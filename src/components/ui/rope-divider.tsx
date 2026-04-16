"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const N = 120; // number of rope segments

export interface RopeConfig {
  /** How strongly the rope springs back to rest. Default: 0.04 */
  tension?: number;
  /** Energy loss per frame (0–1, closer to 1 = more oscillation). Default: 0.985 */
  damping?: number;
  /** How fast the rope follows the cursor grab. Default: 0.04 */
  stiffness?: number;
  /** Radius in px around cursor that grabs the rope. Default: 80 */
  grabRadius?: number;
  color?: string;
  strokeWidth?: number;
}

export default function RopeDivider({
  tension = 0.05,
  damping = 0.95,
  stiffness = 0.130,
  grabRadius = 160,
  color,
  strokeWidth = 1,
  className,
}: RopeConfig & { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  const pts = useRef(
    Array.from({ length: N }, (_, i) => ({ x: i / (N - 1), y: 0, vy: 0 }))
  );

  useEffect(() => {
    const canvas = canvasRef.current!;
    let ctx: CanvasRenderingContext2D;
    let W = 0, H = 0, raf: number;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx = canvas.getContext("2d")!;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    const tick = () => {
      const p = pts.current;
      const cx = H / 2;
      const mouse = mouseRef.current;

      for (let i = 0; i < p.length; i++) {
        if (i === 0 || i === p.length - 1) { p[i].y = 0; p[i].vy = 0; continue; }

        // Restore force — pulls rope back to y=0
        let force = -p[i].y * tension;

        // Grab force — only when mouse is near
        if (mouse) {
          const px = p[i].x * W;
          const dist = Math.hypot(px - mouse.x, (cx + p[i].y) - mouse.y);
          if (dist < grabRadius) {
            const pull = (1 - dist / grabRadius) ** 2; // smooth falloff
            const targetY = mouse.y - cx;
            const edgeFalloff = Math.sin(Math.PI * p[i].x); // endpoints stay locked
            force += (targetY - p[i].y) * stiffness * pull * edgeFalloff * 0.6;
          }
        }

        p[i].vy += force;
        p[i].vy *= damping;
        p[i].y += p[i].vy;
        p[i].y = Math.max(-H * 0.45, Math.min(H * 0.45, p[i].y));
        if (!isFinite(p[i].y)) { p[i].y = 0; p[i].vy = 0; }
      }

      // Wave propagation — 2 passes for smooth spreading
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 1; i < p.length - 1; i++) {
          const spread = stiffness * 0.8;
          if (i > 1)           { const d = spread * (p[i].y - p[i-1].y); p[i-1].vy += d; p[i].vy -= d; }
          if (i < p.length - 2){ const d = spread * (p[i].y - p[i+1].y); p[i+1].vy += d; p[i].vy -= d; }
        }
      }

      draw();
      raf = requestAnimationFrame(tick);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const p = pts.current;
      const cx = H / 2;
      const c = color ?? "rgba(0,0,0,0.75)";

      // Anchor dots
      ctx.fillStyle = c;
      // ctx.beginPath(); ctx.arc(0, cx, 5, 0, Math.PI * 2); ctx.fill();
      // ctx.beginPath(); ctx.arc(W, cx, 5, 0, Math.PI * 2); ctx.fill();

      // Rope
      ctx.beginPath();
      ctx.strokeStyle = c;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < p.length - 1; i++) {
        const x0 = p[i].x * W,     y0 = cx + p[i].y;
        const x1 = p[i+1].x * W,   y1 = cx + p[i+1].y;
        const mx = (x0 + x1) / 2;
        if (i === 0) ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(mx, y0, x1, y1);
      }
      ctx.stroke();
    };

    resize();
    window.addEventListener("resize", resize);
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [tension, damping, stiffness, grabRadius, color, strokeWidth]);

  useEffect(() => {
    const canvas = canvasRef.current!;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = null; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute left-0 top-0 translate-y-[50%] w-full h-full cursor-crosshair", className)}
    />
  );
}