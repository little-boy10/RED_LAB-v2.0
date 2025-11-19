import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Sender } from '../types';
import { Bot, User, Globe, Cpu, Terminal } from 'lucide-react';

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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-mono scroll-smooth">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-4 ${
            msg.sender === Sender.USER ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center border shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
            msg.sender === Sender.USER 
              ? 'bg-console-card border-console-border text-gray-300' 
              : 'bg-console-green/10 border-console-green/30 text-console-green shadow-[0_0_15px_rgba(46,160,67,0.1)]'
          }`}>
            {msg.sender === Sender.USER ? <User size={20} /> : <Terminal size={20} />}
          </div>

          {/* Content Bubble */}
          <div className={`flex-1 max-w-3xl ${msg.sender === Sender.USER ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block rounded-lg p-4 border shadow-md ${
              msg.sender === Sender.USER
                ? 'bg-console-card border-console-border text-console-text'
                : 'bg-transparent border-none p-0 w-full' 
            }`}>
              {msg.sender === Sender.BOT ? (
                 <div className="text-gray-300 font-mono text-sm sm:text-base leading-relaxed break-words">
                  <ReactMarkdown
                    components={{
                      // --- CUSTOM CYBER-THEMED MARKDOWN RENDERERS ---
                      
                      // Headers: Structure & Hierarchy (Purple/Blue)
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold text-console-purple mt-8 mb-4 border-b border-console-purple/20 pb-2 uppercase tracking-widest flex items-center gap-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold text-console-blue mt-6 mb-3 flex items-center gap-2 border-l-2 border-console-blue pl-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold text-console-green mt-4 mb-2 uppercase" {...props} />,
                      
                      // Bold: High Priority / Criticality (Yellow)
                      strong: ({node, ...props}) => <strong className="text-console-yellow font-bold drop-shadow-[0_0_2px_rgba(210,153,34,0.5)]" {...props} />,
                      
                      // Italics: Emphasis (Blue)
                      em: ({node, ...props}) => <em className="text-console-blue/80 not-italic" {...props} />,
                      
                      // Blockquotes: Alerts / Critical Warnings (Red)
                      blockquote: ({node, ...props}) => (
                        <div className="border-l-4 border-console-red bg-console-red/10 pl-4 py-3 my-4 rounded-r text-gray-300 relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-full h-full bg-console-red/5 pointer-events-none animate-pulse opacity-10"></div>
                           <span className="block text-console-red text-xs font-bold mb-1 uppercase tracking-wider">OpSec Alert</span>
                           <div className="italic opacity-90">{props.children}</div>
                        </div>
                      ),
                      
                      // Code Blocks: Payload / Exploit (Matrix Green)
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline ? (
                          <div className="relative my-5 group rounded overflow-hidden border border-console-border shadow-lg bg-[#0d1117]">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-console-card border-b border-console-border">
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                                    {match ? match[1] : 'PAYLOAD'}
                                </span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-console-red/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-console-yellow/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-console-green/50"></div>
                                </div>
                            </div>
                            <div className="p-4 overflow-x-auto">
                              <code className={`${className} text-console-green font-mono text-xs sm:text-sm whitespace-pre`} {...props}>
                                {children}
                              </code>
                            </div>
                          </div>
                        ) : (
                          // Inline code
                          <code className="bg-console-border/40 text-console-green px-1.5 py-0.5 rounded text-xs font-bold border border-console-green/20 font-mono" {...props}>
                            {children}
                          </code>
                        )
                      },
                      
                      // Lists
                      ul: ({node, ...props}) => <ul className="list-none space-y-2 my-3 ml-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 my-3 ml-1 text-gray-400 marker:text-console-blue" {...props} />,
                      li: ({node, ...props}) => (
                        <li className="flex gap-2 text-gray-300">
                            <span className="text-console-border mt-1.5 text-[10px] leading-none">►</span>
                            <span>{props.children}</span>
                        </li>
                      ),
                      
                      // Paragraphs
                      p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                      
                      // Links
                      a: ({node, ...props}) => <a className="text-console-blue hover:text-console-green hover:underline decoration-console-blue/30 underline-offset-4 transition-all" target="_blank" rel="noopener noreferrer" {...props} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  
                  {/* Grounding Sources */}
                  {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                    <div className="mt-6 p-3 bg-console-bg border border-console-border rounded-md text-xs relative overflow-hidden">
                      <div className="absolute inset-0 bg-console-blue/5 pointer-events-none"></div>
                      <div className="flex items-center gap-2 text-console-blue mb-2 font-bold uppercase tracking-wider relative z-10">
                        <Globe size={14} />
                        <span>Verified Intel</span>
                      </div>
                      <ul className="space-y-1 relative z-10">
                        {msg.groundingUrls.map((url, idx) => (
                          <li key={idx}>
                            <a href={url.uri} target="_blank" rel="noreferrer" className="hover:text-console-green hover:translate-x-1 transition-transform truncate block text-gray-500">
                              <span className="text-console-border mr-2">[{idx + 1}]</span>
                              {url.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                 </div>
              ) : (
                <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
              )}
            </div>
            <span className="text-[10px] text-gray-600 mt-2 block uppercase tracking-widest opacity-50">
              {msg.timestamp.toLocaleTimeString()} • {msg.sender === Sender.BOT ? 'ENCRYPTED_CHANNEL' : 'OPERATOR'}
            </span>
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-4 animate-pulse opacity-80">
          <div className="w-10 h-10 rounded bg-console-purple/10 border border-console-purple/30 text-console-purple flex items-center justify-center">
            <Cpu size={20} className="animate-spin-slow" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="text-console-purple text-sm font-bold font-mono tracking-widest">PROCESSING NEURAL PATHWAYS...</span>
            <span className="text-gray-500 text-xs">Allocating reasoning budget (32k tokens)</span>
          </div>
        </div>
      )}
      
      <div ref={endRef} />
    </div>
  );
};