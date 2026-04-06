import { query } from "@anthropic-ai/claude-agent-sdk";
import { PRODUCT_SPECS } from "@/lib/knowledge";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const userMessage = messages[messages.length - 1].content;

    const result = query({
      prompt: userMessage,
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

    let responseText = "";

    for await (const message of result) {
      if (message.type === "assistant") {
        const content = (message as any).content || (message as any).text || "";
        responseText += content;
      }
    }

    return NextResponse.json({ 
      content: responseText
    });

  } catch (error: any) {
    console.error("Agent Error:", error);
    return NextResponse.json({ 
      error: "Agent failed to respond", 
      details: error?.message || String(error),
      stack: error?.stack 
    }, { status: 500 });
  }
}
