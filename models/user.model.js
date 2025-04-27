const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, reguired: true},
  phone: { type: String, reguired: true }
});

module.exports = mongoose.model('User', userSchema);

