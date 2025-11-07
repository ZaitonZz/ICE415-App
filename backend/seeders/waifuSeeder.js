const Waifu = require('../models/Waifu.model');
const fs = require('fs').promises;
const path = require('path');

const waifuSeedData = [
  {
    name: "Aiko",
    personality: "Sweet & Caring",
    description: "A sweet, caring waifu who loves deeply and wants to protect you",
    color: "from-pink-400 to-red-500",
    icon: "💕",
    traits: ["loving", "protective", "romantic"],
    yandereTrigger: "possessive",
    order: 1,
    folderName: "girl1_emotions"
  },
  {
    name: "Yuki",
    personality: "Cheerful & Energetic",
    description: "Always cheerful and full of energy, loves to make you smile",
    color: "from-blue-400 to-cyan-500",
    icon: "❄️",
    traits: ["energetic", "optimistic", "playful"],
    yandereTrigger: "jealous",
    order: 2,
    folderName: "girl2_emotions"
  },
  {
    name: "Sakura",
    personality: "Shy & Gentle",
    description: "Gentle and shy, but has hidden strength and determination",
    color: "from-pink-300 to-purple-400",
    icon: "🌸",
    traits: ["shy", "gentle", "determined"],
    yandereTrigger: "clingy",
    order: 3,
    folderName: "girl3_emotions"
  },
  {
    name: "Mai",
    personality: "Friendly & Smiling",
    description: "Friendly and always smiling, brings joy to your life",
    color: "from-yellow-400 to-orange-500",
    icon: "☀️",
    traits: ["friendly", "cheerful", "social"],
    yandereTrigger: "territorial",
    order: 4,
    folderName: "girl4_emotions"
  }
];

const emotionMapping = {
  'normal': 'normal',
  'happy': 'happy',
  'sad': 'sad',
  'angry': 'angry'
};

async function copyEmotionImages(folderName, waifuName) {
  const emotions = [];
  const sourceDir = path.join(__dirname, '..', folderName);
  const destDir = path.join(__dirname, '..', 'uploads', 'waifus');
  
  try {
    // Ensure destination directory exists
    await fs.mkdir(destDir, { recursive: true });
    
    // Get all files in the source directory
    const files = await fs.readdir(sourceDir);
    
    for (const [emotion, emotionKey] of Object.entries(emotionMapping)) {
      // Find the file for this emotion
      const sourceFile = files.find(file => {
        const lowerFile = file.toLowerCase();
        return lowerFile.includes(emotion) || 
               (emotion === 'angry' && lowerFile.includes('angry'));
      });
      
      if (sourceFile) {
        const ext = path.extname(sourceFile);
        const destFileName = `${waifuName.toLowerCase()}_${emotion}${ext}`;
        const sourcePath = path.join(sourceDir, sourceFile);
        const destPath = path.join(destDir, destFileName);
        
        // Copy file
        await fs.copyFile(sourcePath, destPath);
        
        emotions.push({
          emotion: emotionKey,
          imageUrl: `/uploads/waifus/${destFileName}`
        });
      }
    }
    
    return emotions;
  } catch (error) {
    console.error(`Error copying images for ${waifuName}:`, error);
    return [];
  }
}

async function seedWaifus() {
  try {
    console.log('🌱 Starting waifu seeding...');
    
    // Check if waifus already exist
    const existingCount = await Waifu.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing waifus. Skipping seed.`);
      console.log('💡 To reseed, delete all waifus first or use --force flag');
      return;
    }
    
    console.log('📦 Creating waifus with emotion images...');
    
    for (const waifuData of waifuSeedData) {
      const { folderName, ...data } = waifuData;
      
      console.log(`  📸 Copying images for ${data.name}...`);
      const emotions = await copyEmotionImages(folderName, data.name);
      
      if (emotions.length === 4) {
        const waifu = await Waifu.create({
          ...data,
          emotions
        });
        console.log(`  ✅ Created ${waifu.name} with ${emotions.length} emotions`);
      } else {
        console.log(`  ⚠️  Skipped ${data.name} - missing emotion images (found ${emotions.length}/4)`);
      }
    }
    
    const finalCount = await Waifu.countDocuments();
    console.log(`\n✨ Seeding complete! Created ${finalCount} waifus.`);
    
  } catch (error) {
    console.error('❌ Error seeding waifus:', error);
    throw error;
  }
}

// Allow running this file directly
if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('📊 Connected to MongoDB');
      await seedWaifus();
      await mongoose.connection.close();
      console.log('👋 Database connection closed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    });
}

module.exports = seedWaifus;
