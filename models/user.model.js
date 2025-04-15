const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true,
    default: ''
  },
  phone: {
    type: String,
    required: true,
    default: ''
  }
});

module.exports = mongoose.model('User', userSchema);
