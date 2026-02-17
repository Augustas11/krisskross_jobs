import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/50 p-6">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-red-50 text-red-500 mb-6">
                    <ShieldAlert className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-black text-brand-dark mb-3">
                    Access Restricted
                </h1>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    You don&apos;t have permission to access this page. This area is restricted to a different user role.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-dark px-6 py-3 text-sm font-black text-white shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Home className="h-4 w-4" /> Go Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" /> Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
