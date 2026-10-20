import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function moveToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    moveToTop();

    const animationFrame = requestAnimationFrame(moveToTop);

    return () => cancelAnimationFrame(animationFrame);
  }, [pathname, search]);

  useEffect(() => {
    window.addEventListener("pageshow", moveToTop);

    return () => {
      window.removeEventListener("pageshow", moveToTop);
    };
  }, []);

  return null;
}

export default ScrollToTop;