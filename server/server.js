'use strict'

const express = require('express');

const settings = require('../config/settings.js');

const crypto = require('./crypto.api');

console.log(settings);

// Expose an endpoint
const PORT = settings.server.port;
const HOST = settings.server.host;

const app = express();

// Open it up to others.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/favicon.ico', function(req, res) {
    res.status(204);
});

app.get('/', (req, res) => {
  res.send('Hi Dad Soup.');
});

app.get('/:ticker_symbol', (req, res) => {
  console.log(req.params['ticker_symbol'], req.params);
  crypto.getData(req.params['ticker_symbol'])
    .then(payload => {
      res.json(payload);
    });
});

app.get('/:ticker_symbol/historical', (req, res) => {
  console.log(req.params['ticker_symbol'], req.params);
  crypto.getDataHistorical(req.params['ticker_symbol'])
    .then(payload => {
      res.json(payload);
    });
});


app.listen(PORT, HOST);
console.log('Running on http://', HOST, ':', PORT);
