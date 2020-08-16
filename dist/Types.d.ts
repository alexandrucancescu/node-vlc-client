export interface ClientOptions {
    ip: string;
    port: number;
    username?: string;
    password: string;
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
}
export interface PlaylistEntry {
    name: string;
    id: number;
    duration: number;
    uri: string;
    isPlaying: boolean;
}
