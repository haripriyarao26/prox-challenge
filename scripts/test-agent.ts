import { query } from "@anthropic-ai/claude-agent-sdk";
import { PRODUCT_SPECS } from "../lib/knowledge";

async function runTest(prompt: string) {
  console.log(`\n--- TESTING: "${prompt}" ---`);
  
  try {
    const result = query({
      prompt: prompt,
      options: {
        model: "claude-3-5-sonnet-latest",
        systemPrompt: `You are a technical validator. Verify if the following specs match the user's question: ${JSON.stringify(PRODUCT_SPECS)}`,
      }
    });

    for await (const message of result) {
      if (message.type === "assistant") {
        const text = (message as any).content || (message as any).text || "";
        process.stdout.write(text);
      }
    }
    console.log("\n--- TEST COMPLETE ---\n");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

async function main() {
  // Test 1: Technical Accuracy (Duty Cycle)
  await runTest("What is the duty cycle for MIG welding at 200A on 240V?");

  // Test 2: Polarity Logic
  await runTest("I am setting up for Flux-Cored welding. Which socket does the ground clamp go in?");

  // Test 3: Troubleshooting
  await runTest("I see porosity in my welds. What are the top 3 things to check?");
}

main();
