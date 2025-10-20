'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Weather } from '@/modules/weather';
import { AnyApplication } from '@/modules/any-application';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }

              if (part.type === 'tool-displayWeather') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading weather...</div>;
                  case 'output-available':
                    const output = part.output;
                    if(!output) return null;
                    if(typeof output !== 'object') return null;
                    return (
                      <div key={index}>
                        <Weather {...output} />
                      </div>
                    );
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }

              if (part.type === 'tool-createApplication') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Creating application...</div>;
                  case 'output-available':
                    const appOutput = part.output;
                    if(!appOutput) return null;
                    if(typeof appOutput !== 'object') return null;
                    if(!('html' in appOutput)) return null;
                    return (
                      <div key={index}>
                        <AnyApplication html={appOutput.html as string} />
                      </div>
                    );
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }

              return null;
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}