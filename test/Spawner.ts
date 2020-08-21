import {ChildProcess, spawn} from "child_process";
import {platform} from "os";
import * as isCi from "is-ci"
import {createWriteStream} from "fs";
import * as path from "path";
import {promisified as phin} from "phin"
import {ensureDir, writeFile, remove} from "fs-extra"

let cmd;
let intf;

switch (platform()) {
	case "darwin":
		cmd = "/Applications/VLC.app/Contents/MacOS/VLC";
		intf = "macosx";
		break;
	case "linux":
		cmd = "/usr/bin/vlc";
		intf = "qt"
		break;
	default:
		throw new Error(`Platform '${platform()}' is not supported for testing`);
}

const args = [
	"-I", intf,
	"--extraintf", "http",
	"--http-port", "8080",
	"--http-host", "localhost",
	"--http-password","1234",
];

export async function spawnVlc(): Promise<ChildProcess> {
	const vlcProcess: ChildProcess = spawn(cmd, args, {
		stdio: "pipe"
	});

	if(isCi||true){
		const output = createWriteStream(path.join(__dirname,"../vlc.log"));
		vlcProcess.stderr.pipe(output);
		vlcProcess.stdout.pipe(output);
		vlcProcess.on("exit",()=>{
			output.close();
		})

		console.log([vlcProcess.spawnfile,...vlcProcess.spawnargs].join(" "));
	}

	return new Promise<ChildProcess>((res,rej)=>{
		const listener = (isError: boolean,error: Error)=>{
			vlcProcess.stderr.removeListener("data",listener);
			vlcProcess.stdout.removeListener("data",listener);
			vlcProcess.removeListener("error",listener);

			if(isError){
				rej(error);
				vlcProcess.kill();
			}else{
				setTimeout(()=>{
					res(vlcProcess);
				},2000);
			}
		}

		vlcProcess.stdout.on("data",listener.bind(listener,false));
		vlcProcess.stderr.on("data",listener.bind(listener,false));
		vlcProcess.on("error",listener.bind(listener,true));
	})
}

const TEST_FILES_URLS = [
	{
		url: "https://raw.githubusercontent.com/alexandrucancescu/vlc-client-test-files/master/audio1.mp3",
		type: "audio"
	},
	{
		url: "https://raw.githubusercontent.com/alexandrucancescu/vlc-client-test-files/master/video1.mp4",
		type: "video"
	},
	{
		url: "https://raw.githubusercontent.com/alexandrucancescu/vlc-client-test-files/master/video2.mkv",
		type: "video"
	}
]

const TEST_FILES_DIR = path.join(__dirname, "../test-files");

export type TestFiles = {
	audio: { path: string, name :string } [],
	video: { path: string, name :string } []
};

let testFiles : TestFiles;

export async function downloadTestFiles(): Promise<TestFiles> {
	await ensureDir(TEST_FILES_DIR);

	testFiles = {
		audio: [],
		video: []
	}

	for(let testFile of TEST_FILES_URLS){
		const fName = path.basename(testFile.url);
		const fPath = path.join(TEST_FILES_DIR, fName);

		await downloadFile(testFile.url, fPath);

		const typeArray = (testFile.type === "video") ? testFiles.video : testFiles.audio;

		typeArray.push({
			name: fName,
			path: fPath,
		});
	}

	return testFiles;
}

export async function removeTestFiles(){
	await remove(TEST_FILES_DIR);
}

async function downloadFile(url: string, path: string){
	const result = await phin(url);
	await writeFile(path, result.body);
}