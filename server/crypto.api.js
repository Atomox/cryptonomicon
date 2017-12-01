const api = require('./server.api');

const crypto_endpoint =
{
  single: 'https://min-api.cryptocompare.com/data/price',
  multi: 'https://min-api.cryptocompare.com/data/pricemulti',
  detail: 'https://min-api.cryptocompare.com/data/pricemultifull',
};

const resp_symbols = [
  'BTC',
  'USD',
  'EUR',
  'JPY',
];

function getData(ticker_symbol) {
  let syms;

  // Enforce Validation of input.
  try {
    if (typeof ticker_symbol !== 'string') {
      throw new error('Ticker symbols must be strings.');
    }

    // Split into an array. If only one was passed, split still converts to an array.
    syms = ticker_symbol.split(',');

    if (typeof syms !== 'object' || syms === null) {
      throw new error('Expecting one or more symbols.');
    }

    // Validate each symbol.
    syms.map( (key, i) => {
      if (key.length > 10) {
        throw new error('Ticker symbol must be 10 or fewer characters.');
      }
    });
  }
  catch (err) {
    return Promise.reject('getData failed validation: [' + ticker_symbol + ']: ' + err);
  }

  // Format, and then rejoin as comma-deliminated string.
  syms = syms.map((key) => key.toUpperCase());
  syms = syms.join(',');

  // Assemble the request.
  let my_url = crypto_endpoint.detail;
  my_url += '?fsyms=' + syms;
  my_url += '&' + 'tsyms=' + resp_symbols.join(',');

  console.log('Requesting: ', my_url);

  return prepData(api.getHttps(my_url));
}

function prepData(data) {
  return data.then(payload => {

    // Gather ticket symbols, and data.
    return {
      data: payload.RAW,
      symbol: Object.keys(payload.RAW),
    };
  });
}




module.exports = {
  getData
};
