const User = require('../models/User.model');
const GameState = require('../models/GameState.model');

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profilePicture } = req.body;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user._id }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(username && { username }),
        ...(email && { email }),
        ...(profilePicture !== undefined && { profilePicture })
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account and associated data
 * @access  Private
 */
const deleteAccount = async (req, res, next) => {
  try {
    // Delete user's game state
    await GameState.deleteOne({ userId: req.user._id });

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const gameState = await GameState.findOne({ userId: req.user._id });

    const stats = {
      accountCreated: user.createdAt,
      lastLogin: user.lastLogin,
      achievements: gameState?.achievements.length || 0,
      conversationCount: gameState?.conversationCount || 0,
      affection: gameState?.affection || 50,
      screenshots: gameState?.screenshots.length || 0,
      giftsGiven: gameState?.gifts.length || 0,
      datesCompleted: gameState?.currentDate || 0,
      storyProgress: gameState?.storyProgress || 0,
      unlockedOutfits: gameState?.unlockedOutfits.length || 0,
      unlockedEndings: gameState?.unlockedEndings.length || 0
    };

    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  deleteAccount,
  getUserStats
};
