export class TokenDecodeError extends Error {
    constructor(message) {
        super(message);
        this.name = "TokenDecodeError";
    }
}
