const ApiError = require('./api-error');

module.exports = class ApiErrorBuilder {
    static unauthorizedError() {
        return new ApiError(401, 'Unauthorized error');
    }

    static badRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}