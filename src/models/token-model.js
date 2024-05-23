const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
  userId: { type: String, required: true },
  refreshToken: { type: String, required: true },
})

module.exports = model('Token', TokenSchema);
