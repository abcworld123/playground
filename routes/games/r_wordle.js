const express = require('express');
const { enterRoom } = require('#modules/wordle/m_wordle');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('wordle/lobby');
});

router.get('/:roomname', (req, res, next) => {
  const room = req.params.roomname;
  const host = req.query.host;
  const { success } = enterRoom(room, host);
  if (success) res.render('wordle/playboard', { host, room });
  else next();
});

module.exports = router;
