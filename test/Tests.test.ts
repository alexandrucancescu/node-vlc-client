import {expect} from "chai"
import {after, before, describe} from "mocha"
import {downloadTestFiles, spawnVlc, TestFiles} from "./Spawner";
import {ChildProcess} from "child_process";
import {Client} from "../src";
import * as isCi from "is-ci";
import {AspectRatio} from "../src/Types";

let vlcProcess: ChildProcess;
let vlc: Client;
let testFiles : TestFiles;

before(async ()=>{
	testFiles = await downloadTestFiles();
	if(!isCi){
		vlcProcess =await spawnVlc();
	}
	vlc = new Client({
		ip: "localhost",
		port: 8080,
		password: "1234"
	})
});

after(async ()=>{
	// await removeTestFiles();
	if(!isCi){
		vlcProcess.kill();
	}
});

describe("CORE FUNCTIONALITIES",()=>{
	it("should open media",async ()=>{
		await vlc.playFile(testFiles.video[0].path);
		await wait(1000);
		await vlc.play();

		const status = await vlc.status();

		expect(status.information.category.meta.filename)
			.to.equal(testFiles.video[0].name);
	});

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

	it("should return file name",async ()=>{
		expect(await vlc.getFileName()).to.equal(testFiles.video[0].name);
	});

	it("should return meta", async ()=>{
		expect(await vlc.meta()).to.not.be.null
			.and.not.be.undefined
			.and.to.include.keys()
	})

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

	it("should change media",async()=>{
		await vlc.playFile(testFiles.audio[0].path);
		await wait(2000);

		const status = await vlc.status();

		expect(status.information.category.meta.filename)
			.to.equal(testFiles.audio[0].name);
	});

	it("should retrieve album art",async ()=>{
		const result = await vlc.getAlbumArt();

		expect(result).to.have.keys("contentType","buffer");
		expect(Buffer.isBuffer(result.buffer)).to.be.true;
		expect(result.buffer.byteLength).to.be.greaterThan(0);
		expect(result.contentType).to.equal("image/jpeg");
	});
	
	it("should get/set loop, random, repeat",async ()=>{
		await vlc.setRepeating(true);
		expect(await vlc.isRepeating()).to.be.true;

		await vlc.setLooping(true);
		expect(await vlc.isLooping()).to.be.true;

		await vlc.setRandom(true);
		expect(await vlc.isRandom()).to.be.true;

		await vlc.setRepeating(false);
		expect(await vlc.isRepeating()).to.be.false;

		await vlc.setLooping(false);
		expect(await vlc.isLooping()).to.be.false;

		await vlc.setRandom(false);
		expect(await vlc.isRandom()).to.be.false;

		// await vlc.setRepeating(false);
		// await vlc.setLooping(false);
		// await vlc.setRandom(false);
		//
		// expect(await vlc.isRepeating()).to.be.false;
		// expect(await vlc.isLooping()).to.be.false;
		// expect(await vlc.isRandom()).to.be.false;
		
	})
});

async function wait(ms: number){
	return new Promise(res=>setTimeout(res,ms));
}