/**
 * Maps game mood states to waifu emotion types
 * Game moods: neutral, happy, sad, angry, loving, excited, shy, jealous, worried, playful, disappointed, yandere
 * Waifu emotions: normal, happy, sad, angry
 */
export const getMoodEmotion = (mood) => {
  const moodToEmotionMap = {
    // Happy emotions
    happy: "happy",
    loving: "happy",
    excited: "happy",
    playful: "happy",
    
    // Sad emotions
    sad: "sad",
    disappointed: "sad",
    worried: "sad",
    
    // Angry emotions
    angry: "angry",
    jealous: "angry",
    yandere: "angry",
    
    // Normal/neutral emotions
    neutral: "normal",
    shy: "normal",
  };

  return moodToEmotionMap[mood] || "normal";
};

/**
 * Gets the image URL for a waifu's current emotion
 * @param {Object} waifuData - The waifu object from the database
 * @param {string} mood - The current game mood
 * @param {string} baseUrl - The API base URL (default: http://localhost:5000)
 * @returns {string} The full image URL or empty string if not found
 */
export const getWaifuEmotionImage = (waifuData, mood, baseUrl = "http://localhost:5000") => {
  if (!waifuData || !waifuData.emotions || !Array.isArray(waifuData.emotions)) {
    console.warn("Invalid waifuData:", waifuData);
    return "";
  }

  const emotion = getMoodEmotion(mood);
  const emotionData = waifuData.emotions.find((e) => e.emotion === emotion);

  if (!emotionData || !emotionData.imageUrl) {
    console.warn(`Emotion ${emotion} not found for waifu, falling back to normal`);
    const normalEmotion = waifuData.emotions.find((e) => e.emotion === "normal");
    if (normalEmotion && normalEmotion.imageUrl) {
      return normalEmotion.imageUrl.startsWith("http")
        ? normalEmotion.imageUrl
        : `${baseUrl}${normalEmotion.imageUrl}`;
    }
    return "";
  }

  // Return full URL if it's already a full URL, otherwise prepend base URL
  return emotionData.imageUrl.startsWith("http")
    ? emotionData.imageUrl
    : `${baseUrl}${emotionData.imageUrl}`;
};
