const express = require('express');
const wordle = require('#modules/wordle/m_wordle');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('wordle/lobby');
});

router.get('/:roomname', (req, res, next) => {
  wordle.enterRoom(req, res, next);
});

module.exports = router;
