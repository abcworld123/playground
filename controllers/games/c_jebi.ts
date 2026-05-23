import { submitRanking } from 'modules/games/m_jebi';
import type { ReqJebiSubmit, ResJebiSubmit } from 'types/games/jebi';

export function render(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
  res.render('jebi/jebi');
}

export async function submit(req: ExpressRequest<ReqJebiSubmit>, res: ExpressResponse<ResJebiSubmit>, next: ExpressNextFunction) {
  const { n, dog } = req.body;
  const data = await submitRanking(n, dog);
  res.json(data);
}
