var express = require('express');
var router = express.Router();

const youtube = require('./games/youtube')

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/random', (req, res, next) => {
  res.render('games/random');
});

router.use('/youtube',youtube)

module.exports = router;
