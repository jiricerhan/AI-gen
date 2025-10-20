import { openAIClient } from "../../openAIClient/openAIClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deepMerge<T = any>(obj1: any, obj2: any): Promise<T> {
  const response = await openAIClient.createChatCompletion([
    {
      role: "system",
      content: "You are a helpful assistant that deep merges two JavaScript objects. Respond with only the JSON result of the deep merge, with no additional text or markdown formatting."
    },
    {
      role: "user",
      content: `Deep merge these two objects:\nObject 1: ${JSON.stringify(obj1)}\nObject 2: ${JSON.stringify(obj2)}`
    }
  ], "gpt-4o", {
    temperature: 0,
    max_tokens: 500
  });

  const answer = response.choices[0]?.message?.content?.trim();
  return JSON.parse(answer || "{}");
}
