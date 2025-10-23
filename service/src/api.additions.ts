// สร้างฟังก์ชันเพิ่มเติมที่จะเพิ่มลงใน api.ts

// Import ที่จำเป็น
import { DocumentRelationship, ProgressCallback, TextChunkingOptions } from '../types';
import { commandService } from '../services/command.service';
import fs from 'fs';
import path from 'path';

/**
 * เพิ่มโฟลเดอร์ที่มีไฟล์ Markdown เข้าไปใน knowledge base พร้อมแสดงความคืบหน้า
 */
export async function addMarkdownDirectoryWithProgress(
  directoryPath: string, 
  progressCallback: ProgressCallback,
  recursive = true,
  metadata: any = {},
  chunkingOptions?: Partial<TextChunkingOptions>
): Promise<{ total: number; successful: number; failed: number }> {
  // ตรวจสอบว่าโฟลเดอร์มีอยู่จริง
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`โฟลเดอร์ไม่พบ: ${directoryPath}`);
  }
  
  // สถิติสำหรับติดตามความคืบหน้า
  const stats = {
    total: 0,
    successful: 0,
    failed: 0
  };
  
  // อ่านไฟล์ทั้งหมดในโฟลเดอร์
  const files = fs.readdirSync(directoryPath);
  
  // นับจำนวนไฟล์ Markdown ทั้งหมด (รวมในโฟลเดอร์ย่อยถ้า recursive = true)
  let totalFiles = 0;
  if (recursive) {
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // นับจำนวนไฟล์ในโฟลเดอร์ย่อย
        totalFiles += countMarkdownFiles(filePath, recursive);
      } else if (file.endsWith('.md')) {
        totalFiles++;
      }
    }
  } else {
    totalFiles = files.filter(file => file.endsWith('.md')).length;
  }
  
  // อัปเดตสถิติเริ่มต้น
  stats.total = totalFiles;
  progressCallback({
    completed: 0,
    total: totalFiles,
    percentage: 0,
    status: 'running'
  });
  
  let completed = 0;
  
  // ประมวลผลไฟล์ในโฟลเดอร์
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // ประมวลผลโฟลเดอร์ย่อยถ้า recursive = true
      if (recursive) {
        try {
          const subStats = await addMarkdownDirectoryWithProgress(
            filePath, 
            (subProgress) => {
              // ปรับปรุงความคืบหน้ารวม
              completed += subProgress.completed;
              progressCallback({
                completed,
                total: totalFiles,
                percentage: Math.round((completed / totalFiles) * 100),
                currentItem: subProgress.currentItem,
                status: 'running'
              });
            }, 
            recursive, 
            {
              ...metadata,
              parent: directoryPath
            },
            chunkingOptions
          );
          
          // เพิ่มสถิติจากโฟลเดอร์ย่อย
          stats.successful += subStats.successful;
          stats.failed += subStats.failed;
        } catch (error) {
          stats.failed++;
        }
      }
    } else if (file.endsWith('.md')) {
      // ประมวลผลไฟล์ Markdown
      try {
        // อัปเดตความคืบหน้า
        progressCallback({
          completed,
          total: totalFiles,
          percentage: Math.round((completed / totalFiles) * 100),
          currentItem: filePath,
          status: 'running'
        });
        
        await addMarkdownFile(filePath, {
          ...metadata,
          directory: directoryPath
        }, chunkingOptions);
        
        stats.successful++;
        completed++;
        
        // อัปเดตความคืบหน้าหลังจากเสร็จสิ้น
        progressCallback({
          completed,
          total: totalFiles,
          percentage: Math.round((completed / totalFiles) * 100),
          currentItem: filePath,
          status: 'running'
        });
      } catch (error) {
        console.error(`เกิดข้อผิดพลาดในการประมวลผลไฟล์ ${filePath}:`, error);
        stats.failed++;
        completed++;
        
        // อัปเดตความคืบหน้าหลังจากเกิดข้อผิดพลาด
        progressCallback({
          completed,
          total: totalFiles,
          percentage: Math.round((completed / totalFiles) * 100),
          currentItem: filePath,
          status: 'running',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
  
  // อัปเดตความคืบหน้าเมื่อเสร็จสิ้น
  progressCallback({
    completed: stats.successful,
    total: totalFiles,
    percentage: 100,
    status: 'completed'
  });
  
  return stats;
}

/**
 * ฟังก์ชันช่วยนับจำนวนไฟล์ Markdown ในโฟลเดอร์
 */
function countMarkdownFiles(directoryPath: string, recursive = true): number {
  let count = 0;
  const files = fs.readdirSync(directoryPath);
  
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && recursive) {
      count += countMarkdownFiles(filePath, recursive);
    } else if (file.endsWith('.md')) {
      count++;
    }
  }
  
  return count;
}

/**
 * ประมวลผลคำสั่งจากข้อความแชท
 */
export async function processCommand(text: string): Promise<any> {
  return commandService.processCommand(text);
}

/**
 * ตรวจสอบว่าข้อความเป็นคำสั่งหรือไม่
 */
export function isCommand(text: string): boolean {
  return commandService.isCommand(text);
}

/**
 * ส่งออก knowledge base เพื่อสำรองข้อมูล
 */
export async function exportKnowledgeBase(outputPath: string): Promise<{
  success: boolean;
  path: string;
  documentCount: number;
  fileSize: number;
}> {
  try {
    // ตรวจสอบว่าโฟลเดอร์สำหรับบันทึกมีอยู่
    const directory = path.dirname(outputPath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // ขอข้อมูลทั้งหมดจาก vector store
    const data = await ragService.exportData();
    
    // บันทึกไฟล์
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    
    // ขนาดไฟล์
    const stats = fs.statSync(outputPath);
    
    return {
      success: true,
      path: outputPath,
      documentCount: data.documents.length,
      fileSize: stats.size
    };
  } catch (error) {
    console.error('Error exporting knowledge base:', error);
    throw error;
  }
}

/**
 * นำเข้า knowledge base จากไฟล์ที่ส่งออกไว้
 */
export async function importKnowledgeBase(
  inputPath: string,
  progressCallback?: ProgressCallback
): Promise<{
  success: boolean;
  documentCount: number;
}> {
  try {
    // ตรวจสอบว่าไฟล์มีอยู่
    if (!fs.existsSync(inputPath)) {
      throw new Error(`ไฟล์ไม่พบ: ${inputPath}`);
    }
    
    // อ่านข้อมูลจากไฟล์
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // แจ้งความคืบหน้าเริ่มต้น
    if (progressCallback) {
      progressCallback({
        completed: 0,
        total: data.documents.length,
        percentage: 0,
        status: 'running'
      });
    }
    
    // นำเข้าข้อมูล
    await ragService.importData(data, (progress) => {
      if (progressCallback) {
        progressCallback({
          completed: progress.processed,
          total: progress.total,
          percentage: Math.round((progress.processed / progress.total) * 100),
          status: progress.status
        });
      }
    });
    
    // แจ้งความคืบหน้าเมื่อเสร็จสิ้น
    if (progressCallback) {
      progressCallback({
        completed: data.documents.length,
        total: data.documents.length,
        percentage: 100,
        status: 'completed'
      });
    }
    
    return {
      success: true,
      documentCount: data.documents.length
    };
  } catch (error) {
    console.error('Error importing knowledge base:', error);
    
    // แจ้งความคืบหน้าเมื่อเกิดข้อผิดพลาด
    if (progressCallback) {
      progressCallback({
        completed: 0,
        total: 0,
        percentage: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    throw error;
  }
}

/**
 * หาความสัมพันธ์ระหว่างเอกสาร
 */
export async function getDocumentRelationships(
  documentId: string,
  minStrength = 0.7,
  maxResults = 10
): Promise<DocumentRelationship[]> {
  try {
    // ดึงข้อมูลเอกสาร
    const document = await ragService.getDocumentById(documentId);
    if (!document) {
      throw new Error(`ไม่พบเอกสารที่มี ID: ${documentId}`);
    }
    
    // หาเอกสารที่เกี่ยวข้อง
    const relationships = await ragService.findRelatedDocuments(documentId, minStrength, maxResults);
    
    return relationships;
  } catch (error) {
    console.error('Error getting document relationships:', error);
    throw error;
  }
}

/**
 * อัปเดตการตั้งค่าการแบ่ง chunk
 */
export function updateChunkingOptions(options: Partial<TextChunkingOptions>): TextChunkingOptions {
  // ดึงค่าเดิม
  const currentOptions = ragService.getChunkingOptions();
  
  // อัปเดตค่าใหม่
  const updatedOptions = {
    ...currentOptions,
    ...options
  };
  
  // บันทึกค่าใหม่
  ragService.setChunkingOptions(updatedOptions);
  
  return updatedOptions;
}

/**
 * ดึงการตั้งค่าการแบ่ง chunk ปัจจุบัน
 */
export function getChunkingOptions(): TextChunkingOptions {
  return ragService.getChunkingOptions();
}

/**
 * ลบเอกสารออกจาก knowledge base
 */
export async function removeDocument(documentId: string): Promise<boolean> {
  try {
    await ragService.removeDocument(documentId);
    return true;
  } catch (error) {
    console.error('Error removing document:', error);
    throw error;
  }
}

/**
 * ลบเอกสารทั้งหมดที่มาจากแหล่งข้อมูลเดียวกัน
 */
export async function removeDocumentsBySource(source: string): Promise<{
  success: boolean;
  count: number;
}> {
  try {
    const count = await ragService.removeDocumentsBySource(source);
    return {
      success: true,
      count
    };
  } catch (error) {
    console.error('Error removing documents by source:', error);
    throw error;
  }
}
