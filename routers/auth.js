const { Router } = require('express');
const bcrypt = require('bcrypt');
const requireLoggedIn = require('../middlewares/requireLoggedIn.js');
const requireNotLoggedIn = require('../middlewares/requireNotLoggedIn.js');
const User = require('../db/User.js');

const router = new Router();

router.get('/current', requireLoggedIn, (req, res) => {
  res.json(req.session.user);
});

router.post('/login', requireNotLoggedIn, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const { err, user } = await User.findByUsername(username);

    if (err) {
      const newErr = new Error('Incorrect credentials.');
      newErr.statusCode = 401;
      throw newErr;
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const { id, username } = user;
        const finalUser = { id, username };

        req.session.user = finalUser;

        res.status(204).end();
      } else {
        const newErr = new Error('Incorrect credentials.');
        newErr.statusCode = 401;
        throw newErr;
      }
    }
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const { err, user } = await User.findOrCreate(username, password);

    if (err) {
      throw err;
    } else {
      const { id, username } = user;
      const finalUser = { id, username };

      res.status(201).json(finalUser);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireLoggedIn, (req, res) => {
  req.session.destroy(() => {
    res.status(200).end();
  });
});

module.exports = router;
