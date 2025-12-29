// Test to find available models
const API_KEY = 'b9a4116d-85e8-43ea-b1a6-22c5092c9604';

async function listModels() {
    console.log("Attempting to list available models...\n");

    const endpoints = [
        'https://ark.ap-southeast.bytepluses.com/api/v3/models',
        'https://ark.ap-southeast.bytepluses.com/api/v3/endpoints',
    ];

    for (const endpoint of endpoints) {
        console.log(`\nTrying: ${endpoint}`);
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            console.log(`Status: ${response.status}`);
            const data = await response.json();
            console.log('Response:', JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

listModels();
