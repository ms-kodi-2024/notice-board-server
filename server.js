const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const adsRoutes = require('./routes/ads.routes');

const app = express();

app.use(cors({
	origin: '*',
	methods: 'GET,POST,PUT,DELETE'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build')));

mongoose.connect('mongodb://localhost:27017/announcements', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

app.use('/api/ads', adsRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
})
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something wrong!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
