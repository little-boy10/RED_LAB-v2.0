import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Sender } from '../types';
import { Bot, User, Globe, AlertTriangle, Cpu } from 'lucide-react';

interface Props {
  messages: Message[];
  isThinking: boolean;
}

export const MessageList: React.FC<Props> = ({ messages, isThinking }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-mono">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-4 ${
            msg.sender === Sender.USER ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center border ${
            msg.sender === Sender.USER 
              ? 'bg-console-border border-gray-600 text-gray-300' 
              : 'bg-console-green/10 border-console-green/30 text-console-green'
          }`}>
            {msg.sender === Sender.USER ? <User size={20} /> : <Bot size={20} />}
          </div>

          {/* Content Bubble */}
          <div className={`flex-1 max-w-3xl ${msg.sender === Sender.USER ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block rounded-lg p-4 border ${
              msg.sender === Sender.USER
                ? 'bg-console-card border-console-border text-console-text'
                : 'bg-transparent border-none p-0 w-full' // Bot messages are full width for code blocks
            }`}>
              {msg.sender === Sender.BOT ? (
                 <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-console-blue prose-code:text-console-yellow prose-pre:bg-black prose-pre:border prose-pre:border-console-border max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  
                  {/* Grounding Sources */}
                  {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                    <div className="mt-4 p-3 bg-console-bg border border-console-border rounded text-xs">
                      <div className="flex items-center gap-2 text-console-blue mb-2 font-bold">
                        <Globe size={12} />
                        <span>VERIFIED SOURCES</span>
                      </div>
                      <ul className="space-y-1">
                        {msg.groundingUrls.map((url, idx) => (
                          <li key={idx}>
                            <a href={url.uri} target="_blank" rel="noreferrer" className="hover:text-console-green hover:underline truncate block">
                              [{idx + 1}] {url.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                 </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
            <span className="text-xs text-gray-600 mt-1 block">
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-4 animate-pulse">
          <div className="w-10 h-10 rounded bg-console-purple/10 border border-console-purple/30 text-console-purple flex items-center justify-center">
            <Cpu size={20} className="animate-spin-slow" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="text-console-purple text-sm font-bold font-mono">PROCESSING NEURAL PATHWAYS...</span>
            <span className="text-gray-500 text-xs">Allocating reasoning budget (32k tokens)</span>
          </div>
        </div>
      )}
      
      <div ref={endRef} />
    </div>
  );
};
