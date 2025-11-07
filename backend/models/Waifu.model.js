const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
  emotion: {
    type: String,
    required: true,
    enum: ['normal', 'happy', 'sad', 'angry'],
  },
  imageUrl: {
    type: String,
    required: true,
  }
}, { _id: false });

const waifuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Waifu name is required'],
    trim: true,
    unique: true,
    index: true
  },
  personality: {
    type: String,
    required: [true, 'Personality is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  color: {
    type: String,
    default: 'from-pink-400 to-red-500',
    trim: true
  },
  icon: {
    type: String,
    default: '💕'
  },
  traits: {
    type: [String],
    default: []
  },
  yandereTrigger: {
    type: String,
    required: [true, 'Yandere trigger is required'],
    trim: true
  },
  emotions: {
    type: [emotionSchema],
    validate: {
      validator: function (emotions) {
        // Must have all 4 emotions
        const emotionTypes = emotions.map(e => e.emotion);
        return emotionTypes.includes('normal') &&
          emotionTypes.includes('happy') &&
          emotionTypes.includes('sad') &&
          emotionTypes.includes('angry');
      },
      message: 'Waifu must have all 4 emotions (normal, happy, sad, angry)'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Method to get emotion image
waifuSchema.methods.getEmotionImage = function (emotion) {
  const emotionData = this.emotions.find(e => e.emotion === emotion);
  return emotionData ? emotionData.imageUrl : this.emotions.find(e => e.emotion === 'normal')?.imageUrl;
};

const Waifu = mongoose.model('Waifu', waifuSchema);

module.exports = Waifu;
