export const getMoodColor = (mood) => {
  switch (mood) {
    case "happy":
      return "from-pink-400 to-red-500";
    case "sad":
      return "from-blue-400 to-purple-500";
    case "angry":
      return "from-red-500 to-orange-500";
    case "yandere":
      return "from-red-600 to-pink-600";
    case "shy":
      return "from-pink-300 to-purple-400";
    case "excited":
      return "from-yellow-400 to-orange-500";
    case "worried":
      return "from-blue-500 to-indigo-500";
    case "jealous":
      return "from-red-400 to-pink-500";
    case "loving":
      return "from-pink-500 to-red-400";
    case "disappointed":
      return "from-gray-400 to-blue-500";
    case "playful":
      return "from-green-400 to-cyan-500";
    default:
      return "from-purple-400 to-pink-500";
  }
};

export const getMoodIconType = (mood) => {
  switch (mood) {
    case "happy":
    case "loving":
    case "shy":
      return "heart";
    case "sad":
    case "disappointed":
      return "message";
    case "angry":
    case "jealous":
      return "zap";
    case "yandere":
      return "skull";
    default:
      return "message";
  }
};
