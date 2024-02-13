import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-error";

export class InvalidMimeTypeError extends CustomApiError {
    constructor(message: string = "Invalid MIME type") {
        super(message, StatusCodes.BAD_REQUEST);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}