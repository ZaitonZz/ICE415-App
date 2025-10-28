import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { achievementList } from "../../data/achievements";

let notificationRoot = null;
let notificationCallback = null;

export const showAchievementNotification = (achievementId) => {
  if (notificationCallback) {
    notificationCallback(achievementId);
  }
};

const NotificationPortal = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Create portal root
    if (!notificationRoot) {
      notificationRoot = document.createElement("div");
      notificationRoot.id = "notification-root";
      document.body.appendChild(notificationRoot);
    }

    // Set callback
    notificationCallback = (achievementId) => {
      const achievement = achievementList.find((a) => a.id === achievementId);
      if (achievement) {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, achievement }]);
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
      }
    };

    return () => {
      notificationCallback = null;
    };
  }, []);

  if (!notificationRoot || notifications.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(({ id, achievement }) => (
        <div
          key={id}
          className="bg-green-500 text-white p-4 rounded-lg shadow-lg animate-bounce"
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{achievement.icon}</span>
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-sm">{achievement.name}</div>
            </div>
          </div>
        </div>
      ))}
    </div>,
    notificationRoot
  );
};

export default NotificationPortal;
