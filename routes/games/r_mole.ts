import express from 'express';
import { enterRoom, moleRooms } from 'modules/rooms';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('mole/lobby');
});

router.get('/:roomname', (req, res, next) => {
  const room = req.params.roomname;
  const { success } = enterRoom(moleRooms, room);
  if (success) res.render('mole/playboard');
  else next();
});

export default router;
