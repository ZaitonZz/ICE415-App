import React from "react";
import AppRoot from "./components/AppRoot";
import NotificationPortal from "./components/ui/NotificationPortal";

const YandereAIGame = () => {
  console.log("YandereAIGame component rendering");

  return (
    <>
      <AppRoot />
      <NotificationPortal />
    </>
  );
};

export default YandereAIGame;
