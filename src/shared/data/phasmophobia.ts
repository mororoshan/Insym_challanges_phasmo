export enum EvidenceId {
    Emf5 = 'emf5',
    Dots = 'dots',
    Ultraviolet = 'ultraviolet',
    GhostOrb = 'ghostOrb',
    GhostWriting = 'ghostWriting',
    SpiritBox = 'spiritBox',
    Freezing = 'freezing',
}

export interface Evidence {
    id: EvidenceId
    name: string
}

export enum GhostId {
    Spirit = 'spirit',
    Wraith = 'wraith',
    Phantom = 'phantom',
    Poltergeist = 'poltergeist',
    Banshee = 'banshee',
    Jinn = 'jinn',
    Mare = 'mare',
    Revenant = 'revenant',
    Shade = 'shade',
    Demon = 'demon',
    Yurei = 'yurei',
    Oni = 'oni',
    Yokai = 'yokai',
    Hantu = 'hantu',
    Goryo = 'goryo',
    Myling = 'myling',
    Onryo = 'onryo',
    Twins = 'twins',
    Raiju = 'raiju',
    Obake = 'obake',
    Mimic = 'mimic',
    Moroi = 'moroi',
    Deogen = 'deogen',
    Thaye = 'thaye',
    Dayan = 'dayan',
    Gallu = 'gallu',
    Obambo = 'obambo',
}

export interface Ghost {
    id: GhostId
    name: string
    evidence: EvidenceId[]
}

export const EVIDENCE: Evidence[] = [
    { id: EvidenceId.Emf5, name: 'EMF Level 5' },
    { id: EvidenceId.Dots, name: 'D.O.T.S. Projector' },
    { id: EvidenceId.Ultraviolet, name: 'Ultraviolet' },
    { id: EvidenceId.GhostOrb, name: 'Ghost Orbs' },
    { id: EvidenceId.GhostWriting, name: 'Ghost Writing' },
    { id: EvidenceId.SpiritBox, name: 'Spirit Box' },
    { id: EvidenceId.Freezing, name: 'Freezing Temperatures' },
]

/** Side evidence / optional items for the items wheel (equipment, cursed items, etc.) */
export type SideEvidenceId =
    | 'crucifix'
    | 'smudgeSticks'
    | 'lighter'
    | 'candle'
    | 'flashlight'
    | 'salt'
    | 'soundSensor'
    | 'motionSensor'
    | 'videoCamera'
    | 'photoCamera'

export interface SideEvidenceItem {
    id: SideEvidenceId
    name: string
}

export const SIDE_EVIDENCE: SideEvidenceItem[] = [
    { id: 'crucifix', name: 'Crucifix' },
    { id: 'smudgeSticks', name: 'Smudge Sticks' },
    { id: 'lighter', name: 'Lighter' },
    { id: 'candle', name: 'Candle' },
    { id: 'flashlight', name: 'Flashlight' },
    { id: 'salt', name: 'Salt' },
    { id: 'soundSensor', name: 'Sound Sensor' },
    { id: 'motionSensor', name: 'Motion Sensor' },
    { id: 'videoCamera', name: 'Video Camera' },
    { id: 'photoCamera', name: 'Photo Camera' },
]

/** Single type for items that can appear on the evidence/side-evidence wheel */
export interface WheelItem {
    id: string
    name: string
}

/** All evidence + side evidence for the optional items wheel (order: evidence first, then side evidence) */
export const ALL_WHEEL_ITEMS: WheelItem[] = [
    ...EVIDENCE.map((e) => ({ id: e.id, name: e.name })),
    ...SIDE_EVIDENCE.map((e) => ({ id: e.id, name: e.name })),
]

export const GHOSTS: Ghost[] = [
    {
        id: GhostId.Spirit,
        name: 'Spirit',
        evidence: [
            EvidenceId.Emf5,
            EvidenceId.SpiritBox,
            EvidenceId.GhostWriting,
        ],
    },
    {
        id: GhostId.Wraith,
        name: 'Wraith',
        evidence: [EvidenceId.Emf5, EvidenceId.SpiritBox, EvidenceId.Dots],
    },
    {
        id: GhostId.Phantom,
        name: 'Phantom',
        evidence: [
            EvidenceId.Ultraviolet,
            EvidenceId.SpiritBox,
            EvidenceId.Dots,
        ],
    },
    {
        id: GhostId.Poltergeist,
        name: 'Poltergeist',
        evidence: [
            EvidenceId.Ultraviolet,
            EvidenceId.GhostWriting,
            EvidenceId.SpiritBox,
        ],
    },
    {
        id: GhostId.Banshee,
        name: 'Banshee',
        evidence: [
            EvidenceId.Ultraviolet,
            EvidenceId.GhostOrb,
            EvidenceId.Dots,
        ],
    },
    {
        id: GhostId.Jinn,
        name: 'Jinn',
        evidence: [
            EvidenceId.Emf5,
            EvidenceId.Ultraviolet,
            EvidenceId.Freezing,
        ],
    },
    {
        id: GhostId.Mare,
        name: 'Mare',
        evidence: [
            EvidenceId.SpiritBox,
            EvidenceId.GhostOrb,
            EvidenceId.GhostWriting,
        ],
    },
    {
        id: GhostId.Revenant,
        name: 'Revenant',
        evidence: [
            EvidenceId.Freezing,
            EvidenceId.GhostOrb,
            EvidenceId.GhostWriting,
        ],
    },
    {
        id: GhostId.Shade,
        name: 'Shade',
        evidence: [
            EvidenceId.Freezing,
            EvidenceId.Emf5,
            EvidenceId.GhostWriting,
        ],
    },
    {
        id: GhostId.Demon,
        name: 'Demon',
        evidence: [
            EvidenceId.Freezing,
            EvidenceId.Ultraviolet,
            EvidenceId.GhostWriting,
        ],
    },
    {
        id: GhostId.Yurei,
        name: 'Yurei',
        evidence: [EvidenceId.Freezing, EvidenceId.GhostOrb, EvidenceId.Dots],
    },
    {
        id: GhostId.Oni,
        name: 'Oni',
        evidence: [EvidenceId.Freezing, EvidenceId.Emf5, EvidenceId.Dots],
    },
    {
        id: GhostId.Yokai,
        name: 'Yokai',
        evidence: [EvidenceId.SpiritBox, EvidenceId.GhostOrb, EvidenceId.Dots],
    },
    {
        id: GhostId.Hantu,
        name: 'Hantu',
        evidence: [
            EvidenceId.Freezing,
            EvidenceId.GhostOrb,
            EvidenceId.Ultraviolet,
        ],
    },
    {
        id: GhostId.Goryo,
        name: 'Goryo',
        evidence: [EvidenceId.Emf5, EvidenceId.Dots, EvidenceId.Ultraviolet],
    },
    {
        id: GhostId.Myling,
        name: 'Myling',
        evidence: [
            EvidenceId.Emf5,
            EvidenceId.GhostWriting,
            EvidenceId.Ultraviolet,
        ],
    },
    {
        id: GhostId.Onryo,
        name: 'Onryo',
        evidence: [
            EvidenceId.SpiritBox,
            EvidenceId.Freezing,
            EvidenceId.GhostOrb,
        ],
    },
    {
        id: GhostId.Twins,
        name: 'The Twins',
        evidence: [EvidenceId.SpiritBox, EvidenceId.Freezing, EvidenceId.Emf5],
    },
    {
        id: GhostId.Raiju,
        name: 'Raiju',
        evidence: [EvidenceId.Dots, EvidenceId.GhostOrb, EvidenceId.Emf5],
    },
    {
        id: GhostId.Obake,
        name: 'Obake',
        evidence: [
            EvidenceId.Ultraviolet,
            EvidenceId.GhostOrb,
            EvidenceId.Emf5,
        ],
    },
    {
        id: GhostId.Mimic,
        name: 'The Mimic',
        evidence: [
            EvidenceId.SpiritBox,
            EvidenceId.Ultraviolet,
            EvidenceId.Freezing,
            EvidenceId.GhostOrb,
        ],
    },
    {
        id: GhostId.Moroi,
        name: 'Moroi',
        evidence: [
            EvidenceId.SpiritBox,
            EvidenceId.Freezing,
            EvidenceId.GhostWriting,
        ],
    },
    {
        id: GhostId.Deogen,
        name: 'Deogen',
        evidence: [
            EvidenceId.SpiritBox,
            EvidenceId.Dots,
            EvidenceId.GhostWriting,
        ],
    },
    {
        id: GhostId.Thaye,
        name: 'Thaye',
        evidence: [
            EvidenceId.GhostOrb,
            EvidenceId.Dots,
            EvidenceId.GhostWriting,
        ],
    },
    {
        id: GhostId.Dayan,
        name: 'Dayan',
        evidence: [EvidenceId.Emf5, EvidenceId.GhostOrb, EvidenceId.SpiritBox],
    },
    {
        id: GhostId.Gallu,
        name: 'Gallu',
        evidence: [
            EvidenceId.Emf5,
            EvidenceId.Ultraviolet,
            EvidenceId.SpiritBox,
        ],
    },
    {
        id: GhostId.Obambo,
        name: 'Obambo',
        evidence: [
            EvidenceId.GhostWriting,
            EvidenceId.Ultraviolet,
            EvidenceId.Dots,
        ],
    },
]
