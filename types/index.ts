/**
 * @module NoteWeave Shared Types
 * 
 * This module provides TypeScript interfaces and types shared across NoteWeave components,
 * including progress tracking, text chunking options, chat command definitions, document relationships,
 * and supported AI provider types.
 */
// index.ts
// Shared types for NoteWeave

/**
 * Interface สำหรับติดตามความคืบหน้าของการทำงาน
 */
export interface ProgressCallback {
  (stats: {
    completed: number;
    total: number;
    percentage: number;
    currentItem?: string;
    status: 'running' | 'completed' | 'failed';
    error?: string;
  }): void;
}

/**
 * ตัวเลือกสำหรับการแบ่ง chunk ของเอกสาร
 */
export interface TextChunkingOptions {
  chunkSize: number;         // ขนาดของแต่ละ chunk
  chunkOverlap: number;      // จำนวนตัวอักษรที่ซ้ำกันระหว่าง chunks
  splitByTitle: boolean;     // แบ่งตาม title (# หรือ ##)
  preserveMarkdown: boolean; // รักษาโครงสร้าง Markdown ไว้หรือไม่
  minChunkSize: number;      // ขนาดขั้นต่ำของ chunk
}

/**
 * Interface สำหรับคำสั่งในแชท
 */
export interface ChatCommand {
  name: string;              // ชื่อคำสั่ง (เช่น search, stats)
  description: string;       // คำอธิบายคำสั่ง
  examples: string[];        // ตัวอย่างการใช้งาน
  handler: CommandHandler;   // ฟังก์ชันสำหรับประมวลผลคำสั่ง
}

/**
 * ฟังก์ชันสำหรับประมวลผลคำสั่ง
 */
export type CommandHandler = (args: string, options?: any) => Promise<any>;

/**
 * รูปแบบของความสัมพันธ์ระหว่างเอกสาร
 */
export interface DocumentRelationship {
  sourceId: string;          // ID ของเอกสารต้นทาง
  targetId: string;          // ID ของเอกสารปลายทาง
  strength: number;          // ความแรงของความสัมพันธ์ (0-1)
  type: 'reference' | 'similar' | 'linked'; // ประเภทความสัมพันธ์
  context?: string;          // ข้อความที่แสดงความสัมพันธ์
}

/**
 * ประเภทของ AI providers ที่รองรับ
 */
export type AIProviderType = 'ollama' | 'openai' | 'anthropic' | 'mistralai' | 'lmstudio';
