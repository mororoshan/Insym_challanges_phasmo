import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react'

export type WheelOfNamesHandle = {
    spin: () => void
    isSpinning: () => boolean
}

type Props<T> = {
    items: T[]
    getLabel: (item: T) => string
    onSpinComplete: (item: T) => void
    disabled?: boolean
    size?: number
    durationMs?: number
    fullRotations?: number
}

const DEFAULT_SIZE = 280
const DEFAULT_DURATION_MS = 4000
const DEFAULT_FULL_ROTATIONS = 6

const SEGMENT_COLORS = [
    '#fef3c7', // amber-100
    '#fde68a', // amber-200
    '#fcd34d', // amber-300
    '#fbbf24', // amber-400
    '#f59e0b', // amber-500
    '#fef9c3', // yellow-100
]
const BORDER_COLOR = '#b45309'
const TEXT_COLOR = '#92400e'
const CENTER_COLOR = '#d97706'

// Ease-out cubic: fast start, slow end
function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
}

// Canvas arc uses 0 = 3 o'clock. We use 0 = top (12 o'clock), so offset by -π/2.
const TOP_OFFSET = -Math.PI / 2

function drawWheel<T>(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    items: T[],
    getLabel: (item: T) => string,
    rotationDeg: number
) {
    const n = items.length
    if (n === 0) return

    const segmentAngle = (2 * Math.PI) / n
    const rotationRad = (rotationDeg * Math.PI) / 180

    // Exactly n segments and n labels — one per item
    for (let i = 0; i < n; i++) {
        const startAngle = TOP_OFFSET + rotationRad + i * segmentAngle
        const endAngle = TOP_OFFSET + rotationRad + (i + 1) * segmentAngle

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
        ctx.fill()
        ctx.strokeStyle = BORDER_COLOR
        ctx.lineWidth = 2
        ctx.stroke()

        // Label: use same canvas angles as arcs (0 = 3 o'clock, clockwise)
        const midAngle = startAngle + segmentAngle / 2
        const textRadius = radius * 0.68
        const x = centerX + textRadius * Math.cos(midAngle)
        const y = centerY + textRadius * Math.sin(midAngle)

        ctx.save()
        ctx.translate(x, y)
        // Align text with radius (orthogonal to tangent); radius direction in canvas is (cos θ, sin θ) = angle θ
        ctx.rotate(midAngle)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // Scale font with radius so labels stay readable at any wheel size
        const fontPx = Math.round(Math.max(9, Math.min(36, radius * 0.09)))
        ctx.font = `bold ${fontPx}px system-ui, sans-serif`
        ctx.fillStyle = TEXT_COLOR

        const label = getLabel(items[i])
        // Allow longer labels when wheel (and font) is larger
        const maxLen = Math.max(10, Math.min(24, Math.round(radius / 8)))
        const truncated =
            label.length > maxLen ? label.slice(0, maxLen - 1) + '…' : label
        ctx.fillText(truncated, 0, 0)
        ctx.restore()
    }

    // Center circle — scale with wheel size
    const centerRadius = Math.max(8, Math.min(40, radius * 0.06))
    ctx.beginPath()
    ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI)
    ctx.fillStyle = CENTER_COLOR
    ctx.fill()
    ctx.strokeStyle = BORDER_COLOR
    ctx.lineWidth = 2
    ctx.stroke()
}

function WheelOfNamesInner<T>(
    {
        items,
        getLabel,
        onSpinComplete,
        disabled = false,
        size = DEFAULT_SIZE,
        durationMs = DEFAULT_DURATION_MS,
        fullRotations = DEFAULT_FULL_ROTATIONS,
    }: Props<T>,
    ref: React.Ref<WheelOfNamesHandle>
) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rotationRef = useRef(0)
    const animationRef = useRef<number | null>(null)
    const isSpinningRef = useRef(false)

    const draw = useCallback(
        (rotationDeg: number) => {
            const canvas = canvasRef.current
            if (!canvas || items.length === 0) return

            const dpr = window.devicePixelRatio ?? 1
            const width = size
            const height = size
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.scale(dpr, dpr)
            const centerX = width / 2
            const centerY = height / 2
            const radius = Math.min(width, height) / 2 - 8

            drawWheel(
                ctx,
                centerX,
                centerY,
                radius,
                items,
                getLabel,
                rotationDeg
            )
        },
        [getLabel, size]
    )

    // Redraw when items or size change (and not spinning)
    useEffect(() => {
        if (!isSpinningRef.current) {
            draw(rotationRef.current)
        }
    }, [draw, size])

    const spin = useCallback(() => {
        if (items.length === 0 || isSpinningRef.current || disabled) return

        const index = Math.floor(Math.random() * items.length)
        const n = items.length
        const segmentAngleDeg = 360 / n
        const currentMod = ((rotationRef.current % 360) + 360) % 360
        // Pointer at right (3 o'clock, canvas 0°). We rotate so the selected segment lands at the right;
        // the segment counterclockwise from the pointer is the winner (same logic as before, with pointer angle +90°).
        const targetModExact =
            (90 - ((index * segmentAngleDeg) % 360) + 360) % 360
        const randomOffsetInSegment = Math.random() * segmentAngleDeg
        const targetMod = (targetModExact + randomOffsetInSegment) % 360
        const extra = (targetMod - currentMod + 360) % 360
        const startRotation = rotationRef.current
        const targetRotation = startRotation + 360 * fullRotations + extra

        // Report the segment that is under the pointer (one step counterclockwise from boundary)
        const selectedIndex = (index - 1 + n) % n

        isSpinningRef.current = true
        const startTime = performance.now()

        const tick = (now: number) => {
            const elapsed = now - startTime
            const t = Math.min(elapsed / durationMs, 1)
            const eased = easeOutCubic(t)
            const currentRotation =
                startRotation + (targetRotation - startRotation) * eased
            rotationRef.current = currentRotation
            draw(currentRotation)

            if (t < 1) {
                animationRef.current = requestAnimationFrame(tick)
            } else {
                isSpinningRef.current = false
                animationRef.current = null
                const selected = items[selectedIndex]
                if (selected != null) onSpinComplete(selected)
            }
        }

        animationRef.current = requestAnimationFrame(tick)
    }, [disabled, fullRotations, durationMs, onSpinComplete, draw])

    const isSpinning = useCallback(() => isSpinningRef.current, [])
    useImperativeHandle(ref, () => ({ spin, isSpinning }), [spin, isSpinning])

    useEffect(() => {
        return () => {
            if (animationRef.current != null) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    if (items.length === 0) {
        return (
            <div
                className="flex items-center justify-center rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500"
                style={{ width: size, height: size }}
            >
                <span className="text-sm">No items</span>
            </div>
        )
    }

    const canvasTop = 16
    const extraWidth = 48 // space for pointer on the right
    const canvasLeft = extraWidth / 2 // flex items-center
    return (
        <div
            className="relative flex flex-col items-center"
            style={{ width: size + extraWidth, height: size + 32 }}
        >
            <canvas
                ref={canvasRef}
                className="rounded-full shadow-lg"
                style={{ display: 'block', marginTop: canvasTop }}
            />
            {/* Pointer at right (3 o'clock) so the winning label lands horizontal and readable */}
            <div
                className="absolute z-10"
                style={{
                    top: canvasTop + size / 2,
                    left: canvasLeft + size - 35,
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    borderRight: '16px solid #d97706',
                }}
            />
        </div>
    )
}

export const WheelOfNames = forwardRef(WheelOfNamesInner) as <T>(
    props: Props<T> & { ref?: React.Ref<WheelOfNamesHandle> }
) => React.ReactElement
