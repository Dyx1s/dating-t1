const userService = require('../services/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const UserModel = require('../models/user-model');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { email, password, firstName, lastName, about } = req.body;
            const photo = req.file;

            const userData = await userService.registration(email, password, firstName, lastName, about, photo);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }



    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async likeUser(req, res, next) {
        try {
            const { userId } = req.body;
            const updatedUser = await userService.likeUser(userId);
            res.json(updatedUser);
        } catch (e) {
            next(e);
        }
    }

    async dislikeUser(req, res, next) {
        try {
            const { userId } = req.body;
            const updatedUser = await userService.dislikeUser(userId);
            res.json(updatedUser);
        } catch (e) {
            next(e);
        }
    }

    async getProfile(req, res, next) {
        try {
            console.log('User in getProfile:', req.user);
            const user = await UserModel.findById(req.user.id); 
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
                const userId = req.user.id;
                const { firstName, lastName, about } = req.body;
                const photo = req.file ? req.file.filename : req.user.photo;

                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId,
                    { firstName, lastName, about, photo },
                    { new: true }
                );
                    res.json(updatedUser);
            } catch (error) {
                next(error);
            }
    }



    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (e) {
            next(e);
        }
    }
}



module.exports = new UserController();
