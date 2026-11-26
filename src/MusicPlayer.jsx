import React, { useEffect, useRef } from "react";

const SONG_SRC = `${import.meta.env.BASE_URL}assets/audio/our-song.mp3`;

export default function MusicPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let active = true;
    let playing = false;

    const tryPlayback = () => {
      if (!active || playing || !audio.paused) return;

      audio.play()
        .then(() => {
          if (active) {
            playing = true;
            cleanupGestureListeners();
          }
        })
        .catch(() => {
          // Audible autoplay may be blocked until the visitor interacts with the page.
          // Keep listening so playback can begin after the first permitted gesture.
        });
    };

    const events = ["pointerdown", "touchstart", "keydown"];
    const cleanupGestureListeners = () => {
      events.forEach((eventName) => {
        document.removeEventListener(eventName, tryPlayback, true);
      });
    };

    events.forEach((eventName) => {
      document.addEventListener(eventName, tryPlayback, { capture: true, passive: true });
    });

    tryPlayback();

    return () => {
      active = false;
      cleanupGestureListeners();
      audio.pause();
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={SONG_SRC}
      autoPlay
      preload="auto"
      loop
      playsInline
      aria-hidden="true"
    />
  );
}
