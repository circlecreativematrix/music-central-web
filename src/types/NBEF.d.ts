export interface NBEFNote {
    Midi?: number;
    Signal?: string;
    TimeSec?: string;
    OriginalTime?: string;
    OriginalNote?: string;
    Track: number;
    Velocity: number;
    BeatType?: string;
    NoteType?: string;
    Tempo?: number;
    KeyNote?: string;
    KeyType?: string;
    Note?: number;
    Muted?: boolean;
    Label?: string;
    Duration?: string;
    IsIOAutomatic?: boolean;
    Insert?: boolean;
    Halfsteps?: number;
    Entries?: { [key: string]: string };
}

export interface NBEF {
    Author?: string;
    id?: string;
    Notes: NBEFNote[];
}