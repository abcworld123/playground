const express = require('express');
const router = express.Router();

const youtube = require('./games/r_youtube');
const weather = require('./games/r_weather');
const random = require('./games/r_random');
const jebi = require('./games/r_jebi');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/random', random);
router.use('/jebi', jebi);
router.use('/weather', weather);
router.use('/youtube',youtube)

module.exports = router;
