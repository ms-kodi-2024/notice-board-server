require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');
const connectToDB = require('./db');

const app = express();

connectToDB();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8000';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({ client: mongoose.connection.getClient() }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

app.use('/api/ads', adsRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found...' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something wrong!' });
});

module.exports = app;
