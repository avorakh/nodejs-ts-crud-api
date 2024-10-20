export class ValidationError extends Error {
    public errors: string[];

    constructor(message: string, errors: string[]) {
        super(message);
        this.name = "ValidationError";
        this.errors = errors;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
}