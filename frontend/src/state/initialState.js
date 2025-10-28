export const initialState = {
  // Core game states
  gameState: "start", // start, waifuSelect, playing, ended, date, dateSelect, minigame, minigameSelect, giftSelect
  
  // Waifu and conversation
  selectedWaifu: null,
  mood: "neutral",
  affection: 50,
  currentImage: "",
  dialogue: "",
  choices: [],
  conversationHistory: [],
  conversationCount: 0,
  
  // Settings
  loading: false,
  soundEnabled: true,
  musicEnabled: true,
  showSettings: false,
  currentMusicRef: null,
  selectedMusicTrack: 0,
  greetingImage: "",
  
  // Features
  achievements: [],
  unlockedOutfits: [],
  currentOutfit: "default",
  photoMode: false,
  screenshots: [],
  currentTheme: "purple",
  gifts: [],
  currentDate: null,
  dateLocation: null,
  miniGame: null,
  conversationMemory: [],
  storyProgress: 0,
  unlockedEndings: [],
  
  // Mini-game runtime state
  gameScore: 0,
  gameTime: 30,
  gameActive: false,
  currentTrivia: 0,
  selectedAnswer: null,
  
  // Admin panel
  showAdminPanel: false,
};
