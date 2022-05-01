const express = require('express');
const router = express.Router();

const random = require('./games/r_random');
const youtube = require('./games/r_youtube');
const jebi = require('./games/r_jebi');
const weather = require('./games/r_weather');
const hockey = require('./games/hockey');
const wordle = require('./games/r_wordle');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/random', random);
router.use('/youtube', youtube);
router.use('/jebi', jebi);
router.use('/weather', weather);
router.use('/hockey',hockey);
router.use('/wordle', wordle);

module.exports = router;
