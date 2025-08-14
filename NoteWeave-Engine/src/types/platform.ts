// platform.ts
// Types for platform integrations

import { ProgressCallback } from './index';

/**
 * ประเภทของแพลตฟอร์มที่รองรับการเชื่อมต่อ
 */
export type PlatformType = 'notion' | 'ms365' | 'obsidian' | 'clickup' | 'github' | 'custom';

/**
 * สถานะการเชื่อมต่อกับแพลตฟอร์ม
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

/**
 * ข้อมูลการรับรองตัวตนสำหรับแพลตฟอร์ม
 * แต่ละแพลตฟอร์มจะมีรูปแบบการรับรองตัวตนที่แตกต่างกัน
 */
export interface PlatformCredentials {
  // ข้อมูลพื้นฐานที่ใช้ร่วมกันในหลายแพลตฟอร์ม
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  
  // ข้อมูลเฉพาะของแต่ละแพลตฟอร์ม
  [key: string]: unknown;
}

/**
 * การตั้งค่าการเชื่อมต่อกับแพลตฟอร์ม
 */
export interface PlatformConfig {
  platformType: PlatformType;
  credentials: PlatformCredentials;
  baseUrl?: string;
  workspace?: string;
  syncInterval?: number; // จำนวนนาทีระหว่างการซิงค์ข้อมูลอัตโนมัติ
  options?: Record<string, any>; // ตัวเลือกเพิ่มเติมที่เฉพาะเจาะจงสำหรับแต่ละแพลตฟอร์ม
}

/**
 * ข้อมูลสรุปของแพลตฟอร์มที่เชื่อมต่อ
 */
export interface PlatformSummary {
  id: string; // ID ที่ใช้อ้างอิงการเชื่อมต่อ
  name: string; // ชื่อของการเชื่อมต่อ (กำหนดโดยผู้ใช้)
  platformType: PlatformType;
  status: ConnectionStatus;
  connectedSince?: Date;
  lastSync?: Date;
  itemCount?: number; // จำนวนรายการที่ซิงค์
  workspaceName?: string;
  error?: string;
}

/**
 * รายการที่ซิงค์จากแพลตฟอร์ม
 */
export interface PlatformItem {
  id: string; // ID ในแพลตฟอร์มต้นทาง
  platformId: string; // ID ของการเชื่อมต่อ
  title: string;
  type: 'note' | 'document' | 'task' | 'page' | 'other';
  content?: string;
  url?: string;
  path?: string;
  created: Date;
  updated: Date;
  metadata: Record<string, any>;
  syncStatus: 'pending' | 'synced' | 'error';
  lastSynced?: Date;
}

/**
 * ตัวเลือกในการซิงค์ข้อมูล
 */
export interface SyncOptions {
  direction: 'import' | 'export' | 'bidirectional';
  filter?: {
    types?: string[];
    since?: Date;
    path?: string;
    query?: string;
  };
  conflict: 'newer' | 'remote' | 'local' | 'manual';
  dryRun?: boolean; // ทดลองซิงค์โดยไม่เปลี่ยนแปลงข้อมูลจริง
}

/**
 * ผลลัพธ์จากการซิงค์
 */
export interface SyncResult {
  success: boolean;
  platformId: string;
  itemsProcessed: number;
  itemsAdded: number;
  itemsUpdated: number;
  itemsRemoved: number;
  errors: Array<{
    item?: string;
    error: string;
  }>;
  timestamp: Date;
  duration: number; // เวลาที่ใช้ในการซิงค์ (มิลลิวินาที)
}
