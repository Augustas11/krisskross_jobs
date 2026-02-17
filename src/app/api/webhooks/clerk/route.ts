import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

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
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;
            const primaryEmail = email_addresses?.[0]?.email_address;

            console.log(`[Clerk Webhook] User created: ${id} (${primaryEmail})`);

            // TODO: Sync to your database
            // Example: await db.users.create({
            //   clerkId: id,
            //   email: primaryEmail,
            //   firstName: first_name,
            //   lastName: last_name,
            //   avatarUrl: image_url,
            // });

            break;
        }

        case "user.updated": {
            const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data;
            const primaryEmail = email_addresses?.[0]?.email_address;
            const role = (public_metadata as { role?: string })?.role;

            console.log(`[Clerk Webhook] User updated: ${id} (${primaryEmail}), role: ${role}`);

            // TODO: Sync updates to your database
            // Example: await db.users.update({
            //   where: { clerkId: id },
            //   data: {
            //     email: primaryEmail,
            //     firstName: first_name,
            //     lastName: last_name,
            //     avatarUrl: image_url,
            //     role: role,
            //   },
            // });

            break;
        }

        case "user.deleted": {
            const { id } = evt.data;

            console.log(`[Clerk Webhook] User deleted: ${id}`);

            // TODO: Handle user deletion in your database
            // Example: await db.users.delete({ where: { clerkId: id } });

            break;
        }

        default:
            console.log(`[Clerk Webhook] Unhandled event type: ${eventType}`);
    }

    return new Response("Webhook received", { status: 200 });
}
