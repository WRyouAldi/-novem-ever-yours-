import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Dialog } from "@base-ui/react/dialog";
import "./site.css";

const photos = Array.from({ length: 21 }, (_, i) => ({
  src: `assets/photos/gallery/photo-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `Kenangan kita nomor ${i + 1}`,
  number: String(i + 1).padStart(2, "0")
}));
const videos = Array.from({ length: 12 }, (_, i) => ({
  src: `assets/videos/clips/clip-${String(i + 1).padStart(2, "0")}.mp4`,
  poster: `assets/videos/posters/clip-${String(i + 1).padStart(2, "0")}.webp`,
  number: String(i + 1).padStart(2, "0")
}));
const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, className = "", delay = 0, ...props }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: reduce ? 0 : 0.78, delay, ease }} {...props}>{children}</motion.div>;
}

function Brand({ light = false }) {
  return <a className={`brand ${light ? "brand-light" : ""}`} href="#home" aria-label="Novem-ever Yours, kembali ke atas"><span className="brand-heart">♡</span><span>Novem-ever Yours</span></a>;
}

function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return <Reveal className={`section-heading ${light ? "heading-light" : ""}`}>
    <div className="heading-rule"><span>{eyebrow}</span></div>
    <h2>{title}</h2>
    <p>{subtitle}</p>
  </Reveal>;
}

function PhotoGallery() {
  const [active, setActive] = useState(null);
  const close = () => setActive(null);
  useEffect(() => {
    const onKey = (event) => { if (event.key === "ArrowRight" && active !== null) setActive((active + 1) % photos.length); if (event.key === "ArrowLeft" && active !== null) setActive((active + photos.length - 1) % photos.length); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
  return <>
    <div className="photo-grid">
      {photos.slice(0, showAll ? photos.length : 6).map((photo, i) => <motion.button key={photo.src} type="button" className={`photo-tile photo-tile-${i % 7}`} onClick={() => setActive(i)} aria-label={`Buka foto ${photo.number}`} whileHover={{ y: -5 }} whileTap={{ scale: .985 }}>
        <img src={photo.src} alt={photo.alt} loading={i < 3 ? "eager" : "lazy"} decoding="async" />
        <span className="photo-index">{photo.number}</span>
        <span className="photo-open">↗</span>
      </motion.button>)}
    </div>
    <Dialog.Root open={active !== null} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="lightbox-backdrop" />
        <Dialog.Popup className="lightbox-panel">
          <div className="lightbox-top"><Dialog.Title className="lightbox-title">A little piece of us</Dialog.Title><Dialog.Close className="lightbox-close" aria-label="Tutup foto">×</Dialog.Close></div>
          {active !== null && <img className="lightbox-image" src={photos[active].src} alt={photos[active].alt} />}
          <div className="lightbox-bottom">
            <button type="button" onClick={() => setActive((active + photos.length - 1) % photos.length)} aria-label="Foto sebelumnya">←</button>
            <span>{active === null ? "" : `${String(active + 1).padStart(2, "0")} / ${photos.length}`}</span>
            <button type="button" onClick={() => setActive((active + 1) % photos.length)} aria-label="Foto berikutnya">→</button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}

function VideoGallery() {
  return <div className="video-grid">
    {videos.map((video, i) => <Reveal className="video-card" key={video.src} delay={(i % 3) * .06}>
      <div className="video-frame"><video controls playsInline preload="none" poster={video.poster} aria-label={`Video kenangan ${video.number}`}><source src={video.src} type="video/mp4" />Browser kamu belum mendukung video.</video></div>
      <div className="video-caption"><span>MEMORY {video.number}</span><span>PLAY WHEN YOU MISS US ♡</span></div>
    </Reveal>)}
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const videos = [...document.querySelectorAll("video")];
    const pauseOthers = (event) => videos.forEach(video => { if (video !== event.target) video.pause(); });
    videos.forEach(video => video.addEventListener("play", pauseOthers));
    return () => videos.forEach(video => video.removeEventListener("play", pauseOthers));
  }, []);
  const navItems = [["Our Story", "#story"], ["Gallery", "#gallery"], ["Video", "#video"], ["Letter", "#letter"]];
  return <div className="site-shell">
    <header className="site-nav">
      <div className="nav-inner"><Brand />
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label="Buka navigasi" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Navigasi utama">
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-heart" href="#letter" aria-label="Surat cinta">♡</a>
        </nav>
      </div>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-image" aria-hidden="true"><img src="assets/photos/cover.webp" alt="" fetchPriority="high" /></div>
        <div className="hero-shade" />
        <div className="hero-petals" aria-hidden="true"><i>✿</i><i>✧</i><i>✿</i></div>
        <div className="hero-content">
          <motion.p className="hero-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>FROM HAPPY 27 TO</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .12, ease }}>Our 1st<br/>Anniversary,<br/><em>sayangg.</em></motion.h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9, delay: .55 }}>Novem-ever yours, with love<br className="desktop-break"/> in every season. <span>♥</span></motion.p>
          <motion.a className="pill-button hero-button" href="#letter" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }}>✉ <span>Open Our Letter</span> <b>→</b></motion.a>
        </div>
        <a className="scroll-cue" href="#story"><span className="scroll-mouse">↓</span><small>SCROLL TO OUR STORY</small></a>
        <div className="hero-bottom-wave" />
      </section>

      <section className="journey section-paper" id="story">
        <div className="content-wrap">
          <SectionHeading eyebrow="A BEAUTIFUL STORY, FROM 27 TO FOREVER" title="Our Journey" subtitle="A beautiful story of us, from 27 to forever." />
          <div className="timeline">
            {[["♡","27","Happy"],["♡","Together","Always"],["♡","1st","Anniversary"],["♡","Forever","Yours"]].map(([symbol, top, bottom], i) => <Reveal className="timeline-item" key={top} delay={i * .1}><span className="timeline-heart">{symbol}</span><span className="timeline-dot"/><strong>{top}</strong><small>{bottom}</small></Reveal>)}
          </div>
        </div>
      </section>

      <section className="gallery-section section-paper" id="gallery">
        <div className="content-wrap">
          <SectionHeading eyebrow="MOMENTS THAT MAKE OUR STORY SPECIAL" title="Our Gallery" subtitle="Little moments, endless memories. Every picture holds a piece of my heart." />
          <PhotoGallery />
          <div className="gallery-more"><button className="pill-button" type="button" onClick={() => setShowAll(!showAll)}>{showAll ? "Showing all 21 photos" : "▦  View More Photos"} <b>→</b></button></div>
        </div>
      </section>

      <section className="video-section section-paper" id="video">
        <div className="content-wrap">
          <SectionHeading eyebrow="RELIVE OUR MOMENTS, ONE BY ONE" title="Our Video" subtitle="A few seconds of us, kept close forever. Press play whenever you miss these days." />
          <VideoGallery />
        </div>
      </section>

      <section className="letter-section" id="letter">
        <div className="letter-stars" aria-hidden="true">✧　·　✦　　·　✧　·　✦</div>
        <div className="letter-inner content-wrap">
          <div className="letter-copy">
            <span className="letter-eyebrow">A LETTER FROM MY HEART</span>
            <h2>Dear Sayang<span>...</span></h2>
            <p>Terima kasih sudah menjadi bagian dari setiap cerita, setiap tawa, dan setiap langkahku.</p>
            <p>Semoga kita selalu, hari ini, esok, dan selamanya. Semoga setiap musim yang datang selalu menemukan kita saling menggenggam, saling memahami, dan tetap memilih satu sama lain.</p>
            <p className="letter-love">Love you more and more and more...</p>
            <a className="pill-button letter-button" href="#forever">♡ <span>Read Our Letter</span> <b>→</b></a>
          </div>
          <div className="letter-photo"><img src="assets/photos/gallery/photo-21.webp" alt="Salah satu kenangan favorit kita" loading="lazy"/><span className="photo-tape" /></div>
          <span className="letter-doodle">♡</span>
        </div>
      </section>

      <section className="closing-section" id="forever">
        <div className="closing-inner"><span className="closing-heart">♡</span><p>Novem-ever Yours</p><h2>Forever & Always</h2><span className="closing-line">TWO HEARTS. ONE BEAUTIFUL JOURNEY.</span></div>
      </section>
    </main>
    <footer className="site-footer"><Brand light/><span>Forever & Always ♡</span><span className="footer-note">MADE WITH ALL MY LOVE</span></footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
