import React from "react";
import { useGame, useGameDispatch } from "../../state/GameContext";
import { waifuTypes } from "../../data/waifuTypes";
import { conversations } from "../../data/conversations";
import { getMoodImage } from "../../services/waifuPics";
import { playSound, playBackgroundMusic } from "../../services/audio";

const WaifuSelectScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const handleSelectWaifu = async (waifuTypeKey) => {
    try {
      console.log("Selecting waifu type:", waifuTypeKey);
      const waifuType = waifuTypes[waifuTypeKey];
      console.log("Waifu type found:", waifuType);

      if (!waifuType) {
        console.error("Invalid waifu type:", waifuTypeKey);
        return;
      }

      dispatch({ type: "SET_SELECTED_WAIFU", waifu: waifuTypeKey });
      dispatch({ type: "SET_GAME_STATE", gameState: "playing" });
      dispatch({ type: "SET_MOOD", mood: "neutral" });
      dispatch({ type: "SET_AFFECTION", affection: 50 });
      dispatch({ type: "SET_CONVERSATION_COUNT", count: 0 });
      dispatch({ type: "RESET_HISTORY" });

      // Get first conversation
      const firstConversation = conversations[waifuTypeKey]?.[0];
      console.log("First conversation:", firstConversation);

      if (firstConversation) {
        dispatch({
          type: "SET_DIALOGUE",
          dialogue: firstConversation.question,
        });
        dispatch({ type: "SET_CHOICES", choices: firstConversation.choices });
      } else {
        console.error("No conversation found for waifu type:", waifuTypeKey);
        dispatch({
          type: "SET_DIALOGUE",
          dialogue: "Hello! I'm ready to chat with you!",
        });
        dispatch({ type: "SET_CHOICES", choices: [] });
      }

      // Load image
      dispatch({ type: "SET_LOADING", loading: true });
      const imageUrl = await getMoodImage("neutral");
      dispatch({ type: "SET_IMAGE", image: imageUrl });
      dispatch({ type: "SET_LOADING", loading: false });

      // Play music
      if (state.musicEnabled && state.selectedMusicTrack !== null) {
        const { musicTracks } = await import("../../data/musicTracks");
        const audio = playBackgroundMusic(
          musicTracks[state.selectedMusicTrack].url
        );
        dispatch({ type: "SET_CURRENT_MUSIC_REF", payload: audio });
      }

      playSound("click", state.soundEnabled);
    } catch (error) {
      console.error("Error in selectWaifuType:", error);
      dispatch({
        type: "SET_DIALOGUE",
        dialogue: "Hello! I'm ready to chat with you!",
      });
      dispatch({ type: "SET_CHOICES", choices: [] });
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_GAME_STATE", gameState: "start" });
    playSound("click", state.soundEnabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Waifu 💕
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Each waifu has a unique personality and 10 conversations waiting for
            you!
          </p>
          <button
            onClick={handleBack}
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
              onClick={() => handleSelectWaifu(key)}
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
};

export default WaifuSelectScreen;
