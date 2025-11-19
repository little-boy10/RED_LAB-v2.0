import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TerminalHeader } from './components/TerminalHeader';
import { MessageList } from './components/MessageList';
import { CommandInput } from './components/CommandInput';
import { generateResponse, speakResponse } from './services/geminiService';
import { Message, Sender, AppMode } from './types';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `**SYSTEM ONLINE.**\n\nWelcome, Operator. I am your Elite Red Team Assistant.\n\n**Capabilities Upgraded:**\n- **Multimodal Analysis**: Upload logs, screenshots, or video feeds for analysis.\n- **Vulnerability Research**: I can teach you how to discover CVEs (Fuzzing, RE).\n- **OSINT**: I can perform deep surface web reconnaissance.\n\n*Authorized Environment Detected. Ethical constraints adjusted for educational research.*`,
      sender: Sender.SYSTEM,
      timestamp: new Date(),
    }
  ]);
  const [mode, setMode] = useState<AppMode>(AppMode.MENTOR);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const handleSendMessage = async (text: string, attachment?: { data: string; mimeType: string }) => {
    // Add User Message
    const userMsg: Message = {
      id: uuidv4(),
      text: attachment ? `${text || '[File Uploaded]'} (${attachment.mimeType})` : text,
      sender: Sender.USER,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Call Gemini Service with optional attachment
      const response = await generateResponse(text, mode, attachment, setIsThinking);

      // Add Bot Message
      const botMsg: Message = {
        id: uuidv4(),
        text: response.text,
        sender: Sender.BOT,
        timestamp: new Date(),
        groundingUrls: response.urls
      };
      setMessages((prev) => [...prev, botMsg]);

      // Handle TTS
      if (ttsEnabled) {
        await speakResponse(response.text);
      }

    } catch (error) {
      const errorMsg: Message = {
        id: uuidv4(),
        text: "CONNECTION INTERRUPTED. Neural Uplink Failed. Please check API credentials or network status.",
        sender: Sender.SYSTEM,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-console-bg text-console-text selection:bg-console-green selection:text-black">
      <TerminalHeader 
        mode={mode} 
        setMode={setMode} 
        ttsEnabled={ttsEnabled} 
        setTtsEnabled={setTtsEnabled} 
      />
      
      <main className="flex-1 flex flex-col relative max-w-6xl w-full mx-auto border-x border-console-border/30 bg-console-bg shadow-2xl shadow-black">
        {/* CRT Scanline Effect Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] opacity-20"></div>
        
        <MessageList messages={messages} isThinking={isThinking} />
        <CommandInput onSend={handleSendMessage} disabled={isThinking} />
      </main>
    </div>
  );
}