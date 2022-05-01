const express = require('express');
const router = express.Router();
const weather = require('#modules/weather/m_weather');

router.get('/', (req, res, next) => {
  res.render('weather/weather');
});

router.post('/getWeatherDay', (req, res, next) => {
  weather.getWeatherDay(req, res, next);
});

router.post('/getWeatherTa', (req, res, next) => {
  weather.getWeatherTa(req, res, next);
});

router.post('/getWeatherMl', (req, res, next) => {
  weather.getWeatherMl(req, res, next);
});

module.exports = router;
