"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, CreditCard, Bell, Settings, Mail } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { href: "/subscriptions", icon: CreditCard,       label: "Abonelikler" },
  { href: "/gmail",         icon: Mail,             label: "Gmail Tarama" },
  { href: "/reminders",     icon: Bell,             label: "Hatırlatıcılar" },
  { href: "/settings",      icon: Settings,         label: "Ayarlar" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 flex flex-col z-40">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <LogoMark size={34} />
        <span className="text-xl font-bold text-white tracking-tight">Flowly</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-blue-500/20 text-blue-200 border border-blue-400/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={18} />
                {item.label}
                {active && (
                  <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
        <span className="text-sm text-white/50">Hesabım</span>
      </div>
    </aside>
  );
}
