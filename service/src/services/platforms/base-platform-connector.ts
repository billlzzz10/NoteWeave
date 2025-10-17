// base-platform-connector.ts
// คลาสพื้นฐานสำหรับ connector ที่เชื่อมต่อกับแพลตฟอร์มภายนอก

import { IPlatformConnector } from './platform-connector.interface';
import { 
  PlatformConfig, 
  PlatformSummary, 
  PlatformItem, 
  ConnectionStatus,
  SyncOptions,
  SyncResult
} from '../../types/platform';
import { ProgressCallback } from '../../types';
import crypto from 'crypto';

/**
 * คลาสพื้นฐานสำหรับ connector ที่เชื่อมต่อกับแพลตฟอร์มภายนอก
 * คลาสนี้จะมี implementation บางส่วนที่ใช้ร่วมกันสำหรับทุก connector
 */
export abstract class BasePlatformConnector implements IPlatformConnector {
  // Map ของการเชื่อมต่อที่ active อยู่ โดยใช้ platformId เป็น key
  protected activeConnections: Map<string, {
    config: PlatformConfig;
    summary: PlatformSummary;
  }> = new Map();
  
  /**
   * สร้าง ID สำหรับการเชื่อมต่อใหม่
   */
  protected generateConnectionId(): string {
    return crypto.randomUUID();
  }
  
  /**
   * ตรวจสอบว่ามีการเชื่อมต่อที่มี ID ตามที่ระบุหรือไม่
   * @param platformId ID ของการเชื่อมต่อ
   * @returns true ถ้ามีการเชื่อมต่อ, false ถ้าไม่มี
   */
  protected hasConnection(platformId: string): boolean {
    return this.activeConnections.has(platformId);
  }
  
  /**
   * ตรวจสอบว่า token หมดอายุหรือไม่
   * @param expiry วันที่หมดอายุ
   * @returns true ถ้า token หมดอายุ, false ถ้ายังไม่หมดอายุ
   */
  protected isTokenExpired(expiry?: Date): boolean {
    if (!expiry) return true;
    return expiry.getTime() < Date.now();
  }
  
  /**
   * อัปเดตข้อมูลสรุปของการเชื่อมต่อ
   * @param platformId ID ของการเชื่อมต่อ
   * @param updates ข้อมูลที่ต้องการอัปเดต
   */
  protected updateSummary(platformId: string, updates: Partial<PlatformSummary>): void {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    const connection = this.activeConnections.get(platformId)!;
    connection.summary = {
      ...connection.summary,
      ...updates
    };
    
    this.activeConnections.set(platformId, connection);
  }
  
  // Abstract methods ที่ต้อง implement ในคลาสลูก
  
  /**
   * เชื่อมต่อกับแพลตฟอร์ม
   * @param config การตั้งค่าการเชื่อมต่อ
   */
  public abstract connect(config: PlatformConfig): Promise<PlatformSummary>;
  
  /**
   * ยกเลิกการเชื่อมต่อกับแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   */
  public async disconnect(platformId: string): Promise<boolean> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    // อัปเดตสถานะการเชื่อมต่อ
    this.updateSummary(platformId, {
      status: 'disconnected'
    });
    
    // ลบการเชื่อมต่อออกจาก Map
    this.activeConnections.delete(platformId);
    
    return true;
  }
  
  /**
   * ตรวจสอบสถานะการเชื่อมต่อ
   * @param platformId ID ของการเชื่อมต่อ
   */
  public async getStatus(platformId: string): Promise<ConnectionStatus> {
    if (!this.hasConnection(platformId)) {
      return 'disconnected';
    }
    
    const connection = this.activeConnections.get(platformId)!;
    return connection.summary.status;
  }
  
  /**
   * รับข้อมูลสรุปของการเชื่อมต่อ
   * @param platformId ID ของการเชื่อมต่อ
   */
  public async getSummary(platformId: string): Promise<PlatformSummary> {
    if (!this.hasConnection(platformId)) {
      throw new Error(`ไม่พบการเชื่อมต่อ ID: ${platformId}`);
    }
    
    return this.activeConnections.get(platformId)!.summary;
  }
  
  /**
   * ตั้งค่าการเชื่อมต่อใหม่
   * @param platformId ID ของการเชื่อมต่อ
   * @param config การตั้งค่าการเชื่อมต่อใหม่
   */
  public abstract updateConfig(platformId: string, config: Partial<PlatformConfig>): Promise<PlatformSummary>;
  
  /**
   * ดึงรายการจากแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param options ตัวเลือกในการดึงข้อมูล
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   */
  public abstract fetchItems(
    platformId: string, 
    options?: Partial<SyncOptions>,
    progressCallback?: ProgressCallback
  ): Promise<PlatformItem[]>;
  
  /**
   * ดึงรายการเฉพาะจากแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param itemId ID ของรายการในแพลตฟอร์ม
   */
  public abstract getItem(platformId: string, itemId: string): Promise<PlatformItem>;
  
  /**
   * ซิงค์ข้อมูลกับแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param options ตัวเลือกในการซิงค์ข้อมูล
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   */
  public abstract syncData(
    platformId: string, 
    options: SyncOptions,
    progressCallback?: ProgressCallback
  ): Promise<SyncResult>;
  
  /**
   * ส่งรายการไปยังแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param items รายการที่ต้องการส่ง
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   */
  public abstract pushItems(
    platformId: string,
    items: PlatformItem[],
    progressCallback?: ProgressCallback
  ): Promise<SyncResult>;
  
  /**
   * ลบรายการในแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param itemId ID ของรายการในแพลตฟอร์ม
   */
  public abstract deleteItem(platformId: string, itemId: string): Promise<boolean>;
}
