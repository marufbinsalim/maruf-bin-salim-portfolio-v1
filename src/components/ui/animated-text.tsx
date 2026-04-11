"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedText({ children, className }: AnimatedTextProps) {
  const [hovered, setHovered] = useState(false);

  const text = typeof children === "string" ? children : "Text";

  return (
    <span
      className={`relative inline-block overflow-hidden h-[1.2em] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top text */}
      <motion.span
        className="block"
        animate={{ y: hovered ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {text}
      </motion.span>

      {/* Bottom text */}
      <motion.span
        className="absolute left-0 top-0 block"
        animate={{ y: hovered ? "0%" : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {text}
      </motion.span>
    </span>
  );
}