const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiErrorBuilder = require('../exeptions/api-error-builder')

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiErrorBuilder.badRequest(`User email ${email} is existing`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const fullActivationLink = `${process.env.API_URL}/api/activate/${activationLink}`

        const user = await UserModel.create({ email, password: hashPassword, activationLink });

        await mailService.sendActivationMail(email, fullActivationLink);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw new Error('Wrong activation link');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const candidate = await UserModel.findOne({ email });
        if (!candidate) {
            throw ApiErrorBuilder.badRequest(`Email or password is wrong`);
        }

        const isPassEqual = await bcrypt.compare(password, candidate.password);

        if (!isPassEqual) {
            throw ApiErrorBuilder.badRequest(`Email or password is wrong`);
        }

        const userDto = new UserDto(candidate);

        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiErrorBuilder.unauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiErrorBuilder.unauthorizedError();
        }

        const candidate = await UserModel.findById(userData.id);
        const userDto = new UserDto(candidate);

        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }

    async getAllUsers() {
        return await UserModel.find();
    }

}

module.exports = new UserService();