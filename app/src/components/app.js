'use strict';

let React = require('react');
let _ = require('lodash');
let cryptoHelp = require('../js/library/crypto_helper');

let CurrencyBox = require('./currency_box');
let AppSettings = require('./app_settings');

const settings = require('../../../config/settings.js');
console.log('Settings: ', settings);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: _.uniqueId(),
      title: settings.react.title,
      subtitle: settings.react.subtitle,
      date: new Date(),
      settings: {
        updateSeconds: 10,
        currency: settings.react.currency,
        currencies: settings.react.currencies,
      },
      portfolio:{
        'ETH': {
          amount: 6.07555,
          spent: 1325.90,
        },
        'LSK': {
          amount: 129.99999,
          spent: 189.78,
        },
      },
      historical: {},
      symbols: settings.react.symbols,
      list: []
    }

    this.refreshData(this.state.symbols);
  }


  /**
   * Refresh data using latest from the servers.
   *
   * @var (array) symbols
   *    A list of symbols to fetch (case sensitive).
   */
  refreshData = (symbols) => {
    // Get data from the server, then load it up.
    cryptoHelp.getData(symbols, '')
      .then( data => {
        if (!data || !data.symbol || !data.data) {
          throw new Error('Malformed symbol response.');
        }
        this.initList(data.symbol, data.data);
      })
      .catch (err => this.staleList(symbols));

    // Get historical data if not set or if it is stale.
    cryptoHelp.getData(symbols, 'historical')
      .then( data => {
        if (typeof data !== 'object' && !data) {
          throw new Error('Malformed historical response.');
        }
        let syms = data.map( d => d.symbol );
        this.initList(syms, data, 'historical');
      })
      .catch (err => console.log('Historical fetch Error: ',err));
  }


  /**
   * Set passed symbols as stale, so the UI can convey
   * stale symbol data to the user.
   *
   * @var (array) symbols
   *    A list of symbols to fetch (case sensitive).
   */
  staleList = (symbols) => {
    if (!symbols) { return; };
    try {
      this.setState((prevState) => {
        symbols.map( (key, i) => {
          if (typeof prevState.list[symbols[i]] === 'undefined'
            || prevState.list[symbols[i]] === null) {
            prevState.list[symbols[i]] = {};
          }
          prevState.list[symbols[i]].freshness = false;
        });

        return prevState;
      });
    }
    catch (err) {
      console.log('Error during stale update: ', err);
    }
  };

  /**
   * Load fetched data into the state.
   *
   * @var (array) symbols
   *    A list of symbols to fetch (case sensitive).
   * @var (object) data
   *    Data returned from the server.
   * @var (string) context
   *    Key to determine which type of data this is.
   */
  initList = (symbols, data, context) => {
    try {
      this.setState((prevState) => {

        switch (context) {

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

            if (diff.length) {  this.staleList(diff);  }
            break;
        }

        return prevState;
      });
    }
    catch (err) {
      console.warn('Error during init state update: ', err);
    }
  };

  /**
   * Settings for Currency.
   */
  setCurrency = data => {
    this.setState(prevState => {
      prevState.settings.currency = data;
      return prevState;
    });
  }

  componentDidMount() {
    // Timer functionality. Set the interval of one tick, and update.
    this.timerID = setInterval(() => this.tick(), this.state.settings.updateSeconds * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  /**
   * Initialize timer from zero.
   */
  tick() {
    this.refreshData(this.state.symbols);
    this.setState({
      date: new Date()
    });
  }

  /**
   * Render our components.
   */
  render() {

    // Chunk the list into groups the size of our row,
    // then map those chunks into the items,
    // with a grid div surrounding each chunk.
    let renderedList = _.chunk(Object.keys(this.state.list),3).map( (keys, i) => {
      // Build our row of components.
      let items = keys.map( (key, i) => {
        let currencies = Object.keys(this.state.list[key]).reduce( (result, k, i) => {
          // @TODO
          //   Freshness gets set at the same level as the currencies on a crypto item.
          if (k !== 'freshness') {
            result.push(this.state.list[key][k]);
          }
          return result;
        }, []);

        return (
          <div className="small-12 medium-4 large-3 cell" key={_.uniqueId()}>
            <CurrencyBox
              key={key}
              currencies={ currencies }
              currency={this.state.settings.currency}
              symbol={key}
              freshness={this.state.list[key].freshness}
              portfolio={(this.state.portfolio[key]) ? this.state.portfolio[key] : null}
              historical={(this.state.historical[key]) ? this.state.historical[key] : null}
            />
          </div>
        )
      });

      // Row of items in a grid.
      return (
        <div className="grid-x grid-margin-x" key={_.uniqueId()}>
        {items}
        </div>
      );
    });

    return (
      <div key={this.state.key}>
        <h1>
          {this.state.title}
          <span className="label">
            <span className="icon icon-cloud"></span> &nbsp;
            {this.state.subtitle}
            </span>
        </h1>
        {<AppSettings
          currencies={this.state.settings.currencies}
          currency={this.state.settings.currency}
          updateCurrency={this.setCurrency}
        />}
        {renderedList}
      </div>
    );
  }
}

module.exports = App;
