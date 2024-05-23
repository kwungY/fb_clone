const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./mail');
const TokenService = require('./token');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const tokenModel = require('../models/token-model');
const config = require('../config');

class UserService {
  async registration(name, role, email, password) {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser && existingUser.isActivated) {
      throw ApiError.BadRequest('User with this email already exists in the database');
    }

    if (existingUser && !existingUser.isActivated) {
      await UserModel.deleteOne({ email, isActivated: false });
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      name,
      role,
      email,
      password: hashPassword,
      activationLink,
    });

    await MailService.sendActivationMail(email, `${config.apiUrl}/user/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('User with this email does not exist');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password');
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: { ...userDto, isActivated: user.isActivated } };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      console.log('refreshToken', refreshToken);
      throw ApiError.UnauthorizedError();
    }

    const userData = await TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      console.log('refreshToken', refreshToken);
      throw ApiError.UnauthorizedError();
    }

    console.log(userData)

    if (!userData.isActivated) {
      throw ApiError.BadRequest(400, "User is not activated")
    }

    const userDto = new UserDto(userData);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveToken(userDto.id, refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UserModel.find();

    return users;
  }

  async getUserById(id) {
    const user = await UserModel.findById(id).catch(() => {
      throw ApiError.BadRequest(404)
    })

    return user
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    const existingUser = await UserModel.findOne({ email: user.email, isActivated: true });

    if (!user) {
      throw ApiError.BadRequest(400, 'Incorrect activation link');
    }

    if (existingUser) {
      throw ApiError.BadRequest(404, 'User with this email already activated');
    }

    user.isActivated = true;
    await user.save();

    return 'User successfully activated';
  };

  async sendActivationLink(email) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new ApiError.BadRequest(404, 'User with this email does not exist');
    }

    if (user.isActivated) {
      throw new ApiError.BadRequest(404, 'User is already activated');
    }

    const activationLink = uuid.v4();

    user.activationLink = activationLink;
    await user.save();

    await MailService.sendActivationMail(email, `${config.apiUrl}/activate/${activationLink}`);

    return activationLink;
  }

  async changeUserData(
    oldEmail,
    oldPassword,
    name,
    role,
    email,
    password,
  ) {
    const user = await UserModel.findOne({ email: oldEmail });

    if (!user) {
      console.log('MAIL', oldEmail);
      throw ApiError.BadRequest(400, 'User with this email does not exist');
    }

    const isPassEquals = await bcrypt.compare(oldPassword, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest(400, 'Incorrect old password, data is not changed');
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const changedUser = await UserModel.updateOne(
      {
        name,
        role,
        email,
        password: hashPassword,
        isActivated: email === oldEmail ? user.isActivated : false,
        activationLink,
        oldEmails: email === oldEmail ? user.oldEmails : [...user.oldEmails, user.email],
      },
    );

    if (email !== oldEmail) {
      await MailService.sendActivationMail(email, `${config.apiUrl}/user/activate/${activationLink}`);
    }

    await tokenModel.deleteMany({ userId: user._id });

    const userDto = new UserDto(changedUser);

    return { user: userDto };
  }
}

module.exports = new UserService();
