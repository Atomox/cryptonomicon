'use strict';

let React = require('react');
let _ = require('lodash');
let cryptoHelp = require('../js/library/crypto_helper');

let appState = require('../state/app.state');

let CurrencyBox = require('./currency_box');
let AppSettings = require('./app_settings');
let AppMessages = require('./app_messages');

const settings = require('../../../config/settings.js');
console.log('Settings: ', settings);


class App extends React.Component {
  constructor(props) {
    super(props);

    appState.constructState(this, settings);
    this.refreshData(this.state.symbols);
  }


  /**
   * Refresh data using latest from the servers.
   *
   * @var (array) symbols
   *    A list of symbols to fetch (case sensitive).
   */
  refreshData = (symbols) => {
    appState.refreshData(this, symbols);
  };

  setMessenger = (level, show, title, body) => {
    appState.setMessager(this, level, show, title, body);
  };

  /**
   * Set passed symbols as stale, so the UI can convey
   * stale symbol data to the user.
   *
   * @var (array) symbols
   *    A list of symbols to fetch (case sensitive).
   */
  staleList = (symbols) => {
    appState.setSymbolsStale(this, symbols);
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
    appState.setSymbolState(this, symbols, data, context);
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

        {<AppMessages
          type={this.state.messages.type}
          display={this.state.messages.display}
          title={this.state.messages.title}
          body={this.state.messages.body}
          />}

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
