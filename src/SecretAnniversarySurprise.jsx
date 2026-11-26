import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Dialog } from "@base-ui/react/dialog";
import "./secret-anniversary-surprise.css";
const SECRET = [27, 11, 25];
const makeOptions = () => SECRET.map((answer) => {
  const pool = Array.from({ length: 31 }, (_, index) => index + 1).filter((n) => n !== answer);
  const decoys = [];
  while (decoys.length < 3) decoys.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return [answer, ...decoys].sort(() => Math.random() - 0.5);
});
function DaisyBloom({ reduced }) {
  return <div className={"daisy-bloom" + (reduced ? " daisy-static" : "")} aria-label="Bunga daisy mekar" role="img">
    {Array.from({ length: 12 }, (_, index) => <span className="daisy-petal" key={index} style={{ "--petal": index }} />)}
    <span className="daisy-center" /><span className="daisy-stem" /><span className="daisy-leaf daisy-leaf-left" /><span className="daisy-leaf daisy-leaf-right" />
  </div>;
}
export default function SecretAnniversarySurprise({ onReadLetter }) {
  const [open, setOpen] = useState(false), [step, setStep] = useState(0), [phase, setPhase] = useState("numbers"), [wrong, setWrong] = useState(false), [options, setOptions] = useState(makeOptions);
  const reduced = useReducedMotion();
  const progress = useMemo(() => [0,1,2].map((n) => n < step || phase !== "numbers"), [step, phase]);
  const reset = () => { setStep(0); setPhase("numbers"); setWrong(false); setOptions(makeOptions()); };
  const choose = (number) => {
    if (number !== SECRET[step]) { setWrong(true); return; }
    setWrong(false);
    if (step === 2) setPhase("daisy"); else setStep((current) => current + 1);
  };
  const openLetter = () => { setOpen(false); onReadLetter?.(); };
  return <>
    <button className="surprise-launch" type="button" onClick={() => setOpen(true)}><span aria-hidden="true">✿</span> Unlock a little surprise <b>↗</b></button>
    <Dialog.Root open={open} onOpenChange={(next) => { setOpen(next); if (!next) reset(); }}>
      <Dialog.Portal><Dialog.Backdrop className="surprise-backdrop" />
        <Dialog.Popup className="surprise-panel" aria-describedby="surprise-description">
          <div className="surprise-topline"><span>JUST FOR US</span><Dialog.Close className="surprise-close" aria-label="Tutup kejutan">×</Dialog.Close></div>
          <AnimatePresence mode="wait">
            {phase === "numbers" && <motion.section key="numbers" className="surprise-stage" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? {} : { opacity: 0, y: -8 }} transition={{ duration: .28 }}>
              <p className="surprise-eyebrow">A TINY LITTLE SECRET</p><Dialog.Title className="surprise-title">Three little numbers<span>...</span></Dialog.Title>
              <p id="surprise-description" className="surprise-description">Pilih angka rahasia kita, satu per satu.</p>
              <div className="surprise-progress" aria-label={"Langkah " + (step + 1) + " dari 3"}>{progress.map((done, i) => <span key={i} className={done ? "is-done" : i === step ? "is-current" : ""} />)}</div>
              <p className="surprise-step">NUMBER {step + 1} OF 3</p>
              <div className="secret-number-grid">{options[step].map((number) => <button key={number} type="button" onClick={() => choose(number)}>{number}</button>)}</div>
              <p className={"surprise-feedback" + (wrong ? " is-wrong" : "")} aria-live="polite">{wrong ? "Belum tepat, sayang. Coba pilih lagi ♡" : "Ikuti kata hati kamu ♡"}</p>
            </motion.section>}
            {phase === "daisy" && <motion.section key="daisy" className="surprise-stage daisy-stage" initial={reduced ? false : { opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .65 }}>
              <p className="surprise-eyebrow">YOU FOUND OUR LITTLE SECRET</p><DaisyBloom reduced={reduced} />
              <Dialog.Title className="surprise-title">For my daisy<span> ♡</span></Dialog.Title>
              <p className="surprise-description">Tiga angka sederhana, satu cerita yang selalu ingin kujaga.</p>
              <button className="surprise-primary" type="button" onClick={() => setPhase("card")}>Buka kartu anniversary <b>→</b></button>
            </motion.section>}
            {phase === "card" && <motion.section key="card" className="surprise-stage card-stage" initial={reduced ? false : { opacity: 0, y: 18, rotateX: -7 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: .7 }}>
              <div className="anniversary-card"><span className="card-flower">✿</span><p className="card-kicker">27 · 11 · 25</p>
                <Dialog.Title className="card-title">Happy 1st<br/><em>Anniversary</em></Dialog.Title><span className="card-divider">♡</span>
                <p className="card-message">To my favorite person, thank you for making ordinary days feel like the sweetest memories. Semoga kita selalu saling memilih, dalam setiap musim dan cerita yang akan datang.</p>
                <p className="card-signoff">Novem-ever yours, sayangg.</p><span className="card-footer">FOREVER & ALWAYS</span>
              </div><button className="surprise-primary card-letter-button" type="button" onClick={openLetter}>Read our letter <b>→</b></button>
            </motion.section>}
          </AnimatePresence>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}
