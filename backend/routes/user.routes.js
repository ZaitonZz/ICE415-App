const express = require('express');
const { body } = require('express-validator');
const {
  updateProfile,
  deleteAccount,
  getUserStats
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

router.put('/profile', updateProfileValidation, validate, updateProfile);
router.delete('/account', deleteAccount);
router.get('/stats', getUserStats);

module.exports = router;
