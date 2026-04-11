import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="hidden md:block w-full h-16 bg-white">
      <div className="flex items-center justify-between h-full px-[10rem] gap-10">
        {/* Logo */}
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

        {/* Links */}
        <div className="flex items-center gap-6 text-[18px] font-medium text-black">
          <Link
            href="/about"
          >
            About
          </Link>
          <Link
            href="/experience"
          >
            Experience
          </Link>
          <Link
            href="/case-studies"
          >
            Case Studies
          </Link>
           <Link
            href="/contact"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}