const ApiErrorBuilder = require('../exeptions/api-error-builder');
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiErrorBuilder.unauthorizedError());
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiErrorBuilder.unauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData) {
            return next(ApiErrorBuilder.unauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiErrorBuilder.unauthorizedError());
    }
}