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
const child_process_1 = require("child_process");
const os_1 = require("os");
let cmd;
switch (os_1.platform()) {
    case "darwin":
        cmd = "/Applications/VLC.app/Contents/MacOS/VLC";
        break;
    case "linux":
        cmd = "/usr/bin/vlc";
        break;
    default:
        throw new Error(`Platform '${os_1.platform()}' is not supported for testing`);
}
const args = [
    "-I", "http",
    "--http-port", "8080",
    "--http-host", "localhost",
    "--http-password", "1234",
    "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1280_10MG.mp4"
];
function spawnVlc() {
    return __awaiter(this, void 0, void 0, function* () {
        const vlcProcess = child_process_1.spawn(cmd, args, {
            stdio: "pipe"
        });
        return new Promise((res, rej) => {
            const listener = (isError, error) => {
                vlcProcess.stderr.removeListener("data", listener);
                vlcProcess.stdout.removeListener("data", listener);
                vlcProcess.removeListener("error", listener);
                if (isError) {
                    rej(error);
                    vlcProcess.kill();
                }
                else {
                    console.log("Data", error.toString());
                    res(vlcProcess);
                }
            };
            vlcProcess.stdout.on("data", listener.bind(listener, false));
            vlcProcess.stderr.on("data", listener.bind(listener, false));
            vlcProcess.on("error", listener.bind(listener, true));
        });
    });
}
exports.spawnVlc = spawnVlc;
//# sourceMappingURL=Spawner.js.map