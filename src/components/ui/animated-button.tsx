'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "relative rounded-full border overflow-hidden inline-flex items-center justify-center font-medium transition-colors",
  {
    variants: {
      variant: {
        light: "",
        dark: "",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "light",
      size: "md",
    },
  }
);

type Variant = 'light' | 'dark';

const VARIANTS: Record<Variant, { bg: string; hover: string }> = {
  light: {
    bg: '#ffffff',
    hover: '#161616',
  },
  dark: {
    bg: '#161616',
    hover: '#ffffff',
  },
};

type AnimatedButtonProps = {
  variant?: Variant;
} & VariantProps<typeof buttonVariants> &
  HTMLMotionProps<'button'>;

export function AnimatedButton({
  variant = 'light',
  size,
  className,
  children,
  type,
  ...props
}: AnimatedButtonProps) {
  const { bg, hover } = VARIANTS[variant];

  return (
    <motion.button
      type={type ?? 'button'}
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      className={cn(buttonVariants({ variant, size }), className)}
      style={{
        isolation: 'isolate',
        borderColor: hover,
      }}
      variants={{
        rest: { scaleX: 0.9 },
        hover: { scaleX: 1 },
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      {...props}
    >
      {/* BG */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-full"
        style={{ backgroundColor: bg }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            originY: 1,
            backgroundColor: hover,
          }}
          variants={{
            rest: {
              scaleY: 0,
              borderTopLeftRadius: '60%',
              borderTopRightRadius: '60%',
            },
            hover: {
              scaleY: 1,
              borderTopLeftRadius: '0%',
              borderTopRightRadius: '0%',
            },
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>

      {/* TEXT */}
      <motion.span
        className="relative z-10"
        variants={{
          rest: { color: hover },
          hover: { color: bg },
        }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}