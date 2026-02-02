import { useState, useEffect, useRef } from "react";
import { Wheel } from "react-custom-roulette";
import { motion, AnimatePresence } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import "./App.css";
import { Scene3D } from './Scene3D';
import { FloatingBalloons } from "./FloatingBalloons";

/* =========================================================================
   SAME PRIZES. SAME ORDER. BACKEND MUST RETURN INDEX BASED ON THIS ARRAY
   ========================================================================= */

const ALL_PRIZES = [
  "🎉 \n Cheers",
  "🎧 \n Premium Headset",
  "☕ \n Coffee mug",
  "🏠 \n WFH Perks",
  "👕 \n GD T-Shirt",
  "🍶 \n Sipper",
  "🍀 \n Better \n luck next\n time",
  "🎟️ \n Shopping voucher",
];

function SpinningWheel({ onSpin, onClaimReward, tokenCost = 500 }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [currentPrizes, setCurrentPrizes] = useState([]);
  const [showWheel, setShowWheel] = useState(false);
  const [winningPrize, setWinningPrize] = useState("");
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [isPlaceholderSpinning, setIsPlaceholderSpinning] = useState(true);

  /* =========================================================================
     WHEEL DATA. SAME AS BEFORE
     ========================================================================= */

  const wheelColors = [
    "#ffdf0e",
    "#9b59fb",
    "#eb7beb",
    "#b1ee31",
    "#2afcd5",
    "#20d087",
    "#3674B5",
    "#ff8c00",
  ];

  const wheelData = currentPrizes.map((prize, index) => ({
    option: prize.replace(/\\n/g, "\n"),
    style: {
      backgroundColor: wheelColors[index % wheelColors.length],
      textColor: "#ffffff",
      fontWeight: "bold",
      textOrientation: "horizontal",
      textPosition: "outer",
      whiteSpace: "pre-line",
    },
  }));

  /* =========================================================================
     PLACEHOLDER CONFETTI LOOP. UNTOUCHED
     ========================================================================= */

  useEffect(() => {
    let interval;
    if (isPlaceholderSpinning) {
      interval = setInterval(() => {
        createConfetti(40);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isPlaceholderSpinning]);

  /* =========================================================================
     SPIN BUTTON HANDLER
     ONLY LOGIC CHANGE IS HERE
     ========================================================================= */

  const handleSpinClick = async () => {
    if (!showWheel) {
      initializeWheel();
      return;
    }

    if (mustSpin) return;

    try {
      const spinResult = await onSpin(tokenCost);

      if (!spinResult?.success) return;

      const backendIndex = spinResult.segmentIndex;

      if (
        typeof backendIndex !== "number" ||
        backendIndex < 0 ||
        backendIndex >= ALL_PRIZES.length
      ) {
        return;
      }

      setSelectedPrize(backendIndex);
      setPrizeNumber(backendIndex);
      setWinningPrize(ALL_PRIZES[backendIndex]);
      setMustSpin(true);

    } catch (e) {
      console.error("Spin failed", e);
    }
  };

  /* =========================================================================
     INITIALIZE WHEEL. UI ONLY
     ========================================================================= */

  const initializeWheel = () => {
    setCurrentPrizes(
      ALL_PRIZES.map(prize => {
        const words = prize.split(" ");
        if (words.length > 1) {
          return (
            words.slice(0, Math.ceil(words.length / 2)).join(" ") +
            "\n" +
            words.slice(Math.ceil(words.length / 2)).join(" ")
          );
        }
        return prize;
      })
    );

    setShowWheel(true);
    setIsPlaceholderSpinning(false);
    createConfetti(80);
  };

  /* =========================================================================
     SPIN STOP HANDLER. UNTOUCHED
     ========================================================================= */

  const handleSpinStop = () => {
    setMustSpin(false);
    createConfetti(150);

    setTimeout(() => {
      setShowWinDialog(true);
    }, 1000);
  };

  /* =========================================================================
     CLAIM HANDLER. OLD WHEEL FLOW
     ========================================================================= */

  const handleClaimPrize = async () => {
    try {
      await onClaimReward({
        index: selectedPrize,
        prize: winningPrize,
      });
    } catch (e) {
      console.error("Claim failed", e);
    }

    resetWheel();
  };

  /* =========================================================================
     RESET. SAME AS BEFORE
     ========================================================================= */

  const resetWheel = () => {
    setShowWinDialog(false);
    setMustSpin(false);
    setPrizeNumber(0);
    setCurrentPrizes([]);
    setWinningPrize("");
    setShowWheel(false);
    setSelectedPrize(null);
    setIsPlaceholderSpinning(true);
    setTimeout(() => createConfetti(40), 500);
  };

  /* =========================================================================
     PLACEHOLDER WHEEL. UNTOUCHED
     ========================================================================= */

  const PlaceholderWheel = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        createConfetti(30);
      }, 4000);
      return () => clearInterval(interval);
    }, []);

    return (
      <motion.div
        className="wheel-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="placeholder-wheel-outer">
          <div className="placeholder-wheel">
            <motion.div
              className="wheel-center-animation"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="placeholder-segments">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="segment"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  /* =========================================================================
     CONFETTI. UNTOUCHED
     ========================================================================= */

  const createConfetti = (count = 100) => {
    const container = document.createElement("div");
    container.className = "confetti-container";
    document.body.appendChild(container);

    const colors = [
      "#FFD700",
      "#E82561",
      "#4A90E2",
      "#50E3C2",
      "#F5A623",
      "#7ED321",
    ];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";

      const angle = Math.random() * Math.PI * 2;
      const velocity = 100 + Math.random() * 200;

      confetti.style.setProperty("--tx", `${Math.cos(angle) * velocity}px`);
      confetti.style.setProperty("--ty", `${Math.sin(angle) * velocity}px`);
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      container.appendChild(confetti);
    }

    setTimeout(() => container.remove(), 4000);
  };

  /* =========================================================================
     RENDER. COMPLETELY UNTOUCHED
     ========================================================================= */

  return (
    <motion.div className="app-container">
      <div className="decorative-circle circle-1" />
      <div className="decorative-circle circle-2" />

      <FloatingBalloons side="left" />
      <FloatingBalloons side="right" />

      <motion.div className="wheel-section">
        <Scene3D />

        <div className="trophy-icon">🏆</div>

        <div className="wheel-container">
          <div className="wheel-outer">
            {!showWheel ? (
              <PlaceholderWheel />
            ) : (
              <motion.div className="wheel-content">
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={wheelData}
                  onStopSpinning={handleSpinStop}
                  outerBorderColor="rgba(255,255,255,0.8)"
                  outerBorderWidth={4}
                  radiusLineColor="rgba(255,255,255,0.5)"
                  radiusLineWidth={2}
                  textDistance={85}
                  fontSize={16}
                  spinDuration={1}
                />
                <motion.div
                  className="wheel-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            )}
          </div>
        </div>

        <motion.button
          className="spin-button"
          onClick={handleSpinClick}
          disabled={mustSpin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showWheel ? `${tokenCost} 🎟️` : "SPIN"}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        <Dialog
          open={showWinDialog}
          onClose={() => setShowWinDialog(false)}
          PaperProps={{ className: "custom-dialog" }}
        >
          <div className="dialog-title">Congratulations! 🎉</div>

          <motion.h1
            style={{ color: "#FFD700", textAlign: "center" }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {winningPrize}
          </motion.h1>

          <motion.button
            className="dialog-button"
            onClick={handleClaimPrize}
            whileHover={{ scale: 1.1 }}
          >
            Claim Prize
          </motion.button>
        </Dialog>
      </AnimatePresence>
    </motion.div>
  );
}

export default SpinningWheel;
