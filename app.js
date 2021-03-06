require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { DB_ADDRESS } = require('./utils/constants');
const limiter = require('./utils/rateLimiter');
const { apiLogger, errLogger } = require('./middlewares/logger');
const handlerError = require('./errors/handlerError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(cors());

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiLogger);
app.use(limiter);

app.use('/', require('./routes/index'));

app.use(errLogger);
app.use(errors());

app.use(handlerError);

app.listen(PORT, () => {
  console.log(`Movie Explorer Backend is listening on port ${PORT}`);
});
