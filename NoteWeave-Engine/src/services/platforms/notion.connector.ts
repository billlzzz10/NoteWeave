// notion.connector.ts
// Notion platform connector

import { BasePlatformConnector } from './base-platform-connector';
import { 
  PlatformType, 
  PlatformConfig, 
  PlatformSummary, 
  PlatformItem,
  SyncOptions,
  SyncResult,
  ConnectionStatus
} from '../../types/platform';
import { ProgressCallback } from '../../types';

// Mock Notion API client
class NotionClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async searchPages(query: string): Promise<any[]> {
    // Mock implementation
    return [
      {
        id: 'page1',
        title: 'Example Page 1',
        content: 'This is example content for page 1',
        lastEdited: new Date(),
        createdTime: new Date(Date.now() - 3600000)
      },
      {
        id: 'page2',
        title: 'Example Page 2',
        content: 'This is example content for page 2',
        lastEdited: new Date(),
        createdTime: new Date(Date.now() - 7200000)
      }
    ];
  }
  
  async getDatabase(databaseId: string): Promise<any> {
    // Mock implementation
    return {
      id: databaseId,
      title: 'Example Database',
      properties: {
        Name: { type: 'title' },
        Tags: { type: 'multi_select' },
        Status: { type: 'select' }
      }
    };
  }
  
  async queryDatabase(databaseId: string, query: any): Promise<any[]> {
    // Mock implementation
    return [
      {
        id: 'row1',
        properties: {
          Name: { title: [{ text: { content: 'Item 1' } }] },
          Tags: { multi_select: [{ name: 'tag1' }, { name: 'tag2' }] },
          Status: { select: { name: 'Done' } }
        },
        created_time: new Date(Date.now() - 3600000).toISOString(),
        last_edited_time: new Date().toISOString()
      },
      {
        id: 'row2',
        properties: {
          Name: { title: [{ text: { content: 'Item 2' } }] },
          Tags: { multi_select: [{ name: 'tag3' }] },
          Status: { select: { name: 'In Progress' } }
        },
        created_time: new Date(Date.now() - 7200000).toISOString(),
        last_edited_time: new Date().toISOString()
      }
    ];
  }
  
  async getBlockChildren(blockId: string): Promise<any[]> {
    // Mock implementation
    return [
      {
        id: 'block1',
        type: 'paragraph',
        paragraph: { text: [{ type: 'text', text: { content: 'This is a paragraph' } }] }
      },
      {
        id: 'block2',
        type: 'heading_1',
        heading_1: { text: [{ type: 'text', text: { content: 'This is a heading' } }] }
      }
    ];
  }
  
  async getPage(pageId: string): Promise<any> {
    // Mock implementation
    return {
      id: pageId,
      title: pageId === 'page1' ? 'Example Page 1' : 'Example Page 2',
      lastEdited: new Date(),
      createdTime: new Date(Date.now() - 3600000)
    };
  }
  
  async deletePage(pageId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }
  
  async updatePage(pageId: string, properties: any): Promise<any> {
    // Mock implementation
    return {
      id: pageId,
      title: properties.title || 'Updated Page',
      lastEdited: new Date(),
      createdTime: new Date(Date.now() - 3600000)
    };
  }
}

/**
 * Notion platform connector
 */
export class NotionConnector extends BasePlatformConnector {
  private clients: Map<string, NotionClient> = new Map();
  
  /**
   * Get the platform type
   */
  public getPlatformType(): PlatformType {
    return 'notion';
  }
  
  /**
   * Connect to Notion
   * @param config Notion platform configuration
   */
  public async connect(config: PlatformConfig): Promise<PlatformSummary> {
    const { platformType, credentials } = config;
    
    // Validate required credentials
    if (!credentials.apiKey) {
      throw new Error('Notion API key is required');
    }
    
    try {
      // Create Notion client
      const client = new NotionClient(credentials.apiKey);
      
      // Generate a unique ID for this connection
      const platformId = this.generateConnectionId();
      
      // Store connection details
      const summary: PlatformSummary = {
        id: platformId,
        name: config.workspace || 'Notion Workspace',
        platformType,
        status: 'connected',
        connectedSince: new Date(),
        workspaceName: config.workspace || 'Notion Workspace'
      };
      
      // Store client and connection details
      this.clients.set(platformId, client);
      this.activeConnections.set(platformId, {
        config,
        summary
      });
      
      return summary;
    } catch (error: any) {
      throw new Error(`Failed to connect to Notion: ${error.message}`);
    }
  }
  
  /**
   * Get connection status
   * @param platformId Platform connection ID
   */
  public async getStatus(platformId: string): Promise<ConnectionStatus> {
    if (!this.hasConnection(platformId)) {
      return 'disconnected';
    }
    
    const connection = this.activeConnections.get(platformId);
    return connection?.summary.status || 'disconnected';
  }
  
  /**
   * Get connection summary
   * @param platformId Platform connection ID
   */
  public async getSummary(platformId: string): Promise<PlatformSummary> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const connection = this.activeConnections.get(platformId);
    return connection!.summary;
  }
  
  /**
   * Update connection config
   * @param platformId Platform connection ID
   * @param config New configuration
   */
  public async updateConfig(platformId: string, config: Partial<PlatformConfig>): Promise<PlatformSummary> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const connection = this.activeConnections.get(platformId)!;
    
    // Update the config
    connection.config = {
      ...connection.config,
      ...config
    };
    
    // If credentials were updated, recreate the client
    if (config.credentials?.apiKey) {
      const client = new NotionClient(config.credentials.apiKey);
      this.clients.set(platformId, client);
    }
    
    // Update the connection in the map
    this.activeConnections.set(platformId, connection);
    
    return connection.summary;
  }
  
  /**
   * Get a specific item from Notion
   * @param platformId Platform connection ID
   * @param itemId Item ID in Notion
   */
  public async getItem(platformId: string, itemId: string): Promise<PlatformItem> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const client = this.clients.get(platformId);
    
    if (!client) {
      throw new Error(`Notion client for connection ${platformId} not found`);
    }
    
    try {
      // Get the page from Notion
      const page = await client.getPage(itemId);
      
      // Get page content (blocks)
      const blocks = await client.getBlockChildren(page.id);
      
      // Convert blocks to markdown content
      const content = this.convertBlocksToMarkdown(blocks);
      
      // Create platform item
      const item: PlatformItem = {
        id: page.id,
        platformId,
        title: page.title,
        type: 'page',
        content,
        url: `https://notion.so/${page.id.replace(/-/g, '')}`,
        created: new Date(page.createdTime),
        updated: new Date(page.lastEdited),
        metadata: {
          notionType: 'page',
          parent: page.parent
        },
        syncStatus: 'synced',
        lastSynced: new Date()
      };
      
      return item;
    } catch (error: any) {
      throw new Error(`Failed to get item from Notion: ${error.message}`);
    }
  }
  
  /**
   * Delete an item from Notion
   * @param platformId Platform connection ID
   * @param itemId Item ID in Notion
   */
  public async deleteItem(platformId: string, itemId: string): Promise<boolean> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const client = this.clients.get(platformId);
    
    if (!client) {
      throw new Error(`Notion client for connection ${platformId} not found`);
    }
    
    try {
      // Delete the page from Notion
      return await client.deletePage(itemId);
    } catch (error: any) {
      throw new Error(`Failed to delete item from Notion: ${error.message}`);
    }
  }
  
  /**
   * Fetch items from Notion
   * @param platformId Platform connection ID
   * @param options Options for fetching items
   * @param progressCallback Callback for progress updates
   */
  public async fetchItems(
    platformId: string, 
    options?: Partial<SyncOptions>,
    progressCallback?: ProgressCallback
  ): Promise<PlatformItem[]> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const client = this.clients.get(platformId);
    
    if (!client) {
      throw new Error(`Notion client for connection ${platformId} not found`);
    }
    
    try {
      // Simulate fetching pages from Notion
      const pages = await client.searchPages(options?.filter?.query || '');
      
      // Report progress
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: pages.length,
          percentage: 0,
          status: 'running',
          currentItem: 'Fetching Notion pages'
        });
      }
      
      // Convert Notion pages to platform items
      const items: PlatformItem[] = [];
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Get page content (blocks)
        const blocks = await client.getBlockChildren(page.id);
        
        // Convert blocks to markdown content
        const content = this.convertBlocksToMarkdown(blocks);
        
        // Create platform item
        const item: PlatformItem = {
          id: page.id,
          platformId,
          title: page.title,
          type: 'page',
          content,
          url: `https://notion.so/${page.id.replace(/-/g, '')}`,
          created: new Date(page.createdTime),
          updated: new Date(page.lastEdited),
          metadata: {
            notionType: 'page',
            parent: page.parent
          },
          syncStatus: 'synced',
          lastSynced: new Date()
        };
        
        items.push(item);
        
        // Report progress
        if (progressCallback) {
          progressCallback({
            completed: i + 1,
            total: pages.length,
            percentage: Math.round(((i + 1) / pages.length) * 100),
            status: 'running',
            currentItem: `Processing: ${page.title}`
          });
        }
      }
      
      // Final progress update
      if (progressCallback) {
        progressCallback({
          completed: pages.length,
          total: pages.length,
          percentage: 100,
          status: 'completed',
          currentItem: 'Completed fetching Notion pages'
        });
      }
      
      return items;
    } catch (error: any) {
      throw new Error(`Failed to fetch items from Notion: ${error.message}`);
    }
  }
  
  /**
   * Sync data with Notion
   * @param platformId Platform connection ID
   * @param options Sync options
   * @param progressCallback Callback for progress updates
   */
  public async syncData(
    platformId: string, 
    options: SyncOptions,
    progressCallback?: ProgressCallback
  ): Promise<SyncResult> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    try {
      const items = await this.fetchItems(platformId, options, progressCallback);
      
      // Here we would implement the actual sync logic based on the direction
      // For now, we just return a mock result
      
      return {
        success: true,
        platformId,
        itemsProcessed: items.length,
        itemsAdded: items.length,
        itemsUpdated: 0,
        itemsRemoved: 0,
        errors: [],
        timestamp: new Date(),
        duration: 1000
      };
    } catch (error: any) {
      throw new Error(`Failed to sync data with Notion: ${error.message}`);
    }
  }
  
  /**
   * Push items to Notion
   * @param platformId Platform connection ID
   * @param items Items to push
   * @param progressCallback Callback for progress updates
   */
  public async pushItems(
    platformId: string, 
    items: PlatformItem[],
    progressCallback?: ProgressCallback
  ): Promise<SyncResult> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const client = this.clients.get(platformId);
    
    if (!client) {
      throw new Error(`Notion client for connection ${platformId} not found`);
    }
    
    try {
      // Report initial progress
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: items.length,
          percentage: 0,
          status: 'running',
          currentItem: 'Starting to push items to Notion'
        });
      }
      
      // Here we would implement the actual push logic
      // For now, we just simulate the process
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Simulate a delay for the operation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Report progress
        if (progressCallback) {
          progressCallback({
            completed: i + 1,
            total: items.length,
            percentage: Math.round(((i + 1) / items.length) * 100),
            status: 'running',
            currentItem: `Pushing: ${item.title}`
          });
        }
      }
      
      // Final progress update
      if (progressCallback) {
        progressCallback({
          completed: items.length,
          total: items.length,
          percentage: 100,
          status: 'completed',
          currentItem: 'Completed pushing items to Notion'
        });
      }
      
      return {
        success: true,
        platformId,
        itemsProcessed: items.length,
        itemsAdded: items.length,
        itemsUpdated: 0,
        itemsRemoved: 0,
        errors: [],
        timestamp: new Date(),
        duration: items.length * 100
      };
    } catch (error: any) {
      throw new Error(`Failed to push items to Notion: ${error.message}`);
    }
  }
  
  /**
   * Get authentication URL for OAuth
   * This is a placeholder as Notion typically uses API keys
   * @param redirectUri Redirect URI for OAuth
   */
  public async getAuthUrl(redirectUri: string): Promise<string> {
    // Notion typically uses API keys, but if OAuth is implemented, this would return the auth URL
    return `https://api.notion.com/v1/oauth/authorize?client_id=CLIENT_ID&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
  }
  
  /**
   * Handle authentication code for OAuth
   * This is a placeholder as Notion typically uses API keys
   * @param code Authentication code
   * @param redirectUri Redirect URI used for OAuth
   */
  public async handleAuthCode(code: string, redirectUri: string): Promise<PlatformConfig> {
    // Notion typically uses API keys, but if OAuth is implemented, this would exchange the code for a token
    return {
      platformType: 'notion',
      credentials: {
        apiKey: 'mock-api-key-from-oauth'
      },
      workspace: 'Notion Workspace'
    };
  }
  
  /**
   * Convert Notion blocks to markdown
   * @param blocks Notion blocks
   * @returns Markdown content
   */
  private convertBlocksToMarkdown(blocks: any[]): string {
    let markdown = '';
    
    for (const block of blocks) {
      switch (block.type) {
        case 'paragraph':
          markdown += this.extractTextContent(block.paragraph.text) + '\n\n';
          break;
        case 'heading_1':
          markdown += '# ' + this.extractTextContent(block.heading_1.text) + '\n\n';
          break;
        case 'heading_2':
          markdown += '## ' + this.extractTextContent(block.heading_2.text) + '\n\n';
          break;
        case 'heading_3':
          markdown += '### ' + this.extractTextContent(block.heading_3.text) + '\n\n';
          break;
        case 'bulleted_list_item':
          markdown += '- ' + this.extractTextContent(block.bulleted_list_item.text) + '\n';
          break;
        case 'numbered_list_item':
          markdown += '1. ' + this.extractTextContent(block.numbered_list_item.text) + '\n';
          break;
        case 'code':
          markdown += '```' + (block.code.language || '') + '\n';
          markdown += this.extractTextContent(block.code.text) + '\n';
          markdown += '```\n\n';
          break;
        case 'quote':
          markdown += '> ' + this.extractTextContent(block.quote.text) + '\n\n';
          break;
        default:
          // Handle other block types or skip them
          break;
      }
    }
    
    return markdown;
  }
  
  /**
   * Extract text content from Notion rich text
   * @param richText Notion rich text array
   * @returns Plain text content
   */
  private extractTextContent(richText: any[]): string {
    if (!richText || !Array.isArray(richText)) {
      return '';
    }
    
    return richText.map(text => text.text?.content || '').join('');
  }
}
