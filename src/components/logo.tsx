"use client";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-7 shrink-0 items-center justify-start sm:h-8",
        "transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]",
        className,
      )}
    >
      <img
        src="/PrepareUp.svg"
        alt=""
        width={240}
        height={44}
        className="block h-full w-auto max-w-[min(11rem,62vw)] object-contain object-left"
        decoding="async"
        fetchPriority="high"
      />
    </span>
  );
}
