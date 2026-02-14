export enum EvidenceId {
    Emf5 = 'emf5',
    Dots = 'dots',
    Fingerprints = 'fingerprints',
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
}

export interface Ghost {
    id: GhostId
    name: string
    evidence: EvidenceId[]
}

export const EVIDENCE: Evidence[] = [
    { id: EvidenceId.Emf5, name: 'EMF Level 5' },
    { id: EvidenceId.Dots, name: 'D.O.T.S. Projector' },
    { id: EvidenceId.Fingerprints, name: 'Fingerprints' },
    { id: EvidenceId.GhostOrb, name: 'Ghost Orbs' },
    { id: EvidenceId.GhostWriting, name: 'Ghost Writing' },
    { id: EvidenceId.SpiritBox, name: 'Spirit Box' },
    { id: EvidenceId.Freezing, name: 'Freezing Temperatures' },
]

export const GHOSTS: Ghost[] = [
    { id: GhostId.Spirit, name: 'Spirit', evidence: [EvidenceId.Emf5, EvidenceId.SpiritBox, EvidenceId.GhostWriting] },
    { id: GhostId.Wraith, name: 'Wraith', evidence: [EvidenceId.Emf5, EvidenceId.SpiritBox, EvidenceId.Dots] },
    { id: GhostId.Phantom, name: 'Phantom', evidence: [EvidenceId.Fingerprints, EvidenceId.SpiritBox, EvidenceId.Dots] },
    { id: GhostId.Poltergeist, name: 'Poltergeist', evidence: [EvidenceId.Fingerprints, EvidenceId.GhostWriting, EvidenceId.SpiritBox] },
    { id: GhostId.Banshee, name: 'Banshee', evidence: [EvidenceId.Fingerprints, EvidenceId.GhostOrb, EvidenceId.Dots] },
    { id: GhostId.Jinn, name: 'Jinn', evidence: [EvidenceId.Emf5, EvidenceId.Fingerprints, EvidenceId.Freezing] },
    { id: GhostId.Mare, name: 'Mare', evidence: [EvidenceId.SpiritBox, EvidenceId.GhostOrb, EvidenceId.GhostWriting] },
    { id: GhostId.Revenant, name: 'Revenant', evidence: [EvidenceId.Freezing, EvidenceId.GhostOrb, EvidenceId.GhostWriting] },
    { id: GhostId.Shade, name: 'Shade', evidence: [EvidenceId.Freezing, EvidenceId.Emf5, EvidenceId.GhostWriting] },
    { id: GhostId.Demon, name: 'Demon', evidence: [EvidenceId.Freezing, EvidenceId.Fingerprints, EvidenceId.GhostWriting] },
    { id: GhostId.Yurei, name: 'Yurei', evidence: [EvidenceId.Freezing, EvidenceId.GhostOrb, EvidenceId.Dots] },
    { id: GhostId.Oni, name: 'Oni', evidence: [EvidenceId.Freezing, EvidenceId.Emf5, EvidenceId.Dots] },
    { id: GhostId.Yokai, name: 'Yokai', evidence: [EvidenceId.SpiritBox, EvidenceId.GhostOrb, EvidenceId.Dots] },
    { id: GhostId.Hantu, name: 'Hantu', evidence: [EvidenceId.Freezing, EvidenceId.GhostOrb, EvidenceId.Fingerprints] },
    { id: GhostId.Goryo, name: 'Goryo', evidence: [EvidenceId.Emf5, EvidenceId.Dots, EvidenceId.Fingerprints] },
    { id: GhostId.Myling, name: 'Myling', evidence: [EvidenceId.Emf5, EvidenceId.GhostWriting, EvidenceId.Fingerprints] },
    { id: GhostId.Onryo, name: 'Onryo', evidence: [EvidenceId.SpiritBox, EvidenceId.Freezing, EvidenceId.GhostOrb] },
    { id: GhostId.Twins, name: 'The Twins', evidence: [EvidenceId.SpiritBox, EvidenceId.Freezing, EvidenceId.Emf5] },
    { id: GhostId.Raiju, name: 'Raiju', evidence: [EvidenceId.Dots, EvidenceId.GhostOrb, EvidenceId.Emf5] },
    { id: GhostId.Obake, name: 'Obake', evidence: [EvidenceId.Fingerprints, EvidenceId.GhostOrb, EvidenceId.Emf5] },
    { id: GhostId.Mimic, name: 'The Mimic', evidence: [EvidenceId.SpiritBox, EvidenceId.Fingerprints, EvidenceId.Freezing, EvidenceId.GhostOrb] },
    { id: GhostId.Moroi, name: 'Moroi', evidence: [EvidenceId.SpiritBox, EvidenceId.Freezing, EvidenceId.GhostWriting] },
    { id: GhostId.Deogen, name: 'Deogen', evidence: [EvidenceId.SpiritBox, EvidenceId.Dots, EvidenceId.GhostWriting] },
    { id: GhostId.Thaye, name: 'Thaye', evidence: [EvidenceId.GhostOrb, EvidenceId.Dots, EvidenceId.GhostWriting] },
]
