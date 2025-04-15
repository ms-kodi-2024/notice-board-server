const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: ''},
  phone: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
