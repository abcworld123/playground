var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('random/random');
});

module.exports = router;