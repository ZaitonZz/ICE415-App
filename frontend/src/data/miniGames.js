export const triviaQuestions = [
  {
    question: "What is the capital of Japan?",
    options: ["Kyoto", "Tokyo", "Osaka", "Hiroshima"],
    correct: 1,
    affection: 10,
  },
  {
    question: "What is my favorite flower?",
    options: ["Rose", "Lily", "Cherry Blossom", "Sunflower"],
    correct: 2,
    affection: 15,
  },
  {
    question: "What color are my eyes?",
    options: ["Blue", "Green", "Brown", "Pink"],
    correct: 3,
    affection: 12,
  },
  {
    question: "What is my favorite season?",
    options: ["Spring", "Summer", "Fall", "Winter"],
    correct: 0,
    affection: 10,
  },
  {
    question: "What do I like to do on weekends?",
    options: [
      "Study",
      "Spend time with you!",
      "Watch anime",
      "Sleep",
    ],
    correct: 1,
    affection: 20,
  },
];

export const cookingRecipes = [
  {
    name: "Strawberry Shortcake",
    difficulty: "Easy",
    ingredients: [
      { name: "Flour", emoji: "🌾" },
      { name: "Sugar", emoji: "🧁" },
      { name: "Eggs", emoji: "🥚" },
      { name: "Strawberries", emoji: "🍓" },
    ],
    steps: [
      "Mix flour and sugar",
      "Add eggs and beat well",
      "Bake for 30 minutes",
      "Add strawberries on top",
    ],
    affection: 15,
    dialogue: "This cake is delicious! You're such a good cook! 🍰",
  },
  {
    name: "Chocolate Cookies",
    difficulty: "Medium",
    ingredients: [
      { name: "Butter", emoji: "🧈" },
      { name: "Chocolate", emoji: "🍫" },
      { name: "Flour", emoji: "🌾" },
      { name: "Sugar", emoji: "🧁" },
    ],
    steps: [
      "Cream butter and sugar",
      "Mix in melted chocolate",
      "Add flour gradually",
      "Bake until golden",
    ],
    affection: 12,
    dialogue: "These cookies are amazing! You made them with love! 🍪",
  },
  {
    name: "Bento Box",
    difficulty: "Hard",
    ingredients: [
      { name: "Rice", emoji: "🍚" },
      { name: "Egg", emoji: "🥚" },
      { name: "Vegetables", emoji: "🥕" },
      { name: "Meat", emoji: "🥩" },
    ],
    steps: [
      "Cook rice perfectly",
      "Make tamago (egg roll)",
      "Arrange vegetables artfully",
      "Add meat with care",
    ],
    affection: 20,
    dialogue: "This bento is perfect! You put so much effort into it! 🍱",
  },
];

export const memoryCards = [
  { id: 1, emoji: "💕", matched: false },
  { id: 2, emoji: "💕", matched: false },
  { id: 3, emoji: "🌸", matched: false },
  { id: 4, emoji: "🌸", matched: false },
  { id: 5, emoji: "✨", matched: false },
  { id: 6, emoji: "✨", matched: false },
  { id: 7, emoji: "🎀", matched: false },
  { id: 8, emoji: "🎀", matched: false },
  { id: 9, emoji: "💝", matched: false },
  { id: 10, emoji: "💝", matched: false },
  { id: 11, emoji: "🌹", matched: false },
  { id: 12, emoji: "🌹", matched: false },
];

export const miniGames = [
  {
    id: "trivia",
    name: "Trivia Quiz",
    description: "Answer questions about me!",
    icon: "❓",
    difficulty: "Easy",
    maxAffection: 20,
  },
  {
    id: "cooking",
    name: "Cooking Together",
    description: "Make delicious treats!",
    icon: "🍰",
    difficulty: "Medium",
    maxAffection: 20,
  },
  {
    id: "memory",
    name: "Memory Match",
    description: "Match the romantic cards!",
    icon: "🎴",
    difficulty: "Hard",
    maxAffection: 25,
  },
];
