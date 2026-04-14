// "use client";

// import { animate, motion, useMotionValue, useSpring } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useCursorState } from ".";

// // ─── Spring presets ─────────────────────────────────────────────

// const SPRING_SNAPPY = { stiffness: 600, damping: 40, mass: 0.4 };
// const SPRING_SMOOTH = { stiffness: 220, damping: 28, mass: 0.6 };
// const SPRING_LAZY = { stiffness: 120, damping: 22, mass: 0.8 };

// // ─── Types ─────────────────────────────────────────────────────

// type SpringPreset = "snappy" | "smooth" | "lazy";

// // ─── Hook ──────────────────────────────────────────────────────

// function useTrackedPosition(springConfig = SPRING_SMOOTH) {
//   const { x, y } = useCursorState();

//   const mx = useMotionValue(x);
//   const my = useMotionValue(y);

//   const sx = useSpring(mx, springConfig);
//   const sy = useSpring(my, springConfig);

//   useEffect(() => {
//     mx.set(x);
//   }, [x, mx]);

//   useEffect(() => {
//     my.set(y);
//   }, [y, my]);

//   return { sx, sy };
// }

// // ─── CircleCursor ──────────────────────────────────────────────

// type CircleCursorProps = {
//   size?: number;
//   color?: string;
//   borderWidth?: number;
//   blendMode?: React.CSSProperties["mixBlendMode"];
//   springPreset?: SpringPreset;
//   backgroundColor?: string;
// };

// export function CircleCursor({
//   size = 44,
//   color = "#000",
//   borderWidth = 1.5,
//   blendMode = "normal",
//   springPreset = "smooth",
//   backgroundColor = "transparent",
// }: CircleCursorProps) {
//   const config =
//     springPreset === "snappy"
//       ? SPRING_SNAPPY
//       : springPreset === "lazy"
//         ? SPRING_LAZY
//         : SPRING_SMOOTH;

//   const { sx, sy } = useTrackedPosition(config);

//   const targetHoverSize = size * 2;

//   // 🎯 motion value for size
//   const sizeMV = useMotionValue(size);

//   // 🧲 smooth spring animation
//   const animatedSize = useSpring(sizeMV, config);

//   const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

//   useEffect(() => {
//     const handleMove = (e: MouseEvent) => {
//       const el = document.elementFromPoint(
//         e.clientX,
//         e.clientY
//       ) as HTMLElement | null;

//       if (!el) return;

//       const isInteractive =
//         el.closest("a") !== null ||
//         el.closest("button") !== null ||
//         el.closest("[data-cursor='link']") !== null;

//       setIsHoveringInteractive(isInteractive);
//     };

//     window.addEventListener("mousemove", handleMove);
//     return () => window.removeEventListener("mousemove", handleMove);
//   }, []);

//   // 🚀 animate size change smoothly
//   useEffect(() => {
//     animate(sizeMV, isHoveringInteractive ? targetHoverSize : size, {
//       type: "spring",
//       stiffness: config.stiffness,
//       damping: config.damping,
//     });
//   }, [isHoveringInteractive, size, targetHoverSize, sizeMV, config]);

//   return (
//     <motion.div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         x: sx,
//         y: sy,
//         translateX: "-50%",
//         translateY: "-50%",
//         width: animatedSize,   // OK ONLY in motion.div
//         height: animatedSize,  // OK ONLY in motion.div
//         borderRadius: "999px",
//         border: `${borderWidth}px solid ${color}`,
//         backgroundColor,
//         mixBlendMode: blendMode,
//         pointerEvents: "none",
//         zIndex: 999999, // 👈 ADD THIS (very important)
//       }}
//     />
//   );
// }

// // ─── SquareCursor ─────────────────────────────────────────────

// type SquareCursorProps = {
//   size?: number;
//   color?: string;
//   borderRadius?: number;
//   rotation?: number;
// };

// export function SquareCursor({
//   size = 36,
//   color = "#000",
//   borderRadius = 4,
//   rotation = 45,
// }: SquareCursorProps) {
//   const { sx, sy } = useTrackedPosition(SPRING_SMOOTH);

//   return (
//     <motion.div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: size,
//         height: size,
//         borderRadius,
//         border: `1.5px solid ${color}`,
//         x: sx,
//         y: sy,
//         translateX: "-50%",
//         translateY: "-50%",
//         pointerEvents: "none",
//       }}
//       initial={{ scale: 0, opacity: 0, rotate: 0 }}
//       animate={{ scale: 1, opacity: 1, rotate: rotation }}
//       exit={{ scale: 0, opacity: 0 }}
//       transition={{ duration: 0.2 }}
//     />
//   );
// }

// // ─── DotCursor ────────────────────────────────────────────────

// type DotCursorProps = {
//   size?: number;
//   color?: string;
// };

// export function DotCursor({ size = 8, color = "#000" }: DotCursorProps) {
//   const { sx, sy } = useTrackedPosition(SPRING_SNAPPY);

//   return (
//     <motion.div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: size,
//         height: size,
//         borderRadius: "50%",
//         background: color,
//         x: sx,
//         y: sy,
//         translateX: "-50%",
//         translateY: "-50%",
//         pointerEvents: "none",
//       }}
//       initial={{ scale: 0 }}
//       animate={{ scale: 1 }}
//       exit={{ scale: 0 }}
//       transition={{ duration: 0.12 }}
//     />
//   );
// }

// // ─── LabelCursor ──────────────────────────────────────────────

// type LabelCursorProps = {
//   label?: string;
//   size?: number;
//   bg?: string;
//   fg?: string;
//   springPreset?: SpringPreset;
// };

// export function LabelCursor({
//   label = "View",
//   size = 80,
//   bg = "#000",
//   fg = "#fff",
//   springPreset = "smooth",
// }: LabelCursorProps) {
//   const config =
//     springPreset === "snappy"
//       ? SPRING_SNAPPY
//       : springPreset === "lazy"
//         ? SPRING_LAZY
//         : SPRING_SMOOTH;

//   const { sx, sy } = useTrackedPosition(config);

//   return (
//     <motion.div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: size,
//         height: size,
//         borderRadius: "50%",
//         background: bg,
//         x: sx,
//         y: sy,
//         translateX: "-50%",
//         translateY: "-50%",
//         pointerEvents: "none",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//       initial={{ scale: 0, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       exit={{ scale: 0, opacity: 0 }}
//       transition={{ type: "spring", stiffness: 400, damping: 30 }}
//     >
//       <motion.span
//         initial={{ opacity: 0, y: 4 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.06 }}
//         style={{
//           color: fg,
//           fontSize: 12,
//           fontWeight: 500,
//           letterSpacing: "0.04em",
//           userSelect: "none",
//           fontFamily: "sans-serif",
//         }}
//       >
//         {label}
//       </motion.span>
//     </motion.div>
//   );
// }

// // ─── MorphCursor ──────────────────────────────────────────────

// type MorphCursorProps = {
//   idleSize?: number;
//   activeSize?: number;
//   color?: string;
// };

// export function MorphCursor({
//   idleSize = 40,
//   activeSize = 80,
//   color = "#000",
// }: MorphCursorProps) {
//   const { sx, sy } = useTrackedPosition(SPRING_SMOOTH);
//   const { isVisible } = useCursorState();

//   return (
//     <motion.div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         x: sx,
//         y: sy,
//         translateX: "-50%",
//         translateY: "-50%",
//         pointerEvents: "none",
//         borderRadius: "50%",
//         border: `1.5px solid ${color}`,
//       }}
//       initial={{ width: idleSize, height: idleSize, opacity: 0 }}
//       animate={{
//         width: idleSize,
//         height: idleSize,
//         opacity: isVisible ? 1 : 0,
//       }}
//       whileHover={{ width: activeSize, height: activeSize }}
//       transition={{ type: "spring", stiffness: 300, damping: 28 }}
//     />
//   );
// }

// // ─── CrosshairCursor ──────────────────────────────────────────

// type CrosshairCursorProps = {
//   size?: number;
//   color?: string;
//   gap?: number;
// };

// export function CrosshairCursor({
//   size = 32,
//   color = "#000",
//   gap = 6,
// }: CrosshairCursorProps) {
//   const { sx, sy } = useTrackedPosition(SPRING_SNAPPY);
//   const half = size / 2;

//   return (
//     <motion.svg
//       width={size}
//       height={size}
//       viewBox={`0 0 ${size} ${size}`}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         x: sx,
//         y: sy,
//         translateX: "-50%",
//         translateY: "-50%",
//         pointerEvents: "none",
//         overflow: "visible",
//       }}
//       initial={{ opacity: 0, scale: 0.6 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.6 }}
//       transition={{ duration: 0.15 }}
//     >
//       <line x1={0} y1={half} x2={half - gap} y2={half} stroke={color} strokeWidth={1.5} />
//       <line x1={half + gap} y1={half} x2={size} y2={half} stroke={color} strokeWidth={1.5} />
//       <line x1={half} y1={0} x2={half} y2={half - gap} stroke={color} strokeWidth={1.5} />
//       <line x1={half} y1={half + gap} x2={half} y2={size} stroke={color} strokeWidth={1.5} />
//       <circle cx={half} cy={half} r={1.5} fill={color} />
//     </motion.svg>
//   );
// }

// // ─── DotRingCursor ────────────────────────────────────────────

// type DotRingCursorProps = {
//   dotSize?: number;
//   ringSize?: number;
//   color?: string;
// };

// export function DotRingCursor({
//   dotSize = 6,
//   ringSize = 40,
//   color = "#000",
// }: DotRingCursorProps) {
//   const dot = useTrackedPosition(SPRING_SNAPPY);
//   const ring = useTrackedPosition(SPRING_LAZY);

//   return (
//     <>
//       <motion.div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: dotSize,
//           height: dotSize,
//           borderRadius: "50%",
//           background: color,
//           x: dot.sx,
//           y: dot.sy,
//           translateX: "-50%",
//           translateY: "-50%",
//           pointerEvents: "none",
//         }}
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0 }}
//         transition={{ duration: 0.1 }}
//       />

//       <motion.div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: ringSize,
//           height: ringSize,
//           borderRadius: "50%",
//           border: `1.5px solid ${color}`,
//           x: ring.sx,
//           y: ring.sy,
//           translateX: "-50%",
//           translateY: "-50%",
//           pointerEvents: "none",
//         }}
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0, opacity: 0 }}
//         transition={{ duration: 0.2 }}
//       />
//     </>
//   );
// }