// Test script for AI generation API
const testPrompt = "Change the character action in Figure 1 to the action of holding the cat in Figure 3 with both hands, and change the background to the background picture in Figure 2 to generate a series of 3 pictures, which are bottom-up, head-up, and top-up perspectives.";

const refImages = [
    "/samples/fig1-character.jpg",
    "/samples/fig2-background.jpg",
    "/samples/fig3-cat.jpg"
];

async function testImageGeneration() {
    console.log("\n🎨 Testing IMAGE Generation...");
    console.log("Prompt:", testPrompt);
    console.log("Reference Images:", refImages);

    try {
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'image',
                prompt: testPrompt,
                refImages: refImages
            })
        });

        const data = await response.json();
        console.log("\n✅ Image Generation Response:");
        console.log(JSON.stringify(data, null, 2));

        if (data.task_id) {
            console.log("\n⏳ Task ID received:", data.task_id);
            console.log("You can poll status at: /api/generate/status?taskId=" + data.task_id);
        }

        return data;
    } catch (error) {
        console.error("\n❌ Image Generation Error:", error.message);
        throw error;
    }
}

async function testVideoGeneration() {
    console.log("\n🎬 Testing VIDEO Generation...");
    console.log("Prompt:", testPrompt);
    console.log("Reference Images:", refImages);

    try {
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'video',
                prompt: testPrompt,
                refImages: refImages
            })
        });

        const data = await response.json();
        console.log("\n✅ Video Generation Response:");
        console.log(JSON.stringify(data, null, 2));

        if (data.task_id) {
            console.log("\n⏳ Task ID received:", data.task_id);
            console.log("You can poll status at: /api/generate/status?taskId=" + data.task_id);
        }

        return data;
    } catch (error) {
        console.error("\n❌ Video Generation Error:", error.message);
        throw error;
    }
}

async function runTests() {
    console.log("=".repeat(60));
    console.log("🚀 Starting AI Generation Tests");
    console.log("=".repeat(60));

    try {
        // Test 1: Image Generation
        const imageResult = await testImageGeneration();

        // Wait a bit before next test
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 2: Video Generation
        const videoResult = await testVideoGeneration();

        console.log("\n" + "=".repeat(60));
        console.log("✅ All tests completed!");
        console.log("=".repeat(60));

    } catch (error) {
        console.log("\n" + "=".repeat(60));
        console.log("❌ Tests failed with error:", error.message);
        console.log("=".repeat(60));
        process.exit(1);
    }
}

runTests();
