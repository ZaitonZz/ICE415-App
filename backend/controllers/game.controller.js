const GameState = require('../models/GameState.model');

/**
 * @route   GET /api/game/state
 * @desc    Get user's game state
 * @access  Private
 */
const getGameState = async (req, res, next) => {
  try {
    const gameState = await GameState.getOrCreate(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        gameState
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/game/state
 * @desc    Save/update user's game state
 * @access  Private
 */
const saveGameState = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const gameStateData = req.body;

    // Get or create game state
    let gameState = await GameState.findOne({ userId });

    if (!gameState) {
      gameState = await GameState.create({
        userId,
        ...gameStateData
      });
    } else {
      // Update existing game state
      Object.keys(gameStateData).forEach(key => {
        if (gameStateData[key] !== undefined) {
          gameState[key] = gameStateData[key];
        }
      });
      
      gameState.lastPlayed = Date.now();
      await gameState.save();
    }

    res.status(200).json({
      success: true,
      message: 'Game state saved successfully',
      data: {
        gameState
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/game/state
 * @desc    Reset user's game state
 * @access  Private
 */
const resetGameState = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let gameState = await GameState.findOne({ userId });

    if (!gameState) {
      gameState = await GameState.create({ userId });
    } else {
      await gameState.reset();
    }

    res.status(200).json({
      success: true,
      message: 'Game state reset successfully',
      data: {
        gameState
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGameState,
  saveGameState,
  resetGameState
};
