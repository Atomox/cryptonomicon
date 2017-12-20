'use strict'

const express = require('express');
const app = express();

// Crypto-Specific Files
const settings = require('../config/settings.js');
const crypto = require('./crypto.api');
const PORT = settings.server.port;
const HOST = settings.server.host;
console.log(settings);
console.log('Running on http://', HOST, ':', PORT);
console.log(' - - - - - - - - - - - - - - - - - - - - -');


/** Cross-Site Headers */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/** Favicon */
app.get('/favicon.ico', (req, res) => res.status(204));


/** API welcome Message: */
app.get('/', (req, res) => {
  res.json({
      intro: 'Welcome to cryptonomicon. You can access the following endpoints to serve data.',
      endpoints: {
        '/BTC,ETH,LSK': {
          description: 'Pass one or more symbols, comma separated, to get the current price info for those symbols.',
        },
        '/BTC/historical': {
          description: 'Pass one or more symbols, comma separated, to get the historical daily price info for those symbols.',
        }
      }
  });
});


/** Basic Price Endpoint */
app.get('/:ticker_symbol', (req, res) => {
  crypto.getData(req.params['ticker_symbol'])
    .then(payload => res.json(payload))
    .catch(err => process_req_err(req, res, err, 'Error requesting Ticket Symbols: ' + req.params['ticker_symbol']));
});


/** Historical Price Endpoint */
app.get('/:ticker_symbol/historical', (req, res) => {
  crypto.getDataHistorical(req.params['ticker_symbol'])
    .then(payload => res.json(payload))
    .catch(err => process_req_err(req, res, err, 'Error requesting Historical Data for Ticket Symbols: ' + req.params['ticker_symbol']));
});


/** Handle Error Response */
function process_req_err(req, res, err, msg) {
  console.error('Error with request: ', req, ' - - - Message: ', err);
  res.json({
    status: 'error',
    message: msg,
  });
}


app.listen(PORT, HOST);
