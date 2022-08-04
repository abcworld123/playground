import { enterRoom, moleRooms } from 'modules/rooms';
import type { ReqMolePlayboard } from 'types/games/mole';

export function renderLobby(req: Request, res: Response, next: NextFunction) {
  res.render('mole/lobby');
}

export function renderPlayboard(req: Request<ReqMolePlayboard>, res: Response, next: NextFunction) {
  const room = req.params.roomname;
  const { success } = enterRoom(moleRooms, room);
  if (success) res.render('mole/playboard');
  else next();
}
