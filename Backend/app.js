// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');

dotenv.config();
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);

const app = express();
const Port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected to server...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routes under /api
app.use('/api', routes);

app.use((req, res, next) => {
  console.log('A request was received!');
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message, error: err.message });
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

module.exports = app;
