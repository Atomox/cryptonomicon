const api = require('./server.api');

const crypto_endpoint =
{
  single: 'https://min-api.cryptocompare.com/data/price',
  multi: 'https://min-api.cryptocompare.com/data/pricemulti',
  detail: 'https://min-api.cryptocompare.com/data/pricemultifull',
  historical: 'https://min-api.cryptocompare.com/data/histoday',
};

const resp_symbols = [
  'BTC',
  'USD',
  'EUR',
  'JPY',
];

function getDataHistorical(ticker_symbol) {
  let syms_req;

  try {
    syms_req = prepDataRequest(ticker_symbol);
  }
  catch (err) {
    return Promise.reject('getData failed validation: [' + ticker_symbol + ']: ' + err);
  }

  console.log('historial syms:', syms);

  let resp = syms_req.map((key, i) => {
    // Assemble the request.
    let my_url = crypto_endpoint.historical;
    my_url += '?fsym=' + key;
    my_url += '&' + 'tsym=' + 'USD';
    my_url +='&' + 'limit=' + 10;

    console.log('  ',i, ') -> Req: ', my_url);

    return prepDataHistorial(api.fetchCachedEndpoint(my_url, './data/' + key + '.historial.json', 1440), key);
  });

  return Promise.all(resp);
}

function getData(ticker_symbol) {
  let syms;

  try {
    syms = prepDataRequest(ticker_symbol);
  }
  catch (err) {
    Promise.reject('getData failed validation: [' + ticker_symbol + ']: ' + err);
  }

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

function prepDataHistorial(data, symbol) {
  return data.then(payload => {
      let dates = Object.keys(payload.Data).map( (key, i) => {
        var date = new Date(payload.Data[key].time);
      });

      // Gather ticket symbols, and data.
      return {
        data: payload.Data,
        symbol: symbol,
      };
    })
    .catch(err => {
      console.warn('Problem with response: ', err);
      reject(err);
    });
}


function prepDataRequest(ticker_symbol) {
  // Enforce Validation of input.

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


  // Format, and then rejoin as comma-deliminated string.
  syms = syms.map((key) => key.toUpperCase());

  return syms;
}


module.exports = {
  getData,
  getDataHistorical
};
