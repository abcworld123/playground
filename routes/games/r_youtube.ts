import express from 'express';
import { getResult } from 'modules/games/m_youtube';
import type { ReqYoutubeSubmit, ResYoutubeSubmit } from 'types/games/youtube';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('youtube/youtube');
});

router.post<null, ResYoutubeSubmit, ReqYoutubeSubmit>('/submit', async (req, res, next) => {
  const keywords = req.body.keywords;
  const data = await getResult(keywords);
  res.json(data);
});

export default router;
