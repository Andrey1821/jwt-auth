const userService = require('../services/user-service');

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.registration(email, password);

            const cookieKey = 'refreshToken';
            const cookiesMaxAge = 30 * 24 * 60 * 60 * 1000;
            res.cookie(cookieKey, userData.refreshToken, { maxAge: cookiesMaxAge, httpOnly: true });
            console.log(`User ${email} has been successfully registered`);
            return res.json(userData);
        } catch (e) {
            console.log(e);
        }
    }

    async login(req, res, next) {
        try {

        } catch (e) {

        }
    }

    async logout(req, res, next) {
        try {

        } catch (e) {

        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            console.log(e);
        }
    }

    async refresh(req, res, next) {
        try {

        } catch (e) {

        }
    }

    async getUsers(req, res, next) {
        try {
            res.json(['123', 456]);
        } catch (e) {

        }
    }
}

module.exports = new UserController();