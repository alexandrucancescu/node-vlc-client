import {ChildProcess, spawn} from "child_process";
import {platform} from "os";
import * as isCi from "is-ci"
import {createWriteStream} from "fs";
import * as path from "path";

let cmd;

switch (platform()) {
	case "darwin":
		cmd = "/Applications/VLC.app/Contents/MacOS/VLC";
		break;
	case "linux":
		cmd = "/usr/bin/vlc";
		break;
	default:
		throw new Error(`Platform '${platform()}' is not supported for testing`);
}

const args = [
	"-I", "http",
	"--http-port", "8080",
	"--http-host", "localhost",
	"--http-password","1234",
	"https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1280_10MG.mp4"
];

export async function spawnVlc(): Promise<ChildProcess> {
	const vlcProcess: ChildProcess = spawn(cmd, args, {
		stdio: "pipe"
	});

	if(isCi){
		const output = createWriteStream(path.join(__dirname,"vlc.log"));
		vlcProcess.stderr.pipe(output);
		vlcProcess.on("exit",()=>{
			output.close();
		})
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
				res(vlcProcess);
			}
		}

		vlcProcess.stdout.on("data",listener.bind(listener,false));
		vlcProcess.stderr.on("data",listener.bind(listener,false));
		vlcProcess.on("error",listener.bind(listener,true));
	})
}