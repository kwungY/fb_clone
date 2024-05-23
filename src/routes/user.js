const express = require('express');
const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth-middleware');
const { 
  validateRegistration, 
  validateLogin, 
  validateChangeUserData, 
  validateSendActivationLink,
  validateGetUser
} = require('../schemas/user-validation-schema')

const router = express.Router();

router.post(
  '/registration',
  validateRegistration,
  userController.registration
);

router.post(
  '/login',
  validateLogin,
  userController.login
);
router.post('/logout', userController.logout);

router.post(
  '/change-user-data',
  validateChangeUserData,
  userController.changeUserData
)
router.post('/send-activation-link', userController.sendActivationLink);

router.get(
  '/activate/:link',
  validateSendActivationLink,
  userController.activate
);
router.get('/refresh', userController.refresh);
router.get('/get-all', authMiddleware, userController.getAllUsers);
router.get('/get-user', authMiddleware, validateGetUser, userController.getUserById)

module.exports = { router };
