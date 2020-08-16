
export interface ClientOptions{
	ip: string,
	port: number,
	username?: string,
	password: string,
}

export interface VlcStatus {
	fullscreen: boolean,

	aspectratio: string,
	audiodelay: number,
	apiversion: number,
	currentplid: number,
	time: number,
	volume: number,
	length: number,
	random: number,
	// audiofilters: { filter_0: '' },
	// videoeffects: { hue: 0, saturation: 1, contrast: 1, brightness: 1, gamma: 1 },
	rate: number,
	state: string,
	loop: boolean,
	version: string,
	position: number,

	repeat: boolean,
	subtitledelay: number,
	equalizer: any[],
} 