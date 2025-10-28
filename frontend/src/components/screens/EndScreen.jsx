import { useGame, useGameDispatch } from "../../state/GameContext";
import { playSound } from "../../services/audio";
import { waifuTypes } from "../../data/waifuTypes";

const EndScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const {
    mood,
    affection,
    dialogue,
    currentImage,
    selectedWaifu,
    conversationCount,
  } = state;

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

  const getMoodDescription = () => {
    switch (mood) {
      case "happy":
      case "loving":
        return `*${currentWaifu?.name || "Your waifu"} giggles happily* 💕`;
      case "sad":
      case "disappointed":
        return `*${currentWaifu?.name || "Your waifu"} sniffles softly* 😢`;
      case "angry":
      case "jealous":
        return `*${currentWaifu?.name || "Your waifu"} huffs angrily* 😠`;
      case "yandere":
        return `*${currentWaifu?.name || "Your waifu"} laughs maniacally* 😈`;
      case "shy":
      case "worried":
        return `*${currentWaifu?.name || "Your waifu"} giggles shyly* 😊`;
      case "excited":
        return `*${currentWaifu?.name || "Your waifu"} squeals excitedly* ⭐`;
      case "playful":
        return `*${currentWaifu?.name || "Your waifu"} laughs playfully* 😄`;
      default:
        return `*${currentWaifu?.name || "Your waifu"} sighs softly* 😌`;
    }
  };

  const handleRestart = () => {
    // Reset game state
    dispatch({ type: "RESET_GAME" });
    playSound("click");
  };

  const handleNewWaifu = () => {
    // Go to waifu selection
    dispatch({ type: "SET_GAME_STATE", gameState: "waifuSelect" });
    playSound("click");
  };

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
            <p
              className={`text-sm italic ${
                mood === "happy" || mood === "loving"
                  ? "text-pink-300"
                  : mood === "sad" || mood === "disappointed"
                  ? "text-blue-300"
                  : mood === "angry" || mood === "jealous"
                  ? "text-red-300"
                  : mood === "yandere"
                  ? "text-red-400"
                  : mood === "shy" || mood === "worried"
                  ? "text-purple-300"
                  : mood === "excited"
                  ? "text-yellow-300"
                  : mood === "playful"
                  ? "text-green-300"
                  : "text-gray-300"
              }`}
            >
              {getMoodDescription()}
            </p>
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
            <h3 className="text-white font-semibold mb-2">Final Mood</h3>
            <p className="text-purple-200 capitalize">
              {mood.replace(/([A-Z])/g, " $1")}
            </p>
            <p className="text-purple-200">
              Personality: {currentWaifu?.personality}
            </p>
            <p className="text-purple-200 text-sm mt-2">
              {currentWaifu?.description}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleRestart}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            🔄 Try Again with {currentWaifu?.name}
          </button>
          <button
            onClick={handleNewWaifu}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            💕 Meet Another Waifu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
