const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError('Authorization header is missing'));
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError('Access token is missing'));
        }

        console.log('Received access token:', accessToken);

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError('Invalid access token'));
        }

        req.user = userData;
        next();
    } catch (e) {
        console.error('Error in auth middleware:', e);
        return next(ApiError.UnauthorizedError('Failed to authenticate'));
    }
  };
  