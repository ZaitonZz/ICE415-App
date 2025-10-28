import React, { useEffect } from "react";
import { Play, Settings, Shield } from "lucide-react";
import { useGame, useGameDispatch } from "../../state/GameContext";
import { getGreetingImage } from "../../services/waifuPics";
import { playSound } from "../../services/audio";
import AdminPanel from "../../AdminPanel";
import { waifuTypes } from "../../data/waifuTypes";
import { achievementList } from "../../data/achievements";
import { giftList } from "../../data/gifts";
import { outfitList } from "../../data/outfits";

const StartScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  useEffect(() => {
    const loadImage = async () => {
      const url = await getGreetingImage();
      dispatch({ type: "SET_GREETING_IMAGE", image: url });
    };
    loadImage();
  }, [dispatch]);

  const handleStart = () => {
    dispatch({ type: "SET_GAME_STATE", gameState: "waifuSelect" });
    playSound("click", state.soundEnabled);
  };

  const handleSettings = () => {
    dispatch({ type: "SET_SHOW_SETTINGS", show: true });
    playSound("click", state.soundEnabled);
  };

  const handleUpdateGameData = (updates) => {
    // Handle admin panel updates
    Object.keys(updates).forEach((key) => {
      if (key === "gameState") {
        dispatch({ type: "SET_GAME_STATE", gameState: updates[key] });
      } else if (key === "selectedWaifu") {
        dispatch({ type: "SET_SELECTED_WAIFU", waifu: updates[key] });
      } else if (key === "mood") {
        dispatch({ type: "SET_MOOD", mood: updates[key] });
      } else if (key === "affection") {
        dispatch({ type: "SET_AFFECTION", affection: updates[key] });
      } else if (key === "conversationCount") {
        dispatch({ type: "SET_CONVERSATION_COUNT", count: updates[key] });
      }
    });
  };

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
              {state.greetingImage ? (
                <img
                  src={state.greetingImage}
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
                I've been waiting for you... Your virtual waifu is ready to meet
                you! Choose your perfect companion and let our love story begin.
                Every choice you make will shape our relationship and my
                feelings towards you.
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
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-lg btn-anime"
          >
            <Play className="w-6 h-6 inline mr-2" />
            Choose Your Waifu
          </button>

          <button
            onClick={handleSettings}
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
          onClick={() => dispatch({ type: "SET_SHOW_ADMIN_PANEL", show: true })}
          className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
          title="Admin Panel"
        >
          <Shield className="w-6 h-6" />
        </button>
      </div>

      {/* Admin Panel */}
      <AdminPanel
        isOpen={state.showAdminPanel}
        onClose={() => dispatch({ type: "SET_SHOW_ADMIN_PANEL", show: false })}
        gameData={{
          gameState: state.gameState,
          selectedWaifu: state.selectedWaifu,
          mood: state.mood,
          affection: state.affection,
          conversationCount: state.conversationCount,
          achievements: state.achievements,
          unlockedOutfits: state.unlockedOutfits,
          currentOutfit: state.currentOutfit,
          screenshots: state.screenshots,
          gifts: state.gifts,
          currentDate: state.currentDate,
          storyProgress: state.storyProgress,
          unlockedEndings: state.unlockedEndings,
        }}
        onUpdateGameData={handleUpdateGameData}
        waifuTypes={waifuTypes}
        achievementList={achievementList}
        giftList={giftList}
        outfitList={outfitList}
      />
    </div>
  );
};

export default StartScreen;
