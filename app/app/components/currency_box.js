'use strict';

let React = require('react');

class CurrencyBox extends React.Component {


  formatCurrency = (curr, num) =>
    (curr == 'BTC')
      ? num
      // Enforce 2 decimals, including trailing zeros.
      : parseFloat(Math.round(num * 100) / 100).toFixed(2);

  /**
   * Render our components.
   */
  render() {

    console.log('Currencies:', this.props.currencies);

    return (
      <div className="card">
        <div className="card-divider">
          <h4>{this.props.symbol}</h4>
        </div>
        <div className="card-section">

          <div className="grid-x grid-margin-x">
            {
              this.props.currencies.map( (obj, i) => {
                return (obj.TOSYMBOL === this.props.symbol || obj.TOSYMBOL !== this.props.currency) ? '' : (
                  <div className="row">
                    <div className="small-8 cell">
                      <div className="titlePrice">
                        { this.formatCurrency(obj.TOSYMBOL, obj.PRICE) }
                      </div>
                    </div>

                    <div className="small-4 cell">
                      <small className="titleCurr">{obj.TOSYMBOL}</small>
                    </div>

                    <div className="small-12 cell">
                      <small>
                        <div className="marketUp">
                          <i className="icon icon-caret-up"></i>
                          { this.formatCurrency(obj.TOSYMBOL, obj.HIGH24HOUR) }
                        </div>
                        <div className="marketDown">
                          <i className="icon icon-caret-down"></i>
                          { this.formatCurrency(obj.TOSYMBOL, obj.LOW24HOUR) }
                        </div>
                      </small>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = CurrencyBox;
