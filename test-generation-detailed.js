// Detailed test script for AI generation API
const testPrompt = "Change the character action in Figure 1 to the action of holding the cat in Figure 3 with both hands, and change the background to the background picture in Figure 2 to generate a series of 3 pictures, which are bottom-up, head-up, and top-up perspectives.";

const refImages = [
    "/samples/fig1-character.jpg",
    "/samples/fig2-background.jpg",
    "/samples/fig3-cat.jpg"
];

async function testGeneration(type) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${type === 'image' ? '🎨' : '🎬'} Testing ${type.toUpperCase()} Generation`);
    console.log(`${'='.repeat(60)}`);
    console.log("Prompt:", testPrompt.substring(0, 80) + "...");
    console.log("Reference Images:", refImages);

    try {
        const requestBody = {
            type: type,
            prompt: testPrompt,
            refImages: refImages
        };

        console.log("\n📤 Sending request to /api/generate...");

        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        console.log(`\n📥 Response Status: ${response.status} ${response.statusText}`);

        const data = await response.json();

        if (!response.ok) {
            console.log("\n❌ API Error Response:");
            console.log(JSON.stringify(data, null, 2));
            return { success: false, error: data };
        }

        console.log("\n✅ Success Response:");
        console.log(JSON.stringify(data, null, 2));

        if (data.task_id) {
            console.log("\n⏳ Task created successfully!");
            console.log("   Task ID:", data.task_id);
            console.log("   Poll at: /api/generate/status?taskId=" + data.task_id);
        }

        return { success: true, data };

    } catch (error) {
        console.error("\n❌ Request Error:", error.message);
        console.error("   Stack:", error.stack);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 DETAILED AI GENERATION API TESTS");
    console.log("=".repeat(60));
    console.log("Server: http://localhost:3000");
    console.log("Time:", new Date().toISOString());

    // Test 1: Image Generation
    const imageResult = await testGeneration('image');

    // Wait before next test
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Video Generation
    const videoResult = await testGeneration('video');

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY");
    console.log("=".repeat(60));
    console.log(`Image Generation: ${imageResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Video Generation: ${videoResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log("=".repeat(60) + "\n");

    if (!imageResult.success || !videoResult.success) {
        console.log("⚠️  Some tests failed. Check the error details above.");
        process.exit(1);
    }
}

runTests();
