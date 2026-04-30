"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  shimmer?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hover = true, shimmer = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={cn("glass-card", shimmer && "glass-shimmer", onClick && "cursor-pointer", className)}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
