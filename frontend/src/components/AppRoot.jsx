import React from "react";
import { GameProvider } from "../state/GameContext";
import ScreenRouter from "./ScreenRouter";

const AppRoot = () => {
  return (
    <GameProvider>
      <ScreenRouter />
    </GameProvider>
  );
};

export default AppRoot;
