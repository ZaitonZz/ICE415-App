import { useGame, useGameDispatch } from "../../state/GameContext";
import { useState } from "react";
import { playSound } from "../../services/audio";
import { waifuTypes } from "../../data/waifuTypes";
import {
  triviaQuestions,
  cookingRecipes,
  memoryCards,
} from "../../data/miniGames";

const MinigameScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const { selectedWaifu, minigame, affection } = state;
  const currentWaifu = selectedWaifu ? waifuTypes[selectedWaifu] : null;

  const [gameState, setGameState] = useState("playing");
  const [score, setScore] = useState(0);

  const handleFinishGame = () => {
    // Add bonus affection based on score
    const bonusAffection = Math.min(25, score);
    dispatch({
      type: "SET_AFFECTION",
      affection: Math.min(100, affection + bonusAffection),
    });

    playSound("click");

    // Show notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce";
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-2xl">🎉</span>
        <div>
          <div class="font-bold">Great job!</div>
          <div class="text-sm">+${bonusAffection} affection</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
      dispatch({ type: "SET_GAME_STATE", gameState: "playing" });
    }, 2000);
  };

  const renderTriviaGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const question = triviaQuestions[currentQuestion];

    const handleAnswer = (optionIndex) => {
      if (optionIndex === question.correct) {
        setScore((prev) => prev + question.affection);
        playSound("click");
      }

      if (currentQuestion < triviaQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setGameState("finished");
      }
    };

    if (gameState === "finished") {
      return (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
          <p className="text-purple-200 mb-8">You earned {score} points!</p>
          <button
            onClick={handleFinishGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full"
          >
            Finish 💕
          </button>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Question {currentQuestion + 1} of {triviaQuestions.length}
        </h2>
        <p className="text-xl text-purple-200 mb-6 text-center">
          {question.question}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCookingGame = () => {
    const [currentRecipe] = useState(0);
    const recipe = cookingRecipes[currentRecipe];

    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{recipe.name}</h2>
        <p className="text-purple-200 mb-6">Difficulty: {recipe.difficulty}</p>

        <div className="mb-6">
          <h3 className="text-xl text-white mb-2">Ingredients:</h3>
          <div className="flex justify-center gap-4">
            {recipe.ingredients.map((ing, i) => (
              <span key={i} className="text-4xl">
                {ing.emoji}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setScore(recipe.affection);
            setGameState("finished");
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full"
        >
          Cook! 👨‍🍳
        </button>

        {gameState === "finished" && (
          <div className="mt-8">
            <p className="text-white text-xl mb-4">{recipe.dialogue}</p>
            <button
              onClick={handleFinishGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-full"
            >
              Finish 💕
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderMemoryGame = () => {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Memory Match</h2>
        <p className="text-purple-200 mb-6">Match the cards!</p>
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
          {memoryCards.map((card, i) => (
            <div
              key={i}
              className="bg-white/10 h-20 rounded-lg flex items-center justify-center text-3xl cursor-pointer hover:bg-white/20"
            >
              {card.matched ? card.emoji : "❓"}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setScore(20);
            handleFinishGame();
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full"
        >
          Finish Game 💕
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Mini-Game with {currentWaifu?.name || "Your Waifu"} 🎮
          </h1>
          <button
            onClick={() => {
              dispatch({ type: "SET_GAME_STATE", gameState: "playing" });
              playSound("click");
            }}
            className="text-purple-300 hover:text-white underline"
          >
            ← Back to Conversation
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          {minigame === "trivia" && renderTriviaGame()}
          {minigame === "cooking" && renderCookingGame()}
          {minigame === "memory" && renderMemoryGame()}
          {!minigame && (
            <p className="text-white text-center">No game selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinigameScreen;
