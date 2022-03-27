var express = require('express');
var router = express.Router();

const jebi = require('./games/jebi');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/random', (req, res, next) => {
  res.render('games/random');
});

router.use('/jebi', jebi);

module.exports = router;
