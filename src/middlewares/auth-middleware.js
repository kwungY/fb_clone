const ApiError = require('../exceptions/api-error');
const UserModel = require('../models/user-model');
const TokenService = require('../services/token');

module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    const reqUserId = req.body.foreignKey;

    if (!authorizationHeader) {
      console.error('Authorization header is missing');
      return next(ApiError.UnauthorizedError('Authorization header is missing'));
    }

    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      console.error('Authorization header format is invalid');
      return next(ApiError.UnauthorizedError('Authorization header format is invalid'));
    }

    const accessToken = tokenParts[1];

    const userData = await TokenService.validateAccessToken(accessToken);

    if (!userData) {
      console.error('Access token is invalid');
      return next(ApiError.UnauthorizedError('Access token is invalid'))
    }

    if (!userData.isActivated) {
      return next(ApiError.BadRequest('User is not activated'))
    }

    console.log("id", reqUserId)

    if (reqUserId) {
      if (userData.id !== reqUserId) {
        console.error('Token of other user');
        return next(ApiError.UnauthorizedError('Token of other user'));
      }
    }

    req.user = userData;
    next();
  } catch (e) {
    console.error('An error occurred while validating the access token:', e);
    next(e);
  }
}
