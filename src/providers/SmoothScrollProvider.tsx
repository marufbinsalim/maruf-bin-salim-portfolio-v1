"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const requestFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect user preference (important for accessibility)
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    lenisRef.current = lenis;

    const requestFrame = (time: number) => {
      lenis.raf(time);
      requestFrameRef.current = requestAnimationFrame(requestFrame);
    };

    requestFrameRef.current = requestAnimationFrame(requestFrame);

    return () => {
      if (requestFrameRef.current) cancelAnimationFrame(requestFrameRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}