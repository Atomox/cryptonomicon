'use strict';

let React = require('react');

class CurrencyPrice extends React.Component {

  getSymbol = (curr) => {
    const curr_symbols = {
      USD: '$',
      BTC: 'Ƀ',
      EUR: '€',
      JPY: '¥',
    };

    return (curr_symbols[curr]) ? curr_symbols[curr] : curr;
  }


  formatCurrency = (curr, num) =>
    (curr == 'BTC')
      ? num
      // Enforce 2 decimals, including trailing zeros.
      : this.getSymbol(curr) + parseFloat(Math.round(num * 100) / 100).toFixed(2);

  render() {
    let priceClass = (this.props.isTitle) ? 'titlePrice' : '';
    priceClass += (this.props.positiveChange) ? ' ' + 'marketUp' : ' ' + 'marketDown';

    let direction_class = 'icon icon-caret-';
    direction_class += (this.props.positiveChange) ? 'up' : 'down';
    let caret = <i className={direction_class}></i>;

    return (
      <div className={ priceClass }>
        { (this.props.showCaret) ? caret : ''}
        { this.formatCurrency(this.props.symbol, this.props.price) }
      </div>
    );
  }
}


module.exports = CurrencyPrice;
