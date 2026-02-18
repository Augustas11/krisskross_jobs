"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <section className="bg-white rounded-[32px] border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6 mx-auto">
                {icon}
            </div>
            <h3 className="text-xl font-black text-brand-dark mb-2">{title}</h3>
            <p className="text-slate-500 font-medium mb-2 max-w-sm mx-auto leading-relaxed">
                {description}
            </p>

            {action && (
                action.href ? (
                    <Link href={action.href}>
                        <button
                            className="mt-6 bg-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2 mx-auto"
                            onClick={action.onClick}
                        >
                            {action.label}
                            {action.href && <ArrowRight size={18} />}
                        </button>
                    </Link>
                ) : (
                    <button
                        className="mt-6 bg-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2 mx-auto"
                        onClick={action.onClick}
                    >
                        {action.label}
                        {action.href && <ArrowRight size={18} />}
                    </button>
                )
            )}
        </section>
    );
}

interface ErrorStateProps {
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    secondary?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
}

export function ErrorState({ title, description, action, secondary }: ErrorStateProps) {
    return (
        <div className="bg-red-50 rounded-[32px] border border-red-100 p-8 text-center">
            <h3 className="text-lg font-black text-red-900 mb-2">{title}</h3>
            <p className="text-red-600/80 font-medium mb-6 max-w-sm mx-auto text-sm">
                {description}
            </p>
            <div className="flex items-center justify-center gap-4">
                {action && (
                    <button
                        onClick={action.onClick}
                        className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
                    >
                        {action.label}
                    </button>
                )}
                {secondary && (
                    <Link
                        href={secondary.href || "#"}
                        className="text-red-400 font-bold text-sm hover:text-red-500 transition-colors"
                    >
                        {secondary.label}
                    </Link>
                )}
            </div>
        </div>
    );
}
