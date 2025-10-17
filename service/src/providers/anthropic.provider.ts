import { AIProvider, CompletionOptions } from '../types';
import axios from 'axios';

export interface AnthropicCompletionOptions extends CompletionOptions {
  model?: string;
  apiKey?: string;
  system?: string;
}

/**
 * Anthropic Provider for AI completions (Claude)
 */
export class AnthropicProvider implements AIProvider {
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey = process.env.ANTHROPIC_API_KEY || '', defaultModel = 'claude-3-opus-20240229') {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  /**
   * Generate embeddings (Anthropic doesn't have embedding API, so we'll use OpenAI embedding in production)
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // Anthropic doesn't provide embedding API, so throw an error
    throw new Error('Anthropic does not provide embedding API. Please use OpenAI or Ollama for embeddings.');
  }

  /**
   * Generate completion using Anthropic Claude
   */
  async generateCompletion(prompt: string, options: AnthropicCompletionOptions = {}): Promise<string> {
    try {
      const apiKey = options.apiKey || this.apiKey;
      
      if (!apiKey) {
        throw new Error('Anthropic API key is not set');
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
        'https://api.anthropic.com/v1/messages',
        {
          model,
          messages,
          max_tokens: options.maxTokens || 1024,
          temperature: options.temperature || 0.7
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Error generating completion with Anthropic:', error);
      throw new Error('Failed to generate completion with Anthropic');
    }
  }

  /**
   * Set Anthropic API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Simple query function for Anthropic
   */
  async query(prompt: string, model = this.defaultModel): Promise<string> {
    return this.generateCompletion(prompt, { model });
  }
}

// Export a default instance for easy use
export const anthropicProvider = new AnthropicProvider();

// Simple query function for direct use
export async function queryAnthropic(prompt: string, model = 'claude-3-opus-20240229'): Promise<string> {
  return anthropicProvider.query(prompt, model);
}
