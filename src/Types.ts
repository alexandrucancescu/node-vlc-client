
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

export interface PlaylistEntry{
	name: string;
	id: number;
	duration: number;
	uri: string;
	isCurrent: boolean;
}

export enum AspectRatio {
	_1_1 = "1:1",
	_4_3 = "4:3",
	_5_4 = "5:4",
	_16_9 = "16:9",
	_16_10 = "16:10",
	_221_100 = "221:100",
	_235_100 = "235:100",
	_239_100 = "239:100",
}