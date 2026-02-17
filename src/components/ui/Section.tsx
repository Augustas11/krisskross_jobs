import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    background?: "white" | "warm" | "dark" | "blue";
}

export function Section({ children, className, id, background = "white" }: SectionProps) {
    const bgColors = {
        white: "bg-white",
        warm: "bg-[#FAFAF9]", // Warm white / cream
        dark: "bg-[#0A0A0A]",
        blue: "bg-[#1d4ed8]",
    };

    return (
        <section
            id={id}
            className={cn(
                "py-20 md:py-24 px-6 md:px-8 overflow-hidden",
                bgColors[background],
                className
            )}
        >
            <div className="mx-auto max-w-7xl relative z-10 w-full">
                {children}
            </div>
        </section>
    );
}
