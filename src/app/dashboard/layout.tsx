import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    LayoutGrid,
    Briefcase,
    FileText,
    Plus,
    Users,
    Heart,
    User,
    Building2,
} from "lucide-react";

export const dynamic = "force-dynamic";

type UserRole = "job_seeker" | "employer";

function getUserRole(publicMetadata: Record<string, unknown>): UserRole | null {
    return (publicMetadata?.role as UserRole) ?? null;
}

const seekerNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "My Applications", href: "/seeker/applications", icon: FileText },
    { label: "Saved Jobs", href: "/seeker/saved", icon: Heart },
    { label: "My Profile", href: "/seeker/profile", icon: User },
];

const employerNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "My Listings", href: "/employer/listings", icon: Briefcase },
    { label: "Post a Job", href: "/employer/post-job", icon: Plus },
    { label: "Applications", href: "/employer/applications", icon: Users },
    { label: "Company", href: "/employer/company", icon: Building2 },
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

    const role = getUserRole(user.publicMetadata as Record<string, unknown>);

    if (!role) {
        redirect("/onboarding");
    }

    const navItems = role === "employer" ? employerNav : seekerNav;

    return (
        <div className="min-h-[calc(100vh-4rem)] flex bg-slate-50/50">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6">
                {/* Role Badge */}
                <div className="mb-8">
                    <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider ${role === "employer"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                    >
                        {role === "employer" ? (
                            <Briefcase className="h-3 w-3" />
                        ) : (
                            <User className="h-3 w-3" />
                        )}
                        {role === "employer" ? "Employer" : "Job Seeker"}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
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
