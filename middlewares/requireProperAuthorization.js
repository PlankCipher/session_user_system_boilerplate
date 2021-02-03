module.exports = (req, res, next) => {
  const { username } = req.params;
  if (username !== req.session.user.username) {
    const err = new Error('Unauthorized.');
    err.statusCode = 401;
    next(err);
  }
  next();
};
