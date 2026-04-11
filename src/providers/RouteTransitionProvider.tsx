"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsAnimating(true);

    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setIsAnimating(false);
    }, 600); // match animation duration

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {displayChildren}

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="route-transition"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 z-[9999] border h-screen w-screen rounded-lg bg-white"
          />
        )}
      </AnimatePresence>
    </>
  );
}