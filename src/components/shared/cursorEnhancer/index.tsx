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
  activate: (node: CursorNode) => void;
  deactivate: () => void;
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
  const [active, setActive] = useState<CursorNode>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

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

  const activate = useCallback((node: CursorNode) => {
    setActive(node);
    setIsVisible(true);
  }, []);

  const deactivate = useCallback(() => {
    setActive(null);
  }, []);

  const value: CursorContextValue = {
    x: pos.x,
    y: pos.y,
    isVisible,
    active,
    activate,
    deactivate,
  };

  return (
    <CursorContext.Provider value={value}>
      {/* {active !== null && <style>{`*{cursor:none!important}`}</style>} */}
      {children}
      <CursorPortal />
    </CursorContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// Portal
// -----------------------------------------------------------------------------

function CursorPortal() {
  const ctx = useContext(CursorContext);
  if (!ctx) return null;
  if (!ctx.active || !ctx.isVisible) return null;

  
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

  const active = useRef(false);

  const enter = () => {
    active.current = true;
    ctx.activate(enhance);
  };

  const leave = () => {
    if (!active.current) return;
    active.current = false;
    ctx.deactivate();
  };

  return (
    <Tag
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{ display: 'contents', ...style }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}