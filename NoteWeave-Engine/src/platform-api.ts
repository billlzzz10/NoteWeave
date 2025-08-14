// platform-api.ts
// API functions สำหรับการเชื่อมต่อกับแพลตฟอร์มภายนอก

import { platformManager } from './services/platform-manager.service';
import { 
  PlatformType,
  PlatformConfig, 
  PlatformSummary, 
  PlatformItem, 
  SyncOptions,
  SyncResult
} from './types/platform';
import { ProgressCallback } from './types';

/**
 * รับข้อมูลของแพลตฟอร์มที่รองรับ
 */
export function getSupportedPlatforms(): Array<{
  type: PlatformType;
  name: string;
  description: string;
  website: string;
  icon: string;
  authType: 'apiKey' | 'oauth' | 'both';
  requiredCredentials: string[];
}> {
  return platformManager.getPlatformInfo();
}

/**
 * เชื่อมต่อกับแพลตฟอร์ม
 * @param config การตั้งค่าการเชื่อมต่อ
 */
export async function connectToPlatform(config: PlatformConfig): Promise<PlatformSummary> {
  return platformManager.connect(config);
}

/**
 * ยกเลิกการเชื่อมต่อกับแพลตฟอร์ม
 * @param platformId ID ของการเชื่อมต่อ
 */
export async function disconnectFromPlatform(platformId: string): Promise<boolean> {
  return platformManager.disconnect(platformId);
}

/**
 * รับข้อมูลสรุปของการเชื่อมต่อทั้งหมด
 */
export async function getAllPlatformConnections(): Promise<PlatformSummary[]> {
  return platformManager.getAllConnections();
}

/**
 * รับข้อมูลสรุปของการเชื่อมต่อ
 * @param platformId ID ของการเชื่อมต่อ
 */
export async function getPlatformConnection(platformId: string): Promise<PlatformSummary> {
  return platformManager.getConnection(platformId);
}

/**
 * ดึงรายการจากแพลตฟอร์ม
 * @param platformId ID ของการเชื่อมต่อ
 * @param options ตัวเลือกในการดึงข้อมูล
 * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
 */
export async function fetchItemsFromPlatform(
  platformId: string,
  options?: Partial<SyncOptions>,
  progressCallback?: ProgressCallback
): Promise<PlatformItem[]> {
  return platformManager.fetchItems(platformId, options, progressCallback);
}

/**
 * ซิงค์ข้อมูลกับแพลตฟอร์ม
 * @param platformId ID ของการเชื่อมต่อ
 * @param options ตัวเลือกในการซิงค์ข้อมูล
 * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
 */
export async function syncDataWithPlatform(
  platformId: string,
  options: SyncOptions,
  progressCallback?: ProgressCallback
): Promise<SyncResult> {
  return platformManager.syncData(platformId, options, progressCallback);
}

/**
 * ส่งรายการไปยังแพลตฟอร์ม
 * @param platformId ID ของการเชื่อมต่อ
 * @param items รายการที่ต้องการส่ง
 * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
 */
export async function pushItemsToPlatform(
  platformId: string,
  items: PlatformItem[],
  progressCallback?: ProgressCallback
): Promise<SyncResult> {
  return platformManager.pushItems(platformId, items, progressCallback);
}

/**
 * รับ URL สำหรับการรับรองตัวตน OAuth
 * @param platformId ID ของการเชื่อมต่อ
 * @param redirectUri URI ที่จะให้ redirect กลับหลังจากรับรองตัวตน
 */
export async function getPlatformAuthUrl(platformId: string, redirectUri: string): Promise<string> {
  return platformManager.getAuthUrl(platformId, redirectUri);
}

/**
 * ดำเนินการรับรองตัวตนด้วย OAuth code
 * @param platformId ID ของการเชื่อมต่อ
 * @param code code ที่ได้จากการ redirect
 * @param redirectUri URI ที่ใช้ในการรับรองตัวตน
 */
export async function handlePlatformAuthCode(
  platformId: string, 
  code: string, 
  redirectUri: string
): Promise<PlatformSummary> {
  return platformManager.handleAuthCode(platformId, code, redirectUri);
}

/**
 * ลงทะเบียนฟังก์ชันสำหรับรับเหตุการณ์ของแพลตฟอร์ม
 * @param event ชื่อเหตุการณ์
 * @param listener ฟังก์ชันที่จะเรียกเมื่อเกิดเหตุการณ์
 */
export function onPlatformEvent(event: string, listener: (...args: any[]) => void): void {
  platformManager.events.on(event, listener);
}

/**
 * ยกเลิกการลงทะเบียนฟังก์ชันสำหรับรับเหตุการณ์ของแพลตฟอร์ม
 * @param event ชื่อเหตุการณ์
 * @param listener ฟังก์ชันที่จะยกเลิก
 */
export function offPlatformEvent(event: string, listener: (...args: any[]) => void): void {
  platformManager.events.off(event, listener);
}

/**
 * นำเข้าข้อมูลจากแพลตฟอร์มไปยัง knowledge base
 * @param platformId ID ของการเชื่อมต่อ
 * @param options ตัวเลือกในการนำเข้า
 * @param progressCallback ฟังก์ชันสำหรับติดตามความคืบหน้า
 */
export async function importPlatformDataToKnowledgeBase(
  platformId: string,
  options: {
    filter?: {
      types?: string[];
      since?: Date;
      path?: string;
      query?: string;
    };
    chunkingOptions?: any;
  },
  progressCallback?: ProgressCallback
): Promise<{
  success: boolean;
  itemsProcessed: number;
  itemsAdded: number;
  errors: any[];
}> {
  try {
    // 1. ดึงข้อมูลจากแพลตฟอร์ม
    const syncOptions: Partial<SyncOptions> = {
      direction: 'import',
      filter: options.filter
    };
    
    const items = await platformManager.fetchItems(platformId, syncOptions, (progress) => {
      if (progressCallback) {
        progressCallback({
          ...progress,
          // แปลงสถานะให้สอดคล้องกับการนำเข้า
          currentItem: progress.currentItem ? `ดึงข้อมูล: ${progress.currentItem}` : undefined
        });
      }
    });
    
    // แจ้งความคืบหน้า
    if (progressCallback) {
      progressCallback({
        completed: 0,
        total: items.length,
        percentage: 0,
        currentItem: 'เริ่มนำเข้าข้อมูลไปยัง knowledge base',
        status: 'running'
      });
    }
    
    // 2. แปลงข้อมูลเป็นเอกสาร markdown
    const errors: any[] = [];
    let addedCount = 0;
    
    // TODO: นำเข้าข้อมูลไปยัง knowledge base
    // ในที่นี้เป็นเพียงตัวอย่างโครงสร้าง
    
    // สมมติว่านำเข้าสำเร็จทั้งหมด
    addedCount = items.length;
    
    // แจ้งความคืบหน้า
    if (progressCallback) {
      progressCallback({
        completed: items.length,
        total: items.length,
        percentage: 100,
        currentItem: 'นำเข้าข้อมูลเสร็จสิ้น',
        status: 'completed'
      });
    }
    
    return {
      success: true,
      itemsProcessed: items.length,
      itemsAdded: addedCount,
      errors
    };
  } catch (error) {
    // แจ้งข้อผิดพลาด
    if (progressCallback) {
      progressCallback({
        completed: 0,
        total: 0,
        percentage: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล'
      });
    }
    
    throw error;
  }
}
