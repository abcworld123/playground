var express = require('express');
var router = express.Router();


const random = require('./games/random');

const jebi = require('./games/jebi');


router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/random', random);

router.use('/jebi', jebi);

module.exports = router;
