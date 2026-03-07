class AccessDenied extends Error {
    constructor() {
        super('Access denied');
    }
}

class UserNotFoundError extends Error {
    constructor() {
        super('User not found');
    }
}

class CarNotFoundError extends Error {
    constructor() {
        super('Car not found');
    }
}

/** Generic "not found" — maps to 404 */
class NotFoundError extends Error {
    constructor(message = 'Not found') {
        super(message);
        this.name = 'NotFoundError';
    }
}

/** Domain-level bad request — maps to 400 */
class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }
}

/** Domain-level conflict — maps to 409 */
class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
    }
}

/** Domain-level forbidden — maps to 403 */
class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
    }
}

export {AccessDenied, UserNotFoundError, CarNotFoundError, NotFoundError, BadRequestError, ConflictError, ForbiddenError};
