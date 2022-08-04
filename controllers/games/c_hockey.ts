import { enterRoom, hockeyRooms } from 'modules/rooms';
import type { ReqHockeyPlayboard } from 'types/games/hockey';

export function renderLobby(req: Request, res: Response, next: NextFunction) {
  res.render('hockey/lobby');
}

export function renderPlayboard(req: Request<ReqHockeyPlayboard>, res: Response, next: NextFunction) {
  const room = req.params.roomname;
  const { success } = enterRoom(hockeyRooms, room);
  if (success) res.render('hockey/playboard');
  else next();
}
