"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VlcClientError extends Error {
    constructor(message) {
        super(message);
        this.name = "VlcClientError";
    }
}
exports.default = VlcClientError;
//# sourceMappingURL=VlcClientError.js.map