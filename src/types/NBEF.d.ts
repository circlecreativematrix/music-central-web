export interface NBEFNote {
    midi?: number
    signal?: string
    time_s?: string
    original_time?: string
    original_note?: string
    track?: number
    velocity: number
    beat_type?: string
    note_type?: string
    tempo?: number
    duration?: string
    is_io_automatic?: boolean
    entries?: any
}

export interface NBEF {
    author?: string;
    id?: string;
    notes: NBEFNote[];
}