import { enterRoom, hockeyRooms } from 'modules/rooms';
import type { ReqHockeyPlayboard } from 'types/games/hockey';

export function renderLobby(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
  res.render('hockey/lobby');
}

export function renderPlayboard(req: ExpressRequest<ReqHockeyPlayboard>, res: ExpressResponse, next: ExpressNextFunction) {
  const room = req.params.roomname;
  const { success } = enterRoom(hockeyRooms, room);
  if (success) res.render('hockey/playboard');
  else next();
}
