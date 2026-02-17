import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";


export default async function EmployerPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");
    redirect("/employer/listings");
}
