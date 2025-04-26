const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');
const connectToDB = require('./db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8000';

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});

connectToDB();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production' 
    },
  })
);

app.use('/api/ads', adsRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something wrong!' });
});
