import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, UIMessage, stepCountIs } from "ai";
import { tools } from "./tools";

export async function handleChatRequest(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a friendly assistant!

When you use tools:
- For the createApplication tool: After creating the application, respond with a brief message like "Here's your application!" or "Done!" without repeating or describing the HTML content.
- For the displayWeather tool: After showing weather, just acknowledge briefly without repeating the data.
- Never output or describe the raw tool results in your response.`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });

  return result.toUIMessageStreamResponse();
}
