import { semanticSearch, askQuestion, getKnowledgeBaseStats, getAvailableProviders } from '../api';
import { ChatCommand, CommandHandler } from '../types';

/**
 * Handle chat commands that start with /
 * Example: /search query, /stats, /help
 */
export class CommandService {
  private commands: Map<string, ChatCommand>;
  
  constructor() {
    this.commands = new Map();
    this.registerDefaultCommands();
  }
  
  /**
   * Register a new command
   */
  registerCommand(name: string, handler: CommandHandler, description: string, examples: string[]): void {
    this.commands.set(name, {
      name,
      description,
      examples,
      handler
    });
  }
  
  /**
   * Register default commands
   */
  private registerDefaultCommands(): void {
    // Search command
    this.registerCommand(
      'search',
      async (args: string) => semanticSearch(args, 10, true),
      'ค้นหาเอกสารที่เกี่ยวข้องโดยใช้ semantic search',
      ['/search ประวัติศาสตร์ไทยสมัยอยุธยา', '/search การเขียนโปรแกรม Python']
    );
    
    // Ask command
    this.registerCommand(
      'ask',
      async (args: string, options = {}) => askQuestion(args, { provider: 'ollama', topK: 5, ...options }),
      'ถามคำถามโดยใช้ RAG เพื่อหาคำตอบจากเอกสาร',
      ['/ask ประเทศไทยมีจังหวัดกี่จังหวัด', '/ask วิธีเขียนโปรแกรม Python']
    );
    
    // Stats command
    this.registerCommand(
      'stats',
      async () => getKnowledgeBaseStats(),
      'แสดงสถิติของ knowledge base',
      ['/stats']
    );
    
    // Help command
    this.registerCommand(
      'help',
      async (args: string) => {
        if (args && this.commands.has(args)) {
          const cmd = this.commands.get(args)!;
          return {
            command: cmd.name,
            description: cmd.description,
            examples: cmd.examples
          };
        }
        
        return this.listCommands();
      },
      'แสดงคำสั่งที่สามารถใช้งานได้หรือรายละเอียดของคำสั่งที่ระบุ',
      ['/help', '/help search']
    );
    
    // Providers command
    this.registerCommand(
      'providers',
      async () => getAvailableProviders(),
      'แสดงรายการ AI providers ที่มีให้ใช้งาน',
      ['/providers']
    );
  }
  
  /**
   * List all available commands
   */
  listCommands(): { commands: { name: string; description: string }[] } {
    const commandList = Array.from(this.commands.values()).map(cmd => ({
      name: cmd.name,
      description: cmd.description
    }));
    
    return { commands: commandList };
  }
  
  /**
   * Process a command
   */
  async processCommand(text: string): Promise<any> {
    // Check if this is a command (starts with /)
    if (!text.startsWith('/')) {
      throw new Error('ข้อความนี้ไม่ใช่คำสั่ง');
    }
    
    // Extract command name and arguments
    const parts = text.substring(1).trim().split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    // Check if command exists
    if (!this.commands.has(commandName)) {
      throw new Error(`ไม่พบคำสั่ง "${commandName}" ลองใช้ /help เพื่อดูคำสั่งที่มี`);
    }
    
    // Execute command
    const command = this.commands.get(commandName)!;
    try {
      return await command.handler(args);
    } catch (error) {
      throw new Error(`เกิดข้อผิดพลาดในการทำงานของคำสั่ง ${commandName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Check if text is a command
   */
  isCommand(text: string): boolean {
    return text.startsWith('/');
  }
}

// Export singleton instance
export const commandService = new CommandService();
