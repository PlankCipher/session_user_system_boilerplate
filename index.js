const express = require('express');
const session = require('express-session');
const MySQLSessionStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth.js');
const usersRouter = require('./routers/users.js');
const dbConfig = require('./db/connectionConfig.js');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

const sessionStore = new MySQLSessionStore(dbConfig);

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.use((err, req, res, next) => {
  let statusCode;

  if (err.statusCode) {
    statusCode = err.statusCode !== 200 ? err.statusCode : 500;
  } else {
    statusCode = 500;
  }

  console.log({ message: err.message, stack: err.stack });

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Report this error, please.'
      : err.message;

  const stack =
    process.env.NODE_ENV === 'production'
      ? 'What were you expecting?'
      : err.stack;

  res.status(statusCode).json({ message, stack });
});

app.listen(process.env.PORT || 5000);
