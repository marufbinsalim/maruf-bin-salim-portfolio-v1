"use client";
/**
 * Built-in cursor components.
 * All use useCursorState() and Framer Motion for spring-driven tracking.
 *
 * You can build your own — just call useCursorState() for { x, y, isVisible }.
 */

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useCursorState } from "./cursorEnhancer";

// ─── Shared spring config presets ─────────────────────────────────────────────

const SPRING_SNAPPY  = { stiffness: 600, damping: 40, mass: 0.4 };
const SPRING_SMOOTH  = { stiffness: 220, damping: 28, mass: 0.6 };
const SPRING_LAZY    = { stiffness: 120, damping: 22, mass: 0.8 };

// ─── Hook: spring-tracked position ───────────────────────────────────────────

function useTrackedPosition(springConfig = SPRING_SMOOTH) {
  const { x, y } = useCursorState();
  const mx = useMotionValue(x);
  const my = useMotionValue(y);
  const sx = useSpring(mx, springConfig);
  const sy = useSpring(my, springConfig);

  useEffect(() => { mx.set(x); }, [x, mx]);
  useEffect(() => { my.set(y); }, [y, my]);

  return { sx, sy };
}

// ─── CircleCursor ─────────────────────────────────────────────────────────────

/**
 * A smooth trailing circle. Accepts size, color, borderWidth, mix-blend-mode.
 *
 * @param {number}  [size=44]
 * @param {string}  [color="#000"]
 * @param {number}  [borderWidth=1.5]
 * @param {string}  [blendMode="normal"]
 * @param {string}  [springPreset="smooth"] - "snappy" | "smooth" | "lazy"
 */
export function CircleCursor({
  size = 44,
  color = "#000",
  borderWidth = 1.5,
  blendMode = "normal",
  springPreset = "smooth",
}) {
  const config = springPreset === "snappy" ? SPRING_SNAPPY
               : springPreset === "lazy"   ? SPRING_LAZY
               : SPRING_SMOOTH;

  const { sx, sy } = useTrackedPosition(config);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${borderWidth}px solid ${color}`,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: blendMode as any,
        pointerEvents: "none",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.18 }}
    />
  );
}

// ─── SquareCursor ─────────────────────────────────────────────────────────────

/**
 * A rotating square that tracks the cursor.
 *
 * @param {number} [size=36]
 * @param {string} [color="#000"]
 * @param {number} [borderRadius=4]
 * @param {number} [rotation=45]
 */
export function SquareCursor({
  size = 36,
  color = "#000",
  borderRadius = 4,
  rotation = 45,
}) {
  const { sx, sy } = useTrackedPosition(SPRING_SMOOTH);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius,
        border: `1.5px solid ${color}`,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
      }}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: rotation }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  );
}

// ─── DotCursor ────────────────────────────────────────────────────────────────

/**
 * A filled dot that snaps tightly to the cursor (good as dot+ring combo pair).
 */
export function DotCursor({ size = 8, color = "#000" }) {
  const { sx, sy } = useTrackedPosition(SPRING_SNAPPY);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.12 }}
    />
  );
}

// ─── LabelCursor ──────────────────────────────────────────────────────────────

/**
 * A filled pill with a text label — good for "View", "Play", "Drag", etc.
 *
 * @param {string}  label
 * @param {number}  [size=80]    diameter of the circle
 * @param {string}  [bg="#000"]
 * @param {string}  [fg="#fff"]
 * @param {string}  [springPreset="smooth"]
 */
export function LabelCursor({
  label = "View",
  size = 80,
  bg = "#000",
  fg = "#fff",
  springPreset = "smooth",
}) {
  const config = springPreset === "snappy" ? SPRING_SNAPPY
               : springPreset === "lazy"   ? SPRING_LAZY
               : SPRING_SMOOTH;

  const { sx, sy } = useTrackedPosition(config);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        style={{
          color: fg,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.04em",
          userSelect: "none",
          fontFamily: "sans-serif",
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

// ─── MagneticCursor ───────────────────────────────────────────────────────────

/**
 * A circle that morphs between a ring (idle) and a filled blob (active).
 * Pass active={true} to trigger the morph, or it reacts to clicks automatically.
 */
export function MorphCursor({
  idleSize = 40,
  activeSize = 80,
  color = "#000",
}) {
  const { sx, sy } = useTrackedPosition(SPRING_SMOOTH);
  const { isVisible } = useCursorState();

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
      }}
      initial={{ width: idleSize, height: idleSize, opacity: 0 }}
      animate={{ width: idleSize, height: idleSize, opacity: isVisible ? 1 : 0 }}
      whileHover={{ width: activeSize, height: activeSize }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    />
  );
}

// ─── CrosshairCursor ──────────────────────────────────────────────────────────

/**
 * SVG crosshair that tracks with a slight lag.
 */
export function CrosshairCursor({ size = 32, color = "#000", gap = 6 }) {
  const { sx, sy } = useTrackedPosition(SPRING_SNAPPY);
  const half = size / 2;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        overflow: "visible",
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.15 }}
    >
      {/* Horizontal lines */}
      <line x1={0} y1={half} x2={half - gap} y2={half} stroke={color} strokeWidth={1.5} />
      <line x1={half + gap} y1={half} x2={size} y2={half} stroke={color} strokeWidth={1.5} />
      {/* Vertical lines */}
      <line x1={half} y1={0} x2={half} y2={half - gap} stroke={color} strokeWidth={1.5} />
      <line x1={half} y1={half + gap} x2={half} y2={size} stroke={color} strokeWidth={1.5} />
      {/* Center dot */}
      <circle cx={half} cy={half} r={1.5} fill={color} />
    </motion.svg>
  );
}

// ─── DotRingCursor (Cuberto-style combo) ──────────────────────────────────────

/**
 * The classic Cuberto two-part cursor: a snappy dot + lagging ring.
 * Use this as a single enhance or compose both inside a fragment.
 */
export function DotRingCursor({
  dotSize = 6,
  ringSize = 40,
  color = "#000",
}) {
  const dot = useTrackedPosition(SPRING_SNAPPY);
  const ring = useTrackedPosition(SPRING_LAZY);

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0,
          width: dotSize, height: dotSize,
          borderRadius: "50%",
          background: color,
          x: dot.sx, y: dot.sy,
          translateX: "-50%", translateY: "-50%",
          pointerEvents: "none",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.1 }}
      />
      {/* Ring */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0,
          width: ringSize, height: ringSize,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          x: ring.sx, y: ring.sy,
          translateX: "-50%", translateY: "-50%",
          pointerEvents: "none",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}