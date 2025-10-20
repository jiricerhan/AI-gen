# GenUI - AI-Powered Application Generator

DISCLAIMER: The entire application is partially a joke and partially proof of concept for a talk at Frontendisti.cz meetup. MOST OF THE CODE IS AI GENERATED WITHOUT ANY REVIEW. I DO NOT NORMALLY WRITE APPS LIKE THIS. THE CODE QUALITY MIGHT BE POOR. I don't care its just a silly demo.


**GenUI** is a proof-of-concept that demonstrates how AI can serve as both backend logic and frontend generator - creating fully functional applications that don't need to exist. AI is your app.

## Concept

The core idea: **Software doesn't need to exist to be used.** AI generates both the UI and handles the business logic on-demand, creating interactive applications in real-time based on natural language descriptions.

### How It Works

1. **User Request**: User describes an application in natural language (e.g., "create a counter app" or "build a todo list")
2. **AI Generation**: OpenAI generates interactive HTML with HTMX attributes
3. **Live Rendering**: Application is rendered in the chat interface
4. **User Interaction**: User clicks buttons, fills forms, etc.
5. **AI Backend**: Each interaction sends current state to AI, which processes it and returns only the changed UI elements

### Architecture

```
User → Chat Interface → AI Tool (createApplication)
                          ↓
                    OpenAI generates HTML with HTMX
                          ↓
                    AnyApplication Component
                          ↓
                    User interacts with app
                          ↓
                    HTMX POST to /api/any-application/interact
                          ↓
                    AI receives: currentMarkup + interaction data
                          ↓
                    AI returns: Only changed elements (hx-swap-oob)
                          ↓
                    HTMX swaps updated elements
```

## Getting Started

### Prerequisites

- Node.js 20+
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
yarn run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Type a request in the chat: "Create a counter application"
2. The AI will generate and display a fully functional counter app
3. Click buttons to interact - the AI processes each interaction and updates the UI
4. Try more complex apps: "Create a todo list", "Build a simple calculator", etc.

## Project Structure

```
src/modules/
├── any-application/          # AI application generator
│   ├── AnyApplication.tsx   # React component that renders AI-generated HTML
│   ├── api.ts              # OpenAI prompts and logic
│   ├── tool.ts             # AI tool definition
│   └── index.ts
├── chat/                    # Chat interface
│   ├── ChatPage.tsx        # Main chat UI
│   ├── chatApi.ts          # Chat API handler
│   └── tools.ts            # Available AI tools
└── openAIClient/           # OpenAI client wrapper

app/api/
└── any-application/
    └── interact/           # API endpoint for HTMX interactions
        └── route.ts
```

## How the AI Backend Works

### Application Generation

The AI receives a prompt and generates structured HTML:
- Each section has a meaningful ID (e.g., `counter-display`, `user-list`)
- Buttons use `hx-vals` to identify actions
- Buttons use `hx-swap="none"` since updates use out-of-band swaps

### State Management

- **Current State Tracking**: Before each HTMX request, the component automatically captures the current HTML and injects it as `currentMarkup`
- **Stateless AI**: AI receives the full current state with every request
- **Incremental Updates**: AI returns only the HTML elements that changed

### Out-of-Band Swaps

Instead of replacing entire pages, the AI returns only changed elements:

```html
<!-- AI returns only this: -->
<div id="counter-display" hx-swap-oob="true">Count: 5</div>
```

HTMX automatically swaps this into the matching element by ID.

## Example Applications

Try asking the AI to create:
- Counter with increment/decrement
- Todo list with add/remove
- Simple calculator
- Temperature converter
- Color picker
- Quiz application
- Expense tracker

## Limitations

- No persistent storage (state resets on page refresh)
- AI response latency (~1-3 seconds per interaction)
- Cost scales with usage (OpenAI API calls)
- Limited to what OpenAI can generate in HTML/CSS/HTMX

## Future Ideas

- Add memory/storage layer
- Support for more complex interactions (WebSockets, real-time)
- Multi-user applications
- AI-generated backend APIs
- Plugin system for pre-built components

## License

MIT

## Contributing

This is a proof-of-concept. Contributions, ideas, and experiments welcome!
