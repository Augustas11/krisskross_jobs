import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Init Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Missing CLERK_WEBHOOK_SECRET environment variable"
        );
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", {
            status: 400,
        });
    }

    // Handle the webhook event
    const eventType = evt.type;

    switch (eventType) {
        case "user.created": {
            const { id, email_addresses, first_name, last_name, image_url, external_accounts } = evt.data;
            const primaryEmail = email_addresses?.[0]?.email_address;

            // Check for TikTok connection
            const tiktokAccount = external_accounts?.find(
                (acc) => acc.provider === "tiktok" || acc.provider === "oauth_tiktok"
            );

            console.log(`[Clerk Webhook] User created by webhook: ${id} (${primaryEmail})`);

            let tiktokData: any = {};

            if (tiktokAccount) {
                try {
                    const client = await clerkClient();
                    const tokens = await client.users.getUserOauthAccessToken(id, "oauth_tiktok");

                    // We typically get the latest token
                    const tokenData = tokens.data.length > 0 ? tokens.data[0] : null;

                    if (tokenData) {
                        tiktokData = {
                            tiktok_connected: true,
                            tiktok_username: tiktokAccount.username || null,
                            tiktok_display_name: tiktokAccount.first_name ? `${tiktokAccount.first_name} ${tiktokAccount.last_name || ""}`.trim() : null,
                            tiktok_avatar_url: (tiktokAccount as any).avatar_url || (tiktokAccount as any).image_url || null,
                            tiktok_external_account_id: tiktokAccount.id || null,
                            tiktok_access_token: tokenData.token,
                            // Verify if scopes or refresh are returned. Often Clerk provides them if configured.
                            // If scopes/refresh aren't here, we might need to rely on re-auth or different provider config.
                            // Assuming basic access token for now.
                        };
                        console.log(`[Clerk Webhook] Retrieved TikTok token for ${id}`);
                    }
                } catch (tokenErr) {
                    console.error("[Clerk Webhook] Error fetching TikTok token:", tokenErr);
                    // Fallback to basic data without token
                    tiktokData = {
                        tiktok_connected: true,
                        tiktok_username: tiktokAccount.username || null,
                        tiktok_display_name: tiktokAccount.first_name ? `${tiktokAccount.first_name} ${tiktokAccount.last_name || ""}`.trim() : null,
                        tiktok_avatar_url: (tiktokAccount as any).avatar_url || (tiktokAccount as any).image_url || null,
                        tiktok_external_account_id: tiktokAccount.id || null,
                    };
                }
            }

            const { error } = await supabase.from("creator_profiles").insert({
                clerk_user_id: id,
                email: primaryEmail,
                full_name: `${first_name || ""} ${last_name || ""}`.trim() || "Creator",
                avatar_url: image_url,
                status: "active",
                ...tiktokData
            });

            if (error) {
                console.error("[Clerk Webhook] Error creating profile:", error);
                return new Response(`Error creating profile: ${error.message}`, { status: 500 });
            }

            break;
        }

        case "user.updated": {
            const { id, email_addresses, first_name, last_name, image_url, external_accounts } = evt.data;
            const primaryEmail = email_addresses?.[0]?.email_address;

            // Check for TikTok connection update
            const tiktokAccount = external_accounts?.find(
                (acc) => acc.provider === "tiktok" || acc.provider === "oauth_tiktok"
            );

            console.log(`[Clerk Webhook] User updated: ${id}`);

            const updateData: any = {
                email: primaryEmail,
                full_name: `${first_name || ""} ${last_name || ""}`.trim(),
                avatar_url: image_url,
                updated_at: new Date().toISOString(),
            };

            if (tiktokAccount) {
                try {
                    const client = await clerkClient();
                    const tokens = await client.users.getUserOauthAccessToken(id, "oauth_tiktok");
                    const tokenData = tokens.data.length > 0 ? tokens.data[0] : null;

                    updateData.tiktok_connected = true;
                    updateData.tiktok_username = tiktokAccount.username;
                    updateData.tiktok_external_account_id = tiktokAccount.id;
                    updateData.tiktok_display_name = tiktokAccount.first_name ? `${tiktokAccount.first_name} ${tiktokAccount.last_name || ""}`.trim() : null;
                    updateData.tiktok_avatar_url = (tiktokAccount as any).avatar_url || (tiktokAccount as any).image_url || null;

                    if (tokenData) {
                        updateData.tiktok_access_token = tokenData.token;
                        console.log(`[Clerk Webhook] Updated TikTok token for ${id}`);
                    }
                } catch (tokenErr) {
                    console.error("[Clerk Webhook] Error fetching TikTok token on update:", tokenErr);
                    // Still update profile metadata even if token fetch fails
                    updateData.tiktok_connected = true;
                    updateData.tiktok_username = tiktokAccount.username;
                    updateData.tiktok_external_account_id = tiktokAccount.id;
                }
            }

            const { error } = await supabase
                .from("creator_profiles")
                .update(updateData)
                .eq("clerk_user_id", id);

            if (error) {
                console.error("[Clerk Webhook] Error updating profile:", error);
            }

            break;
        }

        case "user.deleted": {
            const { id } = evt.data;
            console.log(`[Clerk Webhook] User deleted: ${id}`);

            if (id) {
                const { error } = await supabase
                    .from("creator_profiles")
                    .update({ status: "suspended" }) // Soft delete or suspend
                    .eq("clerk_user_id", id);

                if (error) {
                    console.error("[Clerk Webhook] Error suspending profile:", error);
                }
            }
            break;
        }

        default:
            console.log(`[Clerk Webhook] Unhandled event type: ${eventType}`);
    }

    return new Response("Webhook received", { status: 200 });
}
