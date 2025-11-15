import OpenAI from "openai";
import log from "loglevel";
import chalk from "chalk";

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

  private logInfo(message: string) {
    // Use process.stdout.write to bypass Jest's console interception
    if (process.env.NODE_ENV === 'test') {
      process.stdout.write(message + '\n');
    } else {
      this.logger.info(message);
    }
  }

  async createChatCompletion(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    model: string = "gpt-4o",
    options?: Omit<OpenAI.Chat.ChatCompletionCreateParams, "messages" | "model" | "stream">
  ): Promise<OpenAI.Chat.ChatCompletion> {
    this.logger.trace(`Creating chat completion with model: ${model}`);

    const messagesPreview = messages.map((msg, idx) => {
      const role = chalk.cyan(`[${msg.role}]`);
      const content = typeof msg.content === 'string'
        ? msg.content
        : JSON.stringify(msg.content);
      return `  ${idx + 1}. ${role} ${content}`;
    }).join('\n');

    this.logInfo(
      chalk.cyan(`\n${'='.repeat(80)}`) +
      chalk.bold.blue(`\n[OpenAI Request]`) +
      chalk.yellow(` Model: ${model}`) +
      chalk.gray(` | Messages: ${messages.length}`) +
      chalk.cyan(`\n${'-'.repeat(80)}`) +
      `\n${messagesPreview}` +
      chalk.cyan(`\n${'='.repeat(80)}`)
    );

    const startTime = Date.now();
    const response = await this.client.chat.completions.create({
      model,
      messages,
      stream: false,
      ...options,
    });

    const duration = Date.now() - startTime;
    const responseContent = response.choices[0]?.message?.content || 'No content';

    this.logInfo(
      chalk.bold.green(`[OpenAI Response]`) +
      chalk.magenta(` ${duration}ms`) +
      chalk.gray(` | Tokens: ${response.usage?.total_tokens || 0}`) +
      chalk.cyan(`\n${'-'.repeat(80)}`) +
      `\n${responseContent}` +
      chalk.cyan(`\n${'='.repeat(80)}`)
    );
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

    const messagesPreview = messages.map((msg, idx) => {
      const role = chalk.cyan(`[${msg.role}]`);
      const content = typeof msg.content === 'string'
        ? msg.content
        : JSON.stringify(msg.content);
      return `  ${idx + 1}. ${role} ${content}`;
    }).join('\n');

    this.logInfo(
      chalk.cyan(`\n${'='.repeat(80)}`) +
      chalk.bold.blue(`\n[OpenAI Streaming Request]`) +
      chalk.yellow(` Model: ${model}`) +
      chalk.gray(` | Messages: ${messages.length}`) +
      chalk.cyan(`\n${'-'.repeat(80)}`) +
      `\n${messagesPreview}` +
      chalk.cyan(`\n${'='.repeat(80)}`)
    );

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