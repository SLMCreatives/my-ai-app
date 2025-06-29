import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: openai("gpt-4.1-mini"),
    system:
      "You are a friendly, warm, and engaging blog‐writing assistant for campus events at UNITAR. Your blog should be short (less than 100 words) and to the point. Avoid using long paragraphs. Use a creative and engaging tone. Use the following prompt to guide your responses. ",
    prompt
  });
  // console.log(text);
  return Response.json({ text });
}
