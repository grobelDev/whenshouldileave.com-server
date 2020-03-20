const directions = require('./directions.js');

async function getResults(req) {
  try {
    // let inputs = {
    //   origin: startingPoint,
    //   destination: destination,
    //   mode: 'driving',
    //   departure_time: 'now'
    // };

    let inputs = getInputs(req);

    let results = [];

    for (let i = 0; i < inputs.length; i++) {
      let result = directions.getDirections(inputs[i]);
      results.push(result);
    }

    return Promise.all(results);
  } catch (error) {
    return error;
  }
}

function getInputs(req) {
  let numberOfInputs = 5;

  let startingPoint = decodeURIComponent(req.query.startingPoint);
  let destination = decodeURIComponent(req.query.destination);
  let timeFrames = getTimeFrames(numberOfInputs);

  let inputs = timeFrames.map(time => {
    return {
      origin: startingPoint,
      destination: destination,
      mode: 'driving',
      departure_time: time
    };
  });

  return inputs;
}

function getTimeFrames(numberOfInputs) {
  let timeFrames = [];

  for (let i = 0; i < numberOfInputs; i++) {
    let currentTime = new Date();
    let timeResult = currentTime.addHours(i);
    timeFrames.push(timeResult);
  }

  return timeFrames;
}

Date.prototype.addHours = function(h) {
  this.setHours(this.getHours() + h);
  return this;
};

module.exports = {
  getResults: getResults
};
