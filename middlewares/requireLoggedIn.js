module.exports = (req, res, next) => {
  if (!req.session.user) {
    const err = new Error('You need to login.');
    err.statusCode = 403;
    next(err);
  }
  next();
};
