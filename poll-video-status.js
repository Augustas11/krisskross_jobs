// Poll video generation status
const API_KEY = 'b9a4116d-85e8-43ea-b1a6-22c5092c9604';
const taskId = 'cgt-20251229154107-b4f7k';

async function pollVideoStatus() {
    console.log(`Polling video generation status for task: ${taskId}\n`);

    const maxAttempts = 60; // Poll for up to 5 minutes
    const pollInterval = 5000; // 5 seconds

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`[Attempt ${attempt}/${maxAttempts}] Checking status...`);

            const response = await fetch(
                `https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks/${taskId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    }
                }
            );

            const data = await response.json();
            console.log(`Status: ${response.status}`);
            console.log('Response:', JSON.stringify(data, null, 2));

            if (data.status === 'succeeded') {
                console.log('\n✅ Video generation completed successfully!');
                console.log('Video URL:', data.result?.video_url || data.result?.url);

                // Save the final result
                const fs = require('fs');
                const path = require('path');
                const dir = path.join(__dirname, 'test-results');
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                fs.writeFileSync(
                    path.join(dir, 'video-generation-final-response.json'),
                    JSON.stringify(data, null, 2)
                );
                console.log('\n💾 Saved final response to test-results/video-generation-final-response.json');

                return data;
            } else if (data.status === 'failed') {
                console.log('\n❌ Video generation failed!');
                console.log('Error:', data.error || data.message);
                return data;
            } else {
                console.log(`Status: ${data.status || 'processing'} - waiting...`);
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            }

        } catch (error) {
            console.error('Error polling status:', error.message);
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
    }

    console.log('\n⏱️ Polling timeout - video is still processing');
}

pollVideoStatus();
