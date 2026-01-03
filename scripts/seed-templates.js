const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const templates = [
    {
        name: "Cinematic Product Reveal",
        description: "A high-energy, fast-paced product reveal perfect for dropshipping ads. Features dynamic camera swoops and particle effects.",
        price_usd: 15.00,
        category: "E-commerce",
        status: "active",
        thumbnail_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        preview_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        config: {
            prompt: "Cinematic close-up of a consumer product, rotating 360 degrees, dramatic lighting, 4k resolution, unreal engine render style.",
            duration: 5,
            aspect_ratio: "9:16"
        }
    },
    {
        name: "TikTok Viral Dancer",
        description: "Get your song trending with this AI dance template. Replaces your character with a professional dancer in a neon city environment.",
        price_usd: 25.00,
        category: "Social Media",
        status: "active",
        thumbnail_url: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1000&auto=format&fit=crop",
        preview_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        config: {
            prompt: "Cyberpunk street style dancer performing hip hop moves, neon lights, rainy street background, futuristic fashion.",
            duration: 8,
            aspect_ratio: "9:16"
        }
    },
    {
        name: "Luxury Real Estate Walkthrough",
        description: "Smooth, stabilizing camera motion for showcasing interiors. Adds virtual staging to empty rooms automatically.",
        price_usd: 40.00,
        category: "Real Estate",
        status: "active",
        thumbnail_url: "https://images.unsplash.com/photo-1600596542815-2004cb5327fb?q=80&w=1000&auto=format&fit=crop",
        preview_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        config: {
            prompt: "Wide angle shot of a luxury modern living room, white minimalistic furniture, floor to ceiling windows, ocean view, sunlight streaming in.",
            duration: 10,
            aspect_ratio: "16:9"
        }
    },
    {
        name: "Tech Unboxing & Review",
        description: "Perfect for tech reviewers. Generates clean, studio-lit b-roll of gadgets on a white or black background.",
        price_usd: 10.00,
        category: "Tech",
        status: "active",
        thumbnail_url: "https://images.unsplash.com/photo-1526406915894-7bcd43f63619?q=80&w=1000&auto=format&fit=crop",
        preview_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        config: {
            prompt: "Top down view of a smartphone on a clean white desk, hands unboxing it, crisp lighting, macro shots details.",
            duration: 6,
            aspect_ratio: "9:16"
        }
    }
];

async function seed() {
    console.log('Seeding templates...');

    let creatorId = null;

    // Try to list users
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (users && users.users.length > 0) {
        creatorId = users.users[0].id;
        console.log('Attributing to existing creator:', users.users[0].email);
    } else {
        console.log('No users found. Creating a "Seed Creator"...');
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: 'creator@krisskross.ai',
            password: 'password123',
            email_confirm: true
        });

        if (createError) {
            console.error('Failed to create seed user:', createError);
            process.exit(1);
        }
        creatorId = newUser.user.id;
        console.log('Created new seed user:', newUser.user.email);
    }

    const templatesWithCreator = templates.map(t => ({
        ...t,
        creator_id: creatorId
    }));

    const { data, error } = await supabase
        .from('templates')
        .insert(templatesWithCreator)
        .select();

    if (error) {
        console.error('Error seeding:', error);
    } else {
        console.log('Success! Created templates:', data.length);
    }
}

seed();
