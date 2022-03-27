var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('games/weather');
});

router.post('/getWeather', (req, res, next) => {

  // res.render('games/weather');
});

module.exports = router;
