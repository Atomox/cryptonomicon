'use strict';

let React = require('react');
let _ = require('lodash');

let CurrencyBox = require('./currency_box');
let AppSettings = require('./app_settings');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      settings: {
        currency: 'USD',
        currencies: ['USD','EUR','JPY','BTC'],
      },
      symbols: ['BTC', 'ETH', 'LSK', 'OMG', 'CVC', 'GNT', 'NEO', 'XRP', 'NXT', 'ERC'],
      list: []
    }

    console.log('Fetching: ', this.state.symbols,'...');
    // Get data from the server, then load it up.
    this.getData(this.state.symbols)
      .then( data => {
        if (data && data.symbol && data.data) {
          this.initList(data.symbol, data.data);
        }
      });
  }


  /**
   * Fetch the data from the server.
   */
  getData = (symbols) => {
    let url = 'http://localhost:8383/' + symbols.join(',');

    return fetch(url)
      .then(resp => {
        return resp.json();
      })
      .catch(err => {
        console.warn('Error fetching data.', err);
        Promise.reject(err) });
  }

  /**
   * Load fetched data into the state.
   */
  initList = (symbols, data) => {
    this.setState((prevState) => {

      if (typeof symbols === 'string' && symbol.length > 0) {
        prevState.list[symbols] = data;
      }
      else if (typeof symbols === 'object' && symbols) {
        console.log('setState for an array!');
        symbols.map( (key, i) => {
          prevState.list[symbols[i]] = data[key];
        });
      }
      else {
        console.warn('setState() without actual data.', symbols);
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
    console.log('componentDidMount()');
  }

  componentWillUnmount() {
    console.log('componentWillUnmount()');
  }

  /**
   * Render our components.
   */
  render() {

    console.log('....', this.state.list);

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
          <div className="small-4 cell">
            <CurrencyBox
              currencies={ currencies }
              currency={this.state.settings.currency}
              symbol={key}
            />
          </div>
        )
      });

      // Row of items in a grid.
      return (
        <div className="grid-x grid-margin-x">
        {items}
        </div>
      );
    });

    return (
      <div>
        <div>
          <h1>Crypto Prices</h1>
          {<AppSettings
              currencies={this.state.settings.currencies}
              currency={this.state.settings.currency}
              updateCurrency={this.setCurrency}
            />}
        </div>
        {renderedList}
      </div>
    );
  }
}

module.exports = App;
