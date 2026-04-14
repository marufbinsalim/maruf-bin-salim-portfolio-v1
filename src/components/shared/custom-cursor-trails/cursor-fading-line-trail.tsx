// -----------------------------------------------------------------------------
// CursorFadingLineTrail
// -----------------------------------------------------------------------------

import { useMotionValue, useSpring, useAnimationFrame } from "framer-motion";
import { resolveSpring, SpringPreset, useCursorTrail } from "cursor-trail-react";
import { useRef, useEffect, useMemo } from "react";
import * as React from "react";

export type CursorFadingLineTrailProps = {
  segments?: number;
  segmentLength?: number;
  color?: string;
  initialWidth?: number;
  finalWidth?: number;
  opacityStart?: number;
  opacityEnd?: number;
  springPreset?: SpringPreset;
  decaySpeed?: number;
  fadeOnConverge?: boolean;
  convergeFadeSpeed?: number;
};

interface TrailPoint {
  x: number;
  y: number;
}

export function CursorFadingLineTrail({
  segments = 15,
  segmentLength = 20,
  color = '#000',
  initialWidth = 8,
  finalWidth = 1,
  opacityStart = 1,
  opacityEnd = 0.1,
  springPreset = 'snappy',
  decaySpeed = 0.75,
  fadeOnConverge = true,
  convergeFadeSpeed = 0.05,
}: CursorFadingLineTrailProps) {
  const config = resolveSpring(springPreset);
  const { x, y, isVisible } = useCursorTrail();

  const cursorX = useMotionValue(x);
  const cursorY = useMotionValue(y);

  useEffect(() => {
    cursorX.set(x);
    cursorY.set(y);
  }, [x, y, cursorX, cursorY]);

  const springX = useSpring(cursorX, config);
  const springY = useSpring(cursorY, config);

  const trailRef = useRef<TrailPoint[]>(
    Array.from({ length: segments }, () => ({ x: -999, y: -999 }))
  );
  const initialized = useRef(false);
  const opacityRef = useRef(1);
  const lastPosRef = useRef({ x: -999, y: -999 });
  const stationaryFramesRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  const widthRef = useRef(0);
  const heightRef = useRef(0);

  useAnimationFrame(() => {
    const sx = springX.get();
    const sy = springY.get();

    if (!initialized.current && isVisible) {
      initialized.current = true;
      const arr = trailRef.current;
      for (let i = 0; i < segments; i++) {
        arr[i].x = sx;
        arr[i].y = sy;
      }
    }

    if (!isVisible || !initialized.current) return;

    const points = trailRef.current;
    const head = points[0];
    const dx = sx - head.x;
    const dy = sy - head.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > segmentLength) {
      opacityRef.current = Math.min(opacityRef.current + 0.1, 1);
      const angle = Math.atan2(dy, dx);
      const moveX = Math.cos(angle) * segmentLength;
      const moveY = Math.sin(angle) * segmentLength;

      for (let i = points.length - 1; i > 0; i--) {
        points[i].x = points[i - 1].x;
        points[i].y = points[i - 1].y;
      }
      head.x += moveX;
      head.y += moveY;
    } else {
      const isStationary = 
        Math.abs(sx - lastPosRef.current.x) < 0.5 && 
        Math.abs(sy - lastPosRef.current.y) < 0.5;
      
      if (isStationary) {
        stationaryFramesRef.current++;
        if (stationaryFramesRef.current > 60) {
          if (fadeOnConverge) {
            opacityRef.current = Math.max(opacityRef.current - convergeFadeSpeed, 0);
          }
        }
      } else {
        stationaryFramesRef.current = 0;
        opacityRef.current = Math.min(opacityRef.current + 0.1, 1);
      }
      
      lastPosRef.current = { x: sx, y: sy };
      
      for (let i = 1; i < points.length; i++) {
        const target = points[i - 1];
        points[i].x += (target.x - points[i].x) * decaySpeed;
        points[i].y += (target.y - points[i].y) * decaySpeed;
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    if (widthRef.current !== width || heightRef.current !== height) {
      widthRef.current = width;
      heightRef.current = height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;

    for (let i = 0; i < segments - 1; i++) {
      const t = i / (segments - 1);
      const p1 = points[i];
      const p2 = points[i + 1];

      const gap = Math.abs(p1.x - p2.x) > 0.1 || Math.abs(p1.y - p2.y) > 0.1;
      if (!gap) continue;

      const lineWidth = (initialWidth + (finalWidth - initialWidth) * t) * dpr;
      const segmentOpacity = opacityStart + (opacityEnd - opacityStart) * t;
      const opacity = segmentOpacity * opacityRef.current;

      ctx.globalAlpha = opacity;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(p1.x * dpr, p1.y * dpr);
      ctx.lineTo(p2.x * dpr, p2.y * dpr);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  });

  const canvasStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 999999,
    }),
    []
  );

  return <canvas ref={canvasRef} style={canvasStyle} />;
}