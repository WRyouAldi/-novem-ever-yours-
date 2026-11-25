import React, { useState } from "react";

const VIDEO_ID = "8ftyCahxqNI";

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`music-widget ${open ? "music-widget-open" : ""}`} aria-label="Our song">
      {open ? (
        <div className="music-panel">
          <div className="music-panel-heading">
            <div>
              <span className="music-eyebrow">A LITTLE MUSIC FOR US</span>
              <p>Our song <span aria-hidden="true">♡</span></p>
            </div>
            <button className="music-close" type="button" onClick={() => setOpen(false)} aria-label="Tutup pemutar musik">×</button>
          </div>
          <div className="music-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&playsinline=1&rel=0`}
              title="Our song — YouTube player"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="music-panel-footer">
            <span>PLAYING FROM YOUTUBE</span>
            <span>WITH LOVE, ALWAYS ♡</span>
          </div>
        </div>
      ) : (
        <button className="music-launcher" type="button" onClick={() => setOpen(true)} aria-label="Putar lagu kita">
          <span className="music-launcher-icon" aria-hidden="true">♫</span>
          <span><small>OUR LITTLE SOUNDTRACK</small><strong>Play our song</strong></span>
          <span className="music-launcher-heart" aria-hidden="true">♡</span>
        </button>
      )}
    </aside>
  );
}
