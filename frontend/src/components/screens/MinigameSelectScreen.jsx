import { useGame, useGameDispatch } from "../../state/GameContext";
import { playSound } from "../../services/audio";
import { waifuTypes } from "../../data/waifuTypes";
import { miniGames } from "../../data/miniGames";

const MinigameSelectScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const { selectedWaifu } = state;
  const currentWaifu = selectedWaifu ? waifuTypes[selectedWaifu] : null;

  const handleGameSelect = (game) => {
    dispatch({ type: "SET_MINIGAME", minigame: game.id });
    dispatch({ type: "SET_GAME_STATE", gameState: "minigame" });
    playSound("click");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose a Mini-Game 🎮
          </h1>
          <p className="text-purple-200">
            Play a fun game with {currentWaifu?.name || "your waifu"} to
            increase affection!
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

        <div className="grid md:grid-cols-3 gap-6">
          {miniGames.map((game, index) => (
            <button
              key={index}
              onClick={() => handleGameSelect(game)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-purple-400"
            >
              <div className="text-center mb-4">
                <span className="text-6xl">{game.icon}</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-2 text-center">
                {game.name}
              </h3>
              <p className="text-purple-200 text-sm mb-4 text-center">
                {game.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`px-2 py-1 rounded ${
                    game.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-300"
                      : game.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {game.difficulty}
                </span>
                <span className="text-pink-300">Max: +{game.maxAffection}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinigameSelectScreen;
