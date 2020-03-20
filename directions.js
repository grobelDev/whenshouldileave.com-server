require('dotenv').config();

const API_KEY = process.env.API_KEY;

function fetchDirections(req) {
  var googleMapsClient = require('@google/maps').createClient({
    key: API_KEY,
    Promise: Promise
  });

  return googleMapsClient
    .directions({
      origin: req.origin,
      destination: req.destination,
      mode: req.mode,
      departure_time: req.departure_time
    })
    .asPromise();
}

async function getDirections(req) {
  try {
    const result = fetchDirections(req);
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getDirections: getDirections
};
