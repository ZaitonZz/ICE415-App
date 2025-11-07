import { useGame, useGameDispatch } from "../state/GameContext";

/**
 * Custom hook for managing background music
 * Works with MusicManager component for centralized music control
 */
export const useMusic = () => {
  const { musicEnabled, selectedMusicTrack, currentMusicRef } = useGame();
  const dispatch = useGameDispatch();

  const playMusic = (trackIndex = selectedMusicTrack) => {
    // Just update the track - MusicManager will handle the actual playback
    if (trackIndex !== selectedMusicTrack) {
      dispatch({ type: "SET_SELECTED_MUSIC_TRACK", track: trackIndex });
    }
    
    // Enable music if it's disabled
    if (!musicEnabled) {
      dispatch({ type: "SET_MUSIC_ENABLED", enabled: true });
    }
  };

  const stopMusic = () => {
    // Stop the music by pausing current ref
    if (currentMusicRef) {
      currentMusicRef.pause();
      currentMusicRef.currentTime = 0;
    }
    dispatch({ type: "SET_MUSIC_ENABLED", enabled: false });
  };

  const toggleMusic = () => {
    const newMusicEnabled = !musicEnabled;
    dispatch({ type: "SET_MUSIC_ENABLED", enabled: newMusicEnabled });
  };

  const changeTrack = (trackIndex) => {
    dispatch({ type: "SET_SELECTED_MUSIC_TRACK", track: trackIndex });
  };

  return {
    playMusic,
    stopMusic,
    toggleMusic,
    changeTrack,
    isPlaying: musicEnabled && currentMusicRef !== null,
  };
};
