// Simple API test to discover the correct endpoint and format
const API_KEY = 'b9a4116d-85e8-43ea-b1a6-22c5092c9604';

async function testAPI() {
    console.log("Testing BytePlus API...\n");

    // Try different endpoints
    const endpoints = [
        'https://ark.ap-southeast.bytepluses.com/api/v3/chat/completions',
        'https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks',
    ];

    const testPayload = {
        model: 'ep-20241230185503-vgrhk',
        messages: [{
            role: 'user',
            content: 'Hello, test message'
        }]
    };

    for (const endpoint of endpoints) {
        console.log(`\nTrying endpoint: ${endpoint}`);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify(testPayload)
            });

            console.log(`Status: ${response.status} ${response.statusText}`);
            const data = await response.json();
            console.log('Response:', JSON.stringify(data, null, 2));

            if (response.ok) {
                console.log('\n✅ SUCCESS! This endpoint works!');
                break;
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

testAPI();
