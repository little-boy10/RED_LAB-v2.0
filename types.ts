export enum Sender {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isThinking?: boolean;
  isError?: boolean;
  groundingUrls?: Array<{uri: string, title: string}>;
}

export enum AppMode {
  MENTOR = 'mentor', // Standard Red Team Mentor (Flash)
  DEEP_ANALYSIS = 'deep_analysis', // Thinking Model (Pro)
  CVE_HUNTER = 'cve_hunter', // Search Grounding (Flash)
  SPEED_OPS = 'speed_ops', // Low Latency (Flash-Lite)
}

export interface ChatConfig {
  ttsEnabled: boolean;
  mode: AppMode;
}