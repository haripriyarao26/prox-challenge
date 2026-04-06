import { query } from "@anthropic-ai/claude-agent-sdk";
import { PRODUCT_SPECS } from "../lib/knowledge";

async function runTest(prompt: string) {
  console.log(`\n--- TESTING: "${prompt}" ---`);
  
  try {
    const result = query({
      prompt: prompt,
      options: {
        model: "claude-3-5-sonnet-latest",
        systemPrompt: `You are an expert technical advisor for the Vulcan OmniPro 220 Multiprocess Welder. 
Use the following product specifications to answer user questions:
${JSON.stringify(PRODUCT_SPECS)}

VISUAL ARTIFACTS:
When a setup requires a visual (wiring, polarity, charts), you MUST generate a code block with the language 'visual'.
The content of the code block should be a JSON object with 'type' and 'metadata'.
Types: 'POLARITY', 'DUTY_CYCLE', 'DIAGNOSIS', 'WIRING'.

Example:
\`\`\`visual
{
  "type": "POLARITY",
  "metadata": { "process": "MIG", "positive": "Torch", "negative": "Ground" }
}
\`\`\`

Be concise, technical, and prioritize safety.`,
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
  await runTest("I am setting up for Flux-Cored welding. Which socket does the ground clamp go in?");
}

main();
