import OpenAI from "openai";
import log from "loglevel";

// Configure logger
log.setLevel((process.env.LOG_LEVEL as log.LogLevelDesc) || "info");

export class OpenAIClient {
  private client: OpenAI;
  private logger = log.getLogger("OpenAIClient");

  constructor(apiKey?: string) {
    this.logger.trace("Initializing OpenAI client");
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    this.logger.trace("OpenAI client initialized");
  }

  async createChatCompletion(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    model: string = "gpt-4o",
    options?: Omit<OpenAI.Chat.ChatCompletionCreateParams, "messages" | "model" | "stream">
  ): Promise<OpenAI.Chat.ChatCompletion> {
    this.logger.trace(`Creating chat completion with model: ${model}`);
    this.logger.info("Request messages:", messages);

    const startTime = Date.now();
    const response = await this.client.chat.completions.create({
      model,
      messages,
      stream: false,
      ...options,
    });

    const duration = Date.now() - startTime;
    this.logger.info(`Response: ${response.choices[0]?.message?.content}`);
    this.logger.debug(`Completed in ${duration}ms`);
    this.logger.debug(`Tokens used - Prompt: ${response.usage?.prompt_tokens}, Completion: ${response.usage?.completion_tokens}, Total: ${response.usage?.total_tokens}`);

    return response;
  }

  async createStreamingChatCompletion(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    model: string = "gpt-4o",
    options?: Omit<OpenAI.Chat.ChatCompletionCreateParams, "messages" | "model" | "stream">
  ) {
    this.logger.trace(`Creating streaming chat completion with model: ${model}`);
    this.logger.info("Request messages:", messages);

    const stream = await this.client.chat.completions.create({
      model,
      messages,
      stream: true,
      ...options,
    });

    this.logger.trace("Streaming chat completion started");
    return stream;
  }

  getClient() {
    return this.client;
  }
}

// Export a singleton instance for convenience
export const openAIClient = new OpenAIClient();