'use strict';

let React = require('react');

class InvestmentCard extends React.Component {

  render() {
    return (
      <div>
        Investments go here.
        (
          this.props.portfolio
        )
      </div>
    );
  }
}


module.exports = InvestmentCard;
