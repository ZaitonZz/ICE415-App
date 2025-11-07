const express = require('express');
const router = express.Router();
const {
  getAllWaifus,
  getWaifuById,
  createWaifu,
  updateWaifu,
  deleteWaifu,
  uploadEmotionImage
} = require('../controllers/waifu.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { validateWaifuCreate, validateWaifuUpdate } = require('../middleware/validate.middleware');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'waifus'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'waifu-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes
router.get('/', getAllWaifus);
router.get('/:id', getWaifuById);

// Admin only routes
router.post('/', protect, admin, validateWaifuCreate, createWaifu);
router.put('/:id', protect, admin, validateWaifuUpdate, updateWaifu);
router.delete('/:id', protect, admin, deleteWaifu);
router.post('/:id/emotions/:emotion/upload', protect, admin, upload.single('image'), uploadEmotionImage);

module.exports = router;
