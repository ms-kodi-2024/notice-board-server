const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/announcements';
    await mongoose.connect(mongoUrl);
    console.log('Connected to the database');
    return mongoose.connection;
  } catch (error) {
    console.error('Error ' + error);
    throw error;
  }
};

module.exports = connectDB;
