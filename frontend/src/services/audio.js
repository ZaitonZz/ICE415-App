// Play simple sound effect
export const playSound = (type, soundEnabled) => {
  if (!soundEnabled) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === "click") {
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );
  } else if (type === "mood") {
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );
  }

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
};

// Play mood-specific sound effects
export const playMoodSound = (moodType, soundEnabled) => {
  if (!soundEnabled) return;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  switch (moodType) {
    case "happy":
    case "loving":
    case "excited":
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        1200,
        audioContext.currentTime + 0.2
      );
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.4
      );
      break;
    case "sad":
    case "disappointed":
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        200,
        audioContext.currentTime + 0.3
      );
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );
      break;
    case "angry":
    case "jealous":
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(
        1200,
        audioContext.currentTime + 0.1
      );
      oscillator.frequency.setValueAtTime(
        800,
        audioContext.currentTime + 0.2
      );
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );
      break;
    case "yandere":
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(
        800,
        audioContext.currentTime + 0.1
      );
      oscillator.frequency.setValueAtTime(
        200,
        audioContext.currentTime + 0.2
      );
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.4
      );
      break;
    case "shy":
    case "worried":
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        600,
        audioContext.currentTime + 0.2
      );
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );
      break;
    case "playful":
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(
        800,
        audioContext.currentTime + 0.1
      );
      oscillator.frequency.setValueAtTime(
        600,
        audioContext.currentTime + 0.2
      );
      oscillator.frequency.setValueAtTime(
        800,
        audioContext.currentTime + 0.3
      );
      gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.4
      );
      break;
    default:
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );
  }

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
};

// Play ending-specific sound effects
export const playEndingSound = (moodType, affectionLevel, soundEnabled) => {
  if (!soundEnabled) return;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  switch (moodType) {
    case "happy":
    case "loving":
      if (affectionLevel >= 90) {
        // Giggling sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          1000,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          1200,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.setValueAtTime(
          1000,
          audioContext.currentTime + 0.3
        );
        oscillator.frequency.setValueAtTime(
          1200,
          audioContext.currentTime + 0.4
        );
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.6
        );
      } else {
        // Happy sigh
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          400,
          audioContext.currentTime + 0.4
        );
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );
      }
      break;
    case "sad":
    case "disappointed":
      // Soft crying
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(
        250,
        audioContext.currentTime + 0.1
      );
      oscillator.frequency.setValueAtTime(
        300,
        audioContext.currentTime + 0.2
      );
      oscillator.frequency.setValueAtTime(
        250,
        audioContext.currentTime + 0.3
      );
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.6
      );
      break;
    case "yandere":
      // Maniacal laugh
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(
        600,
        audioContext.currentTime + 0.1
      );
      oscillator.frequency.setValueAtTime(
        800,
        audioContext.currentTime + 0.2
      );
      oscillator.frequency.setValueAtTime(
        600,
        audioContext.currentTime + 0.3
      );
      oscillator.frequency.setValueAtTime(
        400,
        audioContext.currentTime + 0.4
      );
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.7
      );
      break;
    default:
      // Neutral sigh
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.3
      );
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.4
      );
  }

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.8);
};

// Background music control
export const playBackgroundMusic = (trackUrl) => {
  const audio = new Audio(trackUrl);
  audio.loop = true;
  audio.volume = 0.3;
  audio.play().catch((e) => console.log("Music autoplay prevented:", e));
  return audio;
};

export const stopBackgroundMusic = (audioRef) => {
  if (audioRef) {
    audioRef.pause();
    audioRef.currentTime = 0;
  }
};
