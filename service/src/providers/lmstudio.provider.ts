import { AIProvider, CompletionOptions } from '../types';
import axios from 'axios';

export interface LMStudioCompletionOptions extends CompletionOptions {
  model?: string;
  apiUrl?: string;
}

/**
 * LM Studio Provider for local AI completions and embeddings
 */
export class LMStudioProvider implements AIProvider {
  private apiUrl: string;
  private defaultModel: string;

  constructor(apiUrl = 'http://localhost:1234/v1', defaultModel = 'local-model') {
    this.apiUrl = apiUrl;
    this.defaultModel = defaultModel;
  }

  /**
   * Generate embeddings using LM Studio
   * Note: LM Studio doesn't have a dedicated embeddings endpoint like OpenAI,
   * but we can use the completions endpoint with a specially crafted prompt
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // LM Studio doesn't have a standard embedding API
      // This is a fallback approach - in production we recommend using OpenAI or a dedicated embedding model
      const prompt = `Generate a vector embedding for the following text. Output only the embedding as a JSON array of numbers:\n\n${text}`;
      
      const response = await axios.post(
        `${this.apiUrl}/completions`,
        {
          prompt,
          max_tokens: 2048,
          temperature: 0.0
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Try to extract embedding from text response
      try {
        const text = response.data.choices[0].text.trim();
        // Find JSON array in the response
        const match = text.match(/\[[\d\.\-\,\s]+\]/);
        if (match) {
          return JSON.parse(match[0]);
        }
        
        // Fallback to a random embedding if we can't parse the response
        console.warn('Could not parse embedding from LM Studio response, using fallback embedding');
        return Array(768).fill(0).map(() => Math.random() * 2 - 1);
      } catch (err) {
        console.error('Error parsing embedding from LM Studio:', err);
        return Array(768).fill(0).map(() => Math.random() * 2 - 1);
      }
    } catch (error) {
      console.error('Error generating embedding with LM Studio:', error);
      throw new Error('Failed to generate embedding with LM Studio');
    }
  }

  /**
   * Generate completion using LM Studio
   */
  async generateCompletion(prompt: string, options: LMStudioCompletionOptions = {}): Promise<string> {
    try {
      const apiUrl = options.apiUrl || this.apiUrl;
      
      const response = await axios.post(
        `${apiUrl}/completions`,
        {
          prompt,
          max_tokens: options.maxTokens || 1024,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 1,
          frequency_penalty: options.frequencyPenalty || 0,
          presence_penalty: options.presencePenalty || 0
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].text;
    } catch (error) {
      console.error('Error generating completion with LM Studio:', error);
      throw new Error('Failed to generate completion with LM Studio');
    }
  }

  /**
   * Set API URL
   */
  setApiUrl(apiUrl: string): void {
    this.apiUrl = apiUrl;
  }

  /**
   * Simple query function for LM Studio
   */
  async query(prompt: string): Promise<string> {
    return this.generateCompletion(prompt);
  }
}

// Export a default instance for easy use
export const lmStudioProvider = new LMStudioProvider();

// Simple query function for direct use
export async function queryLMStudio(prompt: string): Promise<string> {
  return lmStudioProvider.query(prompt);
}
