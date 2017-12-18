'use strict';

let React = require('react');
let InvestmentCard = require('./investment_card');
let CurrencyHistorical = require('./currency_historical');
let CurrencyPrice = require('./currency_price');

class CurrencyBox extends React.Component {

  formatPercent = (num) =>
    parseFloat(Math.round(num * 1000) / 1000).toFixed(3);

  /**
   * Render our components.
   */
  render() {

    let cardClass = "card" + ' ';
    cardClass += (this.props.freshness && this.props.symbol !== 'ETH') ? 'fresh' : 'stale';

    return (
      <div className={cardClass}>
        <div className="card-divider">
          <h4>{this.props.symbol}</h4>
        </div>
        <div className="card-section">

          <div className="grid-x grid-margin-x">
            {
              this.props.currencies.map( (obj, i) => {
                return (obj.TOSYMBOL === this.props.symbol || obj.TOSYMBOL !== this.props.currency) ? '' : (
                  <div className="row" key={i}>
                    <div className="small-8 cell">
                      <CurrencyPrice
                        isTitle={true}
                        symbol={obj.TOSYMBOL}
                        price={obj.PRICE}
                        positiveChange={(obj.CHANGEPCTDAY > 0)}
                        showCaret={false}/>
                    </div>

                    <div className="small-4 cell">
                      <small className="titleCurr">
                      <i className={ (obj.CHANGEPCTDAY > 0)
                        ? 'icon icon-caret-up marketUp'
                        : 'icon icon-caret-down marketDown'
                      }>{this.formatPercent(obj.CHANGEPCTDAY)} %</i>
                      </small>
                    </div>

                    <div className="small-12 medium-8 cell">
                      <small>
                        <CurrencyPrice
                          symbol={obj.TOSYMBOL}
                          price={obj.HIGH24HOUR}
                          positiveChange={true}
                          showCaret={true} />

                          <CurrencyPrice
                            symbol={obj.TOSYMBOL}
                            price={obj.LOW24HOUR}
                            positiveChange={false}
                            showCaret={true} />
                      </small>
                    </div>
{/*
                    <CurrencyHistorical
                      symbol={this.props.symbol}
                      historical={this.props.historical}
                      currency={this.props.currency}
                      />
*/}
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
