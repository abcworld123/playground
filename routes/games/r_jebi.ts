import express from 'express';
import { jebiController } from 'controllers/games';

const router = express.Router();

router.get('/', jebiController.render);
router.post('/submit', jebiController.submit);

export default router;
