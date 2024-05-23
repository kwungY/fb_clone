const PostModel = require('../models/post-model');
const ApiError = require('../exceptions/api-error');
const UserModel = require('../models/user-model');

class postsService {
  async getAll(callback) {
    try {
      const posts = await PostModel.find();
      for (const post of posts) {
        await callback(post);
      }
    } catch (error) {
      console.error('MongoDB Error:', error);
    }
  }

  async getUserPosts(callback, userId) {
    try {
      const posts = await PostModel.find({ foreignKey: userId });
      for (const post of posts) {
        await callback(post);
      }
    } catch (error) {
      console.error('MongoDB Error:', error);
    }
  }

  async addPost(post) {
    const { title, text, foreignKey } = post;

    try {
      const post = await PostModel.create({
        title,
        text,
        foreignKey,
        likesCount: 0,
        createdAt: new Date(),
      });

      const user = await UserModel.findById(foreignKey);
      user.posts.push(post._id);
      await user.save();

      return post;
    } catch (e) {
      throw ApiError.BadRequest(404, e.message);
    }
  }

  async deletePost(postId, userId) {
    try {
      await PostModel.deleteOne({ _id: postId });

      const owner = await UserModel.findById(userId)

      owner.posts = owner.posts.filter((oldPostId) => oldPostId === postId);
      await owner.save()
    } catch (e) {
      throw ApiError.BadRequest(404, e.message);
    }
  }
}

module.exports = new postsService();
