const express = require('express');

const app = express();
const userRoutes = require('./routes/userRoutes.js');

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));

// 1) Middlewares

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Routes
app.use('/api/v1/auth', userRoutes);

app.get('/', (req, res) => {
  res.status(404).json({ message: ' API is running', app: 'Finance' });
});

module.exports = app;
