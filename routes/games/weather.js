var express = require('express');
var router = express.Router();
const weather = require('../../modules/games/weather');

router.get('/', (req, res, next) => {
  res.render('games/weather');
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
