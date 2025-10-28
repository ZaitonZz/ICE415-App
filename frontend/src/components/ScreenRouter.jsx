import React from "react";
import { useGame } from "../state/GameContext";
import StartScreen from "./screens/StartScreen";
import SettingsScreen from "./screens/SettingsScreen";
import WaifuSelectScreen from "./screens/WaifuSelectScreen";
import PlayingScreen from "./screens/PlayingScreen";
import EndScreen from "./screens/EndScreen";
import DateScreen from "./screens/DateScreen";
import DateSelectScreen from "./screens/DateSelectScreen";
import MinigameScreen from "./screens/MinigameScreen";
import MinigameSelectScreen from "./screens/MinigameSelectScreen";
import GiftSelectScreen from "./screens/GiftSelectScreen";

const ScreenRouter = () => {
  const { gameState, showSettings } = useGame();

  console.log(
    "ScreenRouter rendering with gameState:",
    gameState,
    "showSettings:",
    showSettings
  );

  // Settings screen has priority
  if (showSettings) {
    return <SettingsScreen />;
  }

  // Route based on gameState
  switch (gameState) {
    case "start":
      return <StartScreen />;
    case "waifuSelect":
      return <WaifuSelectScreen />;
    case "playing":
      return <PlayingScreen />;
    case "ended":
      return <EndScreen />;
    case "date":
      return <DateScreen />;
    case "dateSelect":
      return <DateSelectScreen />;
    case "minigame":
      return <MinigameScreen />;
    case "minigameSelect":
      return <MinigameSelectScreen />;
    case "giftSelect":
      return <GiftSelectScreen />;
    default:
      console.warn("Unknown gameState:", gameState);
      return <StartScreen />;
  }
};

export default ScreenRouter;
