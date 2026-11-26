import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useAnimationControls, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Dialog } from "@base-ui/react/dialog";
import "./site.css";
import MusicPlayer from "./MusicPlayer.jsx";
import SecretAnniversarySurprise from "./SecretAnniversarySurprise.jsx";

const photos = Array.from({ length: 21 }, (_, i) => ({
  src: `assets/photos/gallery/photo-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `Kenangan kita nomor ${i + 1}`,
  number: String(i + 1).padStart(2, "0")
}));
const videoIds = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
const videos = videoIds.map((id, index) => ({
  src: `assets/videos/clips/clip-${String(id).padStart(2, "0")}.mp4`,
  poster: `assets/videos/posters/clip-${String(id).padStart(2, "0")}.webp`,
  number: String(index + 1).padStart(2, "0")
}));
const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, className = "", delay = 0, once = true, ...props }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: 0.16 });
  const controls = useAnimationControls();
  useEffect(() => {
    if (reduce) controls.set({ opacity: 1, y: 0 });
    else if (inView) controls.start({ opacity: 1, y: 0, transition: { duration: 0.78, delay, ease } });
    else if (!once) controls.set({ opacity: 0, y: 28 });
  }, [controls, delay, inView, once, reduce]);
  return <motion.div ref={ref} className={className} initial={reduce ? false : { opacity: 0, y: 28 }} animate={controls} {...props}>{children}</motion.div>;
}

function JourneyTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.55 });
  const reduce = useReducedMotion();
  const progress = useAnimationControls();
  const runner = useAnimationControls();
  useEffect(() => {
    if (reduce) {
      progress.set({ scaleX: 1 });
      runner.set({ left: "8%", opacity: 0 });
    } else if (inView) {
      progress.start({ scaleX: 1, transition: { duration: 3.2, delay: 0.2, ease } });
      runner.start({ left: "92%", opacity: [0, 1, 1, 0], transition: { duration: 3.2, delay: 0.2, ease: "linear" } });
    } else {
      progress.set({ scaleX: 0 });
      runner.set({ left: "8%", opacity: 0 });
    }
  }, [inView, progress, reduce, runner]);
  return <div className="timeline" ref={ref}>
    <motion.span className="timeline-progress" aria-hidden="true" initial={{ scaleX: 0 }} animate={progress} />
    <motion.span className="timeline-runner" aria-hidden="true" initial={{ left: "8%", opacity: 0 }} animate={runner} />
    {[["♡","27","Happy"],["♡","Together","Always"],["♡","1st","Anniversary"],["♡","Forever","Yours"]].map(([symbol, top, bottom], i) => <Reveal className="timeline-item" key={top} delay={i * .12} once={false}><span className="timeline-heart">{symbol}</span><span className="timeline-dot"/><strong>{top}</strong><small>{bottom}</small></Reveal>)}
  </div>;
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

function PhotoGallery({ showAll }) {
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
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroParallaxY = useTransform(heroScrollProgress, [0, 1], [0, reduceMotion ? 0 : 28]);
  const petalsParallaxY = useTransform(heroScrollProgress, [0, 1], [0, reduceMotion ? 0 : -12]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
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
      <section className="hero" id="home" ref={heroRef}>
        <motion.div className="hero-image" aria-hidden="true" style={{ y: heroParallaxY, scale: reduceMotion ? 1 : 1.06 }}><img src="assets/photos/cover-fhd.jpg" alt="" fetchPriority="high" /></motion.div>
        <div className="hero-shade" />
        <motion.div className="hero-petals" aria-hidden="true" style={{ y: petalsParallaxY }}><i>✿</i><i>✧</i><i>✿</i></motion.div>
        <div className="hero-content">
          <motion.p className="hero-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>FROM HAPPY 27 TO</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .12, ease }}>Our 1st<br/>Anniversary,<br/><em>sayangg.</em></motion.h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9, delay: .55 }}>Novem-ever yours, with love<br className="desktop-break"/> in every season. <span>♥</span></motion.p>
          <motion.a className="pill-button hero-button" href="#letter" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }}>✉ <span>Open Our Letter</span> <b>→</b></motion.a>
        </div>
        <a className="scroll-cue" href="#story"><span className="scroll-mouse">↓</span><small>SCROLL TO OUR STORY</small></a>
        <div className="hero-surprise-entry"><SecretAnniversarySurprise onReadLetter={() => setLetterOpen(true)} /></div>
        <div className="hero-bottom-wave" />
      </section>

      <section className="journey section-paper" id="story">
        <div className="content-wrap">
          <SectionHeading eyebrow="A BEAUTIFUL STORY, FROM 27 TO FOREVER" title="Our Journey" subtitle="A beautiful story of us, from 27 to forever." />
          <JourneyTimeline />
        </div>
      </section>

      <section className="gallery-section section-paper" id="gallery">
        <div className="content-wrap">
          <SectionHeading eyebrow="MOMENTS THAT MAKE OUR STORY SPECIAL" title="Our Gallery" subtitle="Little moments, endless memories. Every picture holds a piece of my heart." />
          <PhotoGallery showAll={showAll} />
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
            <button className="pill-button letter-button" type="button" onClick={() => setLetterOpen(true)} aria-haspopup="dialog">♡ <span>Read Our Letter</span> <b>→</b></button>
          </div>
          <div className="letter-photo"><img src="assets/photos/gallery/photo-21.webp" alt="Salah satu kenangan favorit kita" loading="lazy"/><span className="photo-tape" /></div>
          <span className="letter-doodle">♡</span>
        </div>
      </section>

      <Dialog.Root open={letterOpen} onOpenChange={setLetterOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="letter-dialog-backdrop" />
          <Dialog.Popup className="letter-dialog-panel" aria-describedby="full-letter-body">
            <div className="letter-dialog-top">
              <span className="letter-dialog-eyebrow">NOVEM-EVER YOURS · A LETTER FROM MY HEART</span>
              <Dialog.Close className="letter-dialog-close" aria-label="Tutup surat">×</Dialog.Close>
            </div>
            <div className="letter-dialog-content">
              <p className="letter-dialog-date">To my favorite person,</p>
              <Dialog.Title className="letter-dialog-title">Dear Sayang<span>...</span></Dialog.Title>
              <div id="full-letter-body">
                <p>From Happy 27 to our first anniversary, ternyata sudah sejauh ini cerita kita berjalan. Rasanya masih banyak hal kecil tentang kita yang ingin kusimpan baik-baik: tawa sederhana, obrolan tanpa rencana, momen-momen yang mungkin terlihat biasa, tapi selalu punya tempat istimewa di hatiku.</p>
                <p>Terima kasih sudah menjadi bagian dari setiap cerita, setiap tawa, dan setiap langkahku. Terima kasih untuk kehadiranmu, untuk semua cara sederhana yang membuat hari-hariku terasa lebih hangat, dan untuk setiap kesempatan agar kita terus belajar memahami satu sama lain.</p>
                <p>Aku tidak berharap setiap hari akan selalu sempurna. Akan ada musim yang cerah, juga hari-hari yang terasa lebih berat. Tapi semoga, dalam musim apa pun, kita tetap memilih untuk saling menggenggam, saling mendengarkan, saling menguatkan, dan tumbuh bersama.</p>
                <p>Semoga perjalanan kita selalu dipenuhi hal-hal baik, keberanian untuk melewati yang sulit, dan alasan-alasan kecil untuk jatuh cinta lagi. Hari ini, esok, dan di setiap musim yang akan datang, aku ingin tetap menemukan kita di sisi yang sama.</p>
                <p className="letter-dialog-signoff">Love you more and more and more, sayangg. <span>♡</span></p>
              </div>
            </div>
            <div className="letter-dialog-footer"><span>WITH LOVE, IN EVERY SEASON</span><Dialog.Close className="letter-dialog-done">Close this letter <b>♡</b></Dialog.Close></div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <section className="closing-section" id="forever">
        <div className="closing-inner"><span className="closing-heart">♡</span><p>Novem-ever Yours</p><h2>Forever & Always</h2><span className="closing-line">TWO HEARTS. ONE BEAUTIFUL JOURNEY.</span></div>
      </section>
    </main>
    <footer className="site-footer"><Brand light/><span>Forever & Always ♡</span><span className="footer-note">MADE WITH ALL MY LOVE</span></footer>
    <MusicPlayer />
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
