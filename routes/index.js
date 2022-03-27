var express = require('express');
var router = express.Router();

const youtube = require('./games/youtube')
const weather = require('./games/weather');
const random = require('./games/random');
const jebi = require('./games/jebi');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/random', random);

router.use('/jebi', jebi);

router.use('/weather', weather);

router.use('/youtube',youtube)

module.exports = router;
