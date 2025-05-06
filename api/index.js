// api/index.js
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const connectDB = require('../db');
const adsRoutes = require('../routes/ads.routes');
const authRoutes = require('../routes/auth.routes');

const app = express();
app.set('trust proxy', 1);

connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const FRONTEND_URL = process.env.FRONTEND_URL?.replace(/\/$/, '') || 'http://localhost:3000';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions'
    }),
    name: 'connect.sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 // 1 dzień
    }
  })
);

app.use('/api/ads', adsRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
module.exports.handler = serverless(app);
