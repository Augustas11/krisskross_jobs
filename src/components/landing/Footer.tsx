import { Github, Twitter, Instagram, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                {/* Brand */}
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-black tracking-tight text-white">KrissKross</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-900/20 px-2 py-0.5 rounded border border-blue-900/50">Creator</span>
                    </Link>
                    <p className="text-gray-500 text-sm max-w-xs">
                        AI-powered video tools for e-commerce creators. Turn your skills into income.
                    </p>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-3 text-sm font-medium text-gray-400">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                </div>

                {/* Social / Contact */}
                <div>
                    <div className="flex gap-4 mb-6">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                            <span className="sr-only">TikTok</span>
                            {/* TikTok Icon Placeholder (Music note or similar) */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="mailto:hello@krisskross.ai" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                    <p className="text-gray-500 text-sm">
                        hello@krisskross.ai
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center md:text-left">
                <p className="text-xs text-gray-600 font-medium">
                    © 2026 KrissKross. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
