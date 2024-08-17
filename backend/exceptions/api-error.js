module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message) {
        super(message)
        this.status = status
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не смог авторизоваться')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }
}
