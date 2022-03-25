var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/random', (req, res, next) => {
  res.render('games/random');
});

module.exports = router;
