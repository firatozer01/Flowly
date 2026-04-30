"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary: "bg-blue-500/20 border-blue-400/30 text-blue-100 hover:bg-blue-500/30",
  ghost:   "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white",
  danger:  "bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function GlassButton({ children, className, variant = "ghost", size = "md", loading, disabled, ...props }: GlassButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative rounded-xl border backdrop-blur-md font-medium transition-all duration-200",
        "flex items-center gap-2 justify-center disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant], sizes[size], className
      )}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </motion.button>
  );
}
