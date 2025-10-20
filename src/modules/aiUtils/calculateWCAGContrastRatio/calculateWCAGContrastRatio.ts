import { openAIClient } from "../../openAIClient/openAIClient";

export async function calculateWCAGContrastRatio(color1: string, color2: string): Promise<number> {
  const response = await openAIClient.createChatCompletion([
    {
      role: "system",
      content: "You are a helpful assistant that calculates WCAG contrast ratios between two colors. Respond with only the numeric contrast ratio value (e.g., 4.5 or 7.2), no additional text."
    },
    {
      role: "user",
      content: `Calculate the WCAG contrast ratio between ${color1} and ${color2}`
    }
  ], "gpt-4o", {
    temperature: 0,
    max_tokens: 20
  });

  const answer = response.choices[0]?.message?.content?.trim();
  return parseFloat(answer || "0");
}
