// backend/middleware/errorMiddleware.js

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || 'Internal server error' });
}

module.exports = { errorHandler };
