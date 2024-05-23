const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  foreignKey: { type: String, required: true },
});

module.exports = model('Post', PostSchema, 'posts');
