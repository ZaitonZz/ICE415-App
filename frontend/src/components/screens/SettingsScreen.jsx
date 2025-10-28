import { useGame, useGameDispatch } from "../../state/GameContext";
import {
  playSound,
  playBackgroundMusic,
  stopBackgroundMusic,
} from "../../services/audio";
import { musicTracks } from "../../data/musicTracks";

const SettingsScreen = () => {
  const state = useGame();
  const dispatch = useGameDispatch();

  const { soundEnabled, musicEnabled, selectedMusicTrack } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Settings ⚙️</h1>
          <button
            onClick={() => {
              dispatch({ type: "SET_SHOW_SETTINGS", show: false });
              playSound("click");
            }}
            className="text-purple-300 hover:text-white underline"
          >
            ← Back to Menu
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="space-y-6">
            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white text-lg">Sound Effects</span>
              <button
                onClick={() => {
                  dispatch({
                    type: "SET_SOUND_ENABLED",
                    enabled: !soundEnabled,
                  });
                  playSound("click");
                }}
                className={`w-12 h-6 rounded-full transition-colors ${
                  soundEnabled ? "bg-pink-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    soundEnabled ? "translate-x-6" : "translate-x-0.5"
                  }`}
                ></div>
              </button>
            </div>

            {/* Background Music Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white text-lg">Background Music</span>
              <button
                onClick={() => {
                  const newMusicEnabled = !musicEnabled;
                  dispatch({
                    type: "SET_MUSIC_ENABLED",
                    enabled: newMusicEnabled,
                  });
                  if (newMusicEnabled) {
                    playBackgroundMusic(selectedMusicTrack);
                  } else {
                    stopBackgroundMusic();
                  }
                }}
                className={`w-12 h-6 rounded-full transition-colors ${
                  musicEnabled ? "bg-pink-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    musicEnabled ? "translate-x-6" : "translate-x-0.5"
                  }`}
                ></div>
              </button>
            </div>

            {/* Music Track Selection */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Music Track</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {musicTracks.map((track, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      dispatch({
                        type: "SET_SELECTED_MUSIC_TRACK",
                        track: index,
                      });
                      if (musicEnabled) {
                        playBackgroundMusic(index);
                      }
                      playSound("click");
                    }}
                    className={`p-3 rounded-lg text-left transition-all duration-300 ${
                      selectedMusicTrack === index
                        ? "bg-pink-500/30 border-2 border-pink-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="text-white font-semibold text-sm">
                      {track.name}
                    </div>
                    <div className="text-purple-200 text-xs mt-1">
                      {track.description}
                    </div>
                    <div className="text-purple-300 text-xs mt-1">
                      Mood: {track.mood}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
