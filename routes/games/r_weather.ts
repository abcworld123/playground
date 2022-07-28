import express from 'express';
import { weatherController } from 'controllers/games';

const router = express.Router();

router.get('/', weatherController.render);
router.post('/weatherday', weatherController.getDay);
router.post('/weatherta', weatherController.getWeekTemp);
router.post('/weatherml', weatherController.getWeekLand);

export default router;
