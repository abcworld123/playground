import express from 'express';
import { wordleController } from 'controllers/games';

const router = express.Router();

router.get('/', wordleController.renderLobby);
router.get('/:roomname', wordleController.renderPlayboard);

export default router;
