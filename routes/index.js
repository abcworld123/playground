var express = require('express');
var router = express.Router();

const weather = require('./games/weather');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/random', (req, res, next) => {
  res.render('games/random');
});

router.use('/weather', weather);

module.exports = router;
