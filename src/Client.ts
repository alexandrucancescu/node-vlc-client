import {
	AspectRatio,
	AudioTrack,
	ClientOptions,
	PlaylistEntry,
	SubtitleTrack, Track,
	Tracks,
	VideoTrack,
	VlcStatus,
} from "./Types";
import * as phin from "phin"
import {stringify as encodeQuery, unescape} from "querystring"

export default class Client{
	private readonly options: ClientOptions;

	public constructor(options:ClientOptions) {
		this.options = Client.validateOptions(options);
	}

	//region ACTIONS
	public async play(){
		await this.sendCommand("pl_forceresume");
	}

	public async pause(){
		await this.sendCommand("pl_forcepause");
	}

	public async togglePlay(){
		await this.sendCommand("pl_pause");
	}

	public async stop(){
		await this.sendCommand("pl_stop");
	}

	public async next(){
		await this.sendCommand("pl_next");
	}

	public async previous(){
		await this.sendCommand("pl_previous");
	}

	public async emptyPlaylist(){
		await this.sendCommand("pl_empty");
	}

	public async removeFromPlaylist(id: number){
		await this.sendCommand("pl_delete",{id});
	}

	public async playFromPlaylist(entryId: number){
		await this.sendCommand("pl_play",{
			id: entryId
		})
	}

	public async jumpForward(seconds: number){
		await this.sendCommand("seek",{
			val: `+${seconds}`
		});
	}

	public async jumpBackwards(seconds: number){
		await this.sendCommand("seek",{
			val: `-${seconds}`
		});
	}

	public async toggleFullscreen(){
		await this.sendCommand("fullscreen");
	}

	/**
	 * Increase the volume 0-100
	 * @param increaseBy: int
	 */
	public async increaseVolume(increaseBy: number){
		await this.sendCommand("seek",{
			val: `+${Math.floor(increaseBy*5.12)}`
		});
	}

	/**
	 * Decrease the volume 0-100
	 * @param decreaseBy: int
	 */
	public async decreaseVolume(decreaseBy: number){
		await this.sendCommand("seek",{
			val: `-${Math.floor(decreaseBy*5.12)}`
		});
	}

	//endregion

	//region GETTERS
	/**
	 * Returns an object with all the info that VLC provides except playlist info
	 */
	public async status():Promise<VlcStatus>{
		return this.makeRequest();
	}

	public async isPlaying():Promise<boolean>{
		return (await this.getPlaybackState()) === "playing";
	}

	public async isPaused():Promise<boolean>{
		return (await this.getPlaybackState()) === "paused";
	}

	public async isStopped():Promise<boolean>{
		return (await this.getPlaybackState()) === "stopped";
	}

	public async isFullscreen():Promise<boolean>{
		return (await this.status()).fullscreen;
	}

	/**
	 * State of vlc ( playing / paused / stop )
	 */
	public async getPlaybackState():Promise<string>{
		return (await this.status()).state;
	}

	/**
	 * Time of playback in seconds
	 */
	public async getTime():Promise<number>{
		return (await this.status()).time;
	}

	/**
	 * Media progress from 0-100
	 */
	public async getProgress():Promise<number>{
		return ((await this.getTime()) / (await this.getLength())) * 100;
	}

	/**
	 * Length of the current media playing in seconds
	 */
	public async getLength():Promise<number>{
		return (await this.status()).length;
	}

	/**
	 * Get the volume in a 0-100 range
	 */
	public async getVolume():Promise<number>{
		return ((await this.status()).volume/512)*100;
	}

	/**
	 * Get the current volume as VLC represents it
	 * from 0-512, where 256 is 100% and 512 is 200%
	 */
	public async getVolumeRaw():Promise<number>{
		return (await this.status()).volume;
	}

	/**
	 * Audio delay from video stream in seconds
	 */
	public async getAudioDelay():Promise<number>{
		return (await this.status()).audiodelay;
	}

	/**
	 * Subtitle delay from video stream in seconds
	 */
	public async getSubtitleDelay():Promise<number>{
		return (await this.status()).subtitledelay;
	}

	/**
	 * Returns an array of PlaylistEntries
	 */
	public async getPlaylist():Promise<PlaylistEntry[]>{
		return this.requestPlaylist();
	}

	public async getAspectRatio():Promise<string> {
		return (await this.status()).aspectratio;
	}

	public async getSubtitleTracks():Promise<SubtitleTrack[]>{
		return (await this.getTracks()).subtitle;
	}

	public async getAudioTracks():Promise<AudioTrack[]>{
		return (await this.getTracks()).audio;
	}

	public async getVideoTracks():Promise<VideoTrack[]>{
		return (await this.getTracks()).video;
	}

	public async getChapters():Promise<number[]>{
		return (await this.status()).information.chapters;
	}

	public async getCurrentChapter():Promise<number>{
		return (await this.status()).information.chapter;
	}

	/**
	 * Get all tracks (video,audio,subs)
	 */
	public async getTracks():Promise<Tracks>{
		const stats = await this.status();

		let tracks: Tracks = {
			audio:[],
			video:[],
			subtitle:[],
		}
		for(let key of Object.keys(stats.information.category)){
			if(key.substring(0,6)==="Stream"){
				let streamIndex = Number.parseInt(key.substring(7));
				if(!isNaN(streamIndex)){
					let track = stats.information.category[key] as Track;
					track.streamIndex = streamIndex;
					switch (track.Type) {
						case "Audio": tracks.audio.push(<AudioTrack>track);break;
						case "Video": tracks.video.push(<VideoTrack>track);break;
						case "Subtitle": tracks.subtitle.push(<SubtitleTrack>track);break;
					}
				}
			}
		}

		return tracks;
	}

	//todo get album art
	/**
	 * Returns an array with all the available aspect ratios
	 */
	public availableAspectRations():string[]{
		return Object.values(AspectRatio);
	}

	//endregion

	//region SETTERS

	/**
	 * Set time of playback in seconds
	 */
	public async setTime(time: number){
		await this.sendCommand("seek", {
			val: Math.floor(time),
		});
	}

	/**
	 * Set progress of media playback 0-100 range
	 * @param progress: float
	 */
	public async setProgress(progress: number){
		if(progress < 0 || progress > 100) return;

		await this.sendCommand("seek",{
			val: `${progress}%`,
		})
	}

	/**
	 * Set volume from 0-100
	 * @param volume:Int
	 */
	public async setVolume(volume: number){
		await this.sendCommand("volume",{
			val: Math.floor(512*volume/100)
		})
	}

	/**
	 * Set volume as VLC represents it 0-512
	 * @param volume:Int
	 */
	public async setVolumeRaw(volume: number){
		await this.sendCommand("volume",{
			val: Math.floor(volume),
		})
	}

	public async setFullscreen(val: boolean){
		if((await this.isFullscreen()) != val){
			await this.toggleFullscreen();
		}
	}

	public async setAspectRation(ar: AspectRatio){
		if(!Object.values(AspectRatio).includes(ar)){
			return;
		}
		await this.sendCommand("aspectratio",{
			val: ar
		});
	}

	//endregion

	//region REQUESTS
	private async sendCommand(command: string,params?: any){
		return this.makeRequest({
			command,
			...params
		})
	}

	private async makeRequest(data?: any):Promise<VlcStatus>{
		const auth = `${this.options.username}:${this.options.password}`;

		const headers = {
			"Authorization": `Basic ${Buffer.from(auth).toString("base64")}`,
		}

		if(data){
			headers["Content-Type"] = "application/x-www-form-urlencoded";
		}

		let url = `http://${this.options.ip}:${this.options.port}/requests/status.json`;

		if(data){
			url += `?${encodeQuery(data)}`;
		}

		this.log(url);

		const response = await phin({
			url,
			method: "GET",
			headers,
			data,
		});

		this.log(response.url,response.statusMessage,response.statusCode);

		if(response.complete && response.statusCode === 200){
			return JSON.parse(response.body.toString());
		}else{
			throw new Error(`Request error | Code ${response.statusCode} | Message ${response.statusMessage}`);
		}
	}

	private async requestPlaylist():Promise<PlaylistEntry[]>{
		const auth = `${this.options.username}:${this.options.password}`;

		const headers = {
			"Authorization": `Basic ${Buffer.from(auth).toString("base64")}`,
		}

		let url = `http://${this.options.ip}:${this.options.port}/requests/playlist.json`;

		this.log(url);

		const response = await phin({
			url,
			method: "GET",
			headers,
		});

		this.log(response.url,response.statusMessage,response.statusCode);

		if(response.complete && response.statusCode === 200){
			return Client.parsePlaylistEntries(response.body as unknown as Buffer);
		}else{
			throw new Error(`Request error | Code ${response.statusCode} | Message ${response.statusMessage}`);
		}
	}
	//endregion

	//region HELPERS

	private log(...args:any[]){
		if(this.options.log === true){
			console.error(...args);
		}
	}

	private error(...args:any[]){
		if(this.options.log === true){
			console.error(...args);
		}
	}

	private static parsePlaylistEntries(buffer: Buffer):PlaylistEntry[]{
		const playlistResponse = JSON.parse(buffer.toString());

		return playlistResponse.children
			.find(c=>c.name === "Playlist")
			.children
			.map(pe => ({
					id: pe.id,
					name: pe.name,
					duration: pe.duration,
					isCurrent: (pe.current === "current"),
					uri: unescape(pe.uri),
			}));
	}

	private static validateOptions(options: ClientOptions): ClientOptions{
		if(typeof options.ip !== "string"){
			throw new Error("IP is required and should be a string");
		}
		if(typeof options.port !== "number"){
			throw new Error("Port is required and should be a number");
		}
		if(options.username!==undefined && options.username !==null && (typeof options.username !== "string")){
			throw new Error("Username should be a string");
		}else{
			options.username = "";
		}
		if(typeof options.password !== "string"){
			throw new Error("Password is required and should be a string");
		}
		options.log = (options.log ===true);

		return options;
	}

	//endregion
}
