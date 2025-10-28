import { useGame, useGameDispatch } from "../../state/GameContext";
import { playSound } from "../../services/audio";
import { waifuTypes } from "../../data/waifuTypes";
import { gifts } from "../../data/gifts";

const GiftSelectScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const { selectedWaifu, affection } = state;
  const currentWaifu = selectedWaifu ? waifuTypes[selectedWaifu] : null;

  const handleGiftSelect = (gift) => {
    // Add affection based on gift
    const newAffection = Math.min(100, affection + gift.affection);
    dispatch({ type: "SET_AFFECTION", affection: newAffection });

    // Add gift to history
    dispatch({ type: "ADD_GIFT", gift: { ...gift, timestamp: Date.now() } });

    playSound("click");

    // Show notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-pink-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce";
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-2xl">${gift.icon}</span>
        <div>
          <div class="font-bold">${
            currentWaifu?.name || "Your waifu"
          } loved the ${gift.name}!</div>
          <div class="text-sm">+${gift.affection} affection</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
      // Return to playing screen
      dispatch({ type: "SET_GAME_STATE", gameState: "playing" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose a Gift for {currentWaifu?.name || "Your Waifu"} 🎁
          </h1>
          <p className="text-purple-200">
            Show your affection by giving a thoughtful gift!
          </p>
          <button
            onClick={() => {
              dispatch({ type: "SET_GAME_STATE", gameState: "playing" });
              playSound("click");
            }}
            className="mt-4 text-purple-300 hover:text-white underline"
          >
            ← Back to Conversation
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((gift, index) => (
            <button
              key={index}
              onClick={() => handleGiftSelect(gift)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-pink-400"
            >
              <div className="text-center mb-4">
                <span className="text-6xl">{gift.icon}</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-2 text-center">
                {gift.name}
              </h3>
              <p className="text-purple-200 text-sm mb-4 text-center">
                {gift.description}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-pink-300 font-semibold">
                  +{gift.affection} Affection
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftSelectScreen;
