'use strict';
/**
 * This function manages the state of the React App Component.
 *
 *  --* This is the root component state. *--
 */
let cryptoHelp = require('../js/library/crypto_helper');


function constructState(context, settings) {
  context.state = {
    key: _.uniqueId(),
    title: settings.react.title,
    subtitle: settings.react.subtitle,
    date: new Date(),
    settings: {
      updateSeconds: 10,
      currency: settings.react.currency,
      currencies: settings.react.currencies,
    },
    messages: {
      level: 0,
      display: false,
      title: '',
      body: '',
    },
    portfolio: (settings.portfolio) ? settings.portfolio : {},
    historical: {},
    symbols: settings.react.symbols,
    list: []
  }
}


function setMessager(context, level, show, title, body) {
  let params = {
    level: level,
    display: show,
    title: title,
    body: body,
  };

  context.setState( prevState => {
    Object.keys(params).map( (key, i) => {
      prevState.messages[key] = params[key];
    });

    return prevState;
  });
}

function setSymbolsStale(context, symbols) {
  if (!symbols) { return; };
  try {
    context.setState( prevState => {
      symbols.map( (key, i) => {
        if (!(symbols[i] in prevState.list)) { prevState.list[symbols[i]] = {}; }
        prevState.list[symbols[i]].freshness = false;
      });

      return prevState;
    });
  }
  catch (err) {
    console.error('Error during stale update: ', err);
  }
}


function refreshData(context, symbols) {
  // Get timely Symbol prices.
  cryptoHelp.getData(symbols, '')
    .then( data => cryptoHelp.getDataResponse(data, ''))
    .then( data => context.initList(data.symbol, data.data))
    .catch (err => {
      context.setMessenger(1, true, 'Error Fetching Prices from API', '');
      context.staleList(symbols)
    });

  // Get historical symbol prices.
  cryptoHelp.getData(symbols, 'historical')
    .then( data => cryptoHelp.getDataResponse(data, 'historical'))
    .then( data => context.initList(data.map( d => d.symbol ), data, 'historical'))
    .catch (err => console.log('Historical fetch Error: ', err));
}


function setSymbolState(context, symbols, data, endpoint) {
  try {
    context.setState((prevState) => {

      switch (endpoint) {

        case 'historical':

          if (typeof data !== 'object' || !data) {
            throw new Error('Symbol list update without proper data.');
          }
          data.map( (key, i) => prevState.historical[key.symbol] = key.data);
          break;

        case '':
        default:

          if (typeof symbols !== 'object' || !symbols) {
            throw new Error('Symbol list update without proper data.');
          }

          // Update the state of each crypto symbol's price,
          // and mark as fresh data.
          Object.keys(data).map( key => {
            prevState.list[key] = data[key];
            prevState.list[key].freshness = true;
          });

          // Any missing keys from the response should become stale.
          let rkeys = Object.keys(data);
          let diff = Object.keys(prevState.list)
            .filter(item => rkeys.indexOf(item) === -1);

          if (diff.length) {  context.staleList(diff);  }
          break;
      }

      return prevState;
    });
  }
  catch (err) {
    console.warn('Error during init state update: ', err);
  }
}

module.exports = {
  constructState,
  setMessager,
  refreshData,
  setSymbolsStale,
  setSymbolState,
};
