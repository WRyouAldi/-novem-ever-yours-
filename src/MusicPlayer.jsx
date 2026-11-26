import React, { useEffect, useRef, useState } from "react";
import "./music-player.css";

const SONG_SRC = `${import.meta.env.BASE_URL}assets/audio/our-song.mp3`;

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let active = true;
    const tryAutoplay = () => {
      if (!active || !audio.paused) return;
      audio.play()
        .then(() => {
          if (active) {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          }
        })
        .catch(() => {
          if (active) {
            setIsPlaying(false);
            setAutoplayBlocked(true);
          }
        });
    };

    // Attempt immediately; browsers may require a visitor gesture for audible playback.
    tryAutoplay();
    const interactionEvents = ["pointerdown", "touchstart", "keydown"];
    interactionEvents.forEach((eventName) => {
      document.addEventListener(eventName, tryAutoplay, { once: true, capture: true });
    });

    return () => {
      active = false;
      interactionEvents.forEach((eventName) => {
        document.removeEventListener(eventName, tryAutoplay, true);
      });
      audio.pause();
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setAutoplayBlocked(false);
    } catch {
      setIsPlaying(false);
      setAutoplayBlocked(true);
    }
  }

  return (
    <aside className="music-widget" aria-label="Our song">
      <audio
        ref={audioRef}
        src={SONG_SRC}
        autoPlay
        preload="auto"
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setAutoplayBlocked(true);
        }}
      />
      <button
        className="music-launcher"
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause our song" : "Play our song"}
        aria-pressed={isPlaying}
      >
        <span className="music-launcher-icon" aria-hidden="true">{isPlaying ? "Ⅱ" : "♫"}</span>
        <span>
          <small>OUR LITTLE SOUNDTRACK</small>
          <strong>{isPlaying ? "Pause our song" : "Play our song"}</strong>
          {autoplayBlocked && !isPlaying ? <em className="music-hint">Tap once to start the music</em> : null}
        </span>
        <span className="music-launcher-heart" aria-hidden="true">♡</span>
      </button>
    </aside>
  );
}
