import { getResult } from 'modules/games/m_youtube';
import type { ReqYoutubeSubmit, ResYoutubeSubmit } from 'types/games/youtube';

export function render(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
  res.render('youtube/youtube');
}

export async function submit(req: ExpressRequest<ReqYoutubeSubmit>, res: ExpressResponse<ResYoutubeSubmit>, next: ExpressNextFunction) {
  const keywords = req.body.keywords;
  const data = await getResult(keywords);
  res.json(data);
}
