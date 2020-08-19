import { AspectRatio, AudioTrack, ClientOptions, PlaylistEntry, SubtitleTrack, Tracks, VideoTrack, VlcStatus } from "./Types";
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
    playFromPlaylist(entryId: number): Promise<void>;
    jumpForward(seconds: number): Promise<void>;
    jumpBackwards(seconds: number): Promise<void>;
    toggleFullscreen(): Promise<void>;
    /**
     * Increase the volume 0-100
     * @param increaseBy: int
     */
    increaseVolume(increaseBy: number): Promise<void>;
    /**
     * Decrease the volume 0-100
     * @param decreaseBy: int
     */
    decreaseVolume(decreaseBy: number): Promise<void>;
    /**
     * Returns an object with all the info that VLC provides except playlist info
     */
    status(): Promise<VlcStatus>;
    isPlaying(): Promise<boolean>;
    isPaused(): Promise<boolean>;
    isStopped(): Promise<boolean>;
    isFullscreen(): Promise<boolean>;
    /**
     * State of vlc ( playing / paused / stop )
     */
    getPlaybackState(): Promise<string>;
    /**
     * Time of playback in seconds
     */
    getTime(): Promise<number>;
    /**
     * Media progress from 0-100
     */
    getProgress(): Promise<number>;
    /**
     * Length of the current media playing in seconds
     */
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
    /**
     * Audio delay from video stream in seconds
     */
    getAudioDelay(): Promise<number>;
    /**
     * Subtitle delay from video stream in seconds
     */
    getSubtitleDelay(): Promise<number>;
    /**
     * Returns an array of PlaylistEntries
     */
    getPlaylist(): Promise<PlaylistEntry[]>;
    getAspectRatio(): Promise<string>;
    getSubtitleTracks(): Promise<SubtitleTrack[]>;
    getAudioTracks(): Promise<AudioTrack[]>;
    getVideoTracks(): Promise<VideoTrack[]>;
    getChapters(): Promise<number[]>;
    getCurrentChapter(): Promise<number>;
    /**
     * Get all tracks (video,audio,subs)
     */
    getTracks(): Promise<Tracks>;
    /**
     * Returns an array with all the available aspect ratios
     */
    availableAspectRations(): string[];
    /**
     * Set time of playback in seconds
     */
    setTime(time: number): Promise<void>;
    /**
     * Set progress of media playback 0-100 range
     * @param progress: float
     */
    setProgress(progress: number): Promise<void>;
    /**
     * Set volume from 0-100
     * @param volume:Int
     */
    setVolume(volume: number): Promise<void>;
    /**
     * Set volume as VLC represents it 0-512
     * @param volume:Int
     */
    setVolumeRaw(volume: number): Promise<void>;
    setFullscreen(val: boolean): Promise<void>;
    setAspectRation(ar: AspectRatio): Promise<void>;
    private sendCommand;
    private makeRequest;
    private requestPlaylist;
    private log;
    private error;
    private static parsePlaylistEntries;
    private static validateOptions;
}
