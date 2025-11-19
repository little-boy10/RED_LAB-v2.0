import React, { useState, KeyboardEvent } from 'react';
import { Send, Zap } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const CommandInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  // Chips tailored to specific Red Team / CVE Hunter tasks
  const chips = [
    { label: 'Search CVE-ID', text: 'Search for critical details and PoCs for CVE-2023-38831' },
    { label: 'Software Vulns', text: 'Search for high-severity CVEs affecting Apache httpd 2.4.49' },
    { label: 'Vuln Type: SQLi', text: 'Search for recent SQL Injection vulnerabilities in popular CMS platforms' },
    { label: 'Exploit Mechanics', text: 'Analyze the technical mechanics of the exploit for CVE-2021-41773 (Path Traversal)' },
    { label: 'Generate PoC (Edu)', text: 'Write a Python script demonstrating a basic buffer overflow PoC for educational analysis. Explain the EIP overwrite.' }
  ];

  return (
    <div className="p-4 bg-console-card border-t border-console-border">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-console-green font-mono text-sm select-none hidden sm:block">
          op@redteam:~$
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Enter command or query..."
          className="w-full bg-console-bg text-console-text font-mono text-sm rounded border border-console-border focus:border-console-green focus:ring-1 focus:ring-console-green pl-4 sm:pl-32 pr-12 py-3 transition-all placeholder-gray-700"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-console-green hover:bg-console-green/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
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