const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

// eslint-disable-next-line no-unused-vars
morgan.token('req-headers-length', (req, res, param) => Object.keys(req.headers).length);

const getCustomMorganFormat = () => JSON.stringify({
  method: ':method',
  url: ':url',
  http_version: ':http-version',
  response_time: ':response-time',
  status: ':status',
  content_length: ':res[content-length]',
  timestamp: ':date[iso]',
  headers_count: ':req-headers-length',
});

app.use(morgan(getCustomMorganFormat()));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
