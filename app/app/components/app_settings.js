'use strict';

let React = require('react');

class AppSettings extends React.Component {

  static initialState = (props) => ({
    currency: props.currency,
  });

  state = AppSettings.initialState(this.props);

  handleChange = (event) => {
    console.log(event.target.name, event.target.value);

    switch (event.target.name) {
      case 'currency':
        this.setState({ currency: event.target.value });
        this.props.updateCurrency(event.target.value);
        break;
    }
  };

  render() {
    return(
      <div class="row">
        <fieldset className="large-4 columns">
          <legend></legend>
          {
            this.props.currencies.map( key => {
              return (
                <div className="small-3 cell columns">
                <label htmlFor={"currency" + key}>
                  <input type="radio"
                    name="currency"
                    value={key}
                    id={"currency" + key}
                    onChange={ this.handleChange }
                    checked={(this.props.currency == key) ? 'checked': ''} />
                  {key}
                </label>
                </div>
              );
            })
          }
        </fieldset>
      </div>
    );
  }
}


module.exports = AppSettings;
