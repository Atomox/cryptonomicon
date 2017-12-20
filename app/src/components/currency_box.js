'use strict';

let React = require('react');
let InvestmentCard = require('./investment_card');
let CurrencyHistorical = require('./currency_historical');
let CurrencyPrice = require('./currency_price');

class CurrencyBox extends React.Component {

  formatPercent = (num) =>
    parseFloat(Math.round(num * 1000) / 1000).toFixed(2);

  percentChange = (price, owned, spent) => {
    if (owned == 0) { return 0; }

    let breakeven = spent / owned;              // Spent / Owned
    let profit = (price - breakeven) * owned;   // Profit: (Curr Price - Breakeven) * Owned
    let growth = (profit / spent) * 100;        // Growth: Profit / Spent
    return this.formatPercent(growth);
  }

  /**
   * Render our components.
   */
  render() {

    let cardClass = "card" + ' ';
    cardClass += (this.props.freshness) ? 'fresh' : 'stale';

    let portfolio = (this.props.portfolio)
      ? (this.props.portfolio)
      : { amount: 0, spent: 0 };
    portfolio.breakeven = portfolio.spent / portfolio.amount;

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
                    <div className="small-8 large-8 cell">
                      <CurrencyPrice
                        isTitle={true}
                        symbol={obj.TOSYMBOL}
                        price={obj.PRICE}
                        positiveChange={(obj.CHANGEPCTDAY > 0)}
                        showCaret={false}/>
                    </div>

                    <div className="small-4 large-4 cell text-right">
                      <div>
                        <small className="titleCurr">
                          <i className={ (obj.CHANGEPCTDAY > 0)
                            ? 'icon icon-caret-up marketUp'
                            : 'icon icon-caret-down marketDown'
                          }>{this.formatPercent(obj.CHANGEPCTDAY)} %</i>
                        </small>
                      </div>
                      <div className="portfolio breakeven">
                        <small>
                          <CurrencyPrice
                            symbol={obj.TOSYMBOL}
                            price={(portfolio.breakeven) ?portfolio.breakeven : 0}
                            positiveChange={(obj.PRICE >= portfolio.breakeven)}
                            showCaret={false} />
                        </small>
                      </div>
                      <div className="portfolio percent">
                        <small className="titleCurr">
                          <i className={ (this.percentChange(obj.PRICE,
                            portfolio.amount,
                            portfolio.spent) > 0)
                              ? 'icon icon-caret-up marketUp'
                              : 'icon icon-caret-down marketDown'
                          }>{
                            this.percentChange(obj.PRICE,
                              portfolio.amount,
                              portfolio.spent)
                          } %</i>
                        </small>
                      </div>
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
