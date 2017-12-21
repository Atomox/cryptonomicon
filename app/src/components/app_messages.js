'use strict';

let React = require('react');

class AppMessages extends React.Component {

    render() {

      let typeClass = 'callout ';

      switch (this.props.type) {
        case 'error':    typeClass += 'error'; break;
        case 'warning':  typeClass += 'warning'; break;
        default:   typeClass += 'primary'; break;
      }

      return (this.props.display === true) ? (
        <div className={typeClass}>
          <h5>{this.props.title}</h5>
          <p>{this.props.body}</p>
        </div>
      ) : (<div></div>);
    }
}


module.exports = AppMessages;
