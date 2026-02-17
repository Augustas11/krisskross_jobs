"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Bell, Sparkles, LayoutDashboard, Briefcase, DollarSign } from "lucide-react";

export function DashboardHeader() {
    const pathname = usePathname();

    const navLinks = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "AI Tools", href: "/pipeline", icon: Sparkles },
        { label: "Earnings", href: "/dashboard/templates", icon: DollarSign }, // Temporary until earnings page exists
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Left: Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <span className="text-xl font-black tracking-tighter text-brand-dark">
                            KrissKross <span className="text-primary italic">Creators</span>
                        </span>
                    </Link>

                    {/* Center Navigation (Desktop) */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                            ? "bg-primary/5 text-primary"
                                            : "text-slate-500 hover:text-brand-dark hover:bg-slate-50"
                                        }`}
                                >
                                    <link.icon size={16} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Area */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-brand-dark hover:bg-slate-50 rounded-full transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9 border-2 border-slate-100",
                                userButtonPopoverCard: "shadow-2xl border border-slate-200"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
