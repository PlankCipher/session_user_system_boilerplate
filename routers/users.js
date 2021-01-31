const { Router } = require('express');
const requireLoggedIn = require('../middlewares/requireLoggedIn.js');
const requireProperAuthorization = require('../middlewares/requireProperAuthorization.js');
const User = require('../db/User.js');

const router = new Router();

router.get(
  '/:username',
  requireLoggedIn,
  requireProperAuthorization,
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const { err, user } = await User.findByUsername(username);

      if (err) {
        throw err;
      } else {
        const { id, username } = user;
        const finalUser = { id, username };

        res.json(finalUser);
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
