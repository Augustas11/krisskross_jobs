import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "white" | "black";
    size?: "sm" | "md" | "lg" | "xl";
    loading?: boolean;
    className?: string;
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-[#1d4ed8] text-white hover:bg-blue-800 shadow-md shadow-blue-500/20",
        secondary: "bg-[#F3F4F6] text-[#1F2937] hover:bg-gray-200",
        outline: "border-2 border-[#E5E7EB] text-[#374151] hover:border-gray-400 hover:text-black bg-transparent",
        ghost: "text-[#4B5563] hover:text-black hover:bg-black/5 bg-transparent",
        white: "bg-white text-black hover:bg-gray-100 shadow-md",
        black: "bg-[#0A0A0A] text-white hover:bg-gray-900 border border-white/10 shadow-xl", // Improved black variant
    };

    const sizes = {
        sm: "px-4 py-2 text-sm font-medium rounded-lg",
        md: "px-6 py-3 text-base font-semibold rounded-xl",
        lg: "px-8 py-4 text-lg font-bold rounded-xl",
        xl: "px-10 py-5 text-xl font-black rounded-2xl",
    };

    return (
        <button
            disabled={disabled || loading}
            className={cn(
                "inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {children}
        </button>
    );
}
