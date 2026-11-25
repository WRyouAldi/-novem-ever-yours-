import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { animate, inView, stagger } from "motion";
import "./motion.css";

function MotionExperience() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    root.classList.add("motion-ready");
    const cleanups = [];

    document.querySelectorAll("[data-motion-reveal]").forEach((element, index) => {
      cleanups.push(inView(element, () => {
        element.classList.add("is-visible");
        animate(element, { opacity: [0, 1], y: [22, 0] }, {
          duration: index === 0 ? 1.05 : 0.78,
          delay: index === 0 ? 0.12 : 0,
          ease: [0.22, 1, 0.36, 1]
        });
      }, { amount: 0.16, once: true }));
    });

    const gallery = document.querySelector(".memory-grid");
    if (gallery) {
      cleanups.push(inView(gallery, () => {
        const images = [...gallery.querySelectorAll("figure")];
        animate(images, { opacity: [0, 1], y: [18, 0], scale: [0.985, 1] }, {
          delay: stagger(0.045),
          duration: 0.62,
          ease: [0.22, 1, 0.36, 1]
        });
      }, { amount: 0.08, once: true }));
    }

    document.querySelectorAll(".film-card").forEach((card) => {
      cleanups.push(inView(card, () => {
        card.classList.add("is-visible");
        animate(card, { opacity: [0, 1], y: [18, 0] }, {
          duration: 0.58,
          ease: [0.22, 1, 0.36, 1]
        });
      }, { amount: 0.12, once: true }));
    });

    const heroImage = document.querySelector(".hero-art img");
    if (heroImage) {
      heroImage.addEventListener("load", () => {
        animate(heroImage, { scale: [1.035, 1] }, {
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1]
        });
      }, { once: true });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}

createRoot(document.getElementById("motion-root")).render(<MotionExperience />);
