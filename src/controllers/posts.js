const postsService = require('../services/posts');
const ApiError = require('../exceptions/api-error');
const { validationResult } = require('express-validator');
const UserModel = require('../models/user-model');

class postsController {
  async getAll(req, res, next) {
    try {
      const posts = [];
      await postsService.getAll((post) => posts.push(post));
      res.send(posts);
    } catch (error) {
      next(ApiError.BadRequest(404, error.message));
    }
  }

  async getUserPosts(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(400, 'Validation error', errors.array()));
      }

      const { userId } = req.body

      const posts = [];
      await postsService.getUserPosts((post) => posts.push(post), userId);
      res.send(posts);
    } catch (error) {
      next(ApiError.BadRequest(404, error.message));
    }
  }

  async addPost(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(400, 'Validation error', errors.array()));
    }

    try {
      const newPost = await postsService.addPost(req.body);
      res.status(201).json(newPost);
    } catch (error) {
      next(ApiError.BadRequest(404, error.message));
    }
  }

  async deletePost(req, res, next) {
    try {
      const { postId, foreignKey } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(400, 'Validation error', errors.array()));
      }

      const user = await UserModel.findById(foreignKey);
      if (!user) {
        return next(ApiError.BadRequest(404, 'User not found'));
      }

      if (!user.posts.includes(postId)) {
        return next(ApiError.BadRequest(404, 'No such post'));
      }

      await postsService.deletePost(postId, foreignKey);

      res.status(200).send('Post deleted');
    } catch (error) {
      next(ApiError.BadRequest(404, error.message));
    }
  }
}

module.exports = new postsController();
