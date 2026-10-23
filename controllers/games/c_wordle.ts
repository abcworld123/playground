import { enterRoom, wordleRooms } from 'modules/rooms';
import type { ReqWordlePlayboard } from 'types/games/wordle';

export function renderLobby(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
  res.render('wordle/lobby');
}

export function renderPlayboard(req: ExpressRequest<ReqWordlePlayboard>, res: ExpressResponse, next: ExpressNextFunction) {
  const room = req.params.roomname;
  const host = req.query.host;
  const { success } = enterRoom(wordleRooms, room);
  if (success) res.render('wordle/playboard', { host, room });
  else next();
}
