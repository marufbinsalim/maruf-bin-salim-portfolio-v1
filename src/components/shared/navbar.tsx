"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedText } from "@/components/ui/animated-text";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className="hidden md:block w-full h-16 bg-white fixed top-0 left-0 z-50"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between h-full px-[10rem] gap-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={518}
                height={214}
                className="h-8 w-auto min-w-19.5"
                priority
              />
            </Link>
          </motion.div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[18px] font-medium text-black">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.2 + index * 0.1,
                }}
              >
                <Link href={item.href}>
                  <AnimatedText>
                    {item.label}
                  </AnimatedText>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>




      {/* Mobile Menu Icon */}
      <motion.div
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: isMobileMenuOpen || isVisible ? 1 : 0,
          y: isMobileMenuOpen || isVisible ? 0 : -12,
        }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{
          pointerEvents: isMobileMenuOpen || isVisible ? "auto" : "none",
        }}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={518}
            height={214}
            className="h-8 w-auto min-w-[78px]"
            priority
          />
        </Link>
      </motion.div>

      {/* Mobile Menu Icon */}
      <motion.button
        className="md:hidden fixed top-4 right-4 z-50 p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`w-full h-0.5 bg-black transition-transform ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`w-full h-0.5 bg-black ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
          <span className={`w-full h-0.5 bg-black transition-transform ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </div>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-2xl font-medium text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <AnimatedText>
                    {item.label}
                  </AnimatedText>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}