import express from 'express';
import { youtubeController } from 'controllers/games';

const router = express.Router();

router.get('/', youtubeController.render);
router.post('/submit', youtubeController.submit);

export default router;
