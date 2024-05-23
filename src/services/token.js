const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model');
const config = require('../config');
const UserModel = require('../models/user-model');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    try {
      let tokenData = await TokenModel.findOne({ userId });
      if (tokenData) {
        tokenData.refreshToken = refreshToken;
      } else {
        tokenData = new TokenModel({ userId, refreshToken });
      }
      return await tokenData.save();
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Failed to save token');
    }
  }

  async removeToken(refreshToken) {
    try {
      return await TokenModel.deleteOne({ refreshToken });
    } catch (error) {
      console.error('Error removing token:', error);
      throw new Error('Failed to remove token');
    }
  }

  async validateAccessToken(token) {
    try {
      const user = jwt.verify(token, config.jwt.accessSecret);

      const updatedUser = await UserModel.findById(user.id)

      return updatedUser
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(token) {
    try {
      const user = jwt.verify(token, config.jwt.refreshSecret);

      const updatedUser = await UserModel.findById(user.id)

      return updatedUser
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    try {
      return await TokenModel.findOne({ refreshToken });
    } catch (error) {
      console.error('Error finding token:', error);
      throw new Error('Failed to find token');
    }
  }
}

module.exports = new TokenService();
