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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const Spawner_1 = require("./Spawner");
const src_1 = require("../src");
let vlcProcess;
let vlc;
mocha_1.before(() => __awaiter(void 0, void 0, void 0, function* () {
    vlcProcess = yield Spawner_1.spawnVlc();
    vlc = new src_1.Client({
        ip: "localhost",
        port: 8080,
        password: "1234"
    });
}));
mocha_1.after(() => {
    vlcProcess.kill();
});
mocha_1.describe("CORE FUNCTIONALITIES", () => {
    it("should return status of vlc", () => __awaiter(void 0, void 0, void 0, function* () {
        const status = yield vlc.status();
        chai_1.expect(status).to.not.be.null;
        chai_1.expect(status).to.not.be.undefined;
        chai_1.expect(status).to.include.keys("volume", "information", "state", "position", "rate", "length", "apiversion", "audiodelay", "audiofilters", "currentplid", "equalizer", "fullscreen", "loop", "random", "repeat", "subtitledelay", "time", "version");
        chai_1.expect(status.information).to.include.keys("chapter", "chapters", "category", "category");
        chai_1.expect(status.information.category)
            .to.have.key("meta").and.not.be.null;
    }));
    it("should know playback state", () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.expect(yield vlc.getPlaybackState()).to.equal("playing");
        chai_1.expect(yield vlc.isPlaying()).to.be.true;
        chai_1.expect(yield vlc.isPaused()).to.be.false;
        chai_1.expect(yield vlc.isStopped()).to.be.false;
    }));
});
//# sourceMappingURL=Core.test.js.map