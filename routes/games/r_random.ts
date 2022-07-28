import express from 'express';
import { randomController } from 'controllers/games';

const router = express.Router();

router.get('/', randomController.render);

export default router;
