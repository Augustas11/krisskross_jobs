import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // check for tiktok account
        const tiktokAccount = user.externalAccounts.find(
            (acc) => acc.provider === "tiktok" || acc.provider === "oauth_tiktok"
        );

        if (!tiktokAccount) {
            return NextResponse.json({
                success: false,
                message: "No TikTok account linked in Clerk"
            });
        }

        // Fetch tokens
        const client = await clerkClient();
        const tokens = await client.users.getUserOauthAccessToken(user.id, "oauth_tiktok");
        const tokenData = tokens.data.length > 0 ? tokens.data[0] : null;

        const updateData: any = {
            tiktok_connected: true,
            tiktok_username: tiktokAccount.username || tiktokAccount.firstName, // Fallback
            tiktok_external_account_id: tiktokAccount.id,
            tiktok_display_name: tiktokAccount.firstName ? `${tiktokAccount.firstName} ${tiktokAccount.lastName || ""}`.trim() : null,
            tiktok_avatar_url: (tiktokAccount as any).imageUrl || (tiktokAccount as any).avatarUrl || null,
            updated_at: new Date().toISOString(),
        };

        if (tokenData) {
            updateData.tiktok_access_token = tokenData.token;
            // updateData.tiktok_token_expires_at = ... // if available
        }

        // Update Supabase
        const { error } = await supabase
            .from("creator_profiles")
            .update(updateData)
            .eq("clerk_user_id", user.id);

        if (error) {
            console.error("Error syncing profile to Supabase:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            profile: updateData
        });

    } catch (error) {
        console.error("Error in sync-profile:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
