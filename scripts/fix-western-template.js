// Fix Western Market Standard template with realistic media
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function fixWesternTemplate() {
    console.log('🔧 Fixing Western Market Standard template...\n');

    const { data, error } = await supabase
        .from('templates')
        .update({
            preview_video_url: 'https://privatecdn.krisskross.ai/de12285f-451d-4529-9cf4-fd227229fcdb/ComfyUI_00001__de12285f-451d-4529-9cf4-fd227229fcdb.mp4',
            thumbnail_url: 'https://privatecdn.krisskross.ai/79ce1133-451f-4338-9169-33bbc25b4315/gwen_swap_00001__79ce1133-451f-4338-9169-33bbc25b4315.webp',
            config: {
                prompt: 'A Caucasian woman walking confidently down an urban street in natural daylight, wearing stylish sneakers and casual fashion clothing. Clean, professional fashion photography style with bright, appealing tones perfect for Western markets.',
                mode: 'video',
                refImages: [
                    'https://privatecdn.krisskross.ai/79ce1133-451f-4338-9169-33bbc25b4315/gwen_swap_00001__79ce1133-451f-4338-9169-33bbc25b4315.webp',
                    'https://privatecdn.krisskross.ai/c15125eb-6c9d-4c91-9036-707f6b4fa0c5/gwen_swap_00001__c15125eb-6c9d-4c91-9036-707f6b4fa0c5.webp'
                ],
                subjectConfig: {
                    race: 'white',
                    gender: 'woman',
                    age: 'adult',
                    build: null
                },
                sceneConfig: {
                    environment: 'urban_street',
                    lighting: 'natural_daylight',
                    style: 'fashion_photography',
                    actions: ['walking', 'posing']
                }
            }
        })
        .eq('name', 'Western Market Standard')
        .select();

    if (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }

    console.log('✅ Updated template successfully!');
    console.log('\nNew media URLs:');
    console.log('Video:', data[0].preview_video_url);
    console.log('Thumbnail:', data[0].thumbnail_url);
    console.log('\n✅ Fix complete! Refresh browser to see realistic image.\n');
}

fixWesternTemplate()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('❌ Failed:', err);
        process.exit(1);
    });
