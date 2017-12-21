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


function getDataResponse(data, endpoint) {

  // Server errors will response with a body.status: 'error'.
  if (data.status && data.status == 'error') {
    throw new Error('API responded with error.');
  }
  else if (typeof data !== 'object' || !data) {
    throw new Error('Malformed API response.');
  }

  switch(endpoint) {

    case 'historical':
      break;

    default:
      if (!data.symbol || !data.data) {
        throw new Error('Malformed symbol response.');
      }
      break;
  }

  return data;
}

module.exports = {
  getData,
  getDataResponse,
};
