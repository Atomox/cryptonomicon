'use strict';

let React = require('react');
let InvestmentCard = require('./investment_card');
let CurrencyHistorical = require('./currency_historical');
let CurrencyPrice = require('./currency_price');

let portfolioLib = require('../js/library/portfolio');

class CurrencyBox extends React.Component {

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
                  <div className="grid-container fluid" key={i}>
                    <div className="grid-x grid-margin-x">
                      <div className="small-12 medium-7 x-large-9 cell">
                        <CurrencyPrice
                          isTitle={true}
                          symbol={obj.TOSYMBOL}
                          price={obj.PRICE}
                          positiveChange={(obj.CHANGEPCTDAY > 0)}
                          showCaret={false}/>
                      </div>

                      <div className="small-12 medium-5 x-large-3 cell">
                        <small className="titleCurr">
                          <i className={ (obj.CHANGEPCTDAY > 0)
                            ? 'icon icon-caret-up marketUp'
                            : 'icon icon-caret-down marketDown'
                          }>{portfolioLib.formatPercent(obj.CHANGEPCTDAY)} %</i>
                        </small>
                      </div>
                    </div>
                    <div className="grid-x grid-margin-x">
                      <div className="small-7 x-large-9 cell">
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

                      <div className="small-5 x-large-3 cell">
                        <div className="portfolio percent">
                          <small className="titleCurr">
                            <i className={ (portfolioLib.percentChange(obj.PRICE,
                              portfolio.amount,
                              portfolio.spent) > 0)
                                ? 'icon icon-caret-up marketUp'
                                : 'icon icon-caret-down marketDown'
                            }>{
                              portfolioLib.percentChange(obj.PRICE,
                                portfolio.amount,
                                portfolio.spent)
                            } %</i>
                          </small>
                        </div>
                        <div className="portfolio percent">
                          <small>
                            <CurrencyPrice
                              symbol={obj.TOSYMBOL}
                              price={(portfolio.breakeven) ? portfolio.breakeven : 0}
                              positiveChange={(obj.PRICE >= portfolio.breakeven)}
                              showCaret={false} />
                          </small>
                        </div>
                      </div>
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
