'use client';

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
import { createPortal } from 'react-dom';

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

  // Push a new cursor onto the stack (on layer enter)
  const push = useCallback((node: CursorNode) => {
    stackRef.current = [...stackRef.current, node];
    setActive(node);
    setIsVisible(true);
  }, []);

  // Pop the current cursor off the stack (on layer leave), restore parent
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
      style={{...style }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}