'use strict';

let React = require('react');
let _ = require('lodash');

let CurrencyBox = require('./currency_box');
let AppSettings = require('./app_settings');

const settings = require('../../../config/settings.js');

console.log('Settings: ', settings);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: _.uniqueId(),
      date: new Date(),
      settings: {
        updateSeconds: 10,
        currency: 'USD',
        currencies: ['USD','EUR','JPY','BTC'],
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
      symbols: ['BTC', 'ETH', 'LSK', 'OMG', 'CVC', 'GNT', 'NEO', 'XRP', 'NXT', 'ERC', 'ltc', 'IOT', 'XMR', 'xas', 'XLM', 'ARK', 'ETHOS'],
      list: []
    }

    console.log('Fetching: ', this.state.symbols,'...');
    this.refreshData(this.state.symbols);
  }

  refreshData = (symbols) => {
    // Get data from the server, then load it up.
    this.getData(this.state.symbols, '')
      .then( data => {
        if (data && data.symbol && data.data) {
          this.initList(data.symbol, data.data);
        }
      });

    // Get historical data if not set or if it is stale.
    this.getData(this.state.symbols, 'historical')
      .then( data => {
        if (typeof data !== 'object' && !data) {
          throw new Error('Empty or malformatted historical response.');
        }
        let syms = data.map( d => d.symbol );
        this.initList(syms, data, 'historical');
      })
      .catch (err => {
        console.log('Historical fetch Error: ',err);
      });
  }

  /**
   * Fetch the data from the server.
   */
  getData = (symbols, endpoint) => {
    let host = 'http://192.168.99.100'; // http://localhost
    let port = '30001';
    let url = host + ':' + port + '/' + symbols.join(',');

    switch(endpoint) {
      case '':
        break;

      case 'historical':
        url = url + '/historical';
        break;
    }

    console.log('  ->>', url, ' <<-');

    return fetch(url)
      .then(resp => resp.json())
      .catch(err => {
        console.warn('Error fetching data.', err);
        Promise.reject(err) });
  }

  /**
   * Load fetched data into the state.
   */
  initList = (symbols, data, context) => {
    this.setState((prevState) => {

      switch (context) {
        case 'historical':

          if (typeof data === 'object' && data){
            data.map( (key, i) => {
              prevState.historical[key.symbol] = key.data;
            });
          }
          else {
            console.warn('Symbol list update without proper data.');
          }
          break;

        case '':
        default:
          if (typeof symbols === 'object' && symbols) {
            symbols.map( (key, i) => {
              prevState.list[symbols[i]] = data[key] })
          }
          else {
            console.warn('Symbol list update without proper data.');
          }
          break;
      }

      return prevState;
    });
  };

  setCurrency = data => {
    this.setState(prevState => {
      prevState.settings.currency = data;
      return prevState;
    });
  }

  componentDidMount() {
    // Set the interval of one tick.
    this.timerID = setInterval(() => this.tick(), this.state.settings.updateSeconds * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

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
          result.push(this.state.list[key][k]);
          return result;
        }, []);

        return (
          <div className="small-12 medium-4 large-3 cell" key={_.uniqueId()}>
            <CurrencyBox
              key={key}
              currencies={ currencies }
              currency={this.state.settings.currency}
              symbol={key}
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
          <h1>Cryptonomicon</h1>
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
