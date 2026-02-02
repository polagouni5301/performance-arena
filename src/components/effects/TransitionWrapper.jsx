/**
 * Transition Wrapper - Manages AnimatePresence for route transitions
 */
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import GlitchOverlay from "./GlitchOverlay";

const TransitionWrapper = ({ children }) => {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </AnimatePresence>
      
      {/* Glitch overlay during transitions */}
      <AnimatePresence>
        <GlitchOverlay key={`glitch-${location.pathname}`} />
      </AnimatePresence>
    </>
  );
};

export default TransitionWrapper;
