"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight text-gray-900">KrissKross Creators</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollToSection("how-it-works")} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            How It Works
                        </button>
                        <button onClick={() => scrollToSection("creator-stories")} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            Creator Stories
                        </button>
                        <button onClick={() => scrollToSection("earnings")} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            Earnings
                        </button>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-bold text-gray-600 hover:text-primary transition-colors cursor-pointer">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button className="rounded-full shadow-none" size="sm">
                                    Apply as Creator
                                </Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">
                                Dashboard
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
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 py-4 px-6 space-y-4 shadow-xl absolute w-full top-20 left-0">
                    <button onClick={() => scrollToSection("how-it-works")} className="block w-full text-left py-2 font-medium text-gray-600">
                        How It Works
                    </button>
                    <button onClick={() => scrollToSection("creator-stories")} className="block w-full text-left py-2 font-medium text-gray-600">
                        Creator Stories
                    </button>
                    <button onClick={() => scrollToSection("earnings")} className="block w-full text-left py-2 font-medium text-gray-600">
                        Earnings
                    </button>
                    <hr className="border-gray-100" />
                    <div className="pt-2 flex flex-col gap-3">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="w-full text-center py-3 font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button className="w-full rounded-xl py-6 text-lg">
                                    Apply as Creator
                                </Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <UserButton showName />
                                </div>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full rounded-xl bg-primary py-3 text-lg font-bold text-white text-center shadow-lg"
                                >
                                    Go to Dashboard
                                </Link>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            )}
        </nav>
    );
}
