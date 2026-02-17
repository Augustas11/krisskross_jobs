
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ApifyClient } from "npm:apify-client";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { clerk_user_id, tiktok_username } = await req.json();

        if (!clerk_user_id || !tiktok_username) {
            throw new Error("Missing clerk_user_id or tiktok_username");
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const apifyToken = Deno.env.get("APIFY_API_TOKEN");
        if (!apifyToken) {
            // Fallback: If no token, just update status to 'pending_enrichment' or log warning
            console.warn("Missing APIFY_API_TOKEN. Skipping enrichment.");
            return new Response(JSON.stringify({ message: "Enrichment skipped (no token)" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const client = new ApifyClient({
            token: apifyToken,
        });

        console.log(`Starting TikTok enrichment for ${tiktok_username}...`);

        // Call Apify Actor: apify/tiktok-scraper
        const run = await client.actor("apify/tiktok-scraper").call({
            profiles: [tiktok_username],
            resultsPerPage: 20, // Get last 20 videos
            shouldDownloadVideos: false,
            shouldDownloadCovers: false,
            shouldDownloadSlideshowImages: false,
        });

        console.log(`Apify run started: ${run.id}`);

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log(`Fetched ${items.length} items from Apify.`);

        // Isolate Profile Data (usually first item or structured differently depending on actor version, 
        // assuming items contains video objects mixed with profile data or just video objects which contain authorMeta)

        // We need to find authorMeta from any video item
        const profileItem = items.find((item: any) => item.authorMeta && item.authorMeta.name === tiktok_username);
        const authorMeta = profileItem?.authorMeta;

        if (authorMeta) {
            // Update Creator Profile
            const { error: profileError } = await supabase
                .from("creator_profiles")
                .update({
                    tiktok_followers: authorMeta.fans,
                    tiktok_verified: authorMeta.verified,
                    tiktok_bio: authorMeta.signature,
                    tiktok_avatar_url: authorMeta.avatar, // Update avatar if better quality
                    last_tiktok_sync_at: new Date().toISOString(),
                })
                .eq("clerk_user_id", clerk_user_id);

            if (profileError) console.error("Error updating profile:", profileError);
        }

        // Process Videos
        let totalEngagement = 0;
        let videoCount = 0;
        let totalViews = 0;

        for (const item of items) {
            const anyItem = item as any;
            if (!anyItem.id) continue;

            // Extract metrics
            const views = anyItem.playCount || 0;
            const likes = anyItem.diggCount || 0;
            const comments = anyItem.commentCount || 0;
            const shares = anyItem.shareCount || 0;
            const engagementRate = views > 0 ? ((likes + comments + shares) / views) * 100 : 0;

            totalEngagement += engagementRate;
            totalViews += views;
            videoCount++;

            // Calculate simple hook score based on engagement relative to... average? 
            // For now, random or heuristic placeholder until analytics engine is fully ported
            const heuristicScore = Math.min(Math.round(engagementRate * 2), 10);

            // Upsert Video
            const { error: videoError } = await supabase
                .from("creator_videos")
                .upsert({
                    creator_id: (await supabase.from("creator_profiles").select("id").eq("clerk_user_id", clerk_user_id).single()).data?.id,
                    tiktok_video_id: anyItem.id,
                    tiktok_url: anyItem.webVideoUrl,
                    thumbnail_url: anyItem.videoMeta?.coverUrl,
                    width: anyItem.videoMeta?.width, // if column exists, or ignore
                    height: anyItem.videoMeta?.height,
                    duration_seconds: anyItem.videoMeta?.duration,
                    caption: anyItem.text,
                    hashtags: anyItem.hashtags?.map((h: any) => h.name) || [],
                    posted_at: new Date(anyItem.createTime * 1000).toISOString(),

                    views,
                    likes,
                    comments,
                    shares,
                    saves: anyItem.collectCount || 0, // checking if collectCount exists
                    engagement_rate: engagementRate,

                    hook_effectiveness_score: heuristicScore,
                    // content_type: inferContentType(anyItem.text), // helper function?
                }, { onConflict: "tiktok_video_id" });

            if (videoError) console.error("Error upserting video:", videoError);
        }

        // Calculate & Update Creator Score
        if (videoCount > 0) {
            const avgEngagement = totalEngagement / videoCount;
            const avgViews = Math.round(totalViews / videoCount);

            // Simple 0-100 score logic
            // Baselines: 5% engagement is good (50pts), 10% is great (80pts). 
            // Views: 1000 avg (20pts), 10k avg (50pts), 100k avg (90pts).

            const engScore = Math.min(avgEngagement * 10, 60); // Max 60 pts from engagement
            const viewScore = Math.min(Math.log10(Math.max(avgViews, 1)) * 10, 40); // Max 40 pts from views

            const totalScore = Math.round(engScore + viewScore);

            await supabase.from("creator_profiles").update({
                creator_score: totalScore,
                avg_engagement_rate: avgEngagement,
                avg_views_per_video: avgViews,
                total_videos_analyzed: videoCount
            }).eq("clerk_user_id", clerk_user_id);
        }

        return new Response(JSON.stringify({ success: true, videos_processed: videoCount }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
