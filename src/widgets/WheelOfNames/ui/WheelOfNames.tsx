import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react'

export type WheelOfNamesHandle = {
    spin: () => void
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
        ctx.font = 'bold 13px system-ui, sans-serif'
        ctx.fillStyle = TEXT_COLOR

        const label = getLabel(items[i])
        const maxLen = radius > 80 ? 14 : 10
        const truncated =
            label.length > maxLen ? label.slice(0, maxLen - 1) + '…' : label
        ctx.fillText(truncated, 0, 0)
        ctx.restore()
    }

    // Center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 14, 0, 2 * Math.PI)
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
        // Pointer at top (canvas -90°). We rotate so the *start* of segment `index` is at the top; the segment
        // just clockwise (under the pointer tip) is then segment index. But canvas arc() draws clockwise from start
        // to end, so segment 0 is the wedge from -90° going clockwise. So the wedge that contains the top (-90°)
        // is the one whose start is just after -90° going counterclockwise, i.e. the segment we draw before the one at top.
        // So the segment under the pointer is actually (index - 1 + n) % n when we put start of index at top.
        const targetModExact = (360 - ((index * segmentAngleDeg) % 360)) % 360
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

    useImperativeHandle(ref, () => ({ spin }), [spin])

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

    return (
        <div
            className="relative flex flex-col items-center"
            style={{ width: size + 32, height: size + 40 }}
        >
            {/* Pointer at top (12 o'clock) */}
            <div
                className="absolute z-10"
                style={{
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderTop: '16px solid #d97706',
                }}
            />

            <canvas
                ref={canvasRef}
                className="mt-4 rounded-full shadow-lg"
                style={{ display: 'block' }}
            />
        </div>
    )
}

export const WheelOfNames = forwardRef(WheelOfNamesInner) as <T>(
    props: Props<T> & { ref?: React.Ref<WheelOfNamesHandle> }
) => React.ReactElement
