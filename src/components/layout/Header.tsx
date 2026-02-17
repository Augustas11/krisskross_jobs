"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";

    // Helper to handle scrolling on homepage or navigation on other pages
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        setMobileMenuOpen(false); // Close mobile menu if open

        if (isHome) {
            e.preventDefault();
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const navLinks = [
        { label: "Browse Projects", href: "#browse-projects", isHash: true },
        { label: "How It Works", href: "#how-it-works", isHash: true },
        { label: "For Creators", href: "/creators", isHash: false }, // Placeholder route
        { label: "For Brands", href: "/brands", isHash: false },     // Placeholder route
    ];

    if (isHome || pathname.startsWith("/dashboard")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2 group z-50 relative">
                    <span className="text-xl font-black tracking-tight text-brand-dark">
                        KrissKross Creators
                    </span>
                </Link>

                {/* Center: Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.isHash && !isHome ? `/${link.href}` : link.href}
                            onClick={(e) => link.isHash ? handleNavClick(e, link.href.replace('#', '')) : null}
                            className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/pipeline"
                        className="group flex items-center gap-1.5 text-sm font-bold text-orange-500 transition-all whitespace-nowrap leading-none px-3 py-1.5 bg-orange-500/5 rounded-full border border-orange-500/10 hover:bg-orange-500 hover:text-white"
                    >
                        🔬 AI Pipeline
                    </Link>
                </nav>

                {/* Right: Auth Buttons & Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-4">
                        {/* We use a check for Clerk environment variable in layout, but here we can just render the logic. 
                 If Clerk is not fully configured, SignedOut might not render children or might throw, 
                 but based on layout.tsx usage, it seems safe to assume Clerk components are widely used. 
                 We will wrap with same logic as layout if needed, but standard Clerk usage is fine. */}

                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-bold text-slate-600 hover:text-brand-dark transition-colors cursor-pointer">
                                    Log In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                                    Start Portfolio
                                </button>
                            </SignUpButton>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-brand-dark transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/variations" className="text-sm font-bold text-slate-600 hover:text-brand-dark transition-colors">
                                Variations
                            </Link>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9",
                                    },
                                }}
                            />
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-50 relative"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                style={{ top: "0" }}
            >
                <div className="flex flex-col h-full pt-24 px-6 pb-6 overflow-y-auto">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.isHash && !isHome ? `/${link.href}` : link.href}
                                    onClick={(e) => link.isHash ? handleNavClick(e, link.href.replace('#', '')) : setMobileMenuOpen(false)}
                                    className="text-xl font-bold text-slate-800 py-3 border-b border-slate-100 flex items-center justify-between group"
                                >
                                    {link.label}
                                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                            <Link
                                href="/pipeline"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl font-bold text-orange-500 py-3 border-b border-slate-100 flex items-center justify-between"
                            >
                                AI Pipeline
                                <ChevronRight className="h-5 w-5 text-orange-300" />
                            </Link>
                        </div>

                        <div className="pt-6 mt-auto">
                            <SignedOut>
                                <div className="grid gap-4">
                                    <SignInButton mode="modal">
                                        <button className="w-full rounded-xl border-2 border-slate-200 py-3 text-lg font-bold text-slate-600 hover:border-brand-dark hover:text-brand-dark transition-colors">
                                            Log In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button className="w-full rounded-xl bg-primary py-3 text-lg font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-colors">
                                            Start Portfolio
                                        </button>
                                    </SignUpButton>
                                </div>
                            </SignedOut>

                            <SignedIn>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                        <UserButton showName />
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full rounded-xl bg-brand-dark py-3 text-lg font-bold text-white text-center shadow-lg"
                                    >
                                        Go to Dashboard
                                    </Link>
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
