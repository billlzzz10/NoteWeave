// notion-connector.ts
// Connector สำหรับเชื่อมต่อกับ Notion

import { Client } from '@notionhq/client';
import { BasePlatformConnector } from './base-platform-connector';
import { 
  PlatformConfig, 
  PlatformSummary, 
  PlatformItem, 
  SyncOptions,
  SyncResult
} from '../../types/platform';
import { ProgressCallback } from '../../types';

/**
 * Connector สำหรับเชื่อมต่อกับ Notion
 */
export class NotionConnector extends BasePlatformConnector {
  // Map ของ Notion clients โดยใช้ platformId เป็น key
  private notionClients: Map<string, Client> = new Map();
  
  /**
   * สร้าง Notion client
   * @param apiKey API key สำหรับ Notion
   */
  private createNotionClient(apiKey: string): Client {
    return new Client({ auth: apiKey });
  }
  
  /**
   * ดึง Notion client สำหรับการเชื่อมต่อที่ระบุ
   * @param platformId ID ของการเชื่อมต่อ
   */
  private getNotionClient(platformId: string): Client {
    if (!this.notionClients.has(platformId)) {
      throw new Error(`ไม่พบ Notion client สำหรับการเชื่อมต่อ ID: ${platformId}`);
    }
    
    return this.notionClients.get(platformId)!;
  }
  
  /**
   * เชื่อมต่อกับ Notion
   * @param config การตั้งค่าการเชื่อมต่อ
   */
  public async connect(config: PlatformConfig): Promise<PlatformSummary> {
    try {
      // ตรวจสอบว่ามี API key หรือไม่
      if (!config.credentials.apiKey && !config.credentials.accessToken) {
        throw new Error('ต้องระบุ API key หรือ Access Token สำหรับการเชื่อมต่อกับ Notion');
      }
      
      // สร้าง Notion client
      const apiKey = config.credentials.apiKey || config.credentials.accessToken;
      const notionClient = this.createNotionClient(apiKey!);
      
      // ทดสอบการเชื่อมต่อโดยดึงข้อมูลผู้ใช้
      const user = await notionClient.users.me();
      
      // สร้าง ID สำหรับการเชื่อมต่อ
      const platformId = this.generateConnectionId();
      
      // สร้างข้อมูลสรุปของการเชื่อมต่อ
      const summary: PlatformSummary = {
        id: platformId,
        name: config.workspace || `Notion Workspace (${user.name})`,
        platformType: 'notion',
        status: 'connected',
        connectedSince: new Date(),
        workspaceName: user.name || 'Notion Workspace'
      };
      
      // เก็บข้อมูลการเชื่อมต่อ
      this.activeConnections.set(platformId, {
        config,
        summary
      });
      
      // เก็บ Notion client
      this.notionClients.set(platformId, notionClient);
      
      return summary;
    } catch (error) {
      // สร้างข้อมูลสรุปของการเชื่อมต่อที่ล้มเหลว
      const platformId = this.generateConnectionId();
      const summary: PlatformSummary = {
        id: platformId,
        name: config.workspace || 'Notion Workspace',
        platformType: 'notion',
        status: 'error',
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Notion'
      };
      
      throw error;
    }
  }
  
  /**
   * ตั้งค่าการเชื่อมต่อใหม่
   * @param platformId ID ของการเชื่อมต่อ
   * @param config การตั้งค่าการเชื่อมต่อใหม่
   */
  public async updateConfig(platformId: string, config: Partial<PlatformConfig>): Promise<PlatformSummary> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const connection = this.activeConnections.get(platformId)!;
    
    // ตรวจสอบว่ามีการเปลี่ยนแปลง API key หรือไม่
    if (
      config.credentials?.apiKey && 
      config.credentials.apiKey !== connection.config.credentials.apiKey
    ) {
      // สร้าง Notion client ใหม่
      const notionClient = this.createNotionClient(config.credentials.apiKey);
      this.notionClients.set(platformId, notionClient);
    }
    
    // อัปเดตการตั้งค่า
    connection.config = {
      ...connection.config,
      ...config,
      credentials: {
        ...connection.config.credentials,
        ...config.credentials
      }
    };
    
    // อัปเดตข้อมูลสรุป
    if (config.workspace) {
      this.updateSummary(platformId, {
        name: config.workspace,
        workspaceName: config.workspace
      });
    }
    
    // บันทึกการเปลี่ยนแปลง
    this.activeConnections.set(platformId, connection);
    
    return connection.summary;
  }
  
  /**
   * ดึงรายการจากแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param options ตัวเลือกในการดึงข้อมูล
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   */
  public async fetchItems(
    platformId: string, 
    options?: Partial<SyncOptions>,
    progressCallback?: ProgressCallback
  ): Promise<PlatformItem[]> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const notionClient = this.getNotionClient(platformId);
    const items: PlatformItem[] = [];
    
    try {
      // แจ้งเริ่มต้นการดึงข้อมูล
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: 0, // ยังไม่ทราบจำนวนทั้งหมด
          percentage: 0,
          status: 'running',
          currentItem: 'เริ่มดึงข้อมูลจาก Notion'
        });
      }
      
      // ค้นหา databases
      const databases = await notionClient.search({
        filter: {
          property: 'object',
          value: 'database'
        }
      });
      
      // แจ้งความคืบหน้า
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: databases.results.length,
          percentage: 0,
          currentItem: `พบ ${databases.results.length} databases`,
          status: 'running'
        });
      }
      
      // ดึงข้อมูลจากแต่ละ database
      for (let i = 0; i < databases.results.length; i++) {
        const database = databases.results[i];
        
        // แจ้งความคืบหน้า
        if (progressCallback) {
          progressCallback({
            completed: i,
            total: databases.results.length,
            percentage: Math.round((i / databases.results.length) * 100),
            currentItem: `กำลังดึงข้อมูลจาก database: ${database.id}`,
            status: 'running'
          });
        }
        
        // ดึงรายการจาก database
        const response = await notionClient.databases.query({
          database_id: database.id
        });
        
        // แปลงข้อมูลเป็น PlatformItem
        for (const page of response.results) {
          // อ่านข้อมูลจาก properties
          const titleProperty = Object.values(page.properties).find(
            (prop: any) => prop.type === 'title'
          ) as any;
          
          const title = titleProperty?.title?.[0]?.plain_text || 'Untitled';
          
          // สร้าง PlatformItem
          const item: PlatformItem = {
            id: page.id,
            platformId,
            title,
            type: 'page',
            url: page.url,
            created: new Date(page.created_time),
            updated: new Date(page.last_edited_time),
            metadata: {
              database_id: database.id,
              properties: page.properties
            },
            syncStatus: 'pending'
          };
          
          items.push(item);
        }
      }
      
      // ค้นหา pages
      const pages = await notionClient.search({
        filter: {
          property: 'object',
          value: 'page'
        }
      });
      
      // แจ้งความคืบหน้า
      if (progressCallback) {
        progressCallback({
          completed: databases.results.length,
          total: databases.results.length + pages.results.length,
          percentage: Math.round((databases.results.length / (databases.results.length + pages.results.length)) * 100),
          currentItem: `พบ ${pages.results.length} pages`,
          status: 'running'
        });
      }
      
      // ดึงข้อมูลจากแต่ละ page
      for (let i = 0; i < pages.results.length; i++) {
        const page = pages.results[i];
        
        // แจ้งความคืบหน้า
        if (progressCallback) {
          progressCallback({
            completed: databases.results.length + i,
            total: databases.results.length + pages.results.length,
            percentage: Math.round(((databases.results.length + i) / (databases.results.length + pages.results.length)) * 100),
            currentItem: `กำลังดึงข้อมูลจาก page: ${page.id}`,
            status: 'running'
          });
        }
        
        // อ่านข้อมูลจาก properties
        const titleProperty = Object.values(page.properties).find(
          (prop: any) => prop.type === 'title'
        ) as any;
        
        const title = titleProperty?.title?.[0]?.plain_text || 'Untitled';
        
        // สร้าง PlatformItem
        const item: PlatformItem = {
          id: page.id,
          platformId,
          title,
          type: 'page',
          url: page.url,
          created: new Date(page.created_time),
          updated: new Date(page.last_edited_time),
          metadata: {
            properties: page.properties
          },
          syncStatus: 'pending'
        };
        
        items.push(item);
      }
      
      // แจ้งเสร็จสิ้น
      if (progressCallback) {
        progressCallback({
          completed: databases.results.length + pages.results.length,
          total: databases.results.length + pages.results.length,
          percentage: 100,
          currentItem: `ดึงข้อมูลเสร็จสิ้น (${items.length} รายการ)`,
          status: 'completed'
        });
      }
      
      // อัปเดตข้อมูลสรุป
      this.updateSummary(platformId, {
        itemCount: items.length,
        lastSync: new Date()
      });
      
      return items;
    } catch (error) {
      // แจ้งข้อผิดพลาด
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: 0,
          percentage: 0,
          status: 'failed',
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก Notion'
        });
      }
      
      throw error;
    }
  }
  
  /**
   * ดึงรายการเฉพาะจากแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param itemId ID ของรายการในแพลตฟอร์ม
   */
  public async getItem(platformId: string, itemId: string): Promise<PlatformItem> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const notionClient = this.getNotionClient(platformId);
    
    try {
      // ดึงข้อมูล page
      const page = await notionClient.pages.retrieve({ page_id: itemId });
      
      // ดึงเนื้อหาของ page
      const blocks = await notionClient.blocks.children.list({ block_id: itemId });
      
      // แปลงข้อมูลเป็น PlatformItem
      const titleProperty = Object.values(page.properties).find(
        (prop: any) => prop.type === 'title'
      ) as any;
      
      const title = titleProperty?.title?.[0]?.plain_text || 'Untitled';
      
      // แปลง blocks เป็น markdown
      let content = '';
      for (const block of blocks.results) {
        content += this.blockToMarkdown(block);
      }
      
      // สร้าง PlatformItem
      const item: PlatformItem = {
        id: page.id,
        platformId,
        title,
        type: 'page',
        content,
        url: page.url,
        created: new Date(page.created_time),
        updated: new Date(page.last_edited_time),
        metadata: {
          properties: page.properties,
          blocks: blocks.results
        },
        syncStatus: 'synced',
        lastSynced: new Date()
      };
      
      return item;
    } catch (error) {
      throw new Error(`ไม่สามารถดึงข้อมูลรายการ ID: ${itemId} - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * แปลง Notion block เป็น markdown
   * @param block Notion block
   */
  private blockToMarkdown(block: any): string {
    let markdown = '';
    
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph.rich_text.length > 0) {
          markdown += block.paragraph.rich_text.map((text: any) => text.plain_text).join('');
        }
        markdown += '\n\n';
        break;
        
      case 'heading_1':
        if (block.heading_1.rich_text.length > 0) {
          markdown += '# ' + block.heading_1.rich_text.map((text: any) => text.plain_text).join('');
        }
        markdown += '\n\n';
        break;
        
      case 'heading_2':
        if (block.heading_2.rich_text.length > 0) {
          markdown += '## ' + block.heading_2.rich_text.map((text: any) => text.plain_text).join('');
        }
        markdown += '\n\n';
        break;
        
      case 'heading_3':
        if (block.heading_3.rich_text.length > 0) {
          markdown += '### ' + block.heading_3.rich_text.map((text: any) => text.plain_text).join('');
        }
        markdown += '\n\n';
        break;
        
      case 'bulleted_list_item':
        if (block.bulleted_list_item.rich_text.length > 0) {
          markdown += '- ' + block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('');
        }
        markdown += '\n';
        break;
        
      case 'numbered_list_item':
        if (block.numbered_list_item.rich_text.length > 0) {
          markdown += '1. ' + block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('');
        }
        markdown += '\n';
        break;
        
      case 'to_do':
        if (block.to_do.rich_text.length > 0) {
          markdown += block.to_do.checked ? '- [x] ' : '- [ ] ';
          markdown += block.to_do.rich_text.map((text: any) => text.plain_text).join('');
        }
        markdown += '\n';
        break;
        
      case 'code':
        if (block.code.rich_text.length > 0) {
          markdown += '```' + (block.code.language || '') + '\n';
          markdown += block.code.rich_text.map((text: any) => text.plain_text).join('');
          markdown += '\n```\n\n';
        }
        break;
        
      case 'quote':
        if (block.quote.rich_text.length > 0) {
          markdown += '> ' + block.quote.rich_text.map((text: any) => text.plain_text).join('');
        }
        markdown += '\n\n';
        break;
        
      case 'divider':
        markdown += '---\n\n';
        break;
        
      case 'image':
        if (block.image.caption && block.image.caption.length > 0) {
          const caption = block.image.caption.map((text: any) => text.plain_text).join('');
          markdown += `![${caption}](${block.image.file?.url || block.image.external?.url || ''})\n\n`;
        } else {
          markdown += `![Image](${block.image.file?.url || block.image.external?.url || ''})\n\n`;
        }
        break;
        
      default:
        // สำหรับ block ประเภทอื่นๆ ที่ไม่รองรับ
        if (block[block.type]?.rich_text) {
          markdown += block[block.type].rich_text.map((text: any) => text.plain_text).join('');
          markdown += '\n\n';
        }
    }
    
    return markdown;
  }
  
  /**
   * ซิงค์ข้อมูลกับแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param options ตัวเลือกในการซิงค์ข้อมูล
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   */
  public async syncData(
    platformId: string, 
    options: SyncOptions,
    progressCallback?: ProgressCallback
  ): Promise<SyncResult> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    // เริ่มต้นการซิงค์ข้อมูล
    const startTime = Date.now();
    
    try {
      // แจ้งเริ่มต้นการซิงค์
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: 0,
          percentage: 0,
          currentItem: 'เริ่มซิงค์ข้อมูลกับ Notion',
          status: 'running'
        });
      }
      
      // ดึงรายการจาก Notion
      const items = await this.fetchItems(platformId, options, progressCallback);
      
      // สร้างผลลัพธ์การซิงค์
      const result: SyncResult = {
        success: true,
        platformId,
        itemsProcessed: items.length,
        itemsAdded: items.length, // สมมติว่าทุกรายการเป็นรายการใหม่
        itemsUpdated: 0,
        itemsRemoved: 0,
        errors: [],
        timestamp: new Date(),
        duration: Date.now() - startTime
      };
      
      // อัปเดตข้อมูลสรุป
      this.updateSummary(platformId, {
        itemCount: items.length,
        lastSync: new Date()
      });
      
      // แจ้งเสร็จสิ้น
      if (progressCallback) {
        progressCallback({
          completed: items.length,
          total: items.length,
          percentage: 100,
          currentItem: 'ซิงค์ข้อมูลเสร็จสิ้น',
          status: 'completed'
        });
      }
      
      return result;
    } catch (error) {
      // แจ้งข้อผิดพลาด
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: 0,
          percentage: 0,
          status: 'failed',
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการซิงค์ข้อมูลกับ Notion'
        });
      }
      
      // สร้างผลลัพธ์การซิงค์ที่ล้มเหลว
      const result: SyncResult = {
        success: false,
        platformId,
        itemsProcessed: 0,
        itemsAdded: 0,
        itemsUpdated: 0,
        itemsRemoved: 0,
        errors: [{
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการซิงค์ข้อมูลกับ Notion'
        }],
        timestamp: new Date(),
        duration: Date.now() - startTime
      };
      
      return result;
    }
  }
  
  /**
   * ส่งรายการไปยังแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param items รายการที่ต้องการส่ง
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   */
  public async pushItems(
    platformId: string,
    items: PlatformItem[],
    progressCallback?: ProgressCallback
  ): Promise<SyncResult> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const notionClient = this.getNotionClient(platformId);
    const startTime = Date.now();
    
    try {
      // แจ้งเริ่มต้นการส่งรายการ
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: items.length,
          percentage: 0,
          currentItem: 'เริ่มส่งรายการไปยัง Notion',
          status: 'running'
        });
      }
      
      // รายการที่เพิ่ม/อัปเดต/ล้มเหลว
      const added: string[] = [];
      const updated: string[] = [];
      const errors: Array<{ item?: string; error: string }> = [];
      
      // ส่งรายการไปยัง Notion
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // แจ้งความคืบหน้า
        if (progressCallback) {
          progressCallback({
            completed: i,
            total: items.length,
            percentage: Math.round((i / items.length) * 100),
            currentItem: `กำลังส่งรายการ: ${item.title}`,
            status: 'running'
          });
        }
        
        try {
          // ตรวจสอบว่ามีรายการนี้อยู่แล้วหรือไม่
          if (item.id.startsWith('notion_')) {
            // อัปเดตรายการที่มีอยู่แล้ว
            const notionId = item.id.replace('notion_', '');
            
            // อัปเดต page
            await notionClient.pages.update({
              page_id: notionId,
              properties: {
                title: {
                  title: [
                    {
                      text: {
                        content: item.title
                      }
                    }
                  ]
                }
              }
            });
            
            updated.push(item.id);
          } else {
            // สร้างรายการใหม่
            // ดึงพาเรนต์ ID (อาจเป็น database หรือ page)
            const parentId = item.metadata?.parentId || null;
            
            if (!parentId) {
              throw new Error('ไม่สามารถสร้างรายการใหม่เนื่องจากไม่ระบุ parent ID');
            }
            
            // สร้าง page ใหม่
            const response = await notionClient.pages.create({
              parent: {
                database_id: parentId
              },
              properties: {
                title: {
                  title: [
                    {
                      text: {
                        content: item.title
                      }
                    }
                  ]
                }
              }
            });
            
            added.push(response.id);
          }
        } catch (error) {
          errors.push({
            item: item.id,
            error: error instanceof Error ? error.message : `เกิดข้อผิดพลาดในการส่งรายการ: ${item.title}`
          });
        }
      }
      
      // สร้างผลลัพธ์
      const result: SyncResult = {
        success: errors.length === 0,
        platformId,
        itemsProcessed: items.length,
        itemsAdded: added.length,
        itemsUpdated: updated.length,
        itemsRemoved: 0,
        errors,
        timestamp: new Date(),
        duration: Date.now() - startTime
      };
      
      // แจ้งเสร็จสิ้น
      if (progressCallback) {
        progressCallback({
          completed: items.length,
          total: items.length,
          percentage: 100,
          currentItem: 'ส่งรายการเสร็จสิ้น',
          status: 'completed'
        });
      }
      
      return result;
    } catch (error) {
      // แจ้งข้อผิดพลาด
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: items.length,
          percentage: 0,
          status: 'failed',
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งรายการไปยัง Notion'
        });
      }
      
      // สร้างผลลัพธ์ที่ล้มเหลว
      const result: SyncResult = {
        success: false,
        platformId,
        itemsProcessed: 0,
        itemsAdded: 0,
        itemsUpdated: 0,
        itemsRemoved: 0,
        errors: [{
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งรายการไปยัง Notion'
        }],
        timestamp: new Date(),
        duration: Date.now() - startTime
      };
      
      return result;
    }
  }
  
  /**
   * ลบรายการในแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param itemId ID ของรายการในแพลตฟอร์ม
   */
  public async deleteItem(platformId: string, itemId: string): Promise<boolean> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const notionClient = this.getNotionClient(platformId);
    
    try {
      // ตรวจสอบ ID รูปแบบ
      const notionId = itemId.startsWith('notion_') ? itemId.replace('notion_', '') : itemId;
      
      // ลบ page โดยการอัปเดตให้เป็น archived
      await notionClient.pages.update({
        page_id: notionId,
        archived: true
      });
      
      return true;
    } catch (error) {
      throw new Error(`ไม่สามารถลบรายการ ID: ${itemId} - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
