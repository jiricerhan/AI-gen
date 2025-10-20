import { openAIClient } from "../../openAIClient/openAIClient";

export async function isOdd(num: number): Promise<boolean> {
  const response = await openAIClient.createChatCompletion([
    {
      role: "system",
      content: "You are a helpful assistant that determines if numbers are odd or even. Respond with only 'true' if the number is odd, or 'false' if the number is even."
    },
    {
      role: "user",
      content: `Is ${num} an odd number?`
    }
  ], "gpt-4o", {
    temperature: 0,
    max_tokens: 10
  });

  const answer = response.choices[0]?.message?.content?.trim().toLowerCase();
  return answer === "true";
}
