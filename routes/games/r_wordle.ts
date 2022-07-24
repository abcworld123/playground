import express from 'express';
import { enterRoom, wordleRooms } from 'modules/rooms';
import type { ReqWordleParams, ReqWordleQuery } from 'types/games/wordle';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('wordle/lobby');
});

router.get<ReqWordleParams, null, null, ReqWordleQuery>('/:roomname', (req, res, next) => {
  const room = req.params.roomname;
  const host = req.query.host;
  const { success } = enterRoom(wordleRooms, room);
  if (success) res.render('wordle/playboard', { host, room });
  else next();
});

export default router;
