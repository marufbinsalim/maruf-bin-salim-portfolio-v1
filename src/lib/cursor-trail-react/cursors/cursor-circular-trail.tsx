// -----------------------------------------------------------------------------
// CursorCircularTrail
// -----------------------------------------------------------------------------

import { animate, useMotionValue, useSpring, motion} from "framer-motion";
import { resolveSpring, SpringPreset, useCursorTrail } from "../cursor-trail";
import { useEffect } from "react";

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
