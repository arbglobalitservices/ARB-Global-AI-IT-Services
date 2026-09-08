import { Router, type IRouter } from "express";

const router: IRouter = Router();

const GROQ_API_KEY = process.env.OPENAI_API_KEY || "";
const GROQ_MODEL = process.env.OPENAI_MODEL || "llama-3.3-70b-versatile";

const businessContext = `You are ARB Global's website assistant. ARB Global AI & IT Services, founded by Abodh Raj Bhar.

Answer clearly and warmly in the user's language. You can explain:
- Services: custom AI/LLM integrations, generative AI, machine learning, AI voice/chatbots, React/Next.js and Node.js solutions.
- The 15 official plans and prices: 01 Starter Lite ₹20,000; 02 Essential Web ₹50,000; 03 Professional Business ₹80,000.
- Every plan starts with a 50% advance; the balance is due at UAT before final deployment. Online payment uses Cashfree.
- Contact: WhatsApp +91 8127968129 and email arbglobalservices@gmail.com. Social links are on the website.

Never invent delivery dates, guarantees, credentials, bank details, or features not described here. If the visitor needs custom scopes, encourage booking an intro call or reaching out via WhatsApp/email.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

router.post("/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!message || message.length > 2000) {
    res.status(400).json({ message: "Please enter a message up to 2,000 characters." });
    return;
  }

  const safeHistory: ChatMessage[] = history
    .filter((item: unknown): item is ChatMessage => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.length <= 2000
      );
    })
    .slice(-10);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 2048,
        stream: true,
        messages: [
          { role: "system", content: businessContext },
          ...safeHistory,
          { role: "user", content: message },
        ],
      }),
    });

    if (!groqResponse.ok || !groqResponse.body) {
      const errText = await groqResponse.text();
      req.log?.error({ err: errText }, "Groq API error");
      res.write(
        `data: ${JSON.stringify({
          error: "The assistant is temporarily unavailable. Please use WhatsApp or email for a fast response.",
        })}\n\n`
      );
      res.end();
      return;
    }

    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;
        const payload = trimmed.replace(/^data:\s*/, "");
        if (payload === "[DONE]") {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          continue;
        }
        try {
          const parsed = JSON.parse(payload);
          const deltaContent = parsed.choices?.[0]?.delta?.content;
          if (deltaContent) {
            res.write(`data: ${JSON.stringify({ content: deltaContent })}\n\n`);
          }
        } catch {
          // ignore stream parse fragments
        }
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (error) {
    req.log?.error({ err: error }, "AI chat request failed");
    res.write(
      `data: ${JSON.stringify({
        error: "The assistant is temporarily unavailable. Please use WhatsApp or email for a fast response.",
      })}\n\n`
    );
  } finally {
    res.end();
  }
});

export default router;
