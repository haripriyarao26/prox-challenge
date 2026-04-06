# Prox Founding Engineer Challenge

<img src="product.webp" alt="Vulcan OmniPro 220" width="400" /> <img src="product-inside.webp" alt="Vulcan OmniPro 220 — inside panel" width="400" />

## The Product

The [Vulcan OmniPro 220](https://www.harborfreight.com/omnipro-220-industrial-multiprocess-welder-with-120240v-input-57812.html) is a multiprocess welding system sold by Harbor Freight. It supports four welding processes (MIG, Flux-Cored, TIG, and Stick), runs on both 120V and 240V input, and has an LCD-based synergic control system.

Its owner's manual is 48 pages of dense technical content. Duty cycle matrices across multiple voltages and amperages, polarity setup procedures that differ per welding process, wire feed mechanisms with specific tensioner calibrations, wiring schematics, troubleshooting matrices, weld diagnosis diagrams, and a full parts list.

This is exactly the kind of product Prox exists for. Nobody knows how to use this machine straight out of the box but has time to read 48 page manual, but a complicated machine needs expert-level support.

Additional video: https://www.youtube.com/watch?v=kxGDoGcnhBw

## Your Job

Build a multimodal reasoning agent for the Vulcan OmniPro 220 using the Claude Agent SDK. The agent must be able to answer deep technical questions about this product accurately, helpfully, and not just in text.

The manuals are in the `files/` directory.

**There is no limit to how far you can go.** You can integrate voice. You can build a full interactive experience. Sky is the limit. The more ambitious and polished, the better.

## What We're Testing

### 1. Deep Technical Accuracy

Your agent needs to answer questions like these correctly:

- "What's the duty cycle for MIG welding at 200A on 240V?"
- "I'm getting porosity in my flux-cored welds. What should I check?"
- "What polarity setup do I need for TIG welding? Which socket does the ground clamp go in?"

We will test with questions that require cross-referencing multiple manual sections, understanding visual content (diagrams, schematics, charts), and handling ambiguous questions that need clarification from the user.

### 2. Multimodal Responses

This is the most important part. Your agent must not be text-only.

- If someone asks about polarity setup, the agent should draw or show a diagram of which cable goes in which socket, not just describe it.
- If the answer relates to a specific image in the manual (the wire feed mechanism, the front panel controls, the weld diagnosis examples), the agent should surface that image.
- If a question is complex enough, the agent should generate interactive content: a duty cycle calculator, a troubleshooting flowchart, a settings configurator that takes process + material + thickness and outputs recommended wire speed and voltage.

When something is too cognitively hard to explain in words, the agent should draw it. Real-time diagrams, interactive schematics, visual walkthroughs generated through code.

For your agent to handle these responses well you need to reverse engineer Claude artifacts. Here are two places where you can start:
- https://claude.ai/artifacts (see how Claude renders interactive artifacts in chat)
- https://www.reidbarber.com/blog/reverse-engineering-claude-artifacts

### 3. Tone and Helpfulness

Imagine your user just bought this welder and is standing in their garage trying to set it up. They're not an idiot, but they're not a professional welder either.

### 4. Knowledge Extraction Quality

The manual has a mix of text, tables, labeled diagrams, schematics, and decision matrices. Some critical information exists only in images (the welding process selection chart, the weld diagnosis photos, the wiring schematic). We want to see that your agent understands and presents the visual content, not just the text.

## Tech Requirements

- Use the [Anthropic Claude Agent SDK](https://docs.anthropic.com) as the foundation for your agent.
- The project must run locally with a single API key provided via `.env`.
- You are responsible for your own API costs during development.

## How to Present Your Work

**This matters.** Your submission is not just the code — it's how you present it.

- **Build a frontend.** The best way for us to evaluate your agent is if it has a clean, simple UI we can run immediately. This is realistically the only way to properly demo an agent like this.
- **Hosting is a plus.** If you host it somewhere we can access without cloning, that's a strong signal. Not required, but it removes friction and shows initiative.
- **Write a clear README.** Explain how your agent works, what design decisions you made, how knowledge is extracted and represented, and how to run it. Your documentation will be evaluated — we want to see how you think and communicate, not just how you code.
- **Video walkthrough is a huge plus.** Record yourself demoing the agent and explaining your approach. Walk through the hard questions, show how it handles multimodal responses, explain your architecture. This gives us a much richer picture of your work than code alone.

We should be running your agent within 2 minutes of cloning your repo:

```bash
git clone <your-fork>
cd <your-fork>
cp .env.example .env   # we plug in our own Anthropic API key
npm install
npm run dev
```

## What to Submit

1. Fork this repo.
2. Build your solution.
3. Submit your fork URL through the form at [useprox.com/join/challenge](https://useprox.com/join/challenge).

---

# Implementation Details

## Architecture & Design Decisions
For this challenge, I built a highly-immersive **Industrial HUD** using Next.js 15, Tailwind CSS, and Framer Motion. I chose to move away from a traditional "chatbot" UI to create an "Expert-in-the-Loop" experience. The application features a split-pane design where natural language reasoning happens on the left, and **Dynamic Interactive Artifacts** render on the right. 

The backend relies on the **Anthropic Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`). Why the Agent SDK instead of standard Messages API? Because it natively handles the complex tool-loop and recursive reasoning required to dynamically update parameters and visually render feedback.

### Reverse-Engineered Multimodal Artifacts
To satisfy the core requirement that "the agent must not be text-only," I reverse-engineered the Claude Artifacts protocol.
When the Agent SDK encounters a cognitively complex task, its System Prompt instructs it to emit a specialized JSON payload wrapped in a \`\`\`visual\`\`\` code block. The frontend intercepts this stream and dynamically mounts React-based interactive components instead of rendering text.
- **Interactive Schematics:** If a user asks about polarity, the HUD renders a generated 3D visual of the terminals rather than prose.
- **Dynamic Charts:** Duty cycle queries generate a visual progress-chart indicating thermal tolerances.
- **Image Referencing:** (Mocked in UI via "Diagnosis Mode") the agent surfaces relevant schematic or diagnostic photos dynamically when weld quality issues are discussed.

## Knowledge Representation
Raw PDFs are notoriously difficult for standard OCR, especially when dealing with Polarity matrices and labeled diagrams.
- **Structured Knowledge Base (`lib/knowledge.ts`)**: I extracted the critical constraints (Duty Cycle Matrices, Socket Polarity configurations, and Troubleshooting logic) into strongly-typed code. This prevents the LLM from hallucinating voltages or amperage limits.
- **Visual Callbacks**: Instead of writing prose to describe technical schematics, the Agent is instructed via its System Prompt to emit specialized `visual` code blocks anytime a user asks for setup instructions. The Next.js frontend catches these blocks and renders React interactive diagrams (like the Polarity UI).

## Quick Start
1. Ensure you have Node.js installed.
2. Clone this repository.
3. Add your key to the environment file:
   ```bash
   cp .env.example .env
   # Add ANTHROPIC_API_KEY=your_key_here to .env
   ```
4. Run the application:
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```
5. Navigate to `http://localhost:3000`. Try asking: _"How do I set up my machine for TIG welding?"_ to see the visual artifact engine in action.

## Testing
An automated test script using the headless Claude SDK is included to verify technical constraints against the knowledge base:
\`\`\`bash
npm run test:agent
\`\`\`
