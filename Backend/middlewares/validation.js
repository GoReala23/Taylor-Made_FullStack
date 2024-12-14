const { celebrate } = require('celebrate');
const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return celebrate({
      body: schema,
      errorType: Error,
      errorMessage: 'Validation failed',
    });
  },
  validateParams: (schema) => {
    return celebrate({
      params: schema,
      errorType: Error,
      errorMessage: 'Validation failed',
    });
  },
  validateQuery: (schema) => {
    return celebrate({
      query: schema,
      errorType: Error,
      errorMessage: 'Validation failed',
    });
  },
};
