var express = require('express');
var router = express.Router();

const random = require('./games/random');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/random', random);

module.exports = router;
