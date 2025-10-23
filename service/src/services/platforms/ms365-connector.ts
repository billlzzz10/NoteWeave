// ms365-connector.ts
// Connector สำหรับเชื่อมต่อกับ Microsoft 365

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
 * Connector สำหรับเชื่อมต่อกับ Microsoft 365
 */
export class MS365Connector extends BasePlatformConnector {
  // Microsoft Graph Client
  private graphClients: Map<string, any> = new Map();
  
  /**
   * สร้าง Microsoft Graph client
   * @param config การตั้งค่าการเชื่อมต่อ
   */
  private async createGraphClient(config: PlatformConfig): Promise<any> {
    // ในการใช้งานจริง เราจะใช้ Microsoft Graph SDK
    // ตัวอย่างนี้เป็นเพียงตัวอย่างโครงสร้าง
    
    return {
      // Mock client ของ Microsoft Graph SDK
      me: {
        get: async () => {
          // สมมติว่าได้ข้อมูลผู้ใช้
          return {
            displayName: config.credentials.username || 'Microsoft 365 User',
            mail: config.credentials.email || 'user@example.com'
          };
        }
      },
      sites: {
        root: {
          get: async () => {
            // สมมติว่าได้ข้อมูล site
            return {
              id: 'root-site-id',
              displayName: 'Root Site'
            };
          }
        },
        getById: (siteId: string) => {
          return {
            lists: {
              get: async () => {
                // สมมติว่าได้รายการ lists
                return {
                  value: [
                    { id: 'list1', displayName: 'Documents' },
                    { id: 'list2', displayName: 'Pages' }
                  ]
                };
              }
            }
          };
        }
      },
      // เพิ่ม method อื่นๆ ตามที่ต้องการ
    };
  }
  
  /**
   * ดึง Microsoft Graph client สำหรับการเชื่อมต่อที่ระบุ
   * @param platformId ID ของการเชื่อมต่อ
   */
  private getGraphClient(platformId: string): any {
    if (!this.graphClients.has(platformId)) {
      throw new Error(`ไม่พบ Microsoft Graph client สำหรับการเชื่อมต่อ ID: ${platformId}`);
    }
    
    return this.graphClients.get(platformId);
  }
  
  /**
   * เชื่อมต่อกับ Microsoft 365
   * @param config การตั้งค่าการเชื่อมต่อ
   */
  public async connect(config: PlatformConfig): Promise<PlatformSummary> {
    try {
      // ตรวจสอบข้อมูลการรับรองตัวตน
      if (!config.credentials.accessToken && !config.credentials.clientId) {
        throw new Error('ต้องระบุ Access Token หรือ Client ID สำหรับการเชื่อมต่อกับ Microsoft 365');
      }
      
      // สร้าง Microsoft Graph client
      const graphClient = await this.createGraphClient(config);
      
      // ทดสอบการเชื่อมต่อโดยดึงข้อมูลผู้ใช้
      const user = await graphClient.me.get();
      
      // สร้าง ID สำหรับการเชื่อมต่อ
      const platformId = this.generateConnectionId();
      
      // สร้างข้อมูลสรุปของการเชื่อมต่อ
      const summary: PlatformSummary = {
        id: platformId,
        name: config.workspace || `Microsoft 365 (${user.displayName})`,
        platformType: 'ms365',
        status: 'connected',
        connectedSince: new Date(),
        workspaceName: user.displayName || 'Microsoft 365'
      };
      
      // เก็บข้อมูลการเชื่อมต่อ
      this.activeConnections.set(platformId, {
        config,
        summary
      });
      
      // เก็บ Microsoft Graph client
      this.graphClients.set(platformId, graphClient);
      
      return summary;
    } catch (error) {
      // สร้างข้อมูลสรุปของการเชื่อมต่อที่ล้มเหลว
      const platformId = this.generateConnectionId();
      const summary: PlatformSummary = {
        id: platformId,
        name: config.workspace || 'Microsoft 365',
        platformType: 'ms365',
        status: 'error',
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Microsoft 365'
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
    
    // ตรวจสอบว่ามีการเปลี่ยนแปลง credentials หรือไม่
    if (
      config.credentials?.accessToken && 
      config.credentials.accessToken !== connection.config.credentials.accessToken
    ) {
      // สร้าง Microsoft Graph client ใหม่
      const graphClient = await this.createGraphClient({
        ...connection.config,
        credentials: {
          ...connection.config.credentials,
          ...config.credentials
        }
      });
      this.graphClients.set(platformId, graphClient);
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
    
    const graphClient = this.getGraphClient(platformId);
    const items: PlatformItem[] = [];
    
    try {
      // แจ้งเริ่มต้นการดึงข้อมูล
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: 0, // ยังไม่ทราบจำนวนทั้งหมด
          percentage: 0,
          status: 'running',
          currentItem: 'เริ่มดึงข้อมูลจาก Microsoft 365'
        });
      }
      
      // ดึงข้อมูล site
      const rootSite = await graphClient.sites.root.get();
      
      // ดึงรายการ lists
      const listsResponse = await graphClient.sites.getById(rootSite.id).lists.get();
      const lists = listsResponse.value;
      
      // แจ้งความคืบหน้า
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: lists.length,
          percentage: 0,
          currentItem: `พบ ${lists.length} lists`,
          status: 'running'
        });
      }
      
      // ในการใช้งานจริง เราจะดึงข้อมูลจาก Microsoft Graph API
      // ตัวอย่างนี้เป็นเพียงตัวอย่างโครงสร้าง
      
      // สร้างข้อมูลตัวอย่าง
      for (let i = 0; i < 10; i++) {
        const item: PlatformItem = {
          id: `ms365_item_${i}`,
          platformId,
          title: `Microsoft 365 Document ${i}`,
          type: 'document',
          content: `This is a sample content for document ${i}`,
          url: `https://example.com/document/${i}`,
          created: new Date(),
          updated: new Date(),
          metadata: {
            listId: 'list1',
            author: 'Sample User'
          },
          syncStatus: 'pending'
        };
        
        items.push(item);
        
        // แจ้งความคืบหน้า
        if (progressCallback) {
          progressCallback({
            completed: i + 1,
            total: 10,
            percentage: Math.round(((i + 1) / 10) * 100),
            currentItem: `กำลังดึงข้อมูลรายการ: ${item.title}`,
            status: 'running'
          });
        }
      }
      
      // แจ้งเสร็จสิ้น
      if (progressCallback) {
        progressCallback({
          completed: 10,
          total: 10,
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
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก Microsoft 365'
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
    
    // ในการใช้งานจริง เราจะดึงข้อมูลจาก Microsoft Graph API
    // ตัวอย่างนี้เป็นเพียงตัวอย่างโครงสร้าง
    
    // สร้างข้อมูลตัวอย่าง
    const item: PlatformItem = {
      id: itemId,
      platformId,
      title: `Microsoft 365 Document (ID: ${itemId})`,
      type: 'document',
      content: `This is a sample content for document with ID: ${itemId}`,
      url: `https://example.com/document/${itemId}`,
      created: new Date(),
      updated: new Date(),
      metadata: {
        listId: 'list1',
        author: 'Sample User'
      },
      syncStatus: 'synced',
      lastSynced: new Date()
    };
    
    return item;
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
          currentItem: 'เริ่มซิงค์ข้อมูลกับ Microsoft 365',
          status: 'running'
        });
      }
      
      // ดึงรายการจาก Microsoft 365
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
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการซิงค์ข้อมูลกับ Microsoft 365'
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
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการซิงค์ข้อมูลกับ Microsoft 365'
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
    
    const startTime = Date.now();
    
    try {
      // แจ้งเริ่มต้นการส่งรายการ
      if (progressCallback) {
        progressCallback({
          completed: 0,
          total: items.length,
          percentage: 0,
          currentItem: 'เริ่มส่งรายการไปยัง Microsoft 365',
          status: 'running'
        });
      }
      
      // รายการที่เพิ่ม/อัปเดต/ล้มเหลว
      const added: string[] = [];
      const updated: string[] = [];
      const errors: Array<{ item?: string; error: string }> = [];
      
      // ในการใช้งานจริง เราจะส่งรายการไปยัง Microsoft Graph API
      // ตัวอย่างนี้เป็นเพียงตัวอย่างโครงสร้าง
      
      // สมมติว่าส่งรายการสำเร็จทั้งหมด
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // แจ้งความคืบหน้า
        if (progressCallback) {
          progressCallback({
            completed: i + 1,
            total: items.length,
            percentage: Math.round(((i + 1) / items.length) * 100),
            currentItem: `กำลังส่งรายการ: ${item.title}`,
            status: 'running'
          });
        }
        
        // สมมติว่าส่งรายการสำเร็จ
        if (item.id.startsWith('ms365_')) {
          updated.push(item.id);
        } else {
          added.push(`ms365_new_${i}`);
        }
      }
      
      // สร้างผลลัพธ์
      const result: SyncResult = {
        success: true,
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
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งรายการไปยัง Microsoft 365'
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
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งรายการไปยัง Microsoft 365'
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
    
    // ในการใช้งานจริง เราจะลบรายการผ่าน Microsoft Graph API
    // ตัวอย่างนี้เป็นเพียงตัวอย่างโครงสร้าง
    
    // สมมติว่าลบรายการสำเร็จ
    return true;
  }
  
  /**
   * รับ URL สำหรับการรับรองตัวตน OAuth
   * @param platformId ID ของการเชื่อมต่อ
   * @param redirectUri URI ที่จะให้ redirect กลับหลังจากรับรองตัวตน
   */
  public async getAuthUrl(platformId: string, redirectUri: string): Promise<string> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const connection = this.activeConnections.get(platformId)!;
    
    // ตรวจสอบว่ามี client ID หรือไม่
    if (!connection.config.credentials.clientId) {
      throw new Error('ต้องระบุ Client ID สำหรับการรับรองตัวตนด้วย OAuth');
    }
    
    // สร้าง URL สำหรับการรับรองตัวตน
    const clientId = connection.config.credentials.clientId;
    const scopes = encodeURIComponent('https://graph.microsoft.com/.default');
    
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_mode=query`;
  }
  
  /**
   * ดำเนินการรับรองตัวตนด้วย OAuth code
   * @param platformId ID ของการเชื่อมต่อ
   * @param code code ที่ได้จากการ redirect
   * @param redirectUri URI ที่ใช้ในการรับรองตัวตน
   */
  public async handleAuthCode(platformId: string, code: string, redirectUri: string): Promise<PlatformSummary> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const connection = this.activeConnections.get(platformId)!;
    
    // ตรวจสอบว่ามี client ID และ client secret หรือไม่
    if (!connection.config.credentials.clientId || !connection.config.credentials.clientSecret) {
      throw new Error('ต้องระบุ Client ID และ Client Secret สำหรับการรับรองตัวตนด้วย OAuth');
    }
    
    try {
      // ในการใช้งานจริง เราจะส่ง request ไปยัง token endpoint
      // เพื่อแลก code กับ access token
      
      // สมมติว่าได้รับ token
      const accessToken = 'mock_access_token';
      const refreshToken = 'mock_refresh_token';
      const expiresIn = 3600;
      
      // คำนวณวันที่หมดอายุ
      const tokenExpiry = new Date();
      tokenExpiry.setSeconds(tokenExpiry.getSeconds() + expiresIn);
      
      // อัปเดต credentials
      connection.config.credentials = {
        ...connection.config.credentials,
        accessToken,
        refreshToken,
        tokenExpiry
      };
      
      // สร้าง Microsoft Graph client ใหม่
      const graphClient = await this.createGraphClient(connection.config);
      this.graphClients.set(platformId, graphClient);
      
      // ดึงข้อมูลผู้ใช้
      const user = await graphClient.me.get();
      
      // อัปเดตข้อมูลสรุป
      this.updateSummary(platformId, {
        status: 'connected',
        name: connection.config.workspace || `Microsoft 365 (${user.displayName})`,
        workspaceName: user.displayName || 'Microsoft 365'
      });
      
      // บันทึกการเปลี่ยนแปลง
      this.activeConnections.set(platformId, connection);
      
      return connection.summary;
    } catch (error) {
      // อัปเดตข้อมูลสรุป
      this.updateSummary(platformId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการรับรองตัวตนด้วย OAuth'
      });
      
      throw error;
    }
  }
}
