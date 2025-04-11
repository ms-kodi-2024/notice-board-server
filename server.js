// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

// Środkowe oprogramowanie – parsowanie JSON
app.use(express.json());

// Konfiguracja CORS – w trybie developerskim dopuszcza dostęp z innych portów
app.use(cors());

// Połączenie z bazą MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Rejestracja routingu dla ogłoszeń
const adsRoutes = require('./routes/ads.routes');
app.use('/api/ads', adsRoutes);

// Konfiguracja serwowania statycznych plików (aplikacji klienckiej) w produkcji
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Przekierowanie wszystkich nieznanych zapytań do index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Globalny middleware do obsługi błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Coś poszło nie tak!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
