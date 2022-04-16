const express = require('express');
const router = express.Router();
const r_weather = require('#modules/weather/m_weather');

router.get('/', (req, res, next) => {
  res.render('weather/weather');
});

router.post('/getWeatherDay', (req, res, next) => {
  r_weather.getWeatherDay(req, res, next);
});

router.post('/getWeatherTa', (req, res, next) => {
  r_weather.getWeatherTa(req, res, next);
});

router.post('/getWeatherMl', (req, res, next) => {
  r_weather.getWeatherMl(req, res, next);
});

module.exports = router;
