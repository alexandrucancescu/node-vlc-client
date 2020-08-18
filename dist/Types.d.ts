export interface ClientOptions {
    ip: string;
    port: number;
    username?: string;
    password: string;
    log?: boolean;
}
export interface VlcStatus {
    fullscreen: boolean;
    aspectratio: string;
    audiodelay: number;
    apiversion: number;
    currentplid: number;
    time: number;
    volume: number;
    length: number;
    random: number;
    rate: number;
    state: string;
    loop: boolean;
    version: string;
    position: number;
    repeat: boolean;
    subtitledelay: number;
    equalizer: any[];
    information: {
        chapter: number;
        chapters: number[];
        title?: any;
        category: {
            meta: {
                showName?: string;
                seasonNumber?: string;
                episodeNumber?: string;
                filename: string;
                [key: string]: string;
            };
        };
        titles: any[];
    };
}
export interface PlaylistEntry {
    name: string;
    id: number;
    duration: number;
    uri: string;
    isCurrent: boolean;
}
export declare enum AspectRatio {
    _1_1 = "1:1",
    _4_3 = "4:3",
    _5_4 = "5:4",
    _16_9 = "16:9",
    _16_10 = "16:10",
    _221_100 = "221:100",
    _235_100 = "235:100",
    _239_100 = "239:100"
}
export interface Tracks {
    video?: VideoTrack[];
    audio?: AudioTrack[];
    subtitle?: SubtitleTrack[];
}
export interface Track {
    streamIndex: number;
    Type: "Audio" | "Video" | "Subtitle";
    Language?: string;
    Codec?: string;
}
export interface VideoTrack extends Track {
    Frame_rate: string;
    Decoded_format: string;
    Video_resolution: string;
    Buffer_dimensions: string;
    Orientation: string;
}
export interface AudioTrack extends Track {
    Channels: string;
    Bits_per_sample: string;
    Sample_rate: string;
}
export interface SubtitleTrack extends Track {
}
