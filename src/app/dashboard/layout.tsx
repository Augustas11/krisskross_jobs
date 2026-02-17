import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";

export const dynamic = "force-dynamic";

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
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-20 md:pb-0">
            <DashboardHeader />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
                {children}
            </main>
            <MobileBottomNav />
        </div>
    );
}
