import { useGame, useGameDispatch } from "../../state/GameContext";
import {
  Heart,
  MessageCircle,
  Settings,
  Shield,
  Zap,
  Skull,
} from "lucide-react";
import { playSound, playMoodSound } from "../../services/audio";
import { getMoodImage } from "../../services/waifuPics";
import { getMoodColor, getMoodIconType } from "../../state/selectors";
import { waifuTypes } from "../../data/waifuTypes";
import { conversations } from "../../data/conversations";
import AdminPanel from "../../AdminPanel";

const PlayingScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const {
    selectedWaifu,
    mood,
    affection,
    currentImage,
    dialogue,
    choices,
    conversationHistory,
    conversationCount,
    loading,
    showAdminPanel,
  } = state;

  // Get mood icon component
  const getMoodIcon = () => {
    const iconType = getMoodIconType(mood);
    const iconProps = { className: "w-5 h-5" };

    switch (iconType) {
      case "heart":
        return <Heart {...iconProps} />;
      case "message":
        return <MessageCircle {...iconProps} />;
      case "zap":
        return <Zap {...iconProps} />;
      case "skull":
        return <Skull {...iconProps} />;
      default:
        return <MessageCircle {...iconProps} />;
    }
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
    dispatch({ type: "ADD_HISTORY", entry: newEntry });

    // Update dialogue
    dispatch({ type: "SET_DIALOGUE", dialogue: choice.response });

    // Update affection
    if (choice.effect === "affection") {
      dispatch({
        type: "SET_AFFECTION",
        affection: Math.min(100, affection + choice.value),
      });
    } else if (choice.effect === "anger") {
      dispatch({
        type: "SET_AFFECTION",
        affection: Math.max(0, affection + choice.value),
      });
    }

    // Update conversation count
    const newCount = conversationCount + 1;
    dispatch({ type: "SET_CONVERSATION_COUNT", count: newCount });

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

      dispatch({ type: "SET_MOOD", mood: endingMood });
      dispatch({ type: "SET_DIALOGUE", dialogue: endingDialogue });

      // Load ending image
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const imageUrl = await getMoodImage(endingMood);
        dispatch({ type: "SET_IMAGE", image: imageUrl });
      } catch (error) {
        console.error("Error loading ending image:", error);
      }
      dispatch({ type: "SET_LOADING", loading: false });

      dispatch({ type: "SET_GAME_STATE", gameState: "ended" });
      return;
    }

    // Determine new mood based on choice, current state, and affection level
    let newMood = mood;
    const newAffection = affection + (choice.value || 0);

    // More nuanced mood determination
    if (choice.effect === "affection") {
      if (newAffection > 80) {
        newMood = "loving";
      } else if (newAffection > 60) {
        newMood = "happy";
      } else if (newAffection > 40) {
        newMood = "excited";
      } else {
        newMood = "shy";
      }
    } else if (choice.effect === "anger") {
      if (newAffection < 20) {
        newMood = "angry";
      } else if (newAffection < 40) {
        newMood = "jealous";
      } else {
        newMood = "worried";
      }
    } else if (choice.effect === "neutral") {
      if (newAffection > 50) {
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
      dispatch({
        type: "SET_DIALOGUE",
        dialogue:
          "W-what?! You're talking about another girl?! I... I won't let you leave me for anyone else! You're MINE! 💢",
      });
    }

    if (choice.text.includes("goodbye") || choice.text.includes("leave")) {
      if (newAffection > 60) {
        newMood = "yandere";
        dispatch({
          type: "SET_DIALOGUE",
          dialogue:
            "No! You can't leave me! I won't let you go! You belong to me now! 🔪",
        });
      } else {
        newMood = "sad";
        dispatch({
          type: "SET_DIALOGUE",
          dialogue:
            "Oh... I see. I thought we had something special... *disappears*",
        });
      }
    }

    dispatch({ type: "SET_MOOD", mood: newMood });

    // Load new mood image
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const imageUrl = await getMoodImage(newMood);
      dispatch({ type: "SET_IMAGE", image: imageUrl });
    } catch (error) {
      console.error("Error loading mood image:", error);
    }
    dispatch({ type: "SET_LOADING", loading: false });

    // Play mood-specific sound effect
    playMoodSound(newMood);

    // Get next conversation
    if (selectedWaifu && conversations[selectedWaifu]) {
      const nextConversation = conversations[selectedWaifu][newCount];
      if (nextConversation) {
        dispatch({ type: "SET_DIALOGUE", dialogue: nextConversation.question });
        dispatch({ type: "SET_CHOICES", choices: nextConversation.choices });
      }
    }
  };

  // Take screenshot
  const takeScreenshot = () => {
    const screenshot = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      waifu: selectedWaifu,
      mood: mood,
      affection: affection,
      image: currentImage,
    };
    dispatch({ type: "ADD_SCREENSHOT", screenshot });
    playSound("click");

    // Show notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-purple-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce";
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-2xl">📸</span>
        <div>
          <div class="font-bold">Screenshot Saved!</div>
          <div class="text-sm">Added to your collection</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-8">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg glass border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
                onClick={() => {
                  dispatch({ type: "SET_GAME_STATE", gameState: "dateSelect" });
                  playSound("click");
                }}
                className="text-purple-300 hover:text-white transition-colors"
                title="Go on a Date"
              >
                <span className="text-xl">💑</span>
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: "SET_GAME_STATE",
                    gameState: "minigameSelect",
                  });
                  playSound("click");
                }}
                className="text-purple-300 hover:text-white transition-colors"
                title="Play Mini-Game"
              >
                <span className="text-xl">🎮</span>
              </button>
              <button
                onClick={() => {
                  dispatch({ type: "SET_GAME_STATE", gameState: "giftSelect" });
                  playSound("click");
                }}
                className="text-purple-300 hover:text-white transition-colors"
                title="Give Gift"
              >
                <span className="text-xl">🎁</span>
              </button>
              <button
                onClick={() => {
                  dispatch({ type: "SET_SHOW_SETTINGS", show: true });
                  playSound("click");
                }}
                className="text-purple-300 hover:text-white transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
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
                className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${getMoodColor(
                  mood
                )} px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg`}
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
                  className={`h-3 rounded-full bg-gradient-to-r ${getMoodColor(
                    mood
                  )} transition-all duration-500`}
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
          onClick={() => {
            dispatch({ type: "SET_SHOW_ADMIN_PANEL", show: true });
            playSound("click");
          }}
          className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
          title="Admin Panel"
        >
          <Shield className="w-6 h-6" />
        </button>
      </div>

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => dispatch({ type: "SET_SHOW_ADMIN_PANEL", show: false })}
        gameData={{
          gameState: state.gameState,
          selectedWaifu,
          mood,
          affection,
          conversationCount,
          achievements: state.achievements,
          unlockedOutfits: state.unlockedOutfits,
          currentOutfit: state.currentOutfit,
          screenshots: state.screenshots,
          gifts: state.gifts,
          currentDate: state.currentDate,
          storyProgress: state.storyProgress,
          unlockedEndings: state.unlockedEndings,
          waifuTypes,
        }}
        onUpdateGameData={(updates) => {
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
            // Add more as needed
          });
        }}
      />
    </div>
  );
};

export default PlayingScreen;
