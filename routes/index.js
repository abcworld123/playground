const express = require('express');
const jebi = require('./games/r_jebi');
const random = require('./games/r_random');
const weather = require('./games/r_weather');
const wordle = require('./games/r_wordle');
const youtube = require('./games/r_youtube');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/jebi', jebi);
router.use('/random', random);
router.use('/weather', weather);
router.use('/wordle', wordle);
router.use('/youtube', youtube);

module.exports = router;
