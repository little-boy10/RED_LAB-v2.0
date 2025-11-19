import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Zap, Paperclip, X, FileVideo, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface Props {
  onSend: (text: string, attachment?: { data: string; mimeType: string }) => void;
  disabled: boolean;
}

export const CommandInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((input.trim() || attachment) && !disabled) {
      onSend(input, attachment ? { data: attachment.data, mimeType: attachment.mimeType } : undefined);
      setInput('');
      setAttachment(null);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple validation
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
        alert("File too large. Max 20MB for demo.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = base64String.split(',')[1];
      
      setAttachment({
        data: base64Data,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const chips = [
    { label: 'Exploit Dev', text: 'Write a Python exploit for a specific CVE. Explain the memory corruption.' },
    { label: 'Analyze Link', text: 'I am pasting a URL. Analyze it for offensive security techniques: [PASTE_LINK_HERE]' },
    { label: 'Upload Video', text: 'I am uploading a video of a physical breach. Analyze the entry technique.' },
    { label: 'Make CVE', text: 'Guide me through finding a Zero-Day in open source software. Start with Fuzzing.' },
    { label: 'Deep Web', text: 'Search the deep web for compromised credentials related to "test_corp".' }
  ];

  return (
    <div className="p-4 bg-console-card border-t border-console-border">
      
      {/* Attachment Preview */}
      {attachment && (
        <div className="max-w-5xl mx-auto mb-2 flex items-center gap-2 p-2 bg-console-bg border border-console-green/30 rounded text-console-green w-fit animate-slide-up">
          {attachment.mimeType.startsWith('video') ? <FileVideo size={16} /> : <ImageIcon size={16} />}
          <span className="text-xs font-mono truncate max-w-[200px]">{attachment.name}</span>
          <button onClick={() => setAttachment(null)} className="hover:text-console-red">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto relative flex gap-2 items-center">
        <div className="text-console-green font-mono text-sm select-none hidden sm:block whitespace-nowrap">
          op@redteam:~$
        </div>
        
        <div className="relative flex-1">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Enter command, URL, or upload media..."
            className="w-full bg-console-bg text-console-text font-mono text-sm rounded border border-console-border focus:border-console-green focus:ring-1 focus:ring-console-green pl-3 pr-12 py-3 transition-all placeholder-gray-700"
            />
            
            {/* File Upload Trigger */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="p-1.5 rounded text-gray-500 hover:text-console-blue hover:bg-console-blue/10 transition-colors"
                    title="Upload Image or Video Analysis"
                >
                    <Paperclip size={18} />
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={disabled || (!input.trim() && !attachment)}
                    className="p-1.5 rounded text-console-green hover:bg-console-green/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-2 flex gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
         {/* Quick Chips */}
         {chips.map((chip, idx) => (
           <button
             key={idx}
             onClick={() => setInput(chip.text)}
             className="flex-shrink-0 flex items-center gap-1.5 text-xs font-mono bg-console-border/30 hover:bg-console-border text-gray-400 hover:text-console-blue px-3 py-1.5 rounded border border-transparent hover:border-console-blue/30 transition-all group"
           >
             <Zap size={12} className="group-hover:text-console-yellow transition-colors" />
             {chip.label}
           </button>
         ))}
      </div>
    </div>
  );
};