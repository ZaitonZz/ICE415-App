import { useEffect, useRef } from "react";
import { useGame, useGameDispatch } from "../state/GameContext";
import { musicTracks } from "../data/musicTracks";

/**
 * Global music manager component
 * Handles background music lifecycle across the entire app
 * Place this at the root level (in AppRoot or similar)
 */
const MusicManager = () => {
  const { musicEnabled, selectedMusicTrack, currentMusicRef } = useGame();
  const dispatch = useGameDispatch();
  const audioRef = useRef(null);

  // Sync with context music ref
  useEffect(() => {
    if (currentMusicRef && !audioRef.current) {
      audioRef.current = currentMusicRef;
    }
  }, [currentMusicRef]);

  // Handle music enabled/disabled state changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (musicEnabled) {
      audioRef.current.play().catch((e) => {
        console.log("Music autoplay prevented:", e);
      });
    } else {
      audioRef.current.pause();
    }
  }, [musicEnabled]);

  // Handle track changes
  useEffect(() => {
    if (!musicEnabled) return;

    // Stop current music if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Start new track
    const track = musicTracks[selectedMusicTrack];
    if (!track) return;

    const audio = new Audio(track.url);
    audio.loop = true;
    audio.volume = 0.3;

    audio.play().catch((e) => {
      console.log("Music autoplay prevented:", e);
    });

    audioRef.current = audio;
    dispatch({ type: "SET_CURRENT_MUSIC_REF", payload: audio });

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [selectedMusicTrack, musicEnabled, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default MusicManager;
