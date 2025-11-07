import React, { createContext, useContext, useReducer, useEffect } from "react";
import { gameReducer } from "./gameReducer";
import { initialState } from "./initialState";

const GameContext = createContext();
const GameDispatchContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Debug logging
  useEffect(() => {
    console.log("Game state changed to:", state.gameState);
  }, [state.gameState]);

  return (
    <GameContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const useGameDispatch = () => {
  const context = useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error("useGameDispatch must be used within a GameProvider");
  }
  return context;
};
