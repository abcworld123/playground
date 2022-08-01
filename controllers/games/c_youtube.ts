import { getResult } from 'modules/games/m_youtube';
import type { ReqYoutubeSubmit, ResYoutubeSubmit } from 'types/games/youtube';

export function render(req: Request, res: Response, next: NextFunction) {
  res.render('youtube/youtube');
}

export async function submit(req: Request<ReqYoutubeSubmit>, res: Response<ResYoutubeSubmit>, next: NextFunction) {
  const keywords = req.body.keywords;
  const data = await getResult(keywords);
  res.json(data);
}
