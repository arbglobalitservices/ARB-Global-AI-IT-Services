import OpenAI from "openai";

const apiKey =
  process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
const baseURL =
  process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ?? "https://api.openai.com/v1";

if (!apiKey) {
  throw new Error(
    "An OpenAI key is required. Configure the managed Replit OpenAI integration or the OPENAI_API_KEY secret.",
  );
}

export const openai = new OpenAI({
  apiKey,
  baseURL,
});
