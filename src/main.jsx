import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { animate, inView, stagger } from "motion";
import "./motion.css";

function MotionExperience() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    root.classList.add("motion-ready");
    const cleanups = [];
    const ease = [0.22, 1, 0.36, 1];

    // A deliberate first impression: the copy and cover enter in sequence.
    const hero = document.querySelector(".hero");
    if (hero) {
      const intro = [
        [".hero .eyebrow", { opacity: [0, 1], y: [18, 0] }, { duration: 0.7, delay: 0.12, ease }],
        [".hero h1", { opacity: [0, 1], y: [26, 0] }, { duration: 0.95, delay: 0.22, ease }],
        [".hero .hero-copy", { opacity: [0, 1], y: [16, 0] }, { duration: 0.72, delay: 0.4, ease }],
        [".hero .hero-date", { opacity: [0, 1], y: [12, 0] }, { duration: 0.65, delay: 0.52, ease }],
        [".hero .button", { opacity: [0, 1], y: [12, 0] }, { duration: 0.65, delay: 0.62, ease }],
        [".hero-art", { opacity: [0, 1], x: [24, 0], scale: [0.975, 1] }, { duration: 1.15, delay: 0.18, ease }]
      ];
      intro.forEach(([target, keyframes, options]) => {
        const element = document.querySelector(target);
        if (element) animate(element, keyframes, options);
      });
      const cover = hero.querySelector(".hero-art img");
      if (cover) animate(cover, { scale: [1.08, 1] }, { duration: 1.8, delay: 0.25, ease });
    }

    // Sections reveal as they enter the viewport, rather than remaining hidden.
    document.querySelectorAll("main > section:not(.hero), .footer").forEach((element, index) => {
      cleanups.push(inView(element, () => {
        element.classList.add("is-visible");
        animate(element, { opacity: [0, 1], y: [34, 0] }, {
          duration: 0.85,
          delay: index === 0 ? 0.04 : 0,
          ease
        });
      }, { amount: "some", once: true }));
    });

    // Editorial headings arrive first; supporting copy follows with a small delay.
    document.querySelectorAll(".section-head").forEach((heading) => {
      cleanups.push(inView(heading, () => {
        const title = heading.querySelector("h2");
        const intro = heading.querySelector(".section-intro");
        if (title) animate(title, { opacity: [0, 1], y: [22, 0] }, { duration: 0.8, ease });
        if (intro) animate(intro, { opacity: [0, 1], y: [14, 0] }, { duration: 0.72, delay: 0.12, ease });
      }, { amount: "some", once: true }));
    });

    const gallery = document.querySelector(".memory-grid");
    if (gallery) {
      cleanups.push(inView(gallery, () => {
        const figures = [...gallery.querySelectorAll("figure")];
        animate(figures, { opacity: [0, 1], y: [26, 0], scale: [0.975, 1] }, {
          delay: stagger(0.055),
          duration: 0.72,
          ease
        });
      }, { amount: "some", once: true }));
    }

    document.querySelectorAll(".film-card").forEach((card, index) => {
      cleanups.push(inView(card, () => {
        card.classList.add("is-visible");
        animate(card, { opacity: [0, 1], y: [24, 0], scale: [0.985, 1] }, {
          duration: 0.68,
          delay: (index % 3) * 0.07,
          ease
        });
      }, { amount: "some", once: true }));
    });

    document.querySelectorAll(".little-item, .moment").forEach((item) => {
      cleanups.push(inView(item, () => {
        animate(item, { opacity: [0, 1], y: [18, 0] }, { duration: 0.7, ease });
      }, { amount: "some", once: true }));
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}

const mount = document.getElementById("motion-root");
if (mount) createRoot(mount).render(<MotionExperience />);
