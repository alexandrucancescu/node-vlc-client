import {expect} from "chai"
import {describe, after, before} from "mocha"
import {spawnVlc} from "./Spawner";
import {ChildProcess} from "child_process";
import {Client} from "../src";

let vlcProcess: ChildProcess;
let vlc: Client;

before(async ()=>{
	vlcProcess =await spawnVlc();
	vlc = new Client({
		ip: "localhost",
		port: 8080,
		password: "1234"
	})
});

after(()=>{
	vlcProcess.kill();
});

describe("CORE FUNCTIONALITIES",()=>{
	it("should return status of vlc",async ()=>{
		const status = await vlc.status();

		expect(status).to.not.be.null;
		expect(status).to.not.be.undefined;
		expect(status).to.include.keys(
			"volume", "information", "state", "position", "rate", "length",
			"apiversion", "audiodelay", "audiofilters", "currentplid", "equalizer",
			"fullscreen", "loop", "random", "repeat", "subtitledelay", "time" ,"version"
		);
		expect(status.information).to.include.keys(
			"chapter", "chapters", "category", "category"
		);
		expect(status.information.category)
			.to.have.key("meta").and.not.be.null;
	});

	it("should know playback state",async ()=>{
		expect(await vlc.getPlaybackState()).to.equal("playing");
		expect(await vlc.isPlaying()).to.be.true;
		expect(await vlc.isPaused()).to.be.false;
		expect(await vlc.isStopped()).to.be.false;
	})
});