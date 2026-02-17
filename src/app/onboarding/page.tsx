import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import OnboardingClient from "./OnboardingClient";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // If user already has a role, skip onboarding
    const role = (user.publicMetadata as { role?: string })?.role;
    if (role) {
        redirect("/dashboard");
    }

    return <OnboardingClient />;
}
