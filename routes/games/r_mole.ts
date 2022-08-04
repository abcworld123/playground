import express from 'express';
import { moleController } from 'controllers/games';

const router = express.Router();

router.get('/', moleController.renderLobby);
router.get('/:roomname', moleController.renderPlayboard);

export default router;
