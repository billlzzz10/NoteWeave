// platform-connector.interface.ts
// Interface สำหรับ connector ที่เชื่อมต่อกับแพลตฟอร์มภายนอก

import { ProgressCallback } from '../../types';
import { 
  PlatformConfig, 
  PlatformSummary, 
  PlatformItem, 
  ConnectionStatus,
  SyncOptions,
  SyncResult
} from '../../types/platform';

/**
 * Interface สำหรับ connector ที่เชื่อมต่อกับแพลตฟอร์มภายนอก
 * ทุก connector ต้อง implement interface นี้
 */
export interface IPlatformConnector {
  /**
   * เชื่อมต่อกับแพลตฟอร์ม
   * @param config การตั้งค่าการเชื่อมต่อ
   * @returns ข้อมูลสรุปของการเชื่อมต่อ
   */
  connect(config: PlatformConfig): Promise<PlatformSummary>;
  
  /**
   * ยกเลิกการเชื่อมต่อกับแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @returns สถานะการยกเลิกการเชื่อมต่อ
   */
  disconnect(platformId: string): Promise<boolean>;
  
  /**
   * ตรวจสอบสถานะการเชื่อมต่อ
   * @param platformId ID ของการเชื่อมต่อ
   * @returns สถานะการเชื่อมต่อ
   */
  getStatus(platformId: string): Promise<ConnectionStatus>;
  
  /**
   * รับข้อมูลสรุปของการเชื่อมต่อ
   * @param platformId ID ของการเชื่อมต่อ
   * @returns ข้อมูลสรุปของการเชื่อมต่อ
   */
  getSummary(platformId: string): Promise<PlatformSummary>;
  
  /**
   * ตั้งค่าการเชื่อมต่อใหม่
   * @param platformId ID ของการเชื่อมต่อ
   * @param config การตั้งค่าการเชื่อมต่อใหม่
   * @returns ข้อมูลสรุปของการเชื่อมต่อหลังจากตั้งค่าใหม่
   */
  updateConfig(platformId: string, config: Partial<PlatformConfig>): Promise<PlatformSummary>;
  
  /**
   * ดึงรายการจากแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param options ตัวเลือกในการดึงข้อมูล
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   * @returns รายการที่ดึงมาจากแพลตฟอร์ม
   */
  fetchItems(
    platformId: string, 
    options?: Partial<SyncOptions>,
    progressCallback?: ProgressCallback
  ): Promise<PlatformItem[]>;
  
  /**
   * ดึงรายการเฉพาะจากแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param itemId ID ของรายการในแพลตฟอร์ม
   * @returns รายการที่ดึงมา
   */
  getItem(platformId: string, itemId: string): Promise<PlatformItem>;
  
  /**
   * ซิงค์ข้อมูลกับแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param options ตัวเลือกในการซิงค์ข้อมูล
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   * @returns ผลลัพธ์จากการซิงค์
   */
  syncData(
    platformId: string, 
    options: SyncOptions,
    progressCallback?: ProgressCallback
  ): Promise<SyncResult>;
  
  /**
   * ส่งรายการไปยังแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param items รายการที่ต้องการส่ง
   * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
   * @returns ผลลัพธ์จากการส่งรายการ
   */
  pushItems(
    platformId: string,
    items: PlatformItem[],
    progressCallback?: ProgressCallback
  ): Promise<SyncResult>;
  
  /**
   * ลบรายการในแพลตฟอร์ม
   * @param platformId ID ของการเชื่อมต่อ
   * @param itemId ID ของรายการในแพลตฟอร์ม
   * @returns สถานะการลบ
   */
  deleteItem(platformId: string, itemId: string): Promise<boolean>;
  
  /**
   * รับ URL สำหรับการรับรองตัวตน OAuth (ถ้ารองรับ)
   * @param platformId ID ของการเชื่อมต่อ
   * @param redirectUri URI ที่จะให้ redirect กลับหลังจากรับรองตัวตน
   * @returns URL สำหรับการรับรองตัวตน
   */
  getAuthUrl?(platformId: string, redirectUri: string): Promise<string>;
  
  /**
   * ดำเนินการรับรองตัวตนด้วย OAuth code
   * @param platformId ID ของการเชื่อมต่อ
   * @param code code ที่ได้จากการ redirect
   * @param redirectUri URI ที่ใช้ในการรับรองตัวตน
   * @returns ข้อมูลสรุปของการเชื่อมต่อหลังจากรับรองตัวตน
   */
  handleAuthCode?(platformId: string, code: string, redirectUri: string): Promise<PlatformSummary>;
}
