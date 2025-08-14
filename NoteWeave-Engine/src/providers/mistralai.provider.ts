import { AIProvider, CompletionOptions } from '../types';
import axios from 'axios';

export interface MistralAICompletionOptions extends CompletionOptions {
  model?: string;
  apiKey?: string;
  system?: string;
}

/**
 * MistralAI Provider for AI completions and embeddings
 */
export class MistralAIProvider implements AIProvider {
  private apiKey: string;
  private defaultModel: string;
  private embeddingModel: string;

  constructor(
    apiKey = process.env.MISTRAL_API_KEY || '',
    defaultModel = 'mistral-large-latest',
    embeddingModel = 'mistral-embed'
  ) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.embeddingModel = embeddingModel;
  }

  /**
   * Generate embeddings using MistralAI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!this.apiKey) {
        throw new Error('MistralAI API key is not set');
      }

      const response = await axios.post(
        'https://api.mistral.ai/v1/embeddings',
        {
          input: text,
          model: this.embeddingModel
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding with MistralAI:', error);
      throw new Error('Failed to generate embedding with MistralAI');
    }
  }

  /**
   * Generate completion using MistralAI
   */
  async generateCompletion(prompt: string, options: MistralAICompletionOptions = {}): Promise<string> {
    try {
      const apiKey = options.apiKey || this.apiKey;
      
      if (!apiKey) {
        throw new Error('MistralAI API key is not set');
      }

      const model = options.model || this.defaultModel;
      
      const messages = [];
      if (options.system) {
        messages.push({
          role: 'system',
          content: options.system
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt
      });

      const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
          model,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
          top_p: options.topP ?? 1
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating completion with MistralAI:', error);
      throw new Error('Failed to generate completion with MistralAI');
    }
  }

  /**
   * Set MistralAI API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Simple query function for MistralAI
   */
  async query(prompt: string, model = this.defaultModel): Promise<string> {
    return this.generateCompletion(prompt, { model });
  }
}

// Export a default instance for easy use
export const mistralAIProvider = new MistralAIProvider();

// Simple query function for direct use
export async function queryMistralAI(prompt: string, model = 'mistral-large-latest'): Promise<string> {
  return mistralAIProvider.query(prompt, model);
}
