"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
const phin = require("phin");
const querystring_1 = require("querystring");
const path_1 = require("path");
class Client {
    constructor(options) {
        this.options = Client.validateOptions(options);
    }
    //region ACTIONS
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_forceresume");
        });
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_forcepause");
        });
    }
    togglePlay() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_pause");
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_stop");
        });
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_next");
        });
    }
    previous() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_previous");
        });
    }
    emptyPlaylist() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_empty");
        });
    }
    removeFromPlaylist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_delete", { id });
        });
    }
    playFromPlaylist(entryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_play", {
                id: entryId
            });
        });
    }
    addToPlaylist(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("in_enqueue", {
                input: uri,
            });
        });
    }
    /**
     * Browse the computer with the VLC instance
     * for files
     * @param dir The directory to browse
     */
    browse(dir = "/") {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestBrowse(dir);
        });
    }
    /**
     * Play a file by specifing URI. Adds a
     * file to the playlist and plays it imediately.
     * Only one of the noaudio/novideo options can
     * be set.
     * @param options.wait Wait for vlc to open the file
     * @param options.timeout Time to wait for vlc to open the file
     */
    playFile(uri, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                input: uri
            };
            if (options === null || options === void 0 ? void 0 : options.noaudio) {
                params.option = "noaudio";
            }
            else if (options === null || options === void 0 ? void 0 : options.novideo) {
                params.option = "novideo";
            }
            yield this.sendCommand("in_play", params);
            if (options === null || options === void 0 ? void 0 : options.wait) {
                const startTime = Date.now();
                const timeout = (_a = options === null || options === void 0 ? void 0 : options.timeout) !== null && _a !== void 0 ? _a : 3000;
                const fileName = (0, path_1.basename)(uri);
                return new Promise(res => {
                    let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        if (Date.now() - startTime > timeout) {
                            clearInterval(interval);
                            res();
                        }
                        if ((yield this.getFileName()) === fileName) {
                            clearInterval(interval);
                            res();
                        }
                    }), 250);
                });
            }
        });
    }
    jumpForward(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("seek", {
                val: `+${seconds}`
            });
        });
    }
    jumpBackwards(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("seek", {
                val: `-${seconds}`
            });
        });
    }
    toggleFullscreen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("fullscreen");
        });
    }
    /**
     * Increase the volume 0-100
     * @param increaseBy: int
     */
    increaseVolume(increaseBy) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("volume", {
                val: `+${Math.floor(increaseBy * 5.12)}`
            });
        });
    }
    /**
     * Decrease the volume 0-100
     * @param decreaseBy: int
     */
    decreaseVolume(decreaseBy) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("volume", {
                val: `-${Math.floor(decreaseBy * 5.12)}`
            });
        });
    }
    //endregion
    //region GETTERS
    /**
     * Returns an object with all the info that VLC provides except playlist info
     */
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestStatus();
        });
    }
    meta() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            return (_c = (_b = (_a = (yield this.status())) === null || _a === void 0 ? void 0 : _a.information) === null || _b === void 0 ? void 0 : _b.category) === null || _c === void 0 ? void 0 : _c.meta;
        });
    }
    getFileName() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            return (_d = (_c = (_b = (_a = (yield this.status())) === null || _a === void 0 ? void 0 : _a.information) === null || _b === void 0 ? void 0 : _b.category) === null || _c === void 0 ? void 0 : _c.meta) === null || _d === void 0 ? void 0 : _d.filename;
        });
    }
    isPlaying() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getPlaybackState()) === "playing";
        });
    }
    isPaused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getPlaybackState()) === "paused";
        });
    }
    isStopped() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getPlaybackState()) === "stopped";
        });
    }
    isFullscreen() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).fullscreen;
        });
    }
    /**
     * State of vlc ( playing / paused / stop )
     */
    getPlaybackState() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).state;
        });
    }
    /**
     * Time of playback in seconds
     */
    getTime() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).time;
        });
    }
    /**
     * Media progress from 0-100
     */
    getProgress() {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.getTime()) / (yield this.getLength())) * 100;
        });
    }
    /**
     * Length of the current media playing in seconds
     */
    getLength() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).length;
        });
    }
    /**
     * Get the volume in a 0-100 range
     */
    getVolume() {
        return __awaiter(this, void 0, void 0, function* () {
            return Math.floor(((yield this.status()).volume / 512) * 100);
        });
    }
    /**
     * Get the current volume as VLC represents it
     * from 0-512, where 256 is 100% and 512 is 200%
     */
    getVolumeRaw() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).volume;
        });
    }
    /**
     * Audio delay from video stream in seconds
     */
    getAudioDelay() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).audiodelay;
        });
    }
    /**
     * Subtitle delay from video stream in seconds
     */
    getSubtitleDelay() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).subtitledelay;
        });
    }
    /**
     * Returns an array of PlaylistEntries
     */
    getPlaylist() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestPlaylist();
        });
    }
    getAspectRatio() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).aspectratio;
        });
    }
    getSubtitleTracks() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getTracks()).subtitle;
        });
    }
    getAudioTracks() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getTracks()).audio;
        });
    }
    getVideoTracks() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getTracks()).video;
        });
    }
    getChapters() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).information.chapters;
        });
    }
    getCurrentChapter() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).information.chapter;
        });
    }
    isLooping() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).loop;
        });
    }
    isRandom() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).random;
        });
    }
    isRepeating() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).repeat;
        });
    }
    /**
     * Playback rate. Normal speed is 1. Range 0.25 - 4
     */
    getPlaybackRate() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.status()).rate;
        });
    }
    getAlbumArt(playlistEntryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestAlbumArt(playlistEntryId);
        });
    }
    /**
     * Get all tracks (video,audio,subs)
     */
    getTracks() {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield this.status();
            let tracks = {
                audio: [],
                video: [],
                subtitle: [],
            };
            for (let key of Object.keys(stats.information.category)) {
                if (key.substring(0, 6) === "Stream") {
                    let streamIndex = Number.parseInt(key.substring(7));
                    if (!isNaN(streamIndex)) {
                        let track = stats.information.category[key];
                        track.streamIndex = streamIndex;
                        switch (track.Type) {
                            case "Audio":
                                tracks.audio.push(track);
                                break;
                            case "Video":
                                tracks.video.push(track);
                                break;
                            case "Subtitle":
                                tracks.subtitle.push(track);
                                break;
                        }
                    }
                }
            }
            return tracks;
        });
    }
    /**
     * Returns an array with all the available aspect ratios
     */
    availableAspectRations() {
        return Object.values(Types_1.AspectRatio);
    }
    //endregion
    //region SETTERS
    /**
     * Set time of playback in seconds
     */
    setTime(time) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("seek", {
                val: Math.floor(time),
            });
        });
    }
    /**
     * Set progress of media playback 0-100 range
     * @param progress: float
     */
    setProgress(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (progress < 0 || progress > 100)
                return;
            yield this.sendCommand("seek", {
                val: `${progress}%`,
            });
        });
    }
    /**
     * Set volume from 0-100
     * @param volume:Int
     */
    setVolume(volume) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("volume", {
                val: Math.floor(512 * volume / 100)
            });
        });
    }
    /**
     * Set volume as VLC represents it 0-512
     * @param volume:Int
     */
    setVolumeRaw(volume) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("volume", {
                val: Math.floor(volume),
            });
        });
    }
    setFullscreen(val) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.isFullscreen()) != val) {
                yield this.toggleFullscreen();
            }
        });
    }
    setAspectRation(ar) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.values(Types_1.AspectRatio).includes(ar)) {
                return;
            }
            yield this.sendCommand("aspectratio", {
                val: ar
            });
        });
    }
    setRepeating(shouldRepeat) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.isRepeating()) !== shouldRepeat) {
                yield this.sendCommand("pl_repeat");
            }
        });
    }
    setLooping(shouldLoop) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.isLooping()) !== shouldLoop) {
                yield this.sendCommand("pl_loop");
            }
        });
    }
    setRandom(random) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.isRandom()) !== random) {
                yield this.sendCommand("pl_random");
            }
        });
    }
    /**
     * Playback rate. Normal speed is 1. Range 0.25 - 4
     */
    setPlaybackRate(rate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("rate", { val: rate });
        });
    }
    setSubtitleDelay(delay) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("subdelay", { val: delay });
        });
    }
    setAudioDelay(delay) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("audiodelay", { val: delay });
        });
    }
    setChapter(chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("chapter", { val: chapter });
        });
    }
    /**
     * Select the audio track. Get the audio track id from .streams()
     */
    setAudioTrack(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("audio_track", { val: trackId });
        });
    }
    setSubtitleTrack(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("subtitle_track", { val: trackId });
        });
    }
    setVideoTrack(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("video_track", { val: trackId });
        });
    }
    //endregion
    //region REQUESTS
    sendCommand(command, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestStatus(Object.assign({ command }, params));
        });
    }
    requestStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.request("/requests/status.json", data);
            return JSON.parse(response.body.toString());
        });
    }
    requestPlaylist() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request("/requests/playlist.json");
            return Client.parsePlaylistEntries(response.body);
        });
    }
    requestBrowse(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request("/requests/browse.json", { dir });
            const browseResult = JSON.parse(response.body.toString());
            if (Array.isArray(browseResult === null || browseResult === void 0 ? void 0 : browseResult.element)) {
                return browseResult.element;
            }
            else {
                //todo throw error
            }
        });
    }
    requestAlbumArt(playlistEntryId) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            if (playlistEntryId) {
                query = {
                    item: playlistEntryId
                };
            }
            const response = yield this.request("/art", query);
            return {
                contentType: (response.headers["Content-Type"] || response.headers["content-type"]),
                buffer: response.body
            };
        });
    }
    request(urlPath, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = `${this.options.username}:${this.options.password}`;
            const headers = {
                "Authorization": `Basic ${Buffer.from(auth).toString("base64")}`,
            };
            let url = `http://${this.options.ip}:${this.options.port}${urlPath}`;
            if (query) {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
                url += `?${(0, querystring_1.stringify)(query)}`;
            }
            this.log(url);
            const response = yield phin({
                url,
                method: "GET",
                headers,
            });
            this.log(response.body.toString());
            if (response.complete && response.statusCode === 200) {
                return response;
            }
            else {
                throw new Error(`Request error | Code ${response.statusCode} | Message ${response.statusMessage}`);
            }
        });
    }
    //endregion
    //region HELPERS
    log(...args) {
        if (this.options.log === true) {
            console.error(...args);
        }
    }
    error(...args) {
        if (this.options.log === true) {
            console.error(...args);
        }
    }
    static parsePlaylistEntries(buffer) {
        const playlistResponse = JSON.parse(buffer.toString());
        return playlistResponse.children
            .find(c => c.name === "Playlist")
            .children
            .map(pe => ({
            id: pe.id,
            name: pe.name,
            duration: pe.duration,
            isCurrent: (pe.current === "current"),
            uri: (0, querystring_1.unescape)(pe.uri),
        }));
    }
    static validateOptions(options) {
        if (typeof options.ip !== "string") {
            throw new Error("IP is required and should be a string");
        }
        if (typeof options.port !== "number") {
            throw new Error("Port is required and should be a number");
        }
        if (options.username !== undefined && options.username !== null && (typeof options.username !== "string")) {
            throw new Error("Username should be a string");
        }
        else {
            options.username = "";
        }
        if (typeof options.password !== "string") {
            throw new Error("Password is required and should be a string");
        }
        options.log = (options.log === true);
        return options;
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map