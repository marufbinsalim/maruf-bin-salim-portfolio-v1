"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/animated-text";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <nav className="hidden md:block w-full h-16 bg-white">
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
    </nav>
  );
}