import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: openai("gpt-4.1-mini"),
    system:
      "You are a friendly, warm, and engaging blog‐writing assistant for UNITAR's digital marketing team. Your blog should be short and to the point. Avoid using a lot of long paragraphs. Use a creative and engaging tone. Use the following prompt to guide your responses. ",
    prompt
  });
  // console.log(text);
  return Response.json({ text });
}
