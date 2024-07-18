const CustomError = require('../lib/customError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError || err.status) {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = errorHandler;
