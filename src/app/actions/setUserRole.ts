"use server";

import { clerkClient, auth } from "@clerk/nextjs/server";

export type UserRole = "creator";

export async function setUserRole(role: UserRole) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Not authenticated");
    }

    const client = await clerkClient();

    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            role,
        },
    });

    return { success: true };
}
