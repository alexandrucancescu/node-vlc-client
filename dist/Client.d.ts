import { AlbumArtResult, AspectRatio, AudioTrack, ClientOptions, PlayFileOptions, PlaylistEntry, SubtitleTrack, Tracks, VideoTrack, VlcFile, VlcMeta, VlcStatus } from "./Types";
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
    addToPlaylist(uri: string): Promise<void>;
    /**
     * Browse the computer with the VLC instance
     * for files
     * @param dir The directory to browse
     */
    browse(dir?: string): Promise<VlcFile[]>;
    /**
     * Play a file by specifing URI. Adds a
     * file to the playlist and plays it imediately.
     * Only one of the noaudio/novideo options can
     * be set.
     * @param options.wait Wait for vlc to open the file
     * @param options.timeout Time to wait for vlc to open the file
     */
    playFile(uri: string, options?: PlayFileOptions): Promise<void>;
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
    meta(): Promise<VlcMeta>;
    getFileName(): Promise<string>;
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
    isLooping(): Promise<boolean>;
    isRandom(): Promise<boolean>;
    isRepeating(): Promise<boolean>;
    /**
     * Playback rate. Normal speed is 1. Range 0.25 - 4
     */
    getPlaybackRate(): Promise<number>;
    getAlbumArt(playlistEntryId?: number): Promise<AlbumArtResult>;
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
    setRepeating(shouldRepeat: boolean): Promise<void>;
    setLooping(shouldLoop: boolean): Promise<void>;
    setRandom(random: boolean): Promise<void>;
    /**
     * Playback rate. Normal speed is 1. Range 0.25 - 4
     */
    setPlaybackRate(rate: number): Promise<void>;
    setSubtitleDelay(delay: number): Promise<void>;
    setAudioDelay(delay: number): Promise<void>;
    setChapter(chapter: number): Promise<void>;
    /**
     * Select the audio track. Get the audio track id from .streams()
     */
    setAudioTrack(trackId: number): Promise<void>;
    setSubtitleTrack(trackId: number): Promise<void>;
    setVideoTrack(trackId: number): Promise<void>;
    private sendCommand;
    private requestStatus;
    private requestPlaylist;
    private requestBrowse;
    private requestAlbumArt;
    private request;
    private log;
    private error;
    private static parsePlaylistEntries;
    private static validateOptions;
}
