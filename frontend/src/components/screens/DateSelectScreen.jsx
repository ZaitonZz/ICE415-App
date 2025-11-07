import { useGame, useGameDispatch } from "../../state/GameContext";
import { playSound } from "../../services/audio";
import { waifuTypes } from "../../data/waifuTypes";
import { dateLocations } from "../../data/dateLocations";

const DateSelectScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const { selectedWaifu } = state;
  const currentWaifu = selectedWaifu ? waifuTypes[selectedWaifu] : null;

  const handleLocationSelect = (location) => {
    dispatch({ type: "SET_DATE_LOCATION", location: location.id });
    dispatch({ type: "SET_GAME_STATE", gameState: "date" });
    playSound("click");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose a Date Location 💑
          </h1>
          <p className="text-purple-200">
            Where would you like to take {currentWaifu?.name || "your waifu"} on
            a date?
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
          {dateLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-pink-400"
            >
              <div className="text-center mb-4">
                <span className="text-6xl">{location.icon}</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-2 text-center">
                {location.name}
              </h3>
              <p className="text-purple-200 text-sm text-center">
                {location.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateSelectScreen;
