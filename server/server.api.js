const axios = require('axios');
const https = require('https');

/*
https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log(
      `City: ${body.results[0].formatted_address} -`,
      `Latitude: ${body.results[0].geometry.location.lat} -`,
      `Longitude: ${body.results[0].geometry.location.lng}`
    );
  });
});
*/

function getHttps(url) {
  return new Promise((resolve, reject) => {

    https.get(url, res => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', data => {
          body += data;
      });

      res.on('end', () => {
        // Make it JSON up in here.
        body = JSON.parse(body);

        resolve(body);
      });
    })
    .on('error', err => {
      reject('Error fetching URL: ' + err);
    });
  });
}

async function getURL(url) {
  try {
    console.log('Requesting:', url);
    const response = await axios.get(url);
    console.log('Result:', response.data());
    return response.data();
  }
  catch (err) {
    console.error('ERROR with AXIOS request:', err);
  }
}

module.exports = {
  getURL,
  getHttps,
};
