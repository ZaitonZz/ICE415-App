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
} from "lucide-react";

// Waifu definitions with unique personalities
const waifus = {
  aiko: {
    name: "Aiko",
    personality: "Sweet & Caring",
    description:
      "The main character with a sweet, caring nature who loves deeply",
    color: "from-pink-400 to-red-500",
    icon: "💕",
    traits: ["loving", "protective", "romantic"],
    yandereTrigger: "possessive",
  },
  yuki: {
    name: "Yuki",
    personality: "Cheerful & Energetic",
    description:
      "Always cheerful and full of energy, loves to make others smile",
    color: "from-blue-400 to-cyan-500",
    icon: "❄️",
    traits: ["energetic", "optimistic", "playful"],
    yandereTrigger: "jealous",
  },
  sakura: {
    name: "Sakura",
    personality: "Shy & Gentle",
    description: "Gentle and shy, but has a hidden strength and determination",
    color: "from-pink-300 to-purple-400",
    icon: "🌸",
    traits: ["shy", "gentle", "determined"],
    yandereTrigger: "clingy",
  },
  mai: {
    name: "Mai",
    personality: "Friendly & Smiling",
    description:
      "Friendly and always smiling, brings joy to everyone around her",
    color: "from-yellow-400 to-orange-500",
    icon: "☀️",
    traits: ["friendly", "cheerful", "social"],
    yandereTrigger: "territorial",
  },
  hana: {
    name: "Hana",
    personality: "Welcoming & Warm",
    description: "Warm and welcoming, makes everyone feel at home",
    color: "from-green-400 to-emerald-500",
    icon: "🌺",
    traits: ["nurturing", "warm", "motherly"],
    yandereTrigger: "overprotective",
  },
};

const YandereAIGame = () => {
  // Core game states
  const [gameState, setGameState] = useState("start"); // start, waifuSelect, playing, ended
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

  // API endpoints for different moods
  const moodEndpoints = {
    happy: "happy",
    sad: "sad",
    angry: "angry",
    yandere: "cringe",
    shy: "blush",
    neutral: "waifu",
  };

  // Conversation database for each waifu
  const conversationDatabase = {
    aiko: [
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
    yuki: [
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
    sakura: [
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
    mai: [
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
    hana: [
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
  };

  // Background music tracks (using royalty-free anime-style music)
  const musicTracks = [
    "https://www.bensound.com/bensound-music/bensound-romantic.mp3", // Romantic anime-style music
    "https://www.bensound.com/bensound-music/bensound-sunny.mp3", // Upbeat and cheerful
    "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3", // Mysterious and emotional
  ];

  // Play background music
  const playBackgroundMusic = () => {
    if (!musicEnabled || currentMusic) return;

    const audio = new Audio(musicTracks[0]);
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

  // Select waifu and start conversation
  const selectWaifu = async (waifuKey) => {
    const waifu = waifus[waifuKey];
    setSelectedWaifu(waifuKey);
    setGameState("playing");
    setMood("neutral");
    setAffection(50);
    setConversationCount(0);
    setConversationHistory([]);

    // Get first conversation
    const firstConversation = conversationDatabase[waifuKey][0];
    setDialogue(firstConversation.question);
    setChoices(firstConversation.choices);

    await getMoodImage("neutral");
    playBackgroundMusic();
  };

  // Initialize game
  const initializeGame = async () => {
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
      setGameState("ended");
      return;
    }

    // Determine new mood based on choice and current state
    let newMood = mood;
    if (choice.effect === "affection" && affection > 70) {
      newMood = "happy";
    } else if (choice.effect === "anger" && affection < 30) {
      newMood = "angry";
    } else if (choice.effect === "neutral") {
      newMood = "shy";
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

  // Check for game ending
  useEffect(() => {
    if (affection >= 90) {
      setGameState("ended");
      setDialogue(
        "I love you so much! You're my everything! Let's be together forever! ♡♡♡"
      );
      setMood("happy");
    } else if (affection <= 10) {
      setGameState("ended");
      setDialogue(
        "I... I think we should end this conversation here. Goodbye."
      );
      setMood("sad");
    }
  }, [affection]);

  // Cleanup music on unmount
  useEffect(() => {
    return () => {
      if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
      }
    };
  }, [currentMusic]);

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
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 animate-pulse text-gradient">
              Yandere AI: Love.exe
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              A virtual waifu experience where your choices matter
            </p>
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
        </div>
      </div>
    );
  }

  // Waifu selection screen
  if (gameState === "waifuSelect") {
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
            {Object.entries(waifus).map(([key, waifu]) => (
              <div
                key={key}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  selectWaifu(key);
                  playSound("click");
                }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{waifu.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {waifu.name}
                  </h3>
                  <p className="text-purple-200 font-semibold mb-2">
                    {waifu.personality}
                  </p>
                  <p className="text-purple-300 text-sm mb-4">
                    {waifu.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {waifu.traits.map((trait, index) => (
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
    const currentWaifu = selectedWaifu ? waifus[selectedWaifu] : null;

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
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
            {selectedWaifu && (
              <div className="flex items-center space-x-2">
                <span className="text-purple-300">with</span>
                <span className="text-pink-300 font-semibold">
                  {waifus[selectedWaifu]?.name}
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
                  alt="Aiko"
                  className={`w-80 h-80 object-cover rounded-full shadow-2xl border-4 border-white/20 transition-all duration-500 mood-${mood}`}
                />
              )}
              <div
                className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${getMoodColor()} px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg`}
              >
                Aiko
              </div>
            </div>
          </div>

          {/* Dialogue and Choices */}
          <div className="space-y-6">
            {/* Dialogue Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 glass">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse-slow">
                  A
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
                    {waifus[selectedWaifu]?.name || "Waifu"}:
                  </span>{" "}
                  {entry.waifu}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YandereAIGame;
