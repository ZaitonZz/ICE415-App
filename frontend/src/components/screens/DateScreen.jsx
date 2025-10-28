import { useGame, useGameDispatch } from "../../state/GameContext";
import { playSound } from "../../services/audio";
import { waifuTypes } from "../../data/waifuTypes";
import {
  dateLocations,
  dateActivities,
  dateDialogues,
} from "../../data/dateLocations";
import { Heart } from "lucide-react";

const DateScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const { selectedWaifu, dateLocation, affection, currentImage } = state;
  const currentWaifu = selectedWaifu ? waifuTypes[selectedWaifu] : null;
  const location = dateLocations.find((loc) => loc.id === dateLocation);
  const activities = dateActivities[dateLocation] || [];
  const dialogues = dateDialogues[dateLocation] || [];

  const handleActivity = (activity) => {
    // Add affection
    const newAffection = Math.min(100, affection + activity.affection);
    dispatch({ type: "SET_AFFECTION", affection: newAffection });

    // Increment date count
    dispatch({ type: "INCREMENT_DATE_COUNT" });

    playSound("click");

    // Show notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-pink-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce";
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-2xl">💕</span>
        <div>
          <div class="font-bold">${activity.dialogue}</div>
          <div class="text-sm">+${activity.affection} affection</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleEndDate = () => {
    dispatch({ type: "SET_GAME_STATE", gameState: "playing" });
    playSound("click");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Date at {location?.name || "Unknown Location"}
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-white">Affection: {affection}%</span>
          </div>
          <p className="text-purple-200 text-lg mb-4">
            {dialogues[Math.floor(Math.random() * dialogues.length)]}
          </p>
        </div>

        {/* Waifu Image */}
        {currentImage && (
          <div className="flex justify-center mb-8">
            <img
              src={currentImage}
              alt={currentWaifu?.name || "Your waifu"}
              className="w-64 h-64 object-cover rounded-full shadow-2xl border-4 border-white/20"
            />
          </div>
        )}

        {/* Activities */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            What would you like to do?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {activities.map((activity, index) => (
              <button
                key={index}
                onClick={() => handleActivity(activity)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-pink-400"
              >
                <h3 className="text-white font-semibold mb-2">
                  {activity.name}
                </h3>
                <p className="text-purple-200 text-sm mb-2">
                  {activity.description}
                </p>
                <span className="text-pink-300 text-sm">
                  +{activity.affection} affection
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* End Date Button */}
        <div className="text-center">
          <button
            onClick={handleEndDate}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            End Date 💕
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateScreen;
