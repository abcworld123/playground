import express from 'express';
import { enterRoom, hockeyRooms } from 'modules/rooms';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('hockey/lobby');
});

router.get('/:roomname', (req, res, next) => {
  const room = req.params.roomname;
  // const { success } = enterRoom(hockeyRooms, room);
  const success = true;
  if (success) res.render('hockey/playboard');
  else next();
});

export default router;
