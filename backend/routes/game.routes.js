const express = require('express');
const {
  getGameState,
  saveGameState,
  resetGameState
} = require('../controllers/game.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/state', getGameState);
router.post('/state', saveGameState);
router.delete('/state', resetGameState);

module.exports = router;
