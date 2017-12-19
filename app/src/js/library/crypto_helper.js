const settings = require('../../../../config/settings.js');

/**
 * Fetch the data from the server.
 */
function getData (symbols, endpoint) {
  let host = settings.react.calls.server.host;
  let port = settings.react.calls.server.port;
  let url = host + ':' + port + '/' + symbols.join(',');

  switch(endpoint) {
    case '':
      break;

    case 'historical':
      url = url + '/historical';
      break;
  }

  return fetch(url)
    .then(resp => resp.json())
    .catch(err => {
      console.warn('Error fetching data.', err);
      return Promise.reject(err); });
}

module.exports = {
  getData
};
