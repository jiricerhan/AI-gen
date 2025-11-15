'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
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
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl rounded-lg p-4 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
              <div className="font-semibold mb-2">{message.role === 'user' ? 'You' : 'AI'}</div>
              <div>
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return <span key={index}>{part.text}</span>;
                  }

                  if (part.type === 'tool-createApplication') {
                    switch (part.state) {
                      case 'input-available':
                        return <div key={index} className="italic">Creating application...</div>;
                      case 'output-available':
                        const appOutput = part.output;
                        if(!appOutput) return null;
                        if(typeof appOutput !== 'object') return null;
                        if(!('html' in appOutput)) return null;
                        return (
                          <div key={index} className="mt-2 border border-gray-300 rounded-lg p-4 bg-white">
                            <AnyApplication
                              html={appOutput.html as string}
                              originalPrompt={'originalPrompt' in appOutput ? appOutput.originalPrompt as string : ''}
                            />
                          </div>
                        );
                      case 'output-error':
                        return <div key={index} className="text-red-500">Error: {part.errorText}</div>;
                      default:
                        return null;
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}