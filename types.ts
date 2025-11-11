
export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface GroundingChunk {
    web?: GroundingSource;
}

export type AnalyticsView = 'home' | 'sales' | 'customers' | 'market' | 'financial' | 'operations';
