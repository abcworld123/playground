const express = require('express');
const router = express.Router();

const random = require('./games/r_random');
const youtube = require('./games/r_youtube');
const jebi = require('./games/r_jebi');
const weather = require('./games/r_weather');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/random', random);
router.use('/youtube', youtube);
router.use('/jebi', jebi);
router.use('/weather', weather);

module.exports = router;
