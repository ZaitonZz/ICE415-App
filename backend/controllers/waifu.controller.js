const Waifu = require('../models/Waifu.model');
const path = require('path');
const fs = require('fs').promises;

/**
 * @desc    Get all waifus
 * @route   GET /api/waifus
 * @access  Public
 */
exports.getAllWaifus = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const waifus = await Waifu.find(query).sort({ order: 1, createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: waifus.length,
      data: waifus
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single waifu by ID
 * @route   GET /api/waifus/:id
 * @access  Public
 */
exports.getWaifuById = async (req, res, next) => {
  try {
    const waifu = await Waifu.findById(req.params.id);
    
    if (!waifu) {
      return res.status(404).json({
        success: false,
        message: 'Waifu not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: waifu
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new waifu (Admin only)
 * @route   POST /api/waifus
 * @access  Private/Admin
 */
exports.createWaifu = async (req, res, next) => {
  try {
    const {
      name,
      personality,
      description,
      color,
      icon,
      traits,
      yandereTrigger,
      emotions,
      isActive,
      order
    } = req.body;
    
    // Check if waifu with same name already exists
    const existingWaifu = await Waifu.findOne({ name });
    if (existingWaifu) {
      return res.status(400).json({
        success: false,
        message: 'Waifu with this name already exists'
      });
    }
    
    // Create waifu
    const waifu = await Waifu.create({
      name,
      personality,
      description,
      color,
      icon,
      traits,
      yandereTrigger,
      emotions,
      isActive,
      order
    });
    
    res.status(201).json({
      success: true,
      message: 'Waifu created successfully',
      data: waifu
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update waifu (Admin only)
 * @route   PUT /api/waifus/:id
 * @access  Private/Admin
 */
exports.updateWaifu = async (req, res, next) => {
  try {
    const {
      name,
      personality,
      description,
      color,
      icon,
      traits,
      yandereTrigger,
      emotions,
      isActive,
      order
    } = req.body;
    
    const waifu = await Waifu.findById(req.params.id);
    
    if (!waifu) {
      return res.status(404).json({
        success: false,
        message: 'Waifu not found'
      });
    }
    
    // Check if updating name to one that already exists
    if (name && name !== waifu.name) {
      const existingWaifu = await Waifu.findOne({ name });
      if (existingWaifu) {
        return res.status(400).json({
          success: false,
          message: 'Waifu with this name already exists'
        });
      }
    }
    
    // Update fields
    if (name) waifu.name = name;
    if (personality) waifu.personality = personality;
    if (description) waifu.description = description;
    if (color) waifu.color = color;
    if (icon) waifu.icon = icon;
    if (traits) waifu.traits = traits;
    if (yandereTrigger) waifu.yandereTrigger = yandereTrigger;
    if (emotions) waifu.emotions = emotions;
    if (isActive !== undefined) waifu.isActive = isActive;
    if (order !== undefined) waifu.order = order;
    
    await waifu.save();
    
    res.status(200).json({
      success: true,
      message: 'Waifu updated successfully',
      data: waifu
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete waifu (Admin only)
 * @route   DELETE /api/waifus/:id
 * @access  Private/Admin
 */
exports.deleteWaifu = async (req, res, next) => {
  try {
    const waifu = await Waifu.findById(req.params.id);
    
    if (!waifu) {
      return res.status(404).json({
        success: false,
        message: 'Waifu not found'
      });
    }
    
    // Delete associated images (optional - you might want to keep them)
    // for (const emotion of waifu.emotions) {
    //   const imagePath = path.join(__dirname, '..', emotion.imageUrl);
    //   try {
    //     await fs.unlink(imagePath);
    //   } catch (err) {
    //     console.error(`Failed to delete image: ${imagePath}`, err);
    //   }
    // }
    
    await waifu.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Waifu deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload waifu emotion image (Admin only)
 * @route   POST /api/waifus/:id/emotions/:emotion/upload
 * @access  Private/Admin
 */
exports.uploadEmotionImage = async (req, res, next) => {
  try {
    const { id, emotion } = req.params;
    
    if (!['normal', 'happy', 'sad', 'angry'].includes(emotion)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid emotion. Must be one of: normal, happy, sad, angry'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }
    
    const waifu = await Waifu.findById(id);
    
    if (!waifu) {
      return res.status(404).json({
        success: false,
        message: 'Waifu not found'
      });
    }
    
    // Construct image URL
    const imageUrl = `/uploads/waifus/${req.file.filename}`;
    
    // Update or add emotion
    const emotionIndex = waifu.emotions.findIndex(e => e.emotion === emotion);
    if (emotionIndex !== -1) {
      waifu.emotions[emotionIndex].imageUrl = imageUrl;
    } else {
      waifu.emotions.push({ emotion, imageUrl });
    }
    
    await waifu.save();
    
    res.status(200).json({
      success: true,
      message: 'Emotion image uploaded successfully',
      data: {
        emotion,
        imageUrl
      }
    });
  } catch (error) {
    next(error);
  }
};
