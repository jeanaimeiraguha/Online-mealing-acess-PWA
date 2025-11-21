export const pageMotion = {
  initial: { opacity: 0, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } },
};

export const modalMotion = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

export const successAnimation = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 360],
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

export const cardFlip = {
  initial: { rotateY: 0 },
  flipped: { rotateY: 180, transition: { duration: 0.6 } }
};

export const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.5 }
};

export const tapAnimation = { scale: 0.95 };
export const hoverScale = { scale: 1.05 };
