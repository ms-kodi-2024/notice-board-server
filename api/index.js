require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('../db');
const adsRoutes = require('../routes/ads.routes');
const authRoutes = require('../routes/auth.routes');

const app = express();

(async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error('MONGO_URL is not defined!');
    process.exit(1);
  }

  await connectDB();
  console.log('MongoDB connected');

  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8000';
  app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      collectionName: 'sessions',
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  }));

  app.use('/ads',  adsRoutes);
  app.use('/auth', authRoutes);

  app.use((req, res) => res.status(404).json({ message: 'Not found...' }));
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something wrong!' });
  });
})();

module.exports = app;
