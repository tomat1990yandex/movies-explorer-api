const express = require('express');
const mongoose = require('mongoose');
// const helmet = require('helmet');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  PORT, MONGO_URL,
} = require('./utils/config');

const handleFinalErrors = require('./middlewares/errors-handler');

const limiter = require('./middlewares/rate-limiter');

const routes = require('./routes');

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();

// app.use(helmet());

// app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  handleFinalErrors(err, res, next);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
