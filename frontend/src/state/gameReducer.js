import { initialState } from "./initialState";

export const gameReducer = (state, action) => {
  switch (action.type) {
    // Game state
    case "SET_GAME_STATE":
      return { ...state, gameState: action.gameState };
    
    // Waifu selection
    case "SET_SELECTED_WAIFU":
      return { ...state, selectedWaifu: action.waifu };
    
    // Mood and affection
    case "SET_MOOD":
      return { ...state, mood: action.mood };
    
    case "SET_AFFECTION":
      return { ...state, affection: Math.max(0, Math.min(100, action.affection)) };
    
    // Images
    case "SET_IMAGE":
      return { ...state, currentImage: action.image };
    
    case "SET_GREETING_IMAGE":
      return { ...state, greetingImage: action.image };
    
    // Dialogue and choices
    case "SET_DIALOGUE":
      return { ...state, dialogue: action.dialogue };
    
    case "SET_CHOICES":
      return { ...state, choices: action.choices };
    
    // Conversation history
    case "ADD_HISTORY":
      return { ...state, conversationHistory: [...state.conversationHistory, action.entry] };
    
    case "RESET_HISTORY":
      return { ...state, conversationHistory: [] };
    
    case "SET_CONVERSATION_COUNT":
      return { ...state, conversationCount: action.count };
    
    // Loading state
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    
    // Sound and music
    case "SET_SOUND_ENABLED":
      return { ...state, soundEnabled: action.enabled };
    
    case "SET_MUSIC_ENABLED":
      return { ...state, musicEnabled: action.enabled };
    
    case "SET_SELECTED_MUSIC_TRACK":
      return { ...state, selectedMusicTrack: action.track };
    
    case "SET_CURRENT_MUSIC_REF":
      return { ...state, currentMusicRef: action.payload };
    
    // UI states
    case "SET_SHOW_SETTINGS":
      return { ...state, showSettings: action.show };
    
    case "SET_SHOW_ADMIN_PANEL":
      return { ...state, showAdminPanel: action.show };
    
    // Screenshots and gifts
    case "ADD_SCREENSHOT":
      return { ...state, screenshots: [...state.screenshots, action.screenshot] };
    
    case "ADD_GIFT":
      return { ...state, gifts: [...state.gifts, action.gift] };
    
    // Dates
    case "SET_DATE_LOCATION":
      return { ...state, dateLocation: action.location };
    
    case "INCREMENT_DATE_COUNT":
      return { ...state, currentDate: (state.currentDate || 0) + 1 };
    
    // Minigames
    case "SET_MINIGAME":
      return { ...state, miniGame: action.minigame };
    
    // Outfits
    case "UNLOCK_OUTFIT":
      if (state.unlockedOutfits.includes(action.outfit)) {
        return state;
      }
      return { ...state, unlockedOutfits: [...state.unlockedOutfits, action.outfit] };
    
    case "SET_CURRENT_OUTFIT":
      return { ...state, currentOutfit: action.outfit };
    
    // Achievements
    case "SET_ACHIEVEMENTS":
      return { ...state, achievements: action.achievements };
    
    // Theme
    case "SET_THEME":
      return { ...state, currentTheme: action.theme };
    
    // Reset game
    case "RESET_GAME":
      return {
        ...initialState,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        currentTheme: state.currentTheme,
        achievements: state.achievements,
        unlockedOutfits: state.unlockedOutfits,
        screenshots: state.screenshots,
      };
    
    default:
      console.warn("Unknown action type:", action.type);
      return state;
  }
};

