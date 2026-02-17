import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    LayoutGrid,
    FileText,
    Library,
    Palette,
    User,
} from "lucide-react";

export const dynamic = "force-dynamic";

const creatorNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "My Templates", href: "/dashboard/templates", icon: Palette },
    { label: "My Library", href: "/dashboard/library", icon: Library },
];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const role = (user.publicMetadata as Record<string, unknown>)?.role as string | undefined;

    if (!role) {
        redirect("/onboarding");
    }

    // Only creator role is supported
    if (role !== "creator") {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex bg-slate-50/50">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6">
                {/* Role Badge */}
                <div className="mb-8">
                    <div
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-primary/10 text-primary"
                    >
                        <Palette className="h-3 w-3" />
                        Creator
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    {creatorNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-dark transition-colors"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User info */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                    <p className="text-xs font-bold text-slate-400 truncate">
                        {user.emailAddresses[0]?.emailAddress}
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
