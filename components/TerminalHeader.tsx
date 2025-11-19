import React from 'react';
import { AppMode } from '../types';
import { Terminal, ShieldAlert, BrainCircuit, Volume2, VolumeX } from 'lucide-react';

interface Props {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
}

export const TerminalHeader: React.FC<Props> = ({ mode, setMode, ttsEnabled, setTtsEnabled }) => {
  return (
    <div className="border-b border-console-border bg-console-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-console-green/10 rounded-lg border border-console-green/20">
          <Terminal className="w-6 h-6 text-console-green" />
        </div>
        <div>
          <h1 className="text-lg font-mono font-bold text-console-text tracking-tight">
            RED_LAB <span className="text-console-green">v2.0</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono uppercase">Offensive Security Workbench</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-console-bg p-1 rounded-lg border border-console-border">
        <button
          onClick={() => setMode(AppMode.MENTOR)}
          className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            mode === AppMode.MENTOR 
              ? 'bg-console-border text-console-text shadow-sm' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Terminal size={14} />
          SHELL
        </button>
        
        <button
          onClick={() => setMode(AppMode.DEEP_ANALYSIS)}
          className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            mode === AppMode.DEEP_ANALYSIS 
              ? 'bg-console-purple/20 text-console-purple border border-console-purple/30' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <BrainCircuit size={14} />
          DEEP_THINK
        </button>

        <button
          onClick={() => setMode(AppMode.CVE_HUNTER)}
          className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            mode === AppMode.CVE_HUNTER 
              ? 'bg-console-yellow/20 text-console-yellow border border-console-yellow/30' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <ShieldAlert size={14} />
          CVE_HUNT
        </button>
      </div>

      <button
        onClick={() => setTtsEnabled(!ttsEnabled)}
        className={`p-2 rounded-full transition-colors border ${
          ttsEnabled 
            ? 'bg-console-green/10 text-console-green border-console-green/30' 
            : 'bg-transparent text-gray-600 border-transparent hover:bg-console-border'
        }`}
        title="Toggle Voice Output"
      >
        {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </div>
  );
};
