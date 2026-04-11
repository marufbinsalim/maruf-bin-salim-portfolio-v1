"use client";

import { AnimatePresence, Easing, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ConfigType = {
  ANIMATION_DURATION: {
    MS: number;
    S: number;
  };
  ANIMATION_EASING: Easing | Easing[];
};

const CONFIG: ConfigType = {
  ANIMATION_DURATION: {
    MS: 600,
    S: 0.6,
  },
  ANIMATION_EASING: [0.76, 0, 0.24, 1],
};

export default function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const intialRender = useRef(true);

  const [isAnimating, setIsAnimating] = useState(false);
  const [childrenNode, setChildrenNode] = useState<React.ReactNode>(children);
    useState<React.ReactNode>(children);

  useEffect(() => {

    if (intialRender.current) {
      intialRender.current = false;
      return;
    }

    setIsAnimating(true);
    setChildrenNode(null);

    const timeout = setTimeout(() => {
      setChildrenNode(children);
      setIsAnimating(false);
    }, CONFIG.ANIMATION_DURATION.MS);

    return () => clearTimeout(timeout);
  }, [pathname, children]);

  return (
    <>
      {childrenNode}

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="route-transition"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: CONFIG.ANIMATION_DURATION.S,
              ease: CONFIG.ANIMATION_EASING,
            }}
            className="fixed top-0 left-0 z-[9999] h-screen w-screen bg-white"
          />
        )}
      </AnimatePresence>
    </>
  );
}