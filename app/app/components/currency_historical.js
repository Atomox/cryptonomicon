'use strict';

let React = require('react');
let CurrencyPrice = require('./currency_price');

class CurrencyHistorical extends React.Component {

  formatDate = (timestamp) => {
    let date = new Date(timestamp);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthIndex + '/' + day;
  }

  /**
   * Render our components.
   */
  render() {
    return (
      <div>
        {this.props.historical.map( (key,i) => {
          return (
            <li key={this.props.symbol + i}>
              {this.formatDate(key.time * 1000)}:

              <small>
                <CurrencyPrice
                  symbol={this.props.currency}
                  price={key.high}
                  positiveChange={true}
                  showCaret={true} />

                <CurrencyPrice
                  symbol={this.props.currency}
                  price={key.low}
                  positiveChange={false}
                  showCaret={true} />
              </small>
            </li>
          );
        }).reverse()}
      </div>
    );
  }
}

module.exports = CurrencyHistorical;
