import { openAIClient } from "../../openAIClient/openAIClient";

export async function divide(a: number, b: number): Promise<number> {
  const response = await openAIClient.createChatCompletion([
    {
      role: "system",
      content: "You are a helpful assistant that performs division. Respond with only the numeric result of the division."
    },
    {
      role: "user",
      content: `What is ${a} divided by ${b}?`
    }
  ], "gpt-4o", {
    temperature: 0,
    max_tokens: 10
  });

  const answer = response.choices[0]?.message?.content?.trim();
  return parseFloat(answer || "0");
}
