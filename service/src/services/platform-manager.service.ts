// platform-manager.service.ts
// Service สำหรับจัดการการเชื่อมต่อกับแพลตฟอร์มภายนอก

import { IPlatformConnector } from './platforms/platform-connector.interface';
import { NotionConnector } from './platforms/notion-connector';
import { MS365Connector } from './platforms/ms365-connector';
import { 
  PlatformType,
  PlatformConfig, 
  PlatformSummary, 
  PlatformItem, 
  SyncOptions,
  SyncResult
} from '../types/platform';
import { ProgressCallback } from '../types';
import { EventEmitter } from 'events';

/**
 * Service สำหรับจัดการการเชื่อมต่อกับแพลตฟอร์มภายนอก
 */
export class PlatformManagerService {
  // Singleton instance
  private static instance: PlatformManagerService;
  
  // EventEmitter สำหรับแจ้งเหตุการณ์
  public readonly events = new EventEmitter();
  
  // Map ของ connectors
  private connectors: Map<PlatformType, IPlatformConnector> = new Map();
  
  // Map ของการเชื่อมต่อทั้งหมด
  private connections: Map<string, {
    platformType: PlatformType;
    summary: PlatformSummary;
  }> = new Map();
  
  /**
   * ข้อมูลเพิ่มเติมสำหรับแพลตฟอร์มแต่ละประเภท
   */
  private readonly platformInfo: Record<PlatformType, {
    name: string;
    description: string;
    website: string;
    icon: string;
    authType: 'apiKey' | 'oauth' | 'both';
    requiredCredentials: string[];
  }> = {
    notion: {
      name: 'Notion',
      description: 'เชื่อมต่อกับ Notion เพื่อซิงค์โน้ตและเอกสาร',
      website: 'https://www.notion.so',
      icon: 'notion-icon.png',
      authType: 'apiKey',
      requiredCredentials: ['apiKey']
    },
    ms365: {
      name: 'Microsoft 365',
      description: 'เชื่อมต่อกับ Microsoft 365 เพื่อซิงค์เอกสารและโน้ต',
      website: 'https://www.microsoft365.com',
      icon: 'ms365-icon.png',
      authType: 'oauth',
      requiredCredentials: ['clientId', 'clientSecret']
    },
    obsidian: {
      name: 'Obsidian',
      description: 'เชื่อมต่อกับ Obsidian เพื่อซิงค์โน้ตและเอกสาร',
      website: 'https://obsidian.md',
      icon: 'obsidian-icon.png',
      authType: 'apiKey',
      requiredCredentials: ['vaultPath']
    },
    clickup: {
      name: 'ClickUp',
      description: 'เชื่อมต่อกับ ClickUp เพื่อซิงค์งานและโน้ต',
      website: 'https://clickup.com',
      icon: 'clickup-icon.png',
      authType: 'apiKey',
      requiredCredentials: ['apiKey']
    },
    github: {
      name: 'GitHub',
      description: 'เชื่อมต่อกับ GitHub เพื่อซิงค์เอกสารและ issues',
      website: 'https://github.com',
      icon: 'github-icon.png',
      authType: 'oauth',
      requiredCredentials: ['accessToken']
    },
    custom: {
      name: 'Custom',
      description: 'เชื่อมต่อกับแพลตฟอร์มที่กำหนดเอง',
      website: '',
      icon: 'custom-icon.png',
      authType: 'both',
      requiredCredentials: []
    }
  };
  
  /**
   * สร้าง PlatformManagerService
   */
  private constructor() {
    // สร้าง connector สำหรับแต่ละแพลตฟอร์ม
    this.connectors.set('notion', new NotionConnector());
    this.connectors.set('ms365', new MS365Connector());
    
    // TODO: สร้าง connector สำหรับแพลตฟอร์มอื่นๆ
  }
  
  /**
   * รับ Singleton instance ของ PlatformManagerService
   */
  public static getInstance(): PlatformManagerService {
    if (!PlatformManagerService.instance) {
      PlatformManagerService.instance = new PlatformManagerService();
    }
    
    return PlatformManagerService.instance;
  }
  
  /**
   * รับข้อมูลเพิ่มเติมเกี่ยวกับแพลตฟอร์ม
   */
  public getPlatformInfo(): Array<{
    type: PlatformType;
    name: string;
    description: string;
    website: string;
    icon: string;
    authType: 'apiKey' | 'oauth' | 'both';
    requiredCredentials: string[];
  }> {
    return Object.entries(this.platformInfo).map(([type, info]) => ({
      type: type as PlatformType,
      ...info
    }));
  }
  
  /**
   * เชื่อมต่อกับแพลตฟอร์ม
   * @param config การตั้งค่าการเชื่อมต่อ
   */
  public async connect(config: PlatformConfig): Promise<PlatformSummary> {
    const { platformType } = config;
    
    // ตรวจสอบว่ามี connector สำหรับแพลตฟอร์มนี้หรือไม่
    if (!this.connectors.has(platformType)) {
      throw new Error(`ไม่รองรับแพลตฟอร์ม: ${platformType}`);
    }
    
    // ตรวจสอบข้อมูลการรับรองตัวตน
    const requiredCredentials = this.platformInfo[platformType].requiredCredentials;
    for (const cred of requiredCredentials) {
      if (!config.credentials[cred]) {
        throw new Error(`ต้องระบุ ${cred} สำหรับการเชื่อมต่อกับ ${this.platformInfo[platformType].name}`);
      }
    }
    
    try {
      // เชื่อมต่อกับแพลตฟอร์ม
      const connector = this.connectors.get(platformType)!;
      const summary = await connector.connect(config);
      
      // เก็บข้อมูลการเชื่อมต่อ
      this.connections.set(summary.id, {
        platformType,
        summary
      });
      
      // แจ้งเหตุการณ์การเชื่อมต่อ
      this.events.emit('platform:connected', summary);
      
      return summary;
    } catch (error) {
      // แจ้งเหตุการณ์ข้อผิดพลาด
      this.events.emit('platform:error', {
        platformType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }
  
  /**
   * ยกเลิกการเชื่อมต่อกับแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   */
  public async disconnect(platformId: string): Promise<boolean> {
    // ตรวจสอบว่ามีการเชื่อมต่อนี้หรือไม่
    if (!this.connections.has(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const { platformType } = this.connections.get(platformId)!;
    
    try {
      // ยกเลิกการเชื่อมต่อ
      const connector = this.connectors.get(platformType)!;
      const success = await connector.disconnect(platformId);
      
      // ลบข้อมูลการเชื่อมต่อ
      if (success) {
        this.connections.delete(platformId);
      }
      
      // แจ้งเหตุการณ์การยกเลิกการเชื่อมต่อ
      this.events.emit('platform:disconnected', { platformId, platformType });
      
      return success;
    } catch (error) {
      // แจ้งเหตุการณ์ข้อผิดพลาด
      this.events.emit('platform:error', {
        platformId,
        platformType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }
  
  /**
   * รับข้อมูลสรุปของการเชื่อมต่อทั้งหมด
   */
  public async getAllConnections(): Promise<PlatformSummary[]> {
    const summaries: PlatformSummary[] = [];
    
    for (const [platformId, { platformType }] of this.connections) {
      try {
        const connector = this.connectors.get(platformType)!;
        const summary = await connector.getSummary(platformId);
        summaries.push(summary);
      } catch (error) {
        console.error(`Error getting summary for platform ${platformId}:`, error);
      }
    }
    
    return summaries;
  }
  
  /**
   * รับข้อมูลสรุปของการเชื่อมต่อ
   * @param platformId ID ของการเชื่อมต่อ
   */
  public async getConnection(platformId: string): Promise<PlatformSummary> {
    // ตรวจสอบว่ามีการเชื่อมต่อนี้หรือไม่
    if (!this.connections.has(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const { platformType } = this.connections.get(platformId)!;
    const connector = this.connectors.get(platformType)!;
    
    return connector.getSummary(platformId);
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
    // ตรวจสอบว่ามีการเชื่อมต่อนี้หรือไม่
    if (!this.connections.has(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const { platformType } = this.connections.get(platformId)!;
    const connector = this.connectors.get(platformType)!;
    
    try {
      // ดึงรายการ
      const items = await connector.fetchItems(platformId, options, progressCallback);
      
      // แจ้งเหตุการณ์การดึงรายการ
      this.events.emit('platform:items:fetched', {
        platformId,
        itemCount: items.length
      });
      
      return items;
    } catch (error) {
      // แจ้งเหตุการณ์ข้อผิดพลาด
      this.events.emit('platform:error', {
        platformId,
        platformType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
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
    // ตรวจสอบว่ามีการเชื่อมต่อนี้หรือไม่
    if (!this.connections.has(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const { platformType } = this.connections.get(platformId)!;
    const connector = this.connectors.get(platformType)!;
    
    try {
      // ซิงค์ข้อมูล
      const result = await connector.syncData(platformId, options, progressCallback);
      
      // แจ้งเหตุการณ์การซิงค์ข้อมูล
      this.events.emit('platform:data:synced', {
        platformId,
        result
      });
      
      return result;
    } catch (error) {
      // แจ้งเหตุการณ์ข้อผิดพลาด
      this.events.emit('platform:error', {
        platformId,
        platformType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
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
    // ตรวจสอบว่ามีการเชื่อมต่อนี้หรือไม่
    if (!this.connections.has(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const { platformType } = this.connections.get(platformId)!;
    const connector = this.connectors.get(platformType)!;
    
    try {
      // ส่งรายการ
      const result = await connector.pushItems(platformId, items, progressCallback);
      
      // แจ้งเหตุการณ์การส่งรายการ
      this.events.emit('platform:items:pushed', {
        platformId,
        result
      });
      
      return result;
    } catch (error) {
      // แจ้งเหตุการณ์ข้อผิดพลาด
      this.events.emit('platform:error', {
        platformId,
        platformType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }
  
  /**
   * รับ URL สำหรับการรับรองตัวตน OAuth
   * @param platformId ID ของการเชื่อมต่อ
   * @param redirectUri URI ที่จะให้ redirect กลับหลังจากรับรองตัวตน
   */
  public async getAuthUrl(platformId: string, redirectUri: string): Promise<string> {
    // ตรวจสอบว่ามีการเชื่อมต่อนี้หรือไม่
    if (!this.connections.has(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const { platformType } = this.connections.get(platformId)!;
    const connector = this.connectors.get(platformType)!;
    
    // ตรวจสอบว่า connector รองรับการรับรองตัวตนด้วย OAuth หรือไม่
    if (!connector.getAuthUrl) {
      throw new Error(`แพลตฟอร์ม ${this.platformInfo[platformType].name} ไม่รองรับการรับรองตัวตนด้วย OAuth`);
    }
    
    return connector.getAuthUrl(platformId, redirectUri);
  }
  
  /**
   * ดำเนินการรับรองตัวตนด้วย OAuth code
   * @param platformId ID ของการเชื่อมต่อ
   * @param code code ที่ได้จากการ redirect
   * @param redirectUri URI ที่ใช้ในการรับรองตัวตน
   */
  public async handleAuthCode(platformId: string, code: string, redirectUri: string): Promise<PlatformSummary> {
    // ตรวจสอบว่ามีการเชื่อมต่อนี้หรือไม่
    if (!this.connections.has(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const { platformType } = this.connections.get(platformId)!;
    const connector = this.connectors.get(platformType)!;
    
    // ตรวจสอบว่า connector รองรับการรับรองตัวตนด้วย OAuth หรือไม่
    if (!connector.handleAuthCode) {
      throw new Error(`แพลตฟอร์ม ${this.platformInfo[platformType].name} ไม่รองรับการรับรองตัวตนด้วย OAuth`);
    }
    
    try {
      // ดำเนินการรับรองตัวตน
      const summary = await connector.handleAuthCode(platformId, code, redirectUri);
      
      // อัปเดตข้อมูลการเชื่อมต่อ
      this.connections.set(platformId, {
        platformType,
        summary
      });
      
      // แจ้งเหตุการณ์การรับรองตัวตน
      this.events.emit('platform:authenticated', summary);
      
      return summary;
    } catch (error) {
      // แจ้งเหตุการณ์ข้อผิดพลาด
      this.events.emit('platform:error', {
        platformId,
        platformType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }
}

// สร้าง singleton instance
export const platformManager = PlatformManagerService.getInstance();
