import Link from "next/link";
import { Sparkles, ArrowRight, Home } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
            {/* Navigation - Simplified */}
            <nav className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-black text-base shadow-lg shadow-primary/20">KJ</div>
                        <span className="text-xl font-bold tracking-tight text-brand-dark">KrissKross <span className="text-primary font-black">Jobs</span></span>
                    </Link>

                    <Link href="/" className="text-sm font-bold text-slate-500 hover:text-brand-dark flex items-center gap-2">
                        <Home className="h-4 w-4" /> Back to Home
                    </Link>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-10">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-black text-brand-dark mb-2">Welcome Back</h1>
                            <p className="text-slate-500 font-medium">Sign in to your Creator Studio</p>
                        </div>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full rounded-xl border border-slate-200 p-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                                    <a href="#" className="text-xs font-bold text-primary hover:text-primary/80">Forgot?</a>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-slate-200 p-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none"
                                />
                            </div>

                            <button className="w-full rounded-2xl bg-brand-dark py-4 text-lg font-black text-white shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                                Sign In <ArrowRight className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
                        <p className="text-sm font-bold text-slate-500">
                            Don't have an account? <Link href="/?signup=true" className="text-primary hover:underline">Apply for Access</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
