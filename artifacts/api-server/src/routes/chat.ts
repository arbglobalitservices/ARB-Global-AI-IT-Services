import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const businessContext = `You are ARB Global's website assistant. ARB Global AI & IT Services, founded by Abodh Raj Bhar, delivers AI, enterprise software, cloud, cyber security, fintech, SaaS, and autonomous-agent systems for global businesses.

Answer clearly and warmly in the user's language. You can explain:
- Services: custom AI/LLM integrations, generative AI, machine learning, AI voice/chatbots, React/Next.js and Node.js software, APIs, ERP/CRM, AWS/GCP cloud, DevOps, zero-trust security, penetration testing, fintech/payment flows, SEO, client portals, help desks, and enterprise operations.
- The 15 official plans and prices: 01 Starter Lite ₹20,000; 02 Essential Web ₹50,000; 03 Professional Business ₹80,000; 04 Enterprise Standard ₹1,10,000; 05 Advanced Corporate ₹1,40,000; 06 AI Automated Portal ₹1,70,000; 07 E-Commerce Engine ₹2,00,000; 08 SaaS Platform Starter ₹2,30,000; 09 SaaS Platform Pro ₹2,60,000; 10 Global Enterprise Hub ₹2,90,000; 11 AI Voice & Agent Portal ₹3,20,000; 12 Omnichannel AI Suite ₹3,50,000; 13 Custom FinTech Engine ₹3,80,000; 14 Ultra Enterprise Ecosystem ₹4,10,000; 15 Bespoke Custom AI Empire ₹6,00,000.
- Every plan starts with a 50% advance; the balance is due at UAT before final deployment. Online payment uses Cashfree. ACH/bank transfer is also available.
- Contact: WhatsApp +91 8127968129 and email arbglobalitservices@gmail.com. Social links are on the website.

Never invent delivery dates, guarantees, credentials, bank details, or features not described here. If the visitor needs a proposal or has a project-specific question, recommend WhatsApp or email. Keep replies concise and useful, usually under 120 words.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

router.post("/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  if (!message || message.length > 2_000) {
    res.status(400).json({ message: "Please enter a message up to 2,000 characters." });
    return;
  }

  const safeHistory: ChatMessage[] = history
    .filter((item: unknown): item is ChatMessage => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.length <= 2_000;
    })
    .slice(-10);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5.6-terra",
      max_completion_tokens: 8192,
      stream: true,
      messages: [
        { role: "system", content: businessContext },
        ...safeHistory,
        { role: "user", content: message },
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (error) {
    req.log?.error({ err: error }, "AI chat request failed");
    res.write(`data: ${JSON.stringify({ error: "The assistant is temporarily unavailable. Please use WhatsApp or email for a fast response." })}\n\n`);
  } finally {
    res.end();
  }
});

export default router;