const express = require('express');
const postsController = require('../controllers/posts');
const {
  validatePost,
  validateDeletePost,
  validateGetUserPost
} = require('../schemas/post-validation-schema');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/get-all', authMiddleware, postsController.getAll);
router.get('/get-user-posts', authMiddleware, validateGetUserPost, postsController.getUserPosts);

router.post('/add', authMiddleware, validatePost, postsController.addPost);
router.post('/delete', authMiddleware, validateDeletePost, postsController.deletePost);

module.exports = { router };
