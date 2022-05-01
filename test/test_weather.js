const axios = require('axios').default;

axios.post('http://localhost:3000/weather/getWeatherDay', {
  idx: 1,
  nx: 1,
  ny: 1,
})
.then((response) => {
  console.log('-----\x1B[32m test_weather.js: success \x1B[0m-----');
})
.catch((error) => {
  console.log('-----\x1B[31m test_weather.js: failed \x1B[0m-----');
  throw new Error(error);
});
