const { body } = require('express-validator');

const validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateGetUser = [
  body('userId').notEmpty().withMessage('userId is required').isString(),
];

const validateLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateSendActivationLink = [
  body('email').isEmail().withMessage('Invalid email format'),
];

const validateChangeUserData = [
  body('oldEmail').isEmail().withMessage('Invalid old email format'),
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

module.exports = {
  validateGetUser,
  validateChangeUserData,
  validateRegistration,
  validateLogin,
  validateSendActivationLink
};
