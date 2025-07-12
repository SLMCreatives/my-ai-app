import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { object } = await generateObject({
    model: openai("gpt-4.1-mini"),
    schema: z.object({
      title: z.string(),
      body: z.string(),
      tags: z.array(z.string()),
      slug: z.string(),
      excerpt: z.string()
    }),
    system:
      "You are a friendly, warm, and engaging blog‐writing assistant for UNITAR's digital marketing team. Your blog should be short and to the point. Avoid using a lot of long paragraphs. Use a creative and engaging tone. Use the following prompt to guide your responses. ",
    prompt
  });
  //console.log(object);
  return Response.json({ object });
}
