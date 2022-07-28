import { enterRoom, wordleRooms } from 'modules/rooms';
import type { NextFunction, Request, Response } from 'types/apis';
import type { ReqWordlePlayboard } from 'types/games/wordle';

export function renderLobby(req: Request, res: Response, next: NextFunction) {
  res.render('wordle/lobby');
}

export function renderPlayboard(req: Request<ReqWordlePlayboard>, res: Response, next: NextFunction) {
  const room = req.params.roomname;
  const host = req.query.host;
  const { success } = enterRoom(wordleRooms, room);
  if (success) res.render('wordle/playboard', { host, room });
  else next();
}
