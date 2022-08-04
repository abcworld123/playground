import { submitRanking } from 'modules/games/m_jebi';
import type { ReqJebiSubmit, ResJebiSubmit } from 'types/games/jebi';

export function render(req: Request, res: Response, next: NextFunction) {
  res.render('jebi/jebi');
}

export async function submit(req: Request<ReqJebiSubmit>, res: Response<ResJebiSubmit>, next: NextFunction) {
  const { n, dog } = req.body;
  const data = await submitRanking(n, dog);
  res.json(data);
}
