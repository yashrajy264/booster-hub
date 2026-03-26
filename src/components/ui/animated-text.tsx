"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 22,
      stiffness: 320,
    },
  },
};

/**
 * Staggered word reveal (React Bits–style blur/fade). Uses solid foreground only — no gradients.
 */
export function AnimatedHeading({
  text,
  className,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const words = text.trim().split(/\s+/);

  return (
    <Tag className={cn("font-heading tracking-tight text-foreground", className)}>
      <motion.span
        className="inline-flex flex-wrap justify-center gap-x-[0.25em] gap-y-1"
        variants={container}
        initial="hidden"
        animate="visible"
        aria-label={text}
      >
        {words.map((word, i) => (
          <motion.span key={`${word}-${i}`} variants={item} className="inline-block">
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
