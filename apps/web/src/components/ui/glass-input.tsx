"use client";

import { cn } from "@/lib/utils";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function GlassInput({ label, error, icon, className, ...props }: GlassInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</span>}
        <input
          className={cn(
            "w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30",
            "border border-white/10 focus:border-blue-400/40 focus:outline-none",
            "transition-all duration-200 bg-transparent",
            icon && "pl-10",
            error && "border-red-400/40",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
