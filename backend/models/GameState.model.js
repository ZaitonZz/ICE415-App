const mongoose = require('mongoose');

const conversationEntrySchema = new mongoose.Schema({
  player: String,
  waifu: String,
  mood: String,
  affection: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const screenshotSchema = new mongoose.Schema({
  id: Number,
  timestamp: String,
  waifu: String,
  mood: String,
  affection: Number,
  dialogue: String
}, { _id: false });

const giftSchema = new mongoose.Schema({
  id: String,
  name: String,
  icon: String,
  value: Number,
  timestamp: Number
}, { _id: false });

const gameStateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  gameState: {
    type: String,
    enum: ['start', 'waifuSelect', 'playing', 'ended', 'date', 'minigame'],
    default: 'start'
  },
  selectedWaifu: {
    type: String,
    enum: ['sweet', 'cheerful', 'shy', 'friendly', 'warm', 'mysterious', null],
    default: null
  },
  mood: {
    type: String,
    enum: ['neutral', 'happy', 'sad', 'angry', 'yandere', 'shy', 'excited', 'worried', 'jealous', 'loving', 'disappointed', 'playful'],
    default: 'neutral'
  },
  affection: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  conversationCount: {
    type: Number,
    default: 0,
    min: 0
  },
  conversationHistory: [conversationEntrySchema],
  achievements: [{
    type: String
  }],
  unlockedOutfits: [{
    type: String
  }],
  currentOutfit: {
    type: String,
    default: 'default'
  },
  screenshots: [screenshotSchema],
  gifts: [giftSchema],
  currentDate: {
    type: Number,
    default: 0,
    min: 0
  },
  dateLocation: {
    type: String,
    default: null
  },
  storyProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  unlockedEndings: [{
    type: String
  }],
  conversationMemory: [conversationEntrySchema],
  currentTheme: {
    type: String,
    default: 'purple'
  },
  soundEnabled: {
    type: Boolean,
    default: true
  },
  musicEnabled: {
    type: Boolean,
    default: true
  },
  lastPlayed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to update last played timestamp
gameStateSchema.methods.updateLastPlayed = function() {
  this.lastPlayed = Date.now();
  return this.save();
};

// Method to reset game state
gameStateSchema.methods.reset = function() {
  this.gameState = 'start';
  this.selectedWaifu = null;
  this.mood = 'neutral';
  this.affection = 50;
  this.conversationCount = 0;
  this.conversationHistory = [];
  this.achievements = [];
  this.unlockedOutfits = [];
  this.currentOutfit = 'default';
  this.screenshots = [];
  this.gifts = [];
  this.currentDate = 0;
  this.dateLocation = null;
  this.storyProgress = 0;
  this.unlockedEndings = [];
  this.conversationMemory = [];
  this.currentTheme = 'purple';
  return this.save();
};

// Static method to get or create game state
gameStateSchema.statics.getOrCreate = async function(userId) {
  let gameState = await this.findOne({ userId });
  
  if (!gameState) {
    gameState = await this.create({ userId });
  }
  
  return gameState;
};

const GameState = mongoose.model('GameState', gameStateSchema);

module.exports = GameState;
