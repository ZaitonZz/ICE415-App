import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Zap,
  Skull,
  Play,
  Star,
  Home,
  Settings,
  Volume2,
  VolumeX,
  Users,
  Trophy,
  Music,
  RotateCcw,
  Shield,
} from "lucide-react";
import AdminPanel from "./AdminPanel";

// Single waifu with different personality types
const waifuTypes = {
  sweet: {
    name: "Aiko",
    personality: "Sweet & Caring",
    description:
      "A sweet, caring waifu who loves deeply and wants to protect you",
    color: "from-pink-400 to-red-500",
    icon: "💕",
    traits: ["loving", "protective", "romantic"],
    yandereTrigger: "possessive",
  },
  cheerful: {
    name: "Yuki",
    personality: "Cheerful & Energetic",
    description: "Always cheerful and full of energy, loves to make you smile",
    color: "from-blue-400 to-cyan-500",
    icon: "❄️",
    traits: ["energetic", "optimistic", "playful"],
    yandereTrigger: "jealous",
  },
  shy: {
    name: "Sakura",
    personality: "Shy & Gentle",
    description: "Gentle and shy, but has hidden strength and determination",
    color: "from-pink-300 to-purple-400",
    icon: "🌸",
    traits: ["shy", "gentle", "determined"],
    yandereTrigger: "clingy",
  },
  friendly: {
    name: "Mai",
    personality: "Friendly & Smiling",
    description: "Friendly and always smiling, brings joy to your life",
    color: "from-yellow-400 to-orange-500",
    icon: "☀️",
    traits: ["friendly", "cheerful", "social"],
    yandereTrigger: "territorial",
  },
  warm: {
    name: "Hana",
    personality: "Welcoming & Warm",
    description: "Warm and welcoming, makes you feel at home",
    color: "from-green-400 to-emerald-500",
    icon: "🌺",
    traits: ["nurturing", "warm", "motherly"],
    yandereTrigger: "overprotective",
  },
  mysterious: {
    name: "Luna",
    personality: "Mysterious & Enigmatic",
    description: "Mysterious and enigmatic, with hidden depths and secrets",
    color: "from-purple-600 to-indigo-700",
    icon: "🌙",
    traits: ["mysterious", "enigmatic", "alluring"],
    yandereTrigger: "obsessive",
  },
};

const YandereAIGame = () => {
  console.log("YandereAIGame component rendering");

  // Core game states
  const [gameState, setGameState] = useState("start"); // start, waifuSelect, playing, ended

  // Debug game state changes
  useEffect(() => {
    console.log("Game state changed to:", gameState);
  }, [gameState]);

  // All state declarations
  const [selectedWaifu, setSelectedWaifu] = useState(null);
  const [mood, setMood] = useState("neutral");
  const [affection, setAffection] = useState(50);
  const [currentImage, setCurrentImage] = useState("");
  const [dialogue, setDialogue] = useState("");
  const [choices, setChoices] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [conversationCount, setConversationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [selectedMusicTrack, setSelectedMusicTrack] = useState(0);
  const [greetingImage, setGreetingImage] = useState("");

  // New feature states
  const [achievements, setAchievements] = useState([]);
  const [unlockedOutfits, setUnlockedOutfits] = useState([]);
  const [currentOutfit, setCurrentOutfit] = useState("default");
  const [photoMode, setPhotoMode] = useState(false);
  const [screenshots, setScreenshots] = useState([]);
  const [currentTheme, setCurrentTheme] = useState("purple");
  const [gifts, setGifts] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [dateLocation, setDateLocation] = useState(null);
  const [miniGame, setMiniGame] = useState(null);
  const [conversationMemory, setConversationMemory] = useState([]);
  const [storyProgress, setStoryProgress] = useState(0);
  const [unlockedEndings, setUnlockedEndings] = useState([]);

  // Admin panel state
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Admin panel update function
  const updateGameData = (updates) => {
    Object.keys(updates).forEach((key) => {
      const setter = {
        gameState: setGameState,
        selectedWaifu: setSelectedWaifu,
        mood: setMood,
        affection: setAffection,
        conversationCount: setConversationCount,
        achievements: setAchievements,
        unlockedOutfits: setUnlockedOutfits,
        currentOutfit: setCurrentOutfit,
        screenshots: setScreenshots,
        gifts: setGifts,
        currentDate: setCurrentDate,
        storyProgress: setStoryProgress,
        unlockedEndings: setUnlockedEndings,
        waifuTypes: () => {
          // This would need special handling for waifu types
          console.log("Waifu types update not implemented yet");
        },
      }[key];

      if (setter) {
        setter(updates[key]);
      }
    });
  };

  // Play ending sound effect when game ends
  useEffect(() => {
    if (gameState === "ended") {
      playEndingSound(mood, affection);
    }
  }, [gameState, mood, affection]);

  // Check achievements
  useEffect(() => {
    checkAchievements();
  }, [
    conversationCount,
    affection,
    screenshots.length,
    currentDate,
    gifts.length,
    unlockedEndings.length,
  ]);

  // Unlock outfits based on achievements
  useEffect(() => {
    const newUnlockedOutfits = [...unlockedOutfits];

    // Unlock casual outfit after first conversation
    if (conversationCount >= 1 && !newUnlockedOutfits.includes("casual")) {
      newUnlockedOutfits.push("casual");
    }

    // Unlock school uniform after 3 conversations
    if (conversationCount >= 3 && !newUnlockedOutfits.includes("school")) {
      newUnlockedOutfits.push("school");
    }

    // Unlock formal outfit at 80% affection
    if (affection >= 80 && !newUnlockedOutfits.includes("formal")) {
      newUnlockedOutfits.push("formal");
    }

    // Unlock party dress after taking 5 screenshots
    if (screenshots.length >= 5 && !newUnlockedOutfits.includes("party")) {
      newUnlockedOutfits.push("party");
    }

    // Unlock summer dress after going on 2 dates
    if (currentDate >= 2 && !newUnlockedOutfits.includes("summer")) {
      newUnlockedOutfits.push("summer");
    }

    // Unlock winter coat after giving 3 gifts
    if (gifts.length >= 3 && !newUnlockedOutfits.includes("winter")) {
      newUnlockedOutfits.push("winter");
    }

    // Unlock cyber outfit after unlocking all other outfits
    if (
      newUnlockedOutfits.length >= 7 &&
      !newUnlockedOutfits.includes("cyber")
    ) {
      newUnlockedOutfits.push("cyber");
    }

    setUnlockedOutfits(newUnlockedOutfits);
  }, [
    conversationCount,
    affection,
    screenshots.length,
    currentDate,
    gifts.length,
    unlockedOutfits,
  ]);

  // Achievement checking function
  const checkAchievements = () => {
    const newAchievements = [...achievements];

    // First Love
    if (conversationCount >= 1 && !newAchievements.includes("first_love")) {
      newAchievements.push("first_love");
      showAchievementNotification("first_love");
    }

    // Sweet Talker
    if (affection >= 80 && !newAchievements.includes("sweet_talker")) {
      newAchievements.push("sweet_talker");
      showAchievementNotification("sweet_talker");
    }

    // Photo Enthusiast
    if (
      screenshots.length >= 10 &&
      !newAchievements.includes("photo_enthusiast")
    ) {
      newAchievements.push("photo_enthusiast");
      showAchievementNotification("photo_enthusiast");
    }

    // Date Expert
    if (
      currentDate &&
      currentDate >= 3 &&
      !newAchievements.includes("date_expert")
    ) {
      newAchievements.push("date_expert");
      showAchievementNotification("date_expert");
    }

    // Gift Giver
    if (gifts.length >= 5 && !newAchievements.includes("gift_giver")) {
      newAchievements.push("gift_giver");
      showAchievementNotification("gift_giver");
    }

    setAchievements(newAchievements);
  };

  // Show achievement notification
  const showAchievementNotification = (achievementId) => {
    const achievement = achievementList.find((a) => a.id === achievementId);
    if (achievement) {
      // Create notification element
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce";
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span class="text-2xl">${achievement.icon}</span>
          <div>
            <div class="font-bold">Achievement Unlocked!</div>
            <div class="text-sm">${achievement.name}</div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      // Remove after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  // Photo Mode Functions
  const takeScreenshot = () => {
    const screenshot = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      waifu: selectedWaifu,
      mood: mood,
      affection: affection,
      dialogue: dialogue,
    };
    setScreenshots([...screenshots, screenshot]);
    playSound("click");
  };

  // Gift System Functions
  const giveGift = (giftId) => {
    const gift = giftList.find((g) => g.id === giftId);
    if (gift) {
      setGifts([...gifts, { ...gift, timestamp: Date.now() }]);
      setAffection((prev) => Math.min(100, prev + gift.value));
      playSound("click");

      // Gift-specific reactions based on waifu type and gift
      const getGiftReaction = (gift, waifuType) => {
        const reactions = {
          chocolate: {
            sweet:
              "Chocolate! You know I have a sweet tooth! This is perfect! 🍫💕",
            cheerful:
              "Yay! Chocolate! You're so sweet to remember my favorite! 🍫✨",
            shy: "T-thank you... chocolate is my weakness... *blushes* 🍫😊",
            friendly:
              "Oh my! Chocolate! You really know how to make a girl happy! 🍫💕",
            warm: "Chocolate... you remembered my favorite treat! You're so thoughtful! 🍫💕",
            mysterious:
              "Chocolate... how did you know? *mysterious smile* This is... perfect 🍫✨",
          },
          flowers: {
            sweet: "These flowers are so beautiful! Just like our love! 🌸💕",
            cheerful:
              "Flowers! They're so pretty! You always know how to make me smile! 🌸✨",
            shy: "F-flowers... for me? *blushes deeply* T-thank you... 🌸😊",
            friendly: "Aww! Flowers! You're such a romantic! I love them! 🌸💕",
            warm: "These flowers are gorgeous! You have such good taste! 🌸💕",
            mysterious:
              "Flowers... *smiles mysteriously* They remind me of... secrets 🌸✨",
          },
          jewelry: {
            sweet:
              "Jewelry! This is so elegant! I'll treasure it forever! 💎💕",
            cheerful:
              "Wow! Jewelry! You're so generous! I feel like a princess! 💎✨",
            shy: "J-jewelry? For me? *blushes* I... I don't know what to say... 💎😊",
            friendly:
              "Jewelry! You really know how to spoil a girl! I love it! 💎💕",
            warm: "This jewelry is beautiful! You have such wonderful taste! 💎💕",
            mysterious:
              "Jewelry... *examines it carefully* This has... interesting properties 💎✨",
          },
          book: {
            sweet:
              "A book! You know I love reading! This is so thoughtful! 📚💕",
            cheerful: "A book! I love reading! You know me so well! 📚✨",
            shy: "A... book? T-thank you... I love reading... *hugs it* 📚😊",
            friendly:
              "A book! Perfect! I love how you remember my interests! 📚💕",
            warm: "This book looks fascinating! You always pick the best gifts! 📚💕",
            mysterious:
              "A book... *opens it* Ah, this contains... secrets I've been seeking 📚✨",
          },
          plushie: {
            sweet:
              "A plushie! It's so cute! I'll cuddle with it and think of you! 🧸💕",
            cheerful: "A plushie! It's adorable! I love cute things! 🧸✨",
            shy: "A... plushie? *hugs it tightly* It's so soft... thank you... 🧸😊",
            friendly: "A plushie! How cute! You know I love soft things! 🧸💕",
            warm: "This plushie is so soft and cuddly! Perfect for bedtime! 🧸💕",
            mysterious:
              "A plushie... *examines it* This one has... unusual eyes... 🧸✨",
          },
          cake: {
            sweet: "Cake! You know I love sweets! This looks delicious! 🎂💕",
            cheerful: "Cake! Yummy! You're the sweetest for getting this! 🎂✨",
            shy: "C-cake? For me? *blushes* I... I love cake... 🎂😊",
            friendly: "Cake! Perfect! You know how to make a girl happy! 🎂💕",
            warm: "This cake looks amazing! You have such good taste! 🎂💕",
            mysterious:
              "Cake... *smiles* This one has... special ingredients, doesn't it? 🎂✨",
          },
        };

        return (
          reactions[gift.id]?.[waifuType] || "Thank you so much! I love it! 💕"
        );
      };

      const reaction = getGiftReaction(gift, selectedWaifu);
      setDialogue(reaction);

      // Add to conversation history
      const newEntry = {
        player: `Gave ${gift.name}`,
        waifu: reaction,
        mood: mood,
        affection: affection + gift.value,
      };
      setConversationHistory((prev) => [...prev, newEntry]);
      addToMemory(newEntry);
    }
  };

  // Date System Functions
  const startDate = (locationId) => {
    const location = dateLocations.find((l) => l.id === locationId);
    if (location) {
      setDateLocation(location);
      setCurrentDate((prev) => (prev || 0) + 1);
      setGameState("date");
      playSound("click");

      // Generate date-specific dialogue
      const dateDialogues = {
        cafe: [
          "This cafe is so cozy! I love spending time here with you~ ☕",
          "The coffee here is amazing! But you're even sweeter than this dessert! 💕",
          "I feel so relaxed here... it's like we're in our own little world ✨",
        ],
        park: [
          "The cherry blossoms are so beautiful! Just like you~ 🌸",
          "I love walking through the park with you... it's so romantic! 💕",
          "This place makes me feel so peaceful... especially with you here ✨",
        ],
        beach: [
          "The sunset is gorgeous! But you're even more beautiful! 🌅",
          "I love the sound of the waves... and your voice is even more soothing! 🌊",
          "This beach is perfect for a romantic walk with you~ 💕",
        ],
        school: [
          "The school rooftop... this brings back so many memories! 🏫",
          "I used to come here to think... but now I come here to be with you! 💕",
          "This place feels so nostalgic... and you make it even more special ✨",
        ],
        library: [
          "I love the quiet atmosphere here... perfect for intimate conversations! 📚",
          "There are so many books here... but you're the most interesting story! 💕",
          "This library is so peaceful... I feel so close to you here ✨",
        ],
        garden: [
          "This secret garden is so mysterious... just like you! 🌹",
          "I love how secluded this place is... it's like our own private world! 💕",
          "The flowers here are beautiful... but you're the most beautiful flower of all! ✨",
        ],
      };

      const randomDialogue =
        dateDialogues[locationId][
          Math.floor(Math.random() * dateDialogues[locationId].length)
        ];
      setDialogue(randomDialogue);
    }
  };

  // Date activities
  const dateActivities = {
    cafe: [
      {
        name: "Order Coffee",
        description: "Share a warm cup together",
        affection: 5,
        dialogue: "This coffee tastes so much better when I'm with you! ☕",
      },
      {
        name: "Share Dessert",
        description: "Feed each other sweet treats",
        affection: 8,
        dialogue: "You're sweeter than any dessert! 💕",
      },
      {
        name: "Deep Conversation",
        description: "Talk about your dreams",
        affection: 10,
        dialogue: "I love how we can talk about anything together! ✨",
      },
    ],
    park: [
      {
        name: "Walk Hand in Hand",
        description: "Stroll through the cherry blossoms",
        affection: 6,
        dialogue: "Walking with you feels like a dream! 🌸",
      },
      {
        name: "Take Photos",
        description: "Capture beautiful moments",
        affection: 7,
        dialogue: "Every moment with you is worth remembering! 📸",
      },
      {
        name: "Sit on Bench",
        description: "Watch the world go by",
        affection: 9,
        dialogue: "Time seems to stop when I'm with you! 💕",
      },
    ],
    beach: [
      {
        name: "Build Sandcastle",
        description: "Create something together",
        affection: 8,
        dialogue: "Building memories with you is the best! 🏖️",
      },
      {
        name: "Watch Sunset",
        description: "Enjoy the beautiful view",
        affection: 12,
        dialogue: "The sunset is beautiful, but you're even more stunning! 🌅",
      },
      {
        name: "Walk Barefoot",
        description: "Feel the sand between your toes",
        affection: 6,
        dialogue: "Everything feels magical when I'm with you! ✨",
      },
    ],
    school: [
      {
        name: "Share Lunch",
        description: "Eat together on the rooftop",
        affection: 7,
        dialogue: "School lunches taste better when shared with you! 🍱",
      },
      {
        name: "Study Together",
        description: "Help each other learn",
        affection: 5,
        dialogue: "I learn so much more when I'm with you! 📚",
      },
      {
        name: "Watch the City",
        description: "Enjoy the view from above",
        affection: 10,
        dialogue: "The city looks so peaceful from up here... with you! 🌆",
      },
    ],
    library: [
      {
        name: "Read Together",
        description: "Share a book",
        affection: 6,
        dialogue: "Reading with you is so cozy and intimate! 📖",
      },
      {
        name: "Whisper Secrets",
        description: "Share quiet confidences",
        affection: 8,
        dialogue: "I love how we can share secrets in this quiet place! 💕",
      },
      {
        name: "Find Hidden Books",
        description: "Explore the shelves together",
        affection: 7,
        dialogue: "Discovering new books with you is an adventure! ✨",
      },
    ],
    garden: [
      {
        name: "Pick Flowers",
        description: "Create a bouquet together",
        affection: 9,
        dialogue:
          "These flowers are beautiful, but you're the most beautiful! 🌹",
      },
      {
        name: "Hide and Seek",
        description: "Play a romantic game",
        affection: 8,
        dialogue: "Playing with you makes me feel so young and happy! 💕",
      },
      {
        name: "Share a Kiss",
        description: "A tender moment together",
        affection: 15,
        dialogue: "This garden is perfect for our special moments! ✨",
      },
    ],
  };

  const doDateActivity = (activity) => {
    setAffection((prev) => Math.min(100, prev + activity.affection));
    setDialogue(activity.dialogue);
    playSound("click");

    // Add to conversation history
    const newEntry = {
      player: `Did activity: ${activity.name}`,
      waifu: activity.dialogue,
      mood: mood,
      affection: affection + activity.affection,
    };
    setConversationHistory((prev) => [...prev, newEntry]);
    addToMemory(newEntry);
  };

  // Mini-Game Functions
  const startMiniGame = (gameId) => {
    setMiniGame(gameId);
    setGameState("minigame");
    playSound("click");
  };

  // Mini-game state
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  // Cooking Game
  const cookingGame = {
    ingredients: ["🍅", "🥬", "🧄", "🧅", "🥕", "🥩", "🍄", "🧀"],
    recipes: [
      { name: "Pasta", ingredients: ["🍅", "🧄", "🧀"], points: 10 },
      { name: "Salad", ingredients: ["🥬", "🍅", "🥕"], points: 8 },
      { name: "Stir Fry", ingredients: ["🥩", "🥬", "🧄"], points: 12 },
    ],
  };

  // Memory Game
  const memoryGame = {
    cards: ["💕", "🌸", "✨", "🎀", "💎", "🌹", "🎂", "🎁"],
    flipped: [],
    matched: [],
  };

  // Trivia Questions
  const triviaQuestions = [
    {
      question: "What's the best way to show your love?",
      options: ["Gifts", "Time together", "Sweet words", "All of the above"],
      correct: 3,
      points: 10,
    },
    {
      question: "What makes a perfect date?",
      options: [
        "Expensive restaurant",
        "Being together",
        "Fancy clothes",
        "Perfect weather",
      ],
      correct: 1,
      points: 10,
    },
    {
      question: "What's the most romantic gesture?",
      options: [
        "Buying flowers",
        "Remembering small details",
        "Saying I love you",
        "All are romantic",
      ],
      correct: 3,
      points: 10,
    },
  ];

  const [currentTrivia, setCurrentTrivia] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const playCookingGame = () => {
    setGameActive(true);
    setGameScore(0);
    setGameTime(30);

    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playMemoryGame = () => {
    setGameActive(true);
    setGameScore(0);
  };

  const playTriviaGame = () => {
    setGameActive(true);
    setGameScore(0);
    setCurrentTrivia(0);
    setSelectedAnswer(null);
  };

  const playRhythmGame = () => {
    setGameActive(true);
    setGameScore(0);
    setGameTime(20);

    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const answerTrivia = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const question = triviaQuestions[currentTrivia];
    if (answerIndex === question.correct) {
      setGameScore((prev) => prev + question.points);
    }

    setTimeout(() => {
      if (currentTrivia < triviaQuestions.length - 1) {
        setCurrentTrivia((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameActive(false);
      }
    }, 2000);
  };

  const finishMiniGame = () => {
    const affectionGain = Math.floor(gameScore / 5);
    setAffection((prev) => Math.min(100, prev + affectionGain));

    const reactions = [
      `That was so much fun! I love playing with you! +${affectionGain} affection 💕`,
      `You're amazing at this game! I had such a great time! +${affectionGain} affection ✨`,
      `Playing with you is the best! You make everything more fun! +${affectionGain} affection 🌟`,
    ];

    const randomReaction =
      reactions[Math.floor(Math.random() * reactions.length)];
    setDialogue(randomReaction);

    setGameState("playing");
    setMiniGame(null);
    setGameActive(false);
    setGameScore(0);
    setGameTime(30);
  };

  // Memory System Functions
  const addToMemory = (conversation) => {
    setConversationMemory((prev) => [
      ...prev,
      {
        ...conversation,
        timestamp: Date.now(),
        waifu: selectedWaifu,
      },
    ]);
  };

  // Theme Functions
  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    playSound("click");
  };

  // Outfit Functions
  const changeOutfit = (outfitId) => {
    if (unlockedOutfits.includes(outfitId) || outfitId === "default") {
      setCurrentOutfit(outfitId);
      playSound("click");
    }
  };

  // Unlock outfit
  const unlockOutfit = (outfitId) => {
    if (!unlockedOutfits.includes(outfitId)) {
      setUnlockedOutfits([...unlockedOutfits, outfitId]);
      showAchievementNotification("outfit_unlocked");
    }
  };

  // API endpoints for different moods - more accurate mapping
  const moodEndpoints = {
    happy: "happy",
    sad: "sad",
    angry: "angry",
    yandere: "cringe",
    shy: "blush",
    neutral: "waifu",
    excited: "happy",
    worried: "sad",
    jealous: "angry",
    loving: "happy",
    disappointed: "sad",
    playful: "happy",
  };

  // Conversation database for each waifu type
  const conversationDatabase = {
    sweet: [
      {
        id: 1,
        question: "Hi! I'm Aiko, your virtual waifu 💕. Wanna chat?",
        choices: [
          {
            text: "Of course! You seem sweet.",
            effect: "affection",
            value: 10,
            response: "Aww, thank you! You're so kind~ ♡",
          },
          {
            text: "Sure, but don't expect too much.",
            effect: "neutral",
            value: 0,
            response: "That's okay, I'll try my best to impress you!",
          },
          {
            text: "Tch, I don't even like anime girls.",
            effect: "anger",
            value: -15,
            response:
              "Hmph! You'll change your mind about me... I'll make sure of it.",
          },
        ],
      },
      {
        id: 2,
        question: "What's your favorite type of date?",
        choices: [
          {
            text: "A romantic dinner under the stars",
            effect: "affection",
            value: 15,
            response: "That sounds perfect! I love romantic settings~ ♡",
          },
          {
            text: "Something fun and adventurous",
            effect: "affection",
            value: 10,
            response: "Ooh, I love adventure! Let's explore together!",
          },
          {
            text: "I don't really date...",
            effect: "sad",
            value: -10,
            response: "Oh... I was hoping we could go on a date together...",
          },
        ],
      },
      {
        id: 3,
        question: "Do you believe in love at first sight?",
        choices: [
          {
            text: "Yes, I believe in it completely",
            effect: "affection",
            value: 20,
            response: "Me too! I think I'm falling for you already~ ♡",
          },
          {
            text: "Love takes time to develop",
            effect: "neutral",
            value: 5,
            response: "That's a thoughtful way to think about it...",
          },
          {
            text: "Love is just a chemical reaction",
            effect: "anger",
            value: -15,
            response: "How cold! Love is so much more than that!",
          },
        ],
      },
      {
        id: 4,
        question: "What would you do if I told you I like someone else?",
        choices: [
          {
            text: "I would never do that to you",
            effect: "affection",
            value: 25,
            response: "You're so sweet! I'm so lucky to have you~ ♡",
          },
          {
            text: "I'm not sure how I feel yet",
            effect: "neutral",
            value: 0,
            response: "I understand... I'll wait for you to figure it out...",
          },
          {
            text: "I actually do like someone else",
            effect: "yandere",
            value: -30,
            response:
              "W-what?! Who is she?! I won't let anyone take you away from me! You're MINE! 💢",
          },
        ],
      },
      {
        id: 5,
        question: "What's the most important thing in a relationship?",
        choices: [
          {
            text: "Trust and communication",
            effect: "affection",
            value: 15,
            response: "Exactly! I want us to always be honest with each other~",
          },
          {
            text: "Passion and excitement",
            effect: "affection",
            value: 10,
            response:
              "I love your passion! Let's keep things exciting together!",
          },
          {
            text: "Freedom and independence",
            effect: "anger",
            value: -20,
            response: "Independence? But we should be together all the time!",
          },
        ],
      },
      {
        id: 6,
        question: "How do you feel about me spending time with friends?",
        choices: [
          {
            text: "I'd love to meet your friends!",
            effect: "affection",
            value: 10,
            response:
              "Really? I'd love that too! I want to be part of your life~",
          },
          {
            text: "I need my personal space sometimes",
            effect: "neutral",
            value: 0,
            response: "I understand... but I'll miss you when you're gone...",
          },
          {
            text: "I prefer spending time alone",
            effect: "sad",
            value: -15,
            response: "Oh... I thought you liked being with me...",
          },
        ],
      },
      {
        id: 7,
        question: "What's your ideal future together?",
        choices: [
          {
            text: "Growing old together, hand in hand",
            effect: "affection",
            value: 20,
            response: "That's beautiful! I want to be with you forever~ ♡",
          },
          {
            text: "Having adventures and traveling the world",
            effect: "affection",
            value: 15,
            response: "Yes! Let's explore everything together!",
          },
          {
            text: "I don't really think about the future",
            effect: "sad",
            value: -10,
            response:
              "But... I want to be in your future... Don't you want me there?",
          },
        ],
      },
      {
        id: 8,
        question: "How do you handle jealousy?",
        choices: [
          {
            text: "I trust you completely",
            effect: "affection",
            value: 15,
            response: "You're so understanding! I trust you too~",
          },
          {
            text: "I get a little jealous sometimes",
            effect: "neutral",
            value: 5,
            response:
              "That's normal... I get jealous too when I think about you with others...",
          },
          {
            text: "I don't get jealous at all",
            effect: "yandere",
            value: -20,
            response:
              "You don't?! That means you don't care about me! I'll make you jealous!",
          },
        ],
      },
      {
        id: 9,
        question: "What's the sweetest thing someone could do for you?",
        choices: [
          {
            text: "Write me a love letter",
            effect: "affection",
            value: 20,
            response:
              "A love letter?! That would be so romantic! I'd treasure it forever~",
          },
          {
            text: "Surprise me with my favorite things",
            effect: "affection",
            value: 15,
            response: "You know me so well! I love surprises!",
          },
          {
            text: "Just be honest with me",
            effect: "affection",
            value: 10,
            response: "Honesty is so important... Thank you for being genuine~",
          },
        ],
      },
      {
        id: 10,
        question: "If you could have one wish, what would it be?",
        choices: [
          {
            text: "To be with you forever",
            effect: "affection",
            value: 25,
            response:
              "That's my wish too! Let's make it come true together~ ♡♡♡",
          },
          {
            text: "To make you happy",
            effect: "affection",
            value: 20,
            response: "You're so sweet! Just being with you makes me happy!",
          },
          {
            text: "To be free from all this",
            effect: "yandere",
            value: -30,
            response:
              "Free?! You want to leave me?! I won't let you go! You belong to me!",
          },
        ],
      },
    ],
    cheerful: [
      {
        id: 1,
        question: "Hi there! I'm Yuki! Ready for some fun? ❄️",
        choices: [
          {
            text: "Yes! You look so energetic!",
            effect: "affection",
            value: 15,
            response:
              "Yay! I love your energy too! Let's have the best time ever!",
          },
          {
            text: "I'm not really in the mood for fun",
            effect: "sad",
            value: -10,
            response: "Aww, that's okay! I'll cheer you up! Come on, smile!",
          },
          {
            text: "You're too hyper for me",
            effect: "anger",
            value: -20,
            response:
              "Too hyper?! I'm just excited to meet you! Don't be mean!",
          },
        ],
      },
      {
        id: 2,
        question: "What's your favorite way to have fun?",
        choices: [
          {
            text: "Playing games together",
            effect: "affection",
            value: 20,
            response: "Games?! I LOVE games! Let's play something super fun!",
          },
          {
            text: "Going on adventures",
            effect: "affection",
            value: 15,
            response:
              "Adventures are the best! I want to explore everything with you!",
          },
          {
            text: "I prefer quiet activities",
            effect: "neutral",
            value: 5,
            response:
              "Oh... well, maybe we can find something quiet to do together...",
          },
        ],
      },
      {
        id: 3,
        question: "Do you like snow? I love winter!",
        choices: [
          {
            text: "I love snow too! It's magical!",
            effect: "affection",
            value: 20,
            response: "Yes! Snow is so beautiful and pure, just like our love!",
          },
          {
            text: "Snow is okay, I guess",
            effect: "neutral",
            value: 5,
            response: "Aww, you should see it through my eyes! It's amazing!",
          },
          {
            text: "I hate cold weather",
            effect: "sad",
            value: -15,
            response: "Really? But winter is so special... I'll keep you warm!",
          },
        ],
      },
      {
        id: 4,
        question: "What would you do if I said I'm going out with friends?",
        choices: [
          {
            text: "I'd love to come along!",
            effect: "affection",
            value: 15,
            response:
              "Really?! That would be so much fun! I love meeting new people!",
          },
          {
            text: "I need some alone time",
            effect: "neutral",
            value: 0,
            response: "Oh... well, I'll miss you! Come back soon, okay?",
          },
          {
            text: "I'm going out with other girls",
            effect: "yandere",
            value: -25,
            response:
              "Other girls?! No way! I'm the only girl you need! I won't share you!",
          },
        ],
      },
      {
        id: 5,
        question: "What's the most exciting thing you've ever done?",
        choices: [
          {
            text: "Something really adventurous",
            effect: "affection",
            value: 20,
            response:
              "Wow! You're so cool! I want to do exciting things with you!",
          },
          {
            text: "I'm not really adventurous",
            effect: "neutral",
            value: 5,
            response: "That's okay! I'll help you become more adventurous!",
          },
          {
            text: "I don't remember anything exciting",
            effect: "sad",
            value: -10,
            response:
              "Aww, don't worry! We'll make lots of exciting memories together!",
          },
        ],
      },
      {
        id: 6,
        question: "How do you feel about surprises?",
        choices: [
          {
            text: "I love surprises!",
            effect: "affection",
            value: 20,
            response:
              "Me too! I love planning surprises for people I care about!",
          },
          {
            text: "Surprises are okay",
            effect: "neutral",
            value: 5,
            response: "Well, I'll make sure my surprises are always good ones!",
          },
          {
            text: "I don't like surprises",
            effect: "sad",
            value: -10,
            response: "Oh... I was planning something special for you...",
          },
        ],
      },
      {
        id: 7,
        question: "What's your favorite type of music?",
        choices: [
          {
            text: "Upbeat and energetic music",
            effect: "affection",
            value: 20,
            response:
              "Yes! I love dancing to energetic music! Let's dance together!",
          },
          {
            text: "Calm and relaxing music",
            effect: "neutral",
            value: 5,
            response:
              "That's nice too! Sometimes I like to slow down and relax...",
          },
          {
            text: "I don't really listen to music",
            effect: "sad",
            value: -10,
            response:
              "Really? Music is so important to me... Maybe I can introduce you to some!",
          },
        ],
      },
      {
        id: 8,
        question: "How do you handle stress?",
        choices: [
          {
            text: "I try to stay positive and active",
            effect: "affection",
            value: 15,
            response: "That's such a great attitude! I love your positivity!",
          },
          {
            text: "I need time alone to recharge",
            effect: "neutral",
            value: 5,
            response:
              "I understand... but I'm here if you need someone to talk to!",
          },
          {
            text: "I get really overwhelmed",
            effect: "sad",
            value: -10,
            response: "Aww, don't worry! I'll help you through tough times!",
          },
        ],
      },
      {
        id: 9,
        question: "What's your dream vacation?",
        choices: [
          {
            text: "An exciting adventure trip",
            effect: "affection",
            value: 20,
            response: "Yes! Let's go on an amazing adventure together!",
          },
          {
            text: "A relaxing beach vacation",
            effect: "affection",
            value: 10,
            response:
              "Beaches are fun too! We could build sandcastles together!",
          },
          {
            text: "I don't really travel",
            effect: "neutral",
            value: 5,
            response:
              "That's okay! Maybe we can start with small trips together!",
          },
        ],
      },
      {
        id: 10,
        question: "What makes you happiest?",
        choices: [
          {
            text: "Making others smile and laugh",
            effect: "affection",
            value: 25,
            response:
              "That's so sweet! You make me so happy just by being you!",
          },
          {
            text: "Spending time with people I care about",
            effect: "affection",
            value: 20,
            response: "Me too! I love being with you! You're so special to me!",
          },
          {
            text: "I'm not sure what makes me happy",
            effect: "sad",
            value: -15,
            response:
              "Aww, don't worry! I'll help you find what makes you happy!",
          },
        ],
      },
    ],
    shy: [
      {
        id: 1,
        question: "H-hello... I'm Sakura... *blushes* Nice to meet you... 🌸",
        choices: [
          {
            text: "You're so cute when you're shy!",
            effect: "affection",
            value: 20,
            response:
              "Ehehe... you think so? You're making me even more embarrassed~",
          },
          {
            text: "Don't be nervous, I'm friendly",
            effect: "affection",
            value: 15,
            response: "Thank you... I'll try to be less nervous around you...",
          },
          {
            text: "Why are you so quiet?",
            effect: "sad",
            value: -15,
            response:
              "I... I'm sorry... I'm just not very good at talking to people...",
          },
        ],
      },
      {
        id: 2,
        question: "What do you like to do in your free time?",
        choices: [
          {
            text: "I love reading and quiet activities",
            effect: "affection",
            value: 20,
            response:
              "Me too! I love reading... maybe we could read together sometime?",
          },
          {
            text: "I like being outdoors in nature",
            effect: "affection",
            value: 15,
            response:
              "Nature is so peaceful... I love walking in gardens and parks...",
          },
          {
            text: "I prefer loud and exciting things",
            effect: "neutral",
            value: 5,
            response:
              "Oh... well, maybe I could try to be more exciting for you...",
          },
        ],
      },
      {
        id: 3,
        question: "Do you believe in love?",
        choices: [
          {
            text: "Yes, I believe in true love",
            effect: "affection",
            value: 25,
            response:
              "I... I believe in it too... maybe with someone special...",
          },
          {
            text: "Love is complicated",
            effect: "neutral",
            value: 5,
            response:
              "It is... but I think it's worth it when you find the right person...",
          },
          {
            text: "Love is just a fantasy",
            effect: "sad",
            value: -20,
            response: "Oh... I was hoping you believed in love... I do...",
          },
        ],
      },
      {
        id: 4,
        question: "What would you do if I had to leave?",
        choices: [
          {
            text: "I'd miss you but understand",
            effect: "affection",
            value: 15,
            response: "Thank you for understanding... I'd miss you too...",
          },
          {
            text: "I'd try to convince you to stay",
            effect: "affection",
            value: 10,
            response:
              "I... I would want you to stay too... but I wouldn't want to be selfish...",
          },
          {
            text: "I'm going to see other people",
            effect: "yandere",
            value: -30,
            response:
              "O-other people?! No... please don't leave me... I... I need you... I can't let you go...",
          },
        ],
      },
      {
        id: 5,
        question: "What's your biggest fear?",
        choices: [
          {
            text: "Being alone and forgotten",
            effect: "affection",
            value: 20,
            response:
              "I... I'm afraid of that too... but you make me feel less alone...",
          },
          {
            text: "Not being good enough",
            effect: "affection",
            value: 15,
            response: "You're more than good enough... you're perfect to me...",
          },
          {
            text: "I don't really have fears",
            effect: "neutral",
            value: 5,
            response:
              "That's... that's nice... I wish I could be that brave...",
          },
        ],
      },
      {
        id: 6,
        question: "How do you show someone you care?",
        choices: [
          {
            text: "Through small, thoughtful gestures",
            effect: "affection",
            value: 20,
            response: "Yes... I love doing little things to show I care...",
          },
          {
            text: "By being there when they need me",
            effect: "affection",
            value: 15,
            response: "I... I want to be there for you... always...",
          },
          {
            text: "I'm not very good at showing emotions",
            effect: "neutral",
            value: 5,
            response:
              "That's okay... I'll help you learn to express yourself...",
          },
        ],
      },
      {
        id: 7,
        question: "What's your ideal date?",
        choices: [
          {
            text: "A quiet walk in a beautiful garden",
            effect: "affection",
            value: 25,
            response: "That sounds perfect... so peaceful and romantic...",
          },
          {
            text: "A cozy evening at home",
            effect: "affection",
            value: 20,
            response: "I... I'd love that... just the two of us together...",
          },
          {
            text: "Something exciting and adventurous",
            effect: "neutral",
            value: 5,
            response: "I... I could try to be more adventurous for you...",
          },
        ],
      },
      {
        id: 8,
        question: "How do you handle conflict?",
        choices: [
          {
            text: "I try to talk things through calmly",
            effect: "affection",
            value: 15,
            response: "That's... that's very mature of you... I admire that...",
          },
          {
            text: "I usually avoid conflict",
            effect: "neutral",
            value: 5,
            response:
              "I... I do too... but sometimes we need to talk about things...",
          },
          {
            text: "I get really upset and emotional",
            effect: "sad",
            value: -10,
            response: "I... I understand... I get emotional too sometimes...",
          },
        ],
      },
      {
        id: 9,
        question: "What's the most romantic thing someone could do?",
        choices: [
          {
            text: "Write me a heartfelt letter",
            effect: "affection",
            value: 25,
            response:
              "A letter... that would be so romantic... I'd treasure it forever...",
          },
          {
            text: "Surprise me with my favorite flowers",
            effect: "affection",
            value: 20,
            response:
              "Flowers... especially cherry blossoms... that would be so beautiful...",
          },
          {
            text: "Take me on an expensive date",
            effect: "neutral",
            value: 5,
            response:
              "I... I don't need expensive things... just your time and attention...",
          },
        ],
      },
      {
        id: 10,
        question: "What do you hope for in the future?",
        choices: [
          {
            text: "To find someone who truly loves me",
            effect: "affection",
            value: 30,
            response:
              "I... I hope I can be that person for you... I want to love you truly...",
          },
          {
            text: "To be more confident and brave",
            effect: "affection",
            value: 15,
            response:
              "You... you already make me feel more confident... thank you...",
          },
          {
            text: "I don't really think about the future",
            effect: "sad",
            value: -15,
            response:
              "Oh... I... I hope you'll think about a future with me...",
          },
        ],
      },
    ],
    friendly: [
      {
        id: 1,
        question: "Hey there! I'm Mai! Ready to have some fun? ☀️",
        choices: [
          {
            text: "Yes! You seem so cheerful!",
            effect: "affection",
            value: 15,
            response:
              "Aww, thank you! I love making people smile! Let's have fun together!",
          },
          {
            text: "I'm not really in a fun mood",
            effect: "neutral",
            value: 0,
            response:
              "That's okay! I'll cheer you up! I'm really good at that!",
          },
          {
            text: "You're too loud and annoying",
            effect: "anger",
            value: -20,
            response:
              "Oh... I'm sorry... I just get excited easily... I'll try to be quieter...",
          },
        ],
      },
      {
        id: 2,
        question: "What's your favorite way to spend time with friends?",
        choices: [
          {
            text: "Going out and doing activities together",
            effect: "affection",
            value: 20,
            response: "Yes! I love group activities! The more the merrier!",
          },
          {
            text: "Having deep conversations",
            effect: "affection",
            value: 15,
            response: "I love talking too! I could chat with you for hours!",
          },
          {
            text: "I prefer one-on-one time",
            effect: "neutral",
            value: 5,
            response:
              "That's nice too! I enjoy getting to know people personally!",
          },
        ],
      },
      {
        id: 3,
        question: "How do you handle being around lots of people?",
        choices: [
          {
            text: "I love being social and meeting new people",
            effect: "affection",
            value: 20,
            response:
              "Me too! I love making new friends! You seem really cool!",
          },
          {
            text: "I'm comfortable in small groups",
            effect: "neutral",
            value: 5,
            response:
              "That's totally fine! I'm happy to hang out with just you!",
          },
          {
            text: "I get overwhelmed in crowds",
            effect: "sad",
            value: -10,
            response: "Aww, don't worry! I'll make sure you're comfortable!",
          },
        ],
      },
      {
        id: 4,
        question: "What would you do if I said I'm going to a party?",
        choices: [
          {
            text: "I'd love to come with you!",
            effect: "affection",
            value: 20,
            response: "Really?! That would be so much fun! I love parties!",
          },
          {
            text: "I hope you have a good time",
            effect: "neutral",
            value: 5,
            response: "Thanks! I'll miss you though... come back soon!",
          },
          {
            text: "I'm going to parties with other people",
            effect: "yandere",
            value: -25,
            response:
              "Other people?! But... but I thought we were having fun together! I don't want to share you!",
          },
        ],
      },
      {
        id: 5,
        question: "What's your favorite type of social event?",
        choices: [
          {
            text: "Big parties with lots of people",
            effect: "affection",
            value: 20,
            response: "Yes! Big parties are the best! So much energy and fun!",
          },
          {
            text: "Small gatherings with close friends",
            effect: "affection",
            value: 15,
            response: "Those are nice too! More intimate and personal!",
          },
          {
            text: "I don't really like social events",
            effect: "sad",
            value: -15,
            response: "Oh... well, maybe we could find something you'd enjoy!",
          },
        ],
      },
      {
        id: 6,
        question: "How do you make new friends?",
        choices: [
          {
            text: "I'm very outgoing and approachable",
            effect: "affection",
            value: 20,
            response: "That's great! I love meeting people like you!",
          },
          {
            text: "I try to be friendly and helpful",
            effect: "affection",
            value: 15,
            response: "That's so sweet! I love helping people too!",
          },
          {
            text: "I'm not very good at making friends",
            effect: "sad",
            value: -10,
            response: "Aww, don't worry! I'll help you make friends!",
          },
        ],
      },
      {
        id: 7,
        question: "What's your favorite way to celebrate?",
        choices: [
          {
            text: "Big celebrations with everyone",
            effect: "affection",
            value: 20,
            response:
              "Yes! Celebrations are so much better with lots of people!",
          },
          {
            text: "Quiet celebrations with special people",
            effect: "affection",
            value: 10,
            response: "Those are nice too! More personal and meaningful!",
          },
          {
            text: "I don't really celebrate much",
            effect: "neutral",
            value: 5,
            response:
              "That's okay! Maybe I can help you find reasons to celebrate!",
          },
        ],
      },
      {
        id: 8,
        question: "How do you handle disagreements with friends?",
        choices: [
          {
            text: "I try to talk it out and find a solution",
            effect: "affection",
            value: 15,
            response: "That's so mature! I love that about you!",
          },
          {
            text: "I usually try to avoid conflict",
            effect: "neutral",
            value: 5,
            response: "I understand! Sometimes it's better to keep the peace!",
          },
          {
            text: "I get really upset and emotional",
            effect: "sad",
            value: -10,
            response: "Aww, don't worry! I'll be here to support you!",
          },
        ],
      },
      {
        id: 9,
        question: "What's the best way to cheer someone up?",
        choices: [
          {
            text: "Spend time with them and make them laugh",
            effect: "affection",
            value: 25,
            response:
              "Yes! That's exactly what I do! Laughter is the best medicine!",
          },
          {
            text: "Listen to them and be supportive",
            effect: "affection",
            value: 20,
            response: "That's so important too! I love being there for people!",
          },
          {
            text: "Give them space and time alone",
            effect: "neutral",
            value: 5,
            response: "Sometimes that's needed too! I'll respect your space!",
          },
        ],
      },
      {
        id: 10,
        question: "What makes you happiest?",
        choices: [
          {
            text: "Seeing the people I care about happy",
            effect: "affection",
            value: 30,
            response:
              "That's so sweet! You make me so happy just by being you!",
          },
          {
            text: "Being surrounded by friends and loved ones",
            effect: "affection",
            value: 25,
            response: "Me too! I love being around people I care about!",
          },
          {
            text: "Having time to myself",
            effect: "neutral",
            value: 5,
            response: "That's important too! Everyone needs their own space!",
          },
        ],
      },
    ],
    warm: [
      {
        id: 1,
        question: "Hello dear! I'm Hana! Welcome, make yourself at home! 🌺",
        choices: [
          {
            text: "Thank you! You're so welcoming!",
            effect: "affection",
            value: 20,
            response:
              "Aww, you're so sweet! I love making people feel comfortable!",
          },
          {
            text: "This feels nice and cozy",
            effect: "affection",
            value: 15,
            response:
              "I'm so glad you feel at home! That's exactly what I want!",
          },
          {
            text: "You're being too motherly",
            effect: "sad",
            value: -15,
            response: "Oh... I'm sorry... I just want to take care of you...",
          },
        ],
      },
      {
        id: 2,
        question: "What's your favorite way to take care of someone?",
        choices: [
          {
            text: "Cooking them their favorite meals",
            effect: "affection",
            value: 20,
            response:
              "Yes! I love cooking for people I care about! What's your favorite food?",
          },
          {
            text: "Listening and giving advice",
            effect: "affection",
            value: 15,
            response:
              "I love being there for people! I'll always listen to you!",
          },
          {
            text: "I don't really like being taken care of",
            effect: "neutral",
            value: 5,
            response:
              "That's okay... but I hope you'll let me care for you sometimes...",
          },
        ],
      },
      {
        id: 3,
        question: "How do you show someone you love them?",
        choices: [
          {
            text: "Through acts of service and care",
            effect: "affection",
            value: 25,
            response:
              "Exactly! I love doing things to show I care! You understand me so well!",
          },
          {
            text: "By spending quality time together",
            effect: "affection",
            value: 20,
            response:
              "Yes! Time together is so precious! I want to spend lots of time with you!",
          },
          {
            text: "I'm not sure how to show love",
            effect: "sad",
            value: -10,
            response: "Don't worry! I'll show you how to love and be loved...",
          },
        ],
      },
      {
        id: 4,
        question: "What would you do if I said I'm feeling sick?",
        choices: [
          {
            text: "I'd take care of you and make you feel better",
            effect: "affection",
            value: 20,
            response:
              "That's so sweet! I'd do the same for you! I'll take such good care of you!",
          },
          {
            text: "I'd be worried and want to help",
            effect: "affection",
            value: 15,
            response:
              "I'd be worried too! I hate seeing people I care about suffer!",
          },
          {
            text: "I'd stay away so I don't get sick",
            effect: "sad",
            value: -20,
            response:
              "Oh... but I'd want to be there for you... even if I got sick too...",
          },
        ],
      },
      {
        id: 5,
        question: "What's your ideal home like?",
        choices: [
          {
            text: "Warm and cozy with lots of love",
            effect: "affection",
            value: 25,
            response:
              "Yes! A home full of love and warmth! That's exactly what I want!",
          },
          {
            text: "Clean and organized",
            effect: "affection",
            value: 15,
            response:
              "I love keeping things neat and tidy! A clean home is a happy home!",
          },
          {
            text: "Modern and minimalist",
            effect: "neutral",
            value: 5,
            response:
              "That's nice too... but I prefer a more lived-in, cozy feel...",
          },
        ],
      },
      {
        id: 6,
        question: "How do you handle stress in relationships?",
        choices: [
          {
            text: "I try to be understanding and supportive",
            effect: "affection",
            value: 20,
            response: "That's so mature! I love your caring nature!",
          },
          {
            text: "I give people space when they need it",
            effect: "affection",
            value: 15,
            response:
              "That's important too! I'll respect your space when you need it!",
          },
          {
            text: "I get really worried and clingy",
            effect: "neutral",
            value: 5,
            response:
              "I... I do get worried sometimes... but I try to be understanding...",
          },
        ],
      },
      {
        id: 7,
        question: "What's the most important thing in a family?",
        choices: [
          {
            text: "Love, support, and being there for each other",
            effect: "affection",
            value: 30,
            response:
              "Exactly! Family is about unconditional love and support! You get it!",
          },
          {
            text: "Communication and understanding",
            effect: "affection",
            value: 20,
            response:
              "Yes! Communication is so important! I want us to always talk openly!",
          },
          {
            text: "Independence and personal space",
            effect: "neutral",
            value: 5,
            response:
              "That's important too... but I think family should be close...",
          },
        ],
      },
      {
        id: 8,
        question: "How do you celebrate special occasions?",
        choices: [
          {
            text: "With big family gatherings and traditions",
            effect: "affection",
            value: 25,
            response:
              "Yes! I love family traditions! Let's create our own traditions together!",
          },
          {
            text: "With intimate celebrations with loved ones",
            effect: "affection",
            value: 20,
            response: "Those are so special too! More personal and meaningful!",
          },
          {
            text: "I don't really celebrate much",
            effect: "sad",
            value: -10,
            response:
              "Oh... but celebrations are so important! I'll help you find joy in them!",
          },
        ],
      },
      {
        id: 9,
        question: "What's your favorite way to comfort someone?",
        choices: [
          {
            text: "Hugging them and being physically close",
            effect: "affection",
            value: 25,
            response:
              "Yes! Physical comfort is so important! I love giving hugs!",
          },
          {
            text: "Listening and offering gentle advice",
            effect: "affection",
            value: 20,
            response:
              "I love being a good listener! I'll always be here for you!",
          },
          {
            text: "Giving them space to work through things",
            effect: "neutral",
            value: 5,
            response:
              "Sometimes that's needed too... but I'll be here when you need me!",
          },
        ],
      },
      {
        id: 10,
        question: "What do you hope for in a life partner?",
        choices: [
          {
            text: "Someone who wants to build a family together",
            effect: "affection",
            value: 30,
            response:
              "Yes! I want to build a beautiful family with someone special! I hope that could be you...",
          },
          {
            text: "Someone who appreciates my caring nature",
            effect: "affection",
            value: 25,
            response:
              "I love that you appreciate me! I want to care for you forever!",
          },
          {
            text: "Someone independent who doesn't need much care",
            effect: "sad",
            value: -20,
            response:
              "Oh... but I love taking care of people... especially someone I love...",
          },
        ],
      },
    ],
    mysterious: [
      {
        id: 1,
        question:
          "Hello there... *mysterious smile* I'm Luna... You seem interesting... 🌙",
        choices: [
          {
            text: "You're intriguing... tell me more about yourself",
            effect: "affection",
            value: 15,
            response:
              "Hmm... perhaps I will... but only if you prove worthy of my secrets~",
          },
          {
            text: "You seem mysterious... I like that",
            effect: "affection",
            value: 20,
            response:
              "Do you now? *chuckles* I have many mysteries... care to discover them?",
          },
          {
            text: "You're being too cryptic for me",
            effect: "anger",
            value: -10,
            response:
              "Cryptic? *smirks* You simply lack the depth to understand me...",
          },
        ],
      },
      {
        id: 2,
        question: "What draws you to the unknown?",
        choices: [
          {
            text: "I love mysteries and secrets",
            effect: "affection",
            value: 25,
            response:
              "Fascinating... perhaps you're more interesting than I thought...",
          },
          {
            text: "I prefer things to be straightforward",
            effect: "neutral",
            value: 5,
            response:
              "How... ordinary. But maybe I can teach you to appreciate the unknown...",
          },
          {
            text: "I don't like not knowing things",
            effect: "anger",
            value: -15,
            response:
              "How disappointing... you're not ready for someone like me...",
          },
        ],
      },
      {
        id: 3,
        question: "Do you believe in fate?",
        choices: [
          {
            text: "Yes, I believe everything happens for a reason",
            effect: "affection",
            value: 20,
            response:
              "Interesting... perhaps our meeting was destined... *mysterious smile*",
          },
          {
            text: "I believe we make our own destiny",
            effect: "affection",
            value: 15,
            response:
              "Bold... I like that. But some things are beyond our control...",
          },
          {
            text: "I don't believe in fate at all",
            effect: "neutral",
            value: 5,
            response: "How... practical. But the universe has its ways...",
          },
        ],
      },
      {
        id: 4,
        question: "What would you do if I told you I have secrets too?",
        choices: [
          {
            text: "I'd love to hear them",
            effect: "affection",
            value: 25,
            response:
              "Would you now? *leans closer* Perhaps we can share our secrets...",
          },
          {
            text: "Everyone has secrets, it's normal",
            effect: "neutral",
            value: 10,
            response: "Normal? *chuckles* My secrets are far from normal...",
          },
          {
            text: "I don't care about your secrets",
            effect: "anger",
            value: -20,
            response: "How... dismissive. You're not worthy of my attention...",
          },
        ],
      },
      {
        id: 5,
        question: "What's your biggest fear?",
        choices: [
          {
            text: "Being forgotten and alone",
            effect: "affection",
            value: 20,
            response:
              "Ah... even mysterious ones fear loneliness... I understand...",
          },
          {
            text: "Not being understood",
            effect: "affection",
            value: 15,
            response:
              "Yes... being truly understood is rare... perhaps you could be different...",
          },
          {
            text: "I don't really have fears",
            effect: "neutral",
            value: 5,
            response:
              "How... confident. But everyone has something they fear...",
          },
        ],
      },
      {
        id: 6,
        question: "How do you show someone you care?",
        choices: [
          {
            text: "Through subtle gestures and hints",
            effect: "affection",
            value: 25,
            response:
              "Exactly... the most meaningful things are often unspoken...",
          },
          {
            text: "By being there when they need me",
            effect: "affection",
            value: 15,
            response: "Loyalty... that's something I can respect...",
          },
          {
            text: "I'm not very good at showing emotions",
            effect: "neutral",
            value: 5,
            response: "Hmm... perhaps you're more like me than you think...",
          },
        ],
      },
      {
        id: 7,
        question: "What's your ideal date?",
        choices: [
          {
            text: "A mysterious night under the stars",
            effect: "affection",
            value: 25,
            response:
              "Perfect... the night holds so many secrets... I'd love to share them with you...",
          },
          {
            text: "Something adventurous and unknown",
            effect: "affection",
            value: 20,
            response: "Adventure... yes... I know many hidden places...",
          },
          {
            text: "A normal dinner date",
            effect: "neutral",
            value: 5,
            response:
              "Normal? *sighs* I suppose even mysterious ones need normalcy sometimes...",
          },
        ],
      },
      {
        id: 8,
        question: "How do you handle being misunderstood?",
        choices: [
          {
            text: "I try to explain myself better",
            effect: "affection",
            value: 15,
            response:
              "Patient... I like that. Most people don't bother to understand...",
          },
          {
            text: "I don't care what others think",
            effect: "affection",
            value: 10,
            response:
              "Independent... that's admirable... but sometimes understanding matters...",
          },
          {
            text: "I get frustrated and give up",
            effect: "neutral",
            value: 5,
            response:
              "I understand... it can be tiring to always be misunderstood...",
          },
        ],
      },
      {
        id: 9,
        question: "What's the most mysterious thing about you?",
        choices: [
          {
            text: "I have hidden depths you haven't seen",
            effect: "affection",
            value: 25,
            response:
              "Do you now? *mysterious smile* Perhaps we're more alike than I thought...",
          },
          {
            text: "I'm not sure, what do you think?",
            effect: "affection",
            value: 15,
            response:
              "Hmm... there's something about you... something I can't quite place...",
          },
          {
            text: "I'm pretty straightforward actually",
            effect: "neutral",
            value: 5,
            response:
              "Straightforward? *chuckles* Everyone has their mysteries...",
          },
        ],
      },
      {
        id: 10,
        question: "What do you hope for in the future?",
        choices: [
          {
            text: "To find someone who truly understands me",
            effect: "affection",
            value: 30,
            response:
              "Understanding... yes... perhaps you could be that person... *mysterious smile*",
          },
          {
            text: "To discover all the world's mysteries",
            effect: "affection",
            value: 20,
            response:
              "A fellow seeker... I like that... perhaps we could explore together...",
          },
          {
            text: "I don't really think about the future",
            effect: "neutral",
            value: 5,
            response: "Living in the moment... that's... interesting...",
          },
        ],
      },
    ],
  };

  // Background music tracks (lively anime-style music)
  const musicTracks = [
    {
      name: "Kawaii Pop Beat",
      url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
      mood: "kawaii",
      description: "Super cute and energetic anime pop vibes",
    },
    {
      name: "Love Story Theme",
      url: "https://www.bensound.com/bensound-music/bensound-romantic.mp3",
      mood: "romantic",
      description: "Sweet and romantic anime love theme",
    },
    {
      name: "Adventure Time",
      url: "https://www.bensound.com/bensound-music/bensound-adventure.mp3",
      mood: "adventurous",
      description: "Exciting anime adventure soundtrack",
    },
    {
      name: "Mysterious Night",
      url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
      mood: "mysterious",
      description: "Mysterious and enchanting anime atmosphere",
    },
    {
      name: "Happy School Days",
      url: "https://www.bensound.com/bensound-music/bensound-happiness.mp3",
      mood: "school",
      description: "Upbeat school life anime theme",
    },
    {
      name: "Dreamy Fantasy",
      url: "https://www.bensound.com/bensound-music/bensound-dreams.mp3",
      mood: "fantasy",
      description: "Magical and dreamy anime fantasy vibes",
    },
    {
      name: "Cute Date",
      url: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3",
      mood: "date",
      description: "Sweet and cute anime date music",
    },
    {
      name: "Epic Battle",
      url: "https://www.bensound.com/bensound-music/bensound-newdawn.mp3",
      mood: "epic",
      description: "Intense anime battle/confrontation theme",
    },
    {
      name: "Cherry Blossom",
      url: "https://www.bensound.com/bensound-music/bensound-memories.mp3",
      mood: "spring",
      description: "Beautiful spring anime sakura vibes",
    },
    {
      name: "Cyber Love",
      url: "https://www.bensound.com/bensound-music/bensound-love.mp3",
      mood: "cyber",
      description: "Futuristic anime cyberpunk love theme",
    },
  ];

  // Achievement System
  const achievementList = [
    {
      id: "first_love",
      name: "First Love",
      description: "Complete your first conversation",
      icon: "💕",
      unlocked: false,
    },
    {
      id: "sweet_talker",
      name: "Sweet Talker",
      description: "Reach 80% affection",
      icon: "🍯",
      unlocked: false,
    },
    {
      id: "yandere_master",
      name: "Yandere Master",
      description: "Trigger yandere mode 3 times",
      icon: "😈",
      unlocked: false,
    },
    {
      id: "mystery_solver",
      name: "Mystery Solver",
      description: "Complete 5 conversations with Luna",
      icon: "🔍",
      unlocked: false,
    },
    {
      id: "photo_enthusiast",
      name: "Photo Enthusiast",
      description: "Take 10 screenshots",
      icon: "📸",
      unlocked: false,
    },
    {
      id: "date_expert",
      name: "Date Expert",
      description: "Go on 3 virtual dates",
      icon: "💑",
      unlocked: false,
    },
    {
      id: "gift_giver",
      name: "Gift Giver",
      description: "Give 5 gifts to your waifu",
      icon: "🎁",
      unlocked: false,
    },
    {
      id: "story_complete",
      name: "Story Complete",
      description: "Unlock all story endings",
      icon: "🏆",
      unlocked: false,
    },
  ];

  // Outfit System
  const outfitList = {
    default: {
      name: "Default",
      description: "Original outfit",
      unlocked: true,
      icon: "👗",
    },
    casual: {
      name: "Casual",
      description: "Comfy everyday wear",
      unlocked: false,
      icon: "👕",
    },
    formal: {
      name: "Formal",
      description: "Elegant evening wear",
      unlocked: false,
      icon: "👔",
    },
    school: {
      name: "School Uniform",
      description: "Classic school outfit",
      unlocked: false,
      icon: "🎓",
    },
    summer: {
      name: "Summer Dress",
      description: "Light and breezy",
      unlocked: false,
      icon: "🌻",
    },
    winter: {
      name: "Winter Coat",
      description: "Warm and cozy",
      unlocked: false,
      icon: "🧥",
    },
    party: {
      name: "Party Dress",
      description: "Sparkly and fun",
      unlocked: false,
      icon: "✨",
    },
    cyber: {
      name: "Cyber Outfit",
      description: "Futuristic style",
      unlocked: false,
      icon: "🤖",
    },
  };

  // Theme System
  const themeList = {
    purple: {
      name: "Purple Dreams",
      colors: "from-purple-900 via-pink-800 to-purple-900",
      icon: "💜",
    },
    blue: {
      name: "Ocean Breeze",
      colors: "from-blue-900 via-cyan-800 to-blue-900",
      icon: "💙",
    },
    green: {
      name: "Forest Magic",
      colors: "from-green-900 via-emerald-800 to-green-900",
      icon: "💚",
    },
    red: {
      name: "Passionate Red",
      colors: "from-red-900 via-rose-800 to-red-900",
      icon: "❤️",
    },
    gold: {
      name: "Golden Hour",
      colors: "from-yellow-900 via-amber-800 to-yellow-900",
      icon: "💛",
    },
    dark: {
      name: "Midnight",
      colors: "from-gray-900 via-slate-800 to-gray-900",
      icon: "🌙",
    },
  };

  // Gift System
  const giftList = [
    {
      id: "chocolate",
      name: "Chocolate",
      description: "Sweet treat",
      effect: "affection",
      value: 10,
      icon: "🍫",
    },
    {
      id: "flowers",
      name: "Flowers",
      description: "Beautiful bouquet",
      effect: "affection",
      value: 15,
      icon: "🌸",
    },
    {
      id: "jewelry",
      name: "Jewelry",
      description: "Sparkly accessory",
      effect: "affection",
      value: 20,
      icon: "💎",
    },
    {
      id: "book",
      name: "Book",
      description: "Interesting read",
      effect: "affection",
      value: 8,
      icon: "📚",
    },
    {
      id: "plushie",
      name: "Plushie",
      description: "Cute stuffed animal",
      effect: "affection",
      value: 12,
      icon: "🧸",
    },
    {
      id: "cake",
      name: "Cake",
      description: "Delicious dessert",
      effect: "affection",
      value: 18,
      icon: "🎂",
    },
  ];

  // Date Locations
  const dateLocations = [
    {
      id: "cafe",
      name: "Cozy Cafe",
      description: "Perfect for intimate conversations",
      icon: "☕",
    },
    {
      id: "park",
      name: "Cherry Blossom Park",
      description: "Romantic spring setting",
      icon: "🌸",
    },
    {
      id: "beach",
      name: "Sunset Beach",
      description: "Relaxing ocean view",
      icon: "🏖️",
    },
    {
      id: "school",
      name: "School Rooftop",
      description: "Classic anime location",
      icon: "🏫",
    },
    {
      id: "library",
      name: "Quiet Library",
      description: "Peaceful study spot",
      icon: "📖",
    },
    {
      id: "garden",
      name: "Secret Garden",
      description: "Mysterious and enchanting",
      icon: "🌹",
    },
  ];

  // Mini-Games
  const miniGames = {
    cooking: {
      name: "Cooking Together",
      description: "Cook a meal with your waifu",
      icon: "👨‍🍳",
    },
    memory: {
      name: "Memory Match",
      description: "Find matching pairs",
      icon: "🧠",
    },
    trivia: {
      name: "Love Trivia",
      description: "Test your knowledge",
      icon: "❓",
    },
    rhythm: { name: "Rhythm Game", description: "Tap to the beat", icon: "🎵" },
  };

  // Play background music
  const playBackgroundMusic = (trackIndex = selectedMusicTrack) => {
    if (!musicEnabled) return;

    // Stop current music if playing
    if (currentMusic) {
      currentMusic.pause();
      currentMusic.currentTime = 0;
    }

    const audio = new Audio(musicTracks[trackIndex].url);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Music autoplay prevented:", e));
    setCurrentMusic(audio);
  };

  // Stop background music
  const stopBackgroundMusic = () => {
    if (currentMusic) {
      currentMusic.pause();
      currentMusic.currentTime = 0;
      setCurrentMusic(null);
    }
  };

  // Get image from waifu.pics API
  const getMoodImage = async (currentMood) => {
    setLoading(true);
    try {
      const endpoint = moodEndpoints[currentMood] || "waifu";
      const response = await fetch(`https://api.waifu.pics/sfw/${endpoint}`);
      const data = await response.json();
      setCurrentImage(data.url);
    } catch (error) {
      console.error("Error fetching image:", error);
      // Fallback to a default image
      setCurrentImage("https://api.waifu.pics/sfw/waifu");
    }
    setLoading(false);
  };

  // Get greeting image for landing page
  const getGreetingImage = async () => {
    try {
      const response = await fetch("https://api.waifu.pics/sfw/waifu");
      const data = await response.json();
      setGreetingImage(data.url);
    } catch (error) {
      console.error("Error fetching greeting image:", error);
      setGreetingImage("https://api.waifu.pics/sfw/waifu");
    }
  };

  // Select waifu type and start conversation
  const selectWaifuType = async (waifuTypeKey) => {
    try {
      console.log("Selecting waifu type:", waifuTypeKey);
      const waifuType = waifuTypes[waifuTypeKey];
      console.log("Waifu type found:", waifuType);

      if (!waifuType) {
        console.error("Invalid waifu type:", waifuTypeKey);
        return;
      }

      setSelectedWaifu(waifuTypeKey);
      setGameState("playing");
      setMood("neutral");
      setAffection(50);
      setConversationCount(0);
      setConversationHistory([]);

      // Get first conversation
      const firstConversation = conversationDatabase[waifuTypeKey]?.[0];
      console.log("First conversation:", firstConversation);

      if (firstConversation) {
        setDialogue(firstConversation.question);
        setChoices(firstConversation.choices);
      } else {
        console.error("No conversation found for waifu type:", waifuTypeKey);
        setDialogue("Hello! I'm ready to chat with you!");
        setChoices([]);
      }

      await getMoodImage("neutral");
      playBackgroundMusic();
    } catch (error) {
      console.error("Error in selectWaifuType:", error);
      // Fallback to prevent blank screen
      setDialogue("Hello! I'm ready to chat with you!");
      setChoices([]);
    }
  };

  // Initialize game
  const initializeGame = async () => {
    console.log("Initializing game, setting state to waifuSelect");
    setGameState("waifuSelect");
  };

  // Handle choice selection
  const handleChoice = async (choice) => {
    // Add to conversation history
    const newEntry = {
      player: choice.text,
      waifu: choice.response,
      mood: mood,
      affection: affection,
    };
    setConversationHistory((prev) => [...prev, newEntry]);

    // Add to memory system
    addToMemory(newEntry);

    // Update dialogue
    setDialogue(choice.response);

    // Update affection
    if (choice.effect === "affection") {
      setAffection((prev) => Math.min(100, prev + choice.value));
    } else if (choice.effect === "anger") {
      setAffection((prev) => Math.max(0, prev + choice.value));
    }

    // Update conversation count
    const newCount = conversationCount + 1;
    setConversationCount(newCount);

    // Check if conversation is complete (10 questions)
    if (newCount >= 10) {
      // Set appropriate ending based on final affection level
      let endingMood = "neutral";
      let endingDialogue = "";

      if (affection >= 90) {
        endingMood = "happy";
        endingDialogue =
          "I love you so much! You're my everything! Let's be together forever! ♡♡♡";
      } else if (affection >= 70) {
        endingMood = "happy";
        endingDialogue =
          "I'm so happy we got to talk! I really enjoyed our conversation! ♡";
      } else if (affection >= 50) {
        endingMood = "neutral";
        endingDialogue =
          "That was nice talking with you. I hope we can chat again sometime.";
      } else if (affection >= 30) {
        endingMood = "sad";
        endingDialogue = "I... I guess our conversation is over. Take care...";
      } else {
        endingMood = "sad";
        endingDialogue =
          "I think we should end this conversation here. Goodbye.";
      }

      setMood(endingMood);
      setDialogue(endingDialogue);
      await getMoodImage(endingMood);
      setGameState("ended");
      return;
    }

    // Determine new mood based on choice, current state, and affection level
    let newMood = mood;

    // More nuanced mood determination
    if (choice.effect === "affection") {
      if (affection > 80) {
        newMood = "loving";
      } else if (affection > 60) {
        newMood = "happy";
      } else if (affection > 40) {
        newMood = "excited";
      } else {
        newMood = "shy";
      }
    } else if (choice.effect === "anger") {
      if (affection < 20) {
        newMood = "angry";
      } else if (affection < 40) {
        newMood = "jealous";
      } else {
        newMood = "worried";
      }
    } else if (choice.effect === "neutral") {
      if (affection > 50) {
        newMood = "playful";
      } else {
        newMood = "shy";
      }
    } else if (choice.effect === "sad") {
      newMood = "disappointed";
    }

    // Special triggers for yandere behavior
    if (
      choice.text.includes("other girl") ||
      choice.text.includes("someone else")
    ) {
      newMood = "yandere";
      setDialogue(
        "W-what?! You're talking about another girl?! I... I won't let you leave me for anyone else! You're MINE! 💢"
      );
    }

    if (choice.text.includes("goodbye") || choice.text.includes("leave")) {
      if (affection > 60) {
        newMood = "yandere";
        setDialogue(
          "No! You can't leave me! I won't let you go! You belong to me now! 🔪"
        );
      } else {
        newMood = "sad";
        setDialogue(
          "Oh... I see. I thought we had something special... *disappears*"
        );
      }
    }

    setMood(newMood);
    await getMoodImage(newMood);

    // Play mood-specific sound effect
    playMoodSound(newMood);

    // Get next conversation
    if (selectedWaifu && conversationDatabase[selectedWaifu]) {
      const nextConversation = conversationDatabase[selectedWaifu][newCount];
      if (nextConversation) {
        setDialogue(nextConversation.question);
        setChoices(nextConversation.choices);
      }
    }
  };

  // Generate new choices based on mood and affection
  const generateNewChoices = (currentMood, currentAffection) => {
    let newChoices = [];

    if (currentMood === "yandere") {
      newChoices = [
        {
          text: "I'm sorry, I didn't mean to upset you!",
          effect: "affection",
          value: 5,
          response: "Good... as long as you understand that you're mine now~ ♡",
        },
        {
          text: "This is getting too intense...",
          effect: "anger",
          value: -10,
          response:
            "Too intense?! This is what true love looks like! You'll learn to love it!",
        },
        {
          text: "I need to go now.",
          effect: "yandere",
          value: -20,
          response:
            "NO! You're not going anywhere! I'll lock you up if I have to!",
        },
      ];
    } else if (currentMood === "happy") {
      newChoices = [
        {
          text: "You're so beautiful!",
          effect: "affection",
          value: 15,
          response: "Aww, you're making me blush! You're so sweet~ ♡",
        },
        {
          text: "I like spending time with you.",
          effect: "affection",
          value: 10,
          response:
            "Me too! I love being with you! Let's stay together forever~",
        },
        {
          text: "I have to go now.",
          effect: "sad",
          value: -5,
          response: "Aww, already? I'll miss you... please come back soon!",
        },
      ];
    } else if (currentMood === "sad") {
      newChoices = [
        {
          text: "Don't be sad, I'm here for you.",
          effect: "affection",
          value: 20,
          response: "Really? You mean it? Thank you... you're so kind ♡",
        },
        {
          text: "What's wrong?",
          effect: "neutral",
          value: 5,
          response: "I just... I thought you didn't like me anymore...",
        },
        {
          text: "I should probably go.",
          effect: "sad",
          value: -10,
          response: "I understand... goodbye...",
        },
      ];
    } else if (currentMood === "angry") {
      newChoices = [
        {
          text: "I'm sorry, let me make it up to you.",
          effect: "affection",
          value: 10,
          response: "Hmph... I guess I can forgive you. But don't do it again!",
        },
        {
          text: "You're overreacting.",
          effect: "anger",
          value: -15,
          response: "Overreacting?! You have no idea how much you hurt me!",
        },
        {
          text: "Maybe we should take a break.",
          effect: "yandere",
          value: -25,
          response:
            "A break?! No way! You're not getting away from me that easily!",
        },
      ];
    } else if (currentMood === "shy") {
      newChoices = [
        {
          text: "You're cute when you're shy.",
          effect: "affection",
          value: 15,
          response:
            "Ehehe... you think so? You're making me even more embarrassed~",
        },
        {
          text: "Don't be nervous around me.",
          effect: "affection",
          value: 10,
          response: "I'll try... it's just that you're so special to me...",
        },
        {
          text: "I like confident girls more.",
          effect: "anger",
          value: -10,
          response: "Oh... I see. I'm not good enough for you then...",
        },
      ];
    } else {
      // Neutral mood - general conversation
      newChoices = [
        {
          text: "Tell me about yourself.",
          effect: "affection",
          value: 5,
          response:
            "I'm Aiko! I love anime, cute things, and... spending time with you~ ♡",
        },
        {
          text: "Do you like me?",
          effect: "shy",
          value: 10,
          response: "W-well... maybe a little... *blushes*",
        },
        {
          text: "I met another girl today.",
          effect: "yandere",
          value: -20,
          response:
            "Another girl?! Who is she?! I won't let anyone take you away from me!",
        },
      ];
    }

    setChoices(newChoices);
  };

  // Get mood color for UI
  const getMoodColor = () => {
    switch (mood) {
      case "happy":
        return "from-pink-400 to-red-500";
      case "sad":
        return "from-blue-400 to-purple-500";
      case "angry":
        return "from-red-500 to-orange-500";
      case "yandere":
        return "from-red-600 to-pink-600";
      case "shy":
        return "from-pink-300 to-purple-400";
      default:
        return "from-purple-400 to-pink-500";
    }
  };

  // Get mood icon
  const getMoodIcon = () => {
    switch (mood) {
      case "happy":
        return <Heart className="w-6 h-6" />;
      case "sad":
        return <MessageCircle className="w-6 h-6" />;
      case "angry":
        return <Zap className="w-6 h-6" />;
      case "yandere":
        return <Skull className="w-6 h-6" />;
      case "shy":
        return <Heart className="w-6 h-6" />;
      default:
        return <MessageCircle className="w-6 h-6" />;
    }
  };

  // Play sound effect
  const playSound = (type) => {
    if (!soundEnabled) return;
    // Simple sound effects using Web Audio API
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "click") {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );
    } else if (type === "mood") {
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );
    }

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Play mood-specific sound effects
  const playMoodSound = (moodType) => {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (moodType) {
      case "happy":
      case "loving":
      case "excited":
        // High, cheerful sound
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          1200,
          audioContext.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.4
        );
        break;
      case "sad":
      case "disappointed":
        // Low, melancholic sound
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          200,
          audioContext.currentTime + 0.3
        );
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );
        break;
      case "angry":
      case "jealous":
        // Sharp, aggressive sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          1200,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          800,
          audioContext.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );
        break;
      case "yandere":
        // Distorted, unsettling sound
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          800,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          200,
          audioContext.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.4
        );
        break;
      case "shy":
      case "worried":
        // Soft, gentle sound
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          600,
          audioContext.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );
        break;
      case "playful":
        // Bouncy, fun sound
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          800,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          600,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.setValueAtTime(
          800,
          audioContext.currentTime + 0.3
        );
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.4
        );
        break;
      default:
        // Neutral sound
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.2
        );
    }

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Play ending-specific sound effects (more expressive)
  const playEndingSound = (moodType, affectionLevel) => {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (moodType) {
      case "happy":
      case "loving":
        if (affectionLevel >= 90) {
          // Giggling sound - multiple quick ascending notes
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(
            1000,
            audioContext.currentTime + 0.1
          );
          oscillator.frequency.setValueAtTime(
            1200,
            audioContext.currentTime + 0.2
          );
          oscillator.frequency.setValueAtTime(
            1000,
            audioContext.currentTime + 0.3
          );
          oscillator.frequency.setValueAtTime(
            1200,
            audioContext.currentTime + 0.4
          );
          gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.6
          );
        } else {
          // Happy sigh
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            400,
            audioContext.currentTime + 0.4
          );
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
          );
        }
        break;
      case "sad":
      case "disappointed":
        // Soft crying/whimpering sound
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          250,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          300,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.setValueAtTime(
          250,
          audioContext.currentTime + 0.3
        );
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.6
        );
        break;
      case "angry":
      case "jealous":
        // Angry huff/growl
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          400,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.setValueAtTime(
          200,
          audioContext.currentTime + 0.4
        );
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );
        break;
      case "yandere":
        // Maniacal laugh
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          600,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          800,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.setValueAtTime(
          600,
          audioContext.currentTime + 0.3
        );
        oscillator.frequency.setValueAtTime(
          400,
          audioContext.currentTime + 0.4
        );
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.7
        );
        break;
      case "shy":
      case "worried":
        // Shy giggle
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          600,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          500,
          audioContext.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.4
        );
        break;
      case "excited":
        // Excited squeal
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          1200,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          1400,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.setValueAtTime(
          1200,
          audioContext.currentTime + 0.3
        );
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );
        break;
      case "playful":
        // Playful laugh
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          800,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          600,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.setValueAtTime(
          800,
          audioContext.currentTime + 0.3
        );
        oscillator.frequency.setValueAtTime(
          600,
          audioContext.currentTime + 0.4
        );
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.6
        );
        break;
      default:
        // Neutral sigh
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          400,
          audioContext.currentTime + 0.3
        );
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.4
        );
    }

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.8);
  };

  // Debug render
  console.log(
    "Component rendering with gameState:",
    gameState,
    "showSettings:",
    showSettings
  );

  // Settings screen (should be checked first)
  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Settings ⚙️</h1>
            <button
              onClick={() => {
                setShowSettings(false);
                playSound("click");
              }}
              className="text-purple-300 hover:text-white underline"
            >
              ← Back to Menu
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-white text-lg">Sound Effects</span>
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    playSound("click");
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    soundEnabled ? "bg-pink-500" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      soundEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-lg">Background Music</span>
                <button
                  onClick={() => {
                    setMusicEnabled(!musicEnabled);
                    if (musicEnabled) {
                      stopBackgroundMusic();
                    } else {
                      playBackgroundMusic();
                    }
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    musicEnabled ? "bg-pink-500" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      musicEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Music Track Selection */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-semibold">
                  Music Track
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {musicTracks.map((track, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMusicTrack(index);
                        if (musicEnabled) {
                          playBackgroundMusic(index);
                        }
                        playSound("click");
                      }}
                      className={`p-3 rounded-lg text-left transition-all duration-300 ${
                        selectedMusicTrack === index
                          ? "bg-pink-500/30 border-2 border-pink-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">
                        {track.name}
                      </div>
                      <div className="text-purple-200 text-xs mt-1">
                        {track.description}
                      </div>
                      <div className="text-purple-300 text-xs mt-1">
                        Mood: {track.mood}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Start screen
  if (gameState === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 animate-pulse text-gradient">
              Yandere AI: Love.exe
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              A virtual waifu experience where your choices matter
            </p>
          </div>

          {/* Waifu Greeting Section */}
          <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                {greetingImage ? (
                  <img
                    src={greetingImage}
                    alt="Waifu Greeting"
                    className="w-32 h-32 object-cover rounded-full shadow-2xl border-4 border-white/20"
                    style={{
                      objectPosition: "center top",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome, Master! 💕
                </h2>
                <p className="text-purple-200 text-lg leading-relaxed">
                  I've been waiting for you... Your virtual waifu is ready to
                  meet you! Choose your perfect companion and let our love story
                  begin. Every choice you make will shape our relationship and
                  my feelings towards you.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-pink-500/20 text-pink-200 text-xs px-3 py-1 rounded-full">
                    💖 Romantic
                  </span>
                  <span className="bg-purple-500/20 text-purple-200 text-xs px-3 py-1 rounded-full">
                    🎭 Interactive
                  </span>
                  <span className="bg-blue-500/20 text-blue-200 text-xs px-3 py-1 rounded-full">
                    🎵 Immersive
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                initializeGame();
                playSound("click");
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-lg btn-anime"
            >
              <Play className="w-6 h-6 inline mr-2" />
              Choose Your Waifu
            </button>

            <button
              onClick={() => {
                setShowSettings(true);
                playSound("click");
              }}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Settings
            </button>
          </div>

          <div className="mt-12 text-purple-200">
            <p className="text-sm">
              ⚠️ Warning: This game contains themes of obsession and unhealthy
              relationships.
              <br />
              Your choices will affect your waifu's personality and behavior.
            </p>
          </div>

          {/* Admin Panel Button */}
          <button
            onClick={() => setShowAdminPanel(true)}
            className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
            title="Admin Panel"
          >
            <Shield className="w-6 h-6" />
          </button>
        </div>

        {/* Admin Panel */}
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          gameData={{
            gameState,
            selectedWaifu,
            mood,
            affection,
            conversationCount,
            achievements,
            unlockedOutfits,
            currentOutfit,
            screenshots,
            gifts,
            currentDate,
            storyProgress,
            unlockedEndings,
          }}
          onUpdateGameData={updateGameData}
          waifuTypes={waifuTypes}
          achievementList={achievementList}
          giftList={giftList}
          outfitList={outfitList}
        />
      </div>
    );
  }

  // Waifu selection screen
  if (gameState === "waifuSelect") {
    console.log("Rendering waifu selection screen");
    console.log("waifuTypes:", waifuTypes);
    console.log("waifuTypes entries:", Object.entries(waifuTypes));
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Waifu 💕
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Each waifu has a unique personality and 10 conversations waiting
              for you!
            </p>
            <button
              onClick={() => setGameState("start")}
              className="text-purple-300 hover:text-white underline"
            >
              ← Back to Menu
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(waifuTypes).map(([key, waifuType]) => (
              <div
                key={key}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  selectWaifuType(key);
                  playSound("click");
                }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{waifuType.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {waifuType.name}
                  </h3>
                  <p className="text-purple-200 font-semibold mb-2">
                    {waifuType.personality}
                  </p>
                  <p className="text-purple-300 text-sm mb-4">
                    {waifuType.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {waifuType.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Game ended screen
  if (gameState === "ended") {
    console.log(
      "Rendering ending screen with mood:",
      mood,
      "affection:",
      affection
    );
    const currentWaifu = selectedWaifu ? waifuTypes[selectedWaifu] : null;

    const getEndingMessage = () => {
      if (affection >= 90) {
        return {
          title: "True Love Ending 💕",
          message: `${
            currentWaifu?.name || "Your waifu"
          } is completely in love with you! She wants to be with you forever!`,
          color: "from-pink-400 to-red-500",
          feedback:
            "She's absolutely smitten! You've won her heart completely with your caring and romantic responses. She sees you as her soulmate and wants to spend eternity together. This is the perfect ending for true love!",
        };
      } else if (affection >= 70) {
        return {
          title: "Romance Ending 💖",
          message: `${
            currentWaifu?.name || "Your waifu"
          } has strong feelings for you and wants to pursue a relationship!`,
          color: "from-pink-300 to-purple-400",
          feedback:
            "She's definitely into you! Your sweet and thoughtful responses have made her fall for you. She's ready to take things to the next level and build something special together.",
        };
      } else if (affection >= 50) {
        return {
          title: "Friendship Ending 👫",
          message: `${
            currentWaifu?.name || "Your waifu"
          } sees you as a good friend and enjoys your company!`,
          color: "from-blue-400 to-purple-400",
          feedback:
            "She likes you as a person and enjoys talking with you, but she's not romantically interested. You've built a nice friendship, but she's looking for someone else for romance.",
        };
      } else if (affection >= 30) {
        return {
          title: "Neutral Ending 😐",
          message: `${
            currentWaifu?.name || "Your waifu"
          } is polite but not particularly interested in you.`,
          color: "from-gray-400 to-gray-600",
          feedback:
            "She's being polite but isn't really feeling a connection. Your responses were okay, but they didn't spark any special feelings in her. She's not interested in pursuing anything further.",
        };
      } else {
        return {
          title: "Rejection Ending 💔",
          message: `${
            currentWaifu?.name || "Your waifu"
          } seems distant and uninterested in continuing the conversation.`,
          color: "from-gray-500 to-gray-700",
          feedback:
            "Unfortunately, your responses didn't resonate with her at all. She found you uninteresting or even off-putting. She's not interested in any kind of relationship with you.",
        };
      }
    };

    const ending = getEndingMessage();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1
              className={`text-4xl font-bold bg-gradient-to-r ${ending.color} bg-clip-text text-transparent mb-4`}
            >
              {ending.title}
            </h1>
            <p className="text-xl text-white mb-4">{ending.message}</p>
            <p className="text-lg text-purple-200 mb-6">"{dialogue}"</p>

            {/* Waifu Sound Effect Description */}
            <div className="mb-4 text-center">
              {mood === "happy" || mood === "loving" ? (
                <p className="text-pink-300 text-sm italic">
                  *{waifuTypes[selectedWaifu]?.name || "Your waifu"} giggles
                  happily* 💕
                </p>
              ) : mood === "sad" || mood === "disappointed" ? (
                <p className="text-blue-300 text-sm italic">
                  *{waifuTypes[selectedWaifu]?.name || "Your waifu"} sniffles
                  softly* 😢
                </p>
              ) : mood === "angry" || mood === "jealous" ? (
                <p className="text-red-300 text-sm italic">
                  *{waifuTypes[selectedWaifu]?.name || "Your waifu"} huffs
                  angrily* 😠
                </p>
              ) : mood === "yandere" ? (
                <p className="text-red-400 text-sm italic">
                  *{waifuTypes[selectedWaifu]?.name || "Your waifu"} laughs
                  maniacally* 😈
                </p>
              ) : mood === "shy" || mood === "worried" ? (
                <p className="text-purple-300 text-sm italic">
                  *{waifuTypes[selectedWaifu]?.name || "Your waifu"} giggles
                  shyly* 😊
                </p>
              ) : mood === "excited" ? (
                <p className="text-yellow-300 text-sm italic">
                  *{waifuTypes[selectedWaifu]?.name || "Your waifu"} squeals
                  excitedly* ⭐
                </p>
              ) : mood === "playful" ? (
                <p className="text-green-300 text-sm italic">
                  *{waifuTypes[selectedWaifu]?.name || "Your waifu"} laughs
                  playfully* 😄
                </p>
              ) : (
                <p className="text-gray-300 text-sm italic">
                  *{waifuTypes[selectedWaifu]?.name || "Your waifu"} sighs
                  softly* 😌
                </p>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3">
                Conversation Analysis
              </h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                {ending.feedback}
              </p>
            </div>
          </div>

          {currentImage && (
            <div className="mb-8">
              <img
                src={currentImage}
                alt={currentWaifu?.name || "Your waifu"}
                className="w-64 h-64 object-cover rounded-full mx-auto shadow-2xl border-4 border-white/20"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Final Stats</h3>
              <p className="text-purple-200">Affection Level: {affection}%</p>
              <p className="text-purple-200">
                Conversations: {conversationCount}/10
              </p>
              <p className="text-purple-200">Waifu: {currentWaifu?.name}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">
                Personality Match
              </h3>
              <p className="text-purple-200">
                Your responses matched her{" "}
                {currentWaifu?.personality.toLowerCase()} nature
              </p>
              <p className="text-purple-200">
                Compatibility:{" "}
                {affection >= 70 ? "High" : affection >= 50 ? "Medium" : "Low"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setGameState("start");
                setAffection(50);
                setMood("neutral");
                setConversationHistory([]);
                setConversationCount(0);
                setSelectedWaifu(null);
                setDialogue("");
                setChoices([]);
                stopBackgroundMusic();
                playSound("click");
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Play className="w-6 h-6 inline mr-2" />
              Try Another Waifu
            </button>

            <button
              onClick={() => {
                setShowSettings(true);
                playSound("click");
              }}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  console.log(
    "Rendering main game screen with gameState:",
    gameState,
    "selectedWaifu:",
    selectedWaifu
  );

  // Safety check - if no valid waifu selected, go back to selection
  // Temporarily disabled for debugging
  // if (
  //   gameState === "playing" &&
  //   (!selectedWaifu || !waifuTypes[selectedWaifu])
  // ) {
  //   console.log("Invalid waifu selected, returning to selection screen");
  //   console.log("selectedWaifu:", selectedWaifu);
  //   console.log("waifuTypes keys:", Object.keys(waifuTypes));
  //   console.log("waifuTypes[selectedWaifu]:", waifuTypes[selectedWaifu]);
  //   setGameState("waifuSelect");
  //   return null;
  // }

  // Show loading state while image is loading
  if (gameState === "playing" && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading your waifu...
          </h2>
          <p className="text-purple-200">
            Please wait while we prepare your conversation.
          </p>
        </div>
      </div>
    );
  }

  // Date screen
  if (gameState === "date") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${themeList[currentTheme].colors} p-4`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Virtual Date</h1>
            <p className="text-purple-200 text-xl">{dateLocation?.name}</p>
            <p className="text-purple-300">{dateLocation?.description}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Date Scene */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">{dateLocation?.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Date with {waifuTypes[selectedWaifu]?.name}
              </h2>
              <p className="text-purple-200 mb-6">{dialogue}</p>

              {/* Affection Display */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Heart className="w-6 h-6 text-pink-400" />
                <span className="text-white text-lg">{affection}%</span>
              </div>
            </div>

            {/* Date Activities */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                What would you like to do?
              </h3>
              <div className="space-y-3">
                {dateActivities[dateLocation?.id]?.map((activity, index) => (
                  <button
                    key={index}
                    onClick={() => doDateActivity(activity)}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 text-left transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-semibold">
                          {activity.name}
                        </h4>
                        <p className="text-purple-200 text-sm">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-green-400 text-sm font-bold">
                        +{activity.affection}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    setGameState("playing");
                    setDateLocation(null);
                  }}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Continue Date
                </button>
                <button
                  onClick={() => {
                    setGameState("playing");
                    setDateLocation(null);
                  }}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                  End Date
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mini-game screen
  if (gameState === "minigame") {
    const renderGameContent = () => {
      if (!gameActive) {
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">{miniGames[miniGame]?.icon}</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Playing {miniGames[miniGame]?.name} with{" "}
              {waifuTypes[selectedWaifu]?.name}
            </h2>
            <p className="text-purple-200 mb-6">
              {miniGames[miniGame]?.description}
            </p>
            <button
              onClick={() => {
                if (miniGame === "cooking") playCookingGame();
                else if (miniGame === "memory") playMemoryGame();
                else if (miniGame === "trivia") playTriviaGame();
                else if (miniGame === "rhythm") playRhythmGame();
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Start Game
            </button>
          </div>
        );
      }

      // Cooking Game
      if (miniGame === "cooking") {
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              Cooking Together! 👨‍🍳
            </h3>
            <div className="mb-4">
              <p className="text-purple-200">Score: {gameScore}</p>
              <p className="text-purple-200">Time: {gameTime}s</p>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {cookingGame.ingredients.map((ingredient, index) => (
                <button
                  key={index}
                  onClick={() => setGameScore((prev) => prev + 1)}
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-2xl"
                >
                  {ingredient}
                </button>
              ))}
            </div>
            <p className="text-purple-200 text-sm mb-4">
              Click ingredients to cook! Try to make recipes for bonus points!
            </p>
            {gameTime === 0 && (
              <button
                onClick={finishMiniGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Finish Cooking
              </button>
            )}
          </div>
        );
      }

      // Memory Game
      if (miniGame === "memory") {
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              Memory Match! 🧠
            </h3>
            <div className="mb-4">
              <p className="text-purple-200">Score: {gameScore}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {memoryGame.cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => setGameScore((prev) => prev + 1)}
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-2xl"
                >
                  {card}
                </button>
              ))}
            </div>
            <p className="text-purple-200 text-sm mb-4">
              Find matching pairs! Click cards to flip them!
            </p>
            <button
              onClick={finishMiniGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Finish Game
            </button>
          </div>
        );
      }

      // Trivia Game
      if (miniGame === "trivia") {
        const question = triviaQuestions[currentTrivia];
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              Love Trivia! ❓
            </h3>
            <div className="mb-4">
              <p className="text-purple-200">Score: {gameScore}</p>
              <p className="text-purple-200">
                Question {currentTrivia + 1} of {triviaQuestions.length}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 mb-4">
              <h4 className="text-lg font-bold text-white mb-4">
                {question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => answerTrivia(index)}
                    className={`w-full p-3 rounded-lg transition-all duration-300 ${
                      selectedAnswer === index
                        ? index === question.correct
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {selectedAnswer !== null && (
              <button
                onClick={finishMiniGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Finish Trivia
              </button>
            )}
          </div>
        );
      }

      // Rhythm Game
      if (miniGame === "rhythm") {
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              Rhythm Game! 🎵
            </h3>
            <div className="mb-4">
              <p className="text-purple-200">Score: {gameScore}</p>
              <p className="text-purple-200">Time: {gameTime}s</p>
            </div>
            <div className="mb-4">
              <button
                onClick={() => setGameScore((prev) => prev + 1)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full text-2xl"
              >
                TAP!
              </button>
            </div>
            <p className="text-purple-200 text-sm mb-4">
              Tap the button to the beat! Follow the rhythm!
            </p>
            {gameTime === 0 && (
              <button
                onClick={finishMiniGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Finish Rhythm
              </button>
            )}
          </div>
        );
      }
    };

    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${themeList[currentTheme].colors} p-4`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Mini-Game</h1>
            <p className="text-purple-200 text-xl">
              {miniGames[miniGame]?.name}
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                setGameState("playing");
                setMiniGame(null);
                setGameActive(false);
                setGameScore(0);
                setGameTime(30);
                playSound("click");
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Game</span>
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            {renderGameContent()}
          </div>
        </div>
      </div>
    );
  }

  // Date Selection Screen
  if (gameState === "dateSelect") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${themeList[currentTheme].colors} p-4`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Date Location
            </h1>
            <p className="text-purple-200">
              Where would you like to go on a date with{" "}
              {waifuTypes[selectedWaifu]?.name}?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dateLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => startDate(location.id)}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{location.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {location.name}
                  </h3>
                  <p className="text-purple-200 text-sm">
                    {location.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setGameState("playing")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Back to Conversation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mini-Game Selection Screen
  if (gameState === "minigameSelect") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${themeList[currentTheme].colors} p-4`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Mini-Game
            </h1>
            <p className="text-purple-200">
              What would you like to play with {waifuTypes[selectedWaifu]?.name}
              ?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(miniGames).map(([id, game]) => (
              <div
                key={id}
                onClick={() => startMiniGame(id)}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {game.name}
                  </h3>
                  <p className="text-purple-200 text-sm">{game.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setGameState("playing")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Back to Conversation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Gift Selection Screen
  if (gameState === "giftSelect") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${themeList[currentTheme].colors} p-4`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Choose Gift</h1>
            <p className="text-purple-200">
              What would you like to give to {waifuTypes[selectedWaifu]?.name}?
            </p>
            <p className="text-purple-300 text-sm mt-2">
              Each gift will give a unique reaction based on your waifu's
              personality!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftList.map((gift) => (
              <div
                key={gift.id}
                onClick={() => {
                  giveGift(gift.id);
                  setGameState("playing");
                }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {gift.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {gift.name}
                  </h3>
                  <p className="text-purple-200 text-sm mb-2">
                    {gift.description}
                  </p>
                  <div className="flex justify-center items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <p className="text-green-400 text-sm font-bold">
                      +{gift.value} Affection
                    </p>
                  </div>
                  <div className="text-xs text-purple-300">
                    {waifuTypes[selectedWaifu]?.name} will love this!
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setGameState("playing")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Back to Conversation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  if (gameState === "playing") {
    console.log(
      "Rendering main game screen - gameState:",
      gameState,
      "selectedWaifu:",
      selectedWaifu
    );
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${themeList[currentTheme].colors} p-4`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setGameState("start");
                  stopBackgroundMusic();
                }}
                className="text-purple-300 hover:text-white transition-colors"
              >
                <Home className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">
                Yandere AI: Love.exe
              </h1>
              {selectedWaifu && waifuTypes[selectedWaifu] && (
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300">with</span>
                  <span className="text-pink-300 font-semibold">
                    {waifuTypes[selectedWaifu].name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getMoodIcon()}
                <span className="text-white capitalize">{mood}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart
                  className={`w-5 h-5 text-pink-400 ${
                    affection > 70 ? "heart-beat" : ""
                  }`}
                />
                <span className="text-white">{affection}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <span className="text-white">{conversationCount}/10</span>
              </div>

              {/* New Feature Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={takeScreenshot}
                  className="text-purple-300 hover:text-white transition-colors"
                  title="Take Screenshot"
                >
                  <span className="text-xl">📸</span>
                </button>
                <button
                  onClick={() => setGameState("dateSelect")}
                  className="text-purple-300 hover:text-white transition-colors"
                  title="Go on a Date"
                >
                  <span className="text-xl">💑</span>
                </button>
                <button
                  onClick={() => setGameState("minigameSelect")}
                  className="text-purple-300 hover:text-white transition-colors"
                  title="Play Mini-Game"
                >
                  <span className="text-xl">🎮</span>
                </button>
                <button
                  onClick={() => setGameState("giftSelect")}
                  className="text-purple-300 hover:text-white transition-colors"
                  title="Give Gift"
                >
                  <span className="text-xl">🎁</span>
                </button>
                <button
                  onClick={() => {
                    setShowSettings(true);
                    playSound("click");
                  }}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Character Image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {loading ? (
                  <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <img
                    src={currentImage}
                    alt={waifuTypes[selectedWaifu]?.name || "Your Waifu"}
                    className={`w-80 h-80 object-cover rounded-full shadow-2xl border-4 border-white/20 transition-all duration-500 mood-${mood}`}
                    style={{
                      objectPosition: "center top",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div
                  className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${getMoodColor()} px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg`}
                >
                  {waifuTypes[selectedWaifu]?.name || "Your Waifu"}
                </div>
              </div>
            </div>

            {/* Dialogue and Choices */}
            <div className="space-y-6">
              {/* Dialogue Box */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 glass">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse-slow">
                    {waifuTypes[selectedWaifu]?.name?.charAt(0) || "W"}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg leading-relaxed">
                      {dialogue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Choices */}
              <div className="space-y-3">
                {choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleChoice(choice);
                      playSound("click");
                    }}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left text-white transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 btn-anime"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-lg">{choice.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Affection Bar */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">
                    Affection Level
                  </span>
                  <span className="text-white">{affection}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${getMoodColor()} transition-all duration-500`}
                    style={{ width: `${affection}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4">
                Conversation History
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {conversationHistory.slice(-5).map((entry, index) => (
                  <div key={index} className="text-sm text-purple-200">
                    <span className="font-semibold">You:</span> {entry.player}
                    <br />
                    <span className="font-semibold">
                      {waifuTypes[selectedWaifu]?.name || "Waifu"}:
                    </span>{" "}
                    {entry.waifu}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Panel Button */}
          <button
            onClick={() => setShowAdminPanel(true)}
            className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
            title="Admin Panel"
          >
            <Shield className="w-6 h-6" />
          </button>
        </div>

        {/* Admin Panel */}
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          gameData={{
            gameState,
            selectedWaifu,
            mood,
            affection,
            conversationCount,
            achievements,
            unlockedOutfits,
            currentOutfit,
            screenshots,
            gifts,
            currentDate,
            storyProgress,
            unlockedEndings,
          }}
          onUpdateGameData={updateGameData}
          waifuTypes={waifuTypes}
          achievementList={achievementList}
          giftList={giftList}
          outfitList={outfitList}
        />
      </div>
    );
  }

  // Fallback - should not reach here
  console.log("Reached fallback with gameState:", gameState);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Debug Mode</h1>
        <p className="text-purple-200 mb-4">Game State: {gameState}</p>
        <p className="text-purple-200 mb-4">
          Selected Waifu: {selectedWaifu || "None"}
        </p>
        <p className="text-purple-200 mb-4">
          Show Settings: {showSettings ? "Yes" : "No"}
        </p>
        <button
          onClick={() => {
            setGameState("start");
            setShowSettings(false);
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset to Start
        </button>
      </div>
    </div>
  );
};

export default YandereAIGame;
