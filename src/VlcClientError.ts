
export default class VlcClientError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "VlcClientError";
	}
}