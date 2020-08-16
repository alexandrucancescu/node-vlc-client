import { ClientOptions, VlcStatus } from "./Types";
export default class Client {
    private readonly options;
    constructor(options: ClientOptions);
    play(): Promise<void>;
    pause(): Promise<void>;
    togglePlay(): Promise<void>;
    stop(): Promise<void>;
    next(): Promise<void>;
    previous(): Promise<void>;
    emptyPlaylist(): Promise<void>;
    removeFromPlaylist(id: number): Promise<void>;
    stats(): Promise<VlcStatus>;
    isPlaying(): Promise<boolean>;
    /**
     * State of vlc ( playing / paused / stop );
     */
    getState(): Promise<string>;
    getTime(): Promise<number>;
    /**
     * Media progress from 0-100
     */
    getProgress(): Promise<number>;
    getLength(): Promise<number>;
    /**
     * Get the volume in a 0-100 range
     */
    getVolume(): Promise<number>;
    /**
     * Get the current volume as VLC represents it
     * from 0-512, where 256 is 100% and 512 is 200%
     */
    getVolumeRaw(): Promise<number>;
    getAudioDelay(): Promise<number>;
    getSubtitleDelay(): Promise<number>;
    setTime(): Promise<void>;
    private sendCommand;
    private makeRequest;
}
