const express = require('express');
const router = express.Router();
const wordle = require('#modules/wordle/m_wordle');

router.get('/', (req, res, next) => {
  res.render('wordle/lobby');
});

router.get('/:roomname', (req, res, next) => {
  res.render('wordle/playboard');
});

module.exports = router;
