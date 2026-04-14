'use client';

import { animate, useMotionValue, motion, useSpring } from 'framer-motion';
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
  CSSProperties,
} from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type CursorNode = ReactNode | null;

interface CursorContextValue {
  x: number;
  y: number;
  isVisible: boolean;
  active: CursorNode;
  push: (node: CursorNode) => void;
  pop: () => void;
}

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursorState() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('useCursorState must be used inside CursorEnhancerProvider');
  return ctx;
}

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

export function CursorEnhancerProvider({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [isVisible, setIsVisible] = useState(false);

  // Stack of cursor nodes — top of stack is the active cursor
  const stackRef = useRef<CursorNode[]>([]);
  const [active, setActive] = useState<CursorNode>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const enter = () => setIsVisible(true);
    const leave = () => setIsVisible(false);

    window.addEventListener('mousemove', move, { passive: true });
    document.documentElement.addEventListener('mouseenter', enter);
    document.documentElement.addEventListener('mouseleave', leave);

    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseenter', enter);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  const push = useCallback((node: CursorNode) => {
    stackRef.current = [...stackRef.current, node];
    setActive(node);
    setIsVisible(true);
  }, []);

  const pop = useCallback(() => {
    const next = [...stackRef.current];
    next.pop();
    stackRef.current = next;
    setActive(next.length > 0 ? next[next.length - 1] : null);
  }, []);

  return (
    <CursorContext.Provider value={{ x: pos.x, y: pos.y, isVisible, active, push, pop }}>
      {children}
      <CursorPortal />
    </CursorContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// Portal — fixed to viewport, follows mouse
// -----------------------------------------------------------------------------

function CursorPortal() {
  const ctx = useContext(CursorContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!ctx || !mounted || !ctx.active || !ctx.isVisible) return null;

  return (

    <div
      style={{
        position: 'relative',
        pointerEvents: 'none',
      }}
    >
      {ctx.active}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Layer
// -----------------------------------------------------------------------------

interface CursorEnhancerLayerProps {
  enhance?: CursorNode;
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  style?: CSSProperties;
  className?: string;
}

export function CursorEnhancerLayer({
  enhance = null,
  children,
  as: Tag = 'div',
  style,
  className,
  ...rest
}: CursorEnhancerLayerProps) {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('CursorEnhancerLayer must be inside provider');

  const entered = useRef(false);

  const handleEnter = () => {
    if (entered.current) return;
    entered.current = true;
    ctx.push(enhance);
  };

  const handleLeave = () => {
    if (!entered.current) return;
    entered.current = false;
    ctx.pop();
  };

  return (
    <Tag
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ ...style }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}



// ─── Spring presets ─────────────────────────────────────────────

const SPRING_SNAPPY = { stiffness: 600, damping: 40, mass: 0.4 };
const SPRING_SMOOTH = { stiffness: 220, damping: 28, mass: 0.6 };
const SPRING_LAZY = { stiffness: 120, damping: 22, mass: 0.8 };

// ─── Types ─────────────────────────────────────────────────────

type SpringPreset = "snappy" | "smooth" | "lazy";

// ─── Hook ──────────────────────────────────────────────────────

function useTrackedPosition(springConfig = SPRING_SMOOTH) {
  const { x, y } = useCursorState();

  const mx = useMotionValue(x);
  const my = useMotionValue(y);

  const sx = useSpring(mx, springConfig);
  const sy = useSpring(my, springConfig);

  useEffect(() => {
    mx.set(x);
  }, [x, mx]);

  useEffect(() => {
    my.set(y);
  }, [y, my]);

  return { sx, sy };
}


function useHoveringInteractive() {
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;

      if (!el) return;

      const isInteractive =
        el.closest("a") !== null ||
        el.closest("button") !== null ||
        el.closest("[data-cursor='active']") !== null

      setIsHoveringInteractive(isInteractive);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return { isHoveringInteractive };
}

// ─── CircleCursor ──────────────────────────────────────────────

type CircleCursorProps = {
  size?: number;
  activeSize?: number;
  color?: string;
  borderWidth?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
  springPreset?: SpringPreset;
  backgroundColor?: string;
};

export function CircleCursor({
  size = 20,
  activeSize = 40,
  color = "#000",
  borderWidth = 1.5,
  blendMode = "normal",
  springPreset = "snappy",
  backgroundColor = "transparent",
}: CircleCursorProps) {
  const config =
    springPreset === "snappy" ? SPRING_SNAPPY : springPreset === "lazy" ? SPRING_LAZY : SPRING_SMOOTH;

  const { sx, sy } = useTrackedPosition(config);
  const { isHoveringInteractive } = useHoveringInteractive();

  const targetHoverSize = activeSize;

  const sizeMV = useMotionValue(size);

  const animatedSize = useSpring(sizeMV, config);


  useEffect(() => {
    animate(sizeMV, isHoveringInteractive ? targetHoverSize : size, {
      type: "spring",
      stiffness: config.stiffness,
      damping: config.damping,
    });
  }, [isHoveringInteractive, size, targetHoverSize, sizeMV, config]);

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
        width: animatedSize,
        height: animatedSize,
        borderRadius: "999px",
        border: `${borderWidth}px solid ${color}`,
        backgroundColor,
        mixBlendMode: blendMode,
        pointerEvents: "none",
        zIndex: 999999,
      }}
    />
  );
}