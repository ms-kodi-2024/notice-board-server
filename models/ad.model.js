const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1000
  },
  publishedAt: {
    type: Date,
    required: false,
    default: Date.now
  },
  photo: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  sellerInfo: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Ad', adSchema);
