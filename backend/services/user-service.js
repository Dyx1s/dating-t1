const path = require('path');
const fs = require('fs');
const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password, firstName, lastName, about, photo) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);

        let photoName = null;
        if (photo) {
            photoName = `${Date.now()}-${photo.originalname}`;
            const uploadDir = path.resolve(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const photoPath = path.join(uploadDir, photoName);
            fs.writeFileSync(photoPath, photo.buffer);
        }

        const user = await UserModel.create({
            email,
            password: hashPassword,
            firstName,
            lastName,
            about,
            photo: photoName,
        });

        const userDto = new UserDto(user); // id, email, firstName, lastName
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async likeUser(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('Пользователь не найден');
        }
        user.likes = (user.likes || 0) + 1;
        await user.save();
    }

    async dislikeUser(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.dislikes = (user.dislikes || 0) + 1;
        await user.save();
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async getAllUsers() {
        return await UserModel.find({}, { password: 0 });
    }
}

module.exports = new UserService();
