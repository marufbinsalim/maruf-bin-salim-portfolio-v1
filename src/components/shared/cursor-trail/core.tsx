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

type TrailNode = ReactNode | null;

interface TrailContextValue {
  x: number;
  y: number;
  isVisible: boolean;
  active: TrailNode;
  push: (node: TrailNode) => void;
  pop: () => void;
}

export type SpringPreset = 'snappy' | 'smooth' | 'lazy';

// -----------------------------------------------------------------------------
// Spring presets
// -----------------------------------------------------------------------------

export const SPRING_SNAPPY = { stiffness: 600, damping: 40, mass: 0.4 };
export const SPRING_SMOOTH = { stiffness: 220, damping: 28, mass: 0.6 };
export const SPRING_LAZY = { stiffness: 120, damping: 22, mass: 0.8 };

export function resolveSpring(preset: SpringPreset) {
  if (preset === 'snappy') return SPRING_SNAPPY;
  if (preset === 'lazy') return SPRING_LAZY;
  return SPRING_SMOOTH;
}

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

const TrailContext = createContext<TrailContextValue | null>(null);

// -----------------------------------------------------------------------------
// useCursorTrail — the single public hook
// -----------------------------------------------------------------------------

export function useCursorTrail() {
  const ctx = useContext(TrailContext);
  if (!ctx) throw new Error('useCursorTrail must be used inside CursorTrailProvider');

  const { x, y, isVisible, active } = ctx;

  // Spring-tracked position (smooth preset by default)
  const mx = useMotionValue(x);
  const my = useMotionValue(y);
  const springX = useSpring(mx, SPRING_SMOOTH);
  const springY = useSpring(my, SPRING_SMOOTH);

  useEffect(() => { mx.set(x); }, [x, mx]);
  useEffect(() => { my.set(y); }, [y, my]);

  // Whether the cursor is over an interactive element
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!el) return;
      setIsHoveringInteractive(
        el.closest('a') !== null ||
        el.closest('button') !== null ||
        el.closest("[data-cursor='active']") !== null
      );
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return {
    /** Raw cursor x position */
    x,
    /** Raw cursor y position */
    y,
    /** Spring-animated x (smooth preset) */
    springX,
    /** Spring-animated y (smooth preset) */
    springY,
    /** Whether the cursor is inside the document */
    isVisible,
    /** The currently active trail node (top of stack) */
    active,
    /** Whether the cursor is over a button, link, or [data-cursor="active"] */
    isHoveringInteractive,
  };
}

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

export function CursorTrailProvider({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [isVisible, setIsVisible] = useState(false);

  const stackRef = useRef<TrailNode[]>([]);
  const [active, setActive] = useState<TrailNode>(null);

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

  const push = useCallback((node: TrailNode) => {
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
    <TrailContext.Provider value={{ x: pos.x, y: pos.y, isVisible, active, push, pop }}>
      {children}
      <TrailPortal />
    </TrailContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// TrailPortal — renders the active trail node, pointer-events free
// -----------------------------------------------------------------------------

function TrailPortal() {
  const ctx = useContext(TrailContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!ctx || !mounted || !ctx.active || !ctx.isVisible) return null;

  return (
    <div style={{ position: 'relative', pointerEvents: 'none' }}>
      {ctx.active}
    </div>
  );
}

// -----------------------------------------------------------------------------
// CursorTrailArea — polymorphic zone component with dot-notation API
// Usage: <CursorTrailArea.div trail={<MyTrail />}>  or  <CursorTrailArea.section ...>
// -----------------------------------------------------------------------------

interface CursorTrailAreaProps {
  trail?: TrailNode;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  [key: string]: unknown;
}

function createCursorTrailArea<K extends keyof React.JSX.IntrinsicElements>(Tag: K) {
  return function CursorTrailAreaElement({
    trail = null,
    children,
    style,
    className,
    ...rest
  }: CursorTrailAreaProps) {

    const ctx = useContext(TrailContext);
    if (!ctx) throw new Error('CursorTrailArea must be inside CursorTrailProvider');

    const entered = useRef(false);

    const handleEnter = () => {
      if (entered.current) return;
      entered.current = true;
      ctx.push(trail);
    };

    const handleLeave = () => {
      if (!entered.current) return;
      entered.current = false;
      ctx.pop();
    };

    const AnyTag = Tag as React.ElementType;

    return (
      <AnyTag
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={style}
        className={className}
        {...rest}
      >
        {children}
      </AnyTag>
    );
  };
}

export const CursorTrailArea = {
  div: createCursorTrailArea('div'),
  section: createCursorTrailArea('section'),
  article: createCursorTrailArea('article'),
  aside: createCursorTrailArea('aside'),
  header: createCursorTrailArea('header'),
  footer: createCursorTrailArea('footer'),
  main: createCursorTrailArea('main'),
  nav: createCursorTrailArea('nav'),
  span: createCursorTrailArea('span'),
  li: createCursorTrailArea('li'),
  ul: createCursorTrailArea('ul'),
  a: createCursorTrailArea('a'),
  button: createCursorTrailArea('button'),
} as const;


// -----------------------------------------------------------------------------
// createCursorTrail — base factory for building custom trail components
// Gives the consumer spring-tracked position + interactive state out of the box
// -----------------------------------------------------------------------------

export interface CursorTrailRenderProps {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
  isHoveringInteractive: boolean;
}

/**
 * createCursorTrail(render)
 *
 * Wraps a render function with spring-tracked cursor position
 * and hover-interactive state. Use this to build custom trails.
 *
 * Example:
 *   const MyTrail = createCursorTrail(({ springX, springY }) => (
 *     <motion.div style={{ position: 'fixed', x: springX, y: springY }} />
 *   ));
 */
export function createCursorTrail(
  render: (props: CursorTrailRenderProps) => ReactNode,
  springPreset: SpringPreset = 'smooth'
): () => ReactNode {
  return function CustomCursorTrail() {
    const { x, y, isHoveringInteractive } = useCursorTrail();

    const config = resolveSpring(springPreset);
    const mx = useMotionValue(x);
    const my = useMotionValue(y);
    const springX = useSpring(mx, config);
    const springY = useSpring(my, config);

    useEffect(() => { mx.set(x); }, [x, mx]);
    useEffect(() => { my.set(y); }, [y, my]);

    return <>{render({ springX, springY, isHoveringInteractive })}</>;
  };
}

// -----------------------------------------------------------------------------
// CursorCircularTrail — built-in trail component
// -----------------------------------------------------------------------------

export type CursorCircularTrailProps = {
  size?: number;
  activeSize?: number;
  color?: string;
  borderWidth?: number;
  blendMode?: React.CSSProperties['mixBlendMode'];
  springPreset?: SpringPreset;
  backgroundColor?: string;
};

export function CursorCircularTrail({
  size = 20,
  activeSize = 40,
  color = '#000',
  borderWidth = 1.5,
  blendMode = 'normal',
  springPreset = 'snappy',
  backgroundColor = 'transparent',
}: CursorCircularTrailProps) {
  const config = resolveSpring(springPreset);

  const { x, y, isHoveringInteractive } = useCursorTrail();

  const mx = useMotionValue(x);
  const my = useMotionValue(y);
  const springX = useSpring(mx, config);
  const springY = useSpring(my, config);

  useEffect(() => { mx.set(x); }, [x, mx]);
  useEffect(() => { my.set(y); }, [y, my]);

  const sizeMV = useMotionValue(size);
  const animatedSize = useSpring(sizeMV, config);

  useEffect(() => {
    animate(sizeMV, isHoveringInteractive ? activeSize : size, {
      type: 'spring',
      stiffness: config.stiffness,
      damping: config.damping,
    });
  }, [isHoveringInteractive, size, activeSize, sizeMV, config]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: animatedSize,
        height: animatedSize,
        borderRadius: '999px',
        border: `${borderWidth}px solid ${color}`,
        backgroundColor,
        mixBlendMode: blendMode,
        pointerEvents: 'none',
        zIndex: 999999,
      }}
    />
  );
}