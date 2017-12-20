const axios = require('axios');
const https = require('https');
const fs = require('fs');

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
      try {
        res.setEncoding('utf8');
        let body = '';

        res.on('data', data => {
            body += data;
        });

        res.on('end', () => {
          if (!body) {
            throw new Error('Empty body when loading from' + url);
          }
          // Make it JSON up in here.
          body = JSON.parse(body.trim());

          resolve(body);
        }
        catch (err) {
          reject('Error parsing body. ' + err);
        }
      });
    })
    .on('error', err => {
      reject('Error fetching URL: ' + err);
    });
  });
}

function fetchEndpoint(url,filename) {
  return new Promise( (resolve, reject) => {
    getHttps(url)
      .then(data => JSON.stringify(data))
      .then(data => saveEndpointToFile(data, filename))
      .then(data => resolve(JSON.parse(data)))
      .catch(err => reject('Problem getting data from endpoint, or saving it afterwards:' + err));
  });
}


function fetchCachedEndpoint(url, filename, max_age_minutes) {

  // Convert minutes to milliseconds.
  max_age_minutes = max_age_minutes * 60000;

  // Try loading from file:
  return new Promise((resolve, reject) => {
    loadEndpointFromFile(filename)
      .then ( data => {
          /**
            @TODO Check freshness
              data.TimeTo < age_timestamp
           */
          let cachedTime = data.TimeTo * 1000;
          let currTime = Date.now();

          if (currTime - cachedTime > max_age_minutes) {
            throw new Exception('CACHE EXPIRED.');
          }

          console.log('FETCHING FROM CACHE', url);

          return data;
      })
      .catch( err => {
        console.log('Could not load cache because ', err, '. Loading fresh.');
        return fetchEndpoint(url,filename);
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
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


function saveEndpointToFile(data, filename) {
  return new Promise((resolve, reject) =>{
    fs.writeFile(filename, data, (err) => {
      if (err) {
        reject('Problem writing to file: ' + err);
      }
      resolve(data);
    });
  });
}


function loadEndpointFromFile(filename) {
  return new Promise((resolve, reject) =>{
    fs.readFile(filename, 'utf8', (err, data) => {
      try {
        if (err) {
          throw new Error('Error during file read: ' + err);
        }
        data = JSON.parse(data);
        resolve(data);
      }
      catch(err) {
        reject('Problem reading/parsing from file: ' + err);
      }
    });
  });
}


module.exports = {
  getURL,
  getHttps,
  fetchEndpoint,
  fetchCachedEndpoint
};
