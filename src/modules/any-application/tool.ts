import { tool as createTool } from "ai";
import { z } from "zod";
import { generateApplication } from "./api";

export const anyApplicationTool = createTool({
  description: "Create any application based on a prompt description",
  inputSchema: z.object({
    prompt: z.string().describe("Description of the application to create"),
  }),
  execute: async function ({ prompt }) {
    try {
      const html = await generateApplication(prompt);
      return { html, originalPrompt: prompt };
    } catch (error) {
      console.error('Error generating application:', error);
      return { html: '<p class="text-red-500">Error creating application</p>', originalPrompt: prompt };
    }
  },
});
