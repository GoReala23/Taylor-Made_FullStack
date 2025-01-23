const express = require('express');
const { celebrate } = require('celebrate');

module.exports = {
  errorHandler: (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      success: false,
      message: message,
      error: process.env.NODE_ENV === 'development' ? err.stack : {},
    });
  },
  celebrateErrorHandler: (err, req, res, next) => {
    const statusCode = err.status || 400;
    const message = err.message || 'Bad Request';

    res.status(statusCode).json({
      success: false,
      message: message,
      error: process.env.NODE_ENV === 'development' ? err.details : {},
    });
  },
};
