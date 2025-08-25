export type AIProviderType = string;

export interface ChatCommand {
  name: string;
  description: string;
  examples: string[];
  handler: CommandHandler;
}

export type CommandHandler = (args: string, options?: any) => Promise<any>;

export interface ProgressCallbackData {
  completed: number;
  total: number;
  percentage: number;
  status: 'running' | 'completed' | 'failed';
  currentItem?: string;
  error?: string;
}

export type ProgressCallback = (data: ProgressCallbackData) => void;

export interface TextChunkingOptions {
  chunkSize: number;
  chunkOverlap: number;
}

export interface DocumentRelationship {
  id: string;
  score: number;
  metadata: any;
}