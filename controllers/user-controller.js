const userService = require('../services/user-service');
const { validationResult } = require('express-validator');
const ApiErrorBuilder = require('../exeptions/api-error-builder');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = ApiErrorBuilder.badRequest('Validation error', errors.array());
                next(error);
            }

            const { email, password } = req.body;
            const userData = await userService.registration(email, password);

            const cookieKey = 'refreshToken';
            const cookiesMaxAge = 30 * 24 * 60 * 60 * 1000;
            res.cookie(cookieKey, userData.refreshToken, { maxAge: cookiesMaxAge, httpOnly: true });

            console.log(`User ${email} has been successfully registered`);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);

            const cookieKey = 'refreshToken';
            const cookiesMaxAge = 30 * 24 * 60 * 60 * 1000;
            res.cookie(cookieKey, userData.refreshToken, { maxAge: cookiesMaxAge, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const tokenData = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(tokenData);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {

        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json(['123', 456]);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();