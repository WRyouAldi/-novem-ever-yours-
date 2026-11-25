import { useEffect, useRef } from "react";

const SONG_SRC = `${import.meta.env.BASE_URL}assets/audio/our-song.mp3`;

export default function MusicPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let disposed = false;
    const tryPlay = () => {
      if (disposed || !audio.paused) return;
      const playback = audio.play();
      if (playback?.catch) playback.catch(() => {
        // Browsers may block audible autoplay until the visitor interacts.
        // The first normal page interaction below retries without showing a controller.
      });
    };

    tryPlay();
    const interactionEvents = ["pointerdown", "touchstart", "keydown"];
    interactionEvents.forEach((eventName) => {
      document.addEventListener(eventName, tryPlay, { once: true, capture: true });
    });

    return () => {
      disposed = true;
      interactionEvents.forEach((eventName) => {
        document.removeEventListener(eventName, tryPlay, true);
      });
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
