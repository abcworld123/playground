const request = require('request');

request.post({
  url: 'http://localhost:3000/weather/getWeatherDay',
  body: { idx: 1, nx: 1, ny: 1 },
  json: true
}, (error, response, body) => {
  console.log(body);
  if (!body) {
    console.error(body);
    throw new Error(body);
  }
});
