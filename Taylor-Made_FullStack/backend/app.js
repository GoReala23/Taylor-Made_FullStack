const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  const startTime = Date.now();

  // Response logging
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response (${res.statusCode}):`, body);
    console.log(`Request took ${Date.now() - startTime}ms`);
    return originalSend.call(this, body);
  };
  next();
});
// Serve static files
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));

// Routes
app.use('/api', routes);
// app.use('/api/item', routes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware (single instance)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  // Response event logging
  res.on('finish', () =>
    console.log(`Request finished with status: ${res.statusCode}`)
  );
  res.on('error', (error) => console.error('Response error:', error));

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

// Database connection
mongoose
  .connect('mongodb://localhost:27017/TaylorsMade', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
);

module.exports = app;
