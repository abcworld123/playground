const express = require('express');
const router = express.Router();
const hockey = require('../../modules/games/hockey');

router.get('/', (req, res, next) => {
  res.render('hockey/lobby');
});

router.get('/:roomname', (req, res, next) => {
  res.render('hockey/playboard');
});

module.exports = router;
