class AccessDenied extends Error {
    constructor() {
        super('Access denied');
    }
}

class PermissionError extends Error {
    constructor() {
        super('Not permission');
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

export {PermissionError, AccessDenied, UserNotFoundError, CarNotFoundError};
