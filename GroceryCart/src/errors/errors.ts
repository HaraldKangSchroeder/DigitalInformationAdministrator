export class ApplicationError extends Error {

    status: number

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export class DatabaseError extends ApplicationError { }

export class ValidationError extends ApplicationError {
    constructor() {
        super(401, "Please hand in the correct token");
    }
}