import {ClientOptions, VlcStatus} from "./Types";
import * as xml from "fast-xml-parser"
import * as phin from "phin"
import {stringify as encode} from "querystring"

export default class Client{
	private readonly options: ClientOptions;
	// private readonly xml: XmlParser.

	public constructor(options:ClientOptions) {
		this.options = validateOptions(options);
	}

	//region ACTIONS
	public async play(){
		if(!await this.isPlaying()){
			await this.togglePlay();
		}
	}

	public async pause(){
		if(await this.isPlaying()){
			await this.togglePlay();
		}
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

	//endregion

	//region GETTERS
	public async stats():Promise<VlcStatus>{
		return this.makeRequest();
	}

	public async isPlaying():Promise<boolean>{
		return (await this.getState()) === "playing";
	}

	/**
	 * State of vlc ( playing / paused / stop );
	 */
	public async getState():Promise<string>{
		return (await this.stats()).state;
	}

	public async getTime():Promise<number>{
		return (await this.stats()).time;
	}

	/**
	 * Media progress from 0-100
	 */
	public async getProgress():Promise<number>{
		return ((await this.getTime()) / (await this.getLength())) * 100;
	}

	public async getLength():Promise<number>{
		return (await this.stats()).length;
	}

	/**
	 * Get the volume in a 0-100 range
	 */
	public async getVolume():Promise<number>{
		return ((await this.stats()).volume/512)*100;
	}

	/**
	 * Get the current volume as VLC represents it
	 * from 0-512, where 256 is 100% and 512 is 200%
	 */
	public async getVolumeRaw():Promise<number>{
		return (await this.stats()).volume;
	}

	public async getAudioDelay():Promise<number>{
		return (await this.stats()).audiodelay;
	}

	public async getSubtitleDelay():Promise<number>{
		return (await this.stats()).subtitledelay;
	}

	//endregion

	//region SETTERS
	public async setTime(){

	}

	//endregion

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
			url += `?${encode(data)}`;
		}

		console.log(url);

		const response = await phin({
			url,
			method: "GET",
			headers,
			data,
		});

		console.log(response.url,response.statusMessage,response.statusCode);

		if(response.complete && response.statusCode === 200){
			// console.log(response.body.toString());
			// return xml.parse(response.body.toString()).root;
			return JSON.parse(response.body.toString());
		}else{
			throw new Error(`Request error | Code ${response.statusCode} | Message ${response.statusMessage}`);
		}
	}
}

function validateOptions(options: ClientOptions): ClientOptions{
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

	return options;
}
