import { moodEndpoints } from "../data/moodEndpoints";

// Get image from waifu.pics API
export const getMoodImage = async (mood) => {
  try {
    const endpoint = moodEndpoints[mood] || "waifu";
    const response = await fetch(`https://api.waifu.pics/sfw/${endpoint}`);
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error fetching image:", error);
    // Fallback to a default image
    return "https://api.waifu.pics/sfw/waifu";
  }
};

// Get greeting image for landing page
export const getGreetingImage = async () => {
  try {
    const response = await fetch("https://api.waifu.pics/sfw/waifu");
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error fetching greeting image:", error);
    return "https://api.waifu.pics/sfw/waifu";
  }
};
