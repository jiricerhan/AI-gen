import { openAIClient } from "../openAIClient/openAIClient";

export async function generateApplication(prompt: string): Promise<string> {
  const enhancedPrompt = `Create an interactive HTML application for the following request: "${prompt}"

Requirements:
- Return ONLY complete, functional HTML markup - no markdown, no explanations, no comments
- DO NOT include HTML comments (<!-- -->)
- Return full html with all elements event repetitive parts. The output must be complete and ready to use without other additions.
- GENERATE ALL ELEMENTS COMPLETELY - if you need 100 cells, output all 100, not just examples
- Return only body content - no <html>, <head>, or <body> tags
- DO NOT include any <script> tags or inline JavaScript - all interactivity must use HTMX attributes only
- IMPORTANT: ALL interactive buttons MUST use EXACTLY this URL: hx-post="/api/any-application/interact"
- Structure your HTML with MEANINGFUL IDs for different sections that can be updated independently
  * Each logical section should have a unique ID (e.g., id="counter-display", id="user-list")
  * This allows for partial updates using HTMX out-of-band swaps
- Use htmx attributes for ALL interactive elements:
  * Use <button hx-post="/api/any-application/interact" hx-swap="none" hx-vals='{"action":"increment"}' hx-indicator="#app-loading-indicator"> for buttons
  * IMPORTANT: ALL interactive buttons MUST include hx-indicator="#app-loading-indicator" to show loading state
  * Use hx-vals to send specific data about which action was triggered
  * Use hx-swap="none" since we'll use out-of-band swaps for updates
  * Only use hx-include="#app-form" if you have actual form inputs that need to be sent
- Add form inputs (text, number, etc.) when you need user input data
- Use hx-vals='{"action":"actionName"}' to identify which button was clicked
- IMPORTANT: Store application state and metadata in hidden input fields
  * Use <input type="hidden" name="stateData" value="..."> to persist state between interactions
  * Store any data you need to track (scores, positions, game state, etc.) in hidden fields
  * Example: <input type="hidden" name="score" value="0"> or <input type="hidden" name="gameState" value='{"x":5,"y":3}'>
  * These hidden fields will be sent with every interaction so you can maintain state
- Use Tailwind CSS classes for styling (assume Tailwind is available)
- Make it functional and interactive using ONLY HTML and HTMX attributes - NO JavaScript
- Output COMPLETE, WORKING HTML with all elements fully rendered

Example structure:
<div id="app-container" class="p-4">
  <input type="hidden" name="count" value="0" />
  <div id="counter-display" class="text-2xl mb-4">Count: 0</div>
  <div id="controls" class="space-x-2">
    <button type="button" hx-post="/api/any-application/interact" hx-swap="none" hx-vals='{"action":"increment"}' hx-indicator="#app-loading-indicator" class="bg-blue-500 text-white px-4 py-2">
      Increment
    </button>
    <button type="button" hx-post="/api/any-application/interact" hx-swap="none" hx-vals='{"action":"decrement"}' hx-indicator="#app-loading-indicator" class="bg-red-500 text-white px-4 py-2">
      Decrement
    </button>
  </div>
</div>

Example with form inputs:
<div id="app-container" class="p-4">
  <form id="app-form">
    <input type="text" name="username" class="border p-2" placeholder="Enter name" />
    <button type="button" hx-post="/api/any-application/interact" hx-include="#app-form" hx-swap="none" hx-vals='{"action":"submit"}' hx-indicator="#app-loading-indicator" class="bg-blue-500 text-white px-4 py-2">
      Submit
    </button>
  </form>
  <div id="result" class="mt-4"></div>
</div>

Note: The current HTML state and original prompt are automatically captured and sent with each request.`;

  const response = await openAIClient.createChatCompletion([
    {
      role: "system",
      content: "You are an expert at creating interactive HTML applications with htmx. Return ONLY complete, functional HTML markup with NO comments, NO placeholders, NO examples - generate ALL elements fully. No explanations or markdown. Always use proper htmx attributes.",
    },
    {
      role: "user",
      content: enhancedPrompt,
    },
  ]);

  const html = response.choices[0]?.message?.content || "<p>Error generating application</p>";

  // Remove markdown code blocks if present
  return html.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function processInteraction(formData: Record<string, any>): Promise<string> {
  // Extract current markup and original prompt
  const currentMarkup = formData.currentMarkup || 'Not provided';
  const originalPrompt = formData.originalPrompt || 'Not provided';

  // Remove currentMarkup and originalPrompt from formData for cleaner display
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentMarkup: _markup, originalPrompt: _prompt, ...interactionData } = formData;

  const interactionPrompt = `A user interacted with an HTML application.

ORIGINAL APPLICATION PROMPT: "${originalPrompt}"

CURRENT HTML STATE (automatically captured - DO NOT swap this):
${currentMarkup}

USER INTERACTION DATA:
${JSON.stringify(interactionData, null, 2)}

Based on this interaction, generate ONLY the HTML elements that need to be updated using HTMX out-of-band swaps.
Remember that this application was created to: "${originalPrompt}"

Requirements:
- Return ONLY the changed UI elements with hx-swap-oob="true"
- DO NOT return the full page markup, only the parts that visually changed
- DO NOT include any <script> tags or inline JavaScript - use only HTML and HTMX attributes
- DO NOT try to update or swap "currentMarkup" - it's managed automatically by the system
- Each element MUST have hx-swap-oob="true" and an id matching the element to update
- Use the same IDs as in the current markup
- Maintain htmx interaction patterns (hx-post="/api/any-application/interact")
- IMPORTANT: ALL interactive buttons MUST include hx-indicator="#app-loading-indicator" to show loading state
- Use Tailwind CSS classes for styling
- IMPORTANT: Update hidden state fields if the state changed
  * If you have hidden fields tracking state (scores, positions, etc.), include updated versions in your response
  * Use hx-swap-oob="true" with matching name attribute to swap hidden inputs
  * Example: <input type="hidden" name="count" value="5" hx-swap-oob="true" />

Example response (return ONLY updated UI elements):
<div id="counter-display" hx-swap-oob="true" class="text-2xl mb-4">Count: 5</div>
<input type="hidden" name="count" value="5" hx-swap-oob="[name='count']" />

IMPORTANT:
- Return ONLY the UI elements that changed, nothing else
- Include updated hidden state fields if state changed
- DO NOT include currentMarkup in your response
- DO NOT include any <script> tags or JavaScript
- Each element needs hx-swap-oob="true" and the correct id or selector`;

  const response = await openAIClient.createChatCompletion([
    {
      role: "system",
      content: "You are an expert at creating interactive HTML applications with htmx. You are an API endpoint that returns ONLY the changed HTML elements using out-of-band swaps. Return only HTML markup with hx-swap-oob='true', no explanations or markdown. Don't forget to update hidden state fields if needed.",
    },
    {
      role: "user",
      content: interactionPrompt,
    },
  ]);

  const html = response.choices[0]?.message?.content || "<div id='app-error-message' hx-swap-oob='true' class='text-red-500 p-2'>Error processing interaction</div>";

  // Remove markdown code blocks if present
  return html.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
}
