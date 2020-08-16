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
const phin = require("phin");
const querystring_1 = require("querystring");
class Client {
    // private readonly xml: XmlParser.
    constructor(options) {
        this.options = validateOptions(options);
    }
    //region ACTIONS
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isPlaying())) {
                yield this.togglePlay();
            }
        });
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isPlaying()) {
                yield this.togglePlay();
            }
        });
    }
    togglePlay() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendCommand("pl_pause");
        });
    }
    //endregion
    //region GETTERS
    stats() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest();
        });
    }
    isPlaying() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.stats()).state === "playing";
        });
    }
    getTime() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.stats()).time;
        });
    }
    getLength() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.stats()).length;
        });
    }
    /**
     * Get the volume in a 0-100 range
     */
    getVolume() {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.stats()).volume / 512) * 100;
        });
    }
    /**
     * Get the current volume as VLC represents it
     * from 0-512, where 256 is 100% and 512 is 200%
     */
    getVolumeRaw() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.stats()).volume;
        });
    }
    getAudioDelay() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.stats()).audiodelay;
        });
    }
    getSubtitleDelay() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.stats()).subtitledelay;
        });
    }
    //endregion
    //region SETTERS
    setTime() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    //endregion
    sendCommand(command, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Object.assign({ command }, params));
        });
    }
    makeRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = `${this.options.username}:${this.options.password}`;
            const headers = {
                "Authorization": `Basic ${Buffer.from(auth).toString("base64")}`,
            };
            if (data) {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
            }
            let url = `http://${this.options.ip}:${this.options.port}/requests/status.json`;
            if (data) {
                url += `?${querystring_1.stringify(data)}`;
            }
            console.log(url);
            const response = yield phin({
                url,
                method: "GET",
                headers,
                data,
            });
            console.log(response.url, response.statusMessage, response.statusCode);
            if (response.complete && response.statusCode === 200) {
                // console.log(response.body.toString());
                // return xml.parse(response.body.toString()).root;
                return JSON.parse(response.body.toString());
            }
            else {
                throw new Error(`Request error | Code ${response.statusCode} | Message ${response.statusMessage}`);
            }
        });
    }
}
exports.default = Client;
function validateOptions(options) {
    if (typeof options.ip !== "string") {
        throw new Error("IP is required and should be a string");
    }
    if (typeof options.port !== "number") {
        throw new Error("Port is required and should be a number");
    }
    if (options.username !== undefined && options.username !== null && (typeof options.username !== "string")) {
        throw new Error("Username should be a string");
    }
    else {
        options.username = "";
    }
    if (typeof options.password !== "string") {
        throw new Error("Password is required and should be a string");
    }
    return options;
}
//# sourceMappingURL=Client.js.map