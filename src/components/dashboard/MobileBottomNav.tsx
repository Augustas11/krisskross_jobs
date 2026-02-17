"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, DollarSign, User } from "lucide-react";

export function MobileBottomNav() {
    const pathname = usePathname();

    const navLinks = [
        { label: "Home", href: "/dashboard", icon: LayoutDashboard },
        { label: "Tools", href: "/pipeline", icon: Sparkles },
        { label: "Earnings", href: "/dashboard/templates", icon: DollarSign },
        { label: "Profile", href: "/dashboard/profile", icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-6 py-3 pb-8 z-50">
            <div className="flex items-center justify-between">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-primary" : "text-slate-400"
                                }`}
                        >
                            <link.icon size={20} fill={isActive ? "currentColor" : "none"} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
