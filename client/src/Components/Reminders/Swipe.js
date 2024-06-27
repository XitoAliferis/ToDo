import { useState } from "react";

const useSwipe = (onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown) => {
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e, item) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);

    setTouchEndY(null);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e, item) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = (e, item) => {
    if (touchStartX !== null && touchEndX !== null) swipeHorizontal(e, item);
    if (touchStartY !== null && touchEndY !== null) swipeVertical(e, item);
  };

  const swipeHorizontal = (e, item) => {
    if (touchStartX === null || touchEndX === null) return;

    const xDistance = touchStartX - touchEndX;
    const yDistance = touchStartY - touchEndY;
    if (Math.abs(yDistance) >= Math.abs(xDistance)) {
      return;
    }

    const isLeftSwipe = xDistance > minSwipeDistance;
    const isRightSwipe = xDistance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft(e, item); // Pass event and item
    }

    if (isRightSwipe && onSwipeRight) {
      onSwipeRight(e, item); // Pass event and item
    }
  };

  const swipeVertical = (e, item) => {
    if (touchStartY === null || touchEndY === null) return;

    const xDistance = touchStartX - touchEndX;
    const yDistance = touchStartY - touchEndY;
    if (Math.abs(xDistance) >= Math.abs(yDistance)) {
      return;
    }

    const isUpSwipe = yDistance > minSwipeDistance;
    const isDownSwipe = yDistance < -minSwipeDistance;

    if (isDownSwipe && onSwipeDown) {
      onSwipeDown(e, item); // Pass event and item
    }

    if (isUpSwipe && onSwipeUp) {
      onSwipeUp(e, item); // Pass event and item
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export default useSwipe;
