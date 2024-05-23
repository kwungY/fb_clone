const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'user', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  posts: { type: Array, required: true, default: [] },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  oldEmails: { type: Array, default: [] },
})

module.exports = model('User', UserSchema);
