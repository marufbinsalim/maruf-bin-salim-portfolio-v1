"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const POINTS = 200;
const SPRING = 0.12;
const DAMPING = 0.96;
const SPREAD = 0.04;
const MOUSE_INFLUENCE = 50;

const MAX_Y = 50;
const MAX_V = 1000;

export default function RopeDivider({
  color = "red",
  className,
}: {
  color?: string;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const points = useRef(
    Array.from({ length: POINTS }, (_, i) => ({
      x: i / (POINTS - 1),
      y: 0,
      vy: 0,
    }))
  );

  // 🎯 Physics loop
  useEffect(() => {
    let raf: number;

    const update = () => {
      const pts = points.current;

      for (let i = 0; i < pts.length; i++) {
        // 🔒 Lock endpoints
        if (i === 0 || i === pts.length - 1) {
          pts[i].y = 0;
          pts[i].vy = 0;
          continue;
        }

        const force = -pts[i].y * SPRING;

        pts[i].vy += force;
        pts[i].vy *= DAMPING;

        // Clamp velocity
        pts[i].vy = Math.max(-MAX_V, Math.min(MAX_V, pts[i].vy));

        pts[i].y += pts[i].vy;

        // Clamp position
        pts[i].y = Math.max(-MAX_Y, Math.min(MAX_Y, pts[i].y));

        // Safety reset
        if (!isFinite(pts[i].y)) {
          pts[i].y = 0;
          pts[i].vy = 0;
        }
      }

      // --- Spread (wave propagation) ---
      for (let j = 0; j < 2; j++) {
        for (let i = 1; i < pts.length - 1; i++) {
          if (i > 1) {
            const d = SPREAD * (pts[i].y - pts[i - 1].y);
            pts[i - 1].vy += d;
            pts[i].vy -= d;
          }

          if (i < pts.length - 2) {
            const d = SPREAD * (pts[i].y - pts[i + 1].y);
            pts[i + 1].vy += d;
            pts[i].vy -= d;
          }
        }
      }

      draw();
      raf = requestAnimationFrame(update);
    };

    const draw = () => {
      const svg = svgRef.current;
      if (!svg) return;

      const w = svg.clientWidth;
      const h = svg.clientHeight;

      let d = "";
      const pts = points.current;

      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];

        const x0 = p0.x * w;
        const y0 = h / 2 + p0.y;

        const x1 = p1.x * w;
        const y1 = h / 2 + p1.y;

        const cx = (x0 + x1) / 2;

        if (i === 0) d += `M ${x0},${y0}`;

        // Smooth quadratic curve
        d += ` Q ${cx},${y0} ${x1},${y1}`;
      }

      svg.innerHTML = `
        <path 
          d="${d}" 
          stroke="${color}" 
          stroke-width="1.5" 
          fill="none" 
        />
      `;
    };

    update();
    return () => cancelAnimationFrame(raf);
  }, [color]);

  // 🖱️ Mouse interaction
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const w = rect.width;
      const h = rect.height;

      points.current.forEach((p, i) => {
        const px = p.x * w;
        const dist = Math.abs(px - mx);

        if (dist < MOUSE_INFLUENCE) {
          const strength = 1 - dist / MOUSE_INFLUENCE;

          const targetY = my - h / 2;

          const edgeFalloff = Math.sin(Math.PI * p.x);

          p.vy += (targetY - p.y) * 0.08 * strength * edgeFalloff;
        }
      });
    };

    svg.addEventListener("mousemove", handleMove);

    return () => {
      svg.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={cn(
        "absolute left-0 top-1/2 w-full h-full bg-transparent",
        className
      )}
    />
  );
}