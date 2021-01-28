module.exports = (req, res, next) => {
  if (req.session.user) {
    const err = new Error('Already logged in.');
    err.statusCode = 403;
    next(err);
  }
  next();
};
