import {expect} from "chai"
import {after, before, describe} from "mocha"
import {spawnVlc} from "./Spawner";
import {ChildProcess} from "child_process";
import {Client} from "../src";
import * as isCi from "is-ci";
import {AspectRatio} from "../src/Types";

let vlcProcess: ChildProcess;
let vlc: Client;

before(async ()=>{
	if(!isCi){
		vlcProcess =await spawnVlc();
		console.log("spawned");
	}else{
		console.log("IS CI!");
	}
	vlc = new Client({
		ip: "localhost",
		port: 8080,
		password: "1234"
	})
});

after(()=>{
	if(!isCi){
		vlcProcess.kill();
	}
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
			.to.include.keys("meta");
	});

	it("should know playback state",async ()=>{
		expect(await vlc.getPlaybackState()).to.equal("playing");
		expect(await vlc.isPlaying()).to.be.true;
		expect(await vlc.isPaused()).to.be.false;
		expect(await vlc.isStopped()).to.be.false;
	})

	it("should pause",async ()=>{
		await vlc.pause();
		expect(await vlc.isPaused()).to.be.true;
	})

	it("should play",async ()=>{
		await vlc.play();
		expect(await vlc.isPaused()).to.be.false;
		expect(await vlc.isPlaying()).to.be.true;
	})

	it("should change and retrieve volume",async ()=>{
		await vlc.setVolumeRaw(512);
		expect(await vlc.getVolumeRaw()).to.equal(512);
		expect(await vlc.getVolume()).to.equal(100);
	})

	it("should retrieve and set aspect ratio", async ()=>{
		expect(await vlc.getAspectRatio()).to.not.be.null
			.and.not.be.undefined

		await vlc.setAspectRation(AspectRatio._4_3);
		expect(await vlc.getAspectRatio()).to.equal(AspectRatio._4_3);
	});
});