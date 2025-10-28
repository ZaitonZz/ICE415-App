export const giftList = [
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
    affection: 18,
  },
];

// Also export with simpler name for imports
export const gifts = giftList.map(g => ({
  ...g,
  affection: g.value // Normalize the property name
}));
