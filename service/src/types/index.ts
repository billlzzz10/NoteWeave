export interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    title?: string;
    tags?: string[];
    created?: Date;
    modified?: Date;
    [key: string]: any;
  };
}

export interface EmbeddedDocument extends Document {
  embedding: number[];
}

export interface SearchResult {
  document: Document;
  score: number;
  confidenceLevel?: 'high' | 'medium' | 'low'; // เพิ่มระดับความเชื่อมั่น
  relevancePercentage?: number; // เพิ่มค่าเปอร์เซ็นต์ความเกี่ยวข้อง
  highlightedText?: string; // เพิ่มข้อความที่ highlight ตามคำค้นหา
}

export interface QueryResult {
  question: string;
  answer: string;
  sources: SearchResult[];
  insightSummary?: string; // เพิ่มสรุปข้อมูลเชิงลึก
}

export interface AIProvider {
  generateEmbedding(text: string): Promise<number[]>;
  generateCompletion(prompt: string, options?: CompletionOptions): Promise<string>;
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  [key: string]: any;
}

export interface VectorStoreConfig {
  dimension: number;
  similarityMetric: 'cosine' | 'euclid' | 'innerProduct';
  path?: string;
}

export type AIProviderType = 'ollama' | 'openai' | 'anthropic' | 'mistralai' | 'lmstudio' | 'custom';

export interface RAGOptions {
  provider: AIProviderType;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topK?: number; // Number of documents to retrieve
  enhanceWithSummary?: boolean; // เพิ่มตัวเลือกสำหรับการเพิ่มสรุปข้อมูลเชิงลึก
  highlightKeywords?: boolean; // เพิ่มตัวเลือกในการ highlight คำสำคัญ
  includeConfidenceScores?: boolean; // เพิ่มตัวเลือกแสดงคะแนนความเชื่อมั่น
}

export interface TextChunkingOptions {
  chunkSize: number; // ขนาดของแต่ละ chunk (จำนวนตัวอักษร)
  chunkOverlap: number; // จำนวนตัวอักษรที่ซ้อนทับกันระหว่าง chunks
  splitByParagraph: boolean; // แบ่งตามย่อหน้าหรือไม่
  respectCodeBlocks: boolean; // ไม่แบ่ง code blocks หรือไม่
  minChunkSize: number; // ขนาด chunk ขั้นต่ำ
}

export type NoteSourceType = 'obsidian' | 'notion' | 'clickup' | 'airtable';

export interface SourceInfo {
  content: string;
  metadata: {
    source: string;
    title?: string;
    [key: string]: any;
  };
  score: number;
  confidenceLevel?: 'high' | 'medium' | 'low';
  relevancePercentage?: number;
  highlightedText?: string;
}

export interface RAGResponse {
  answer: string;
  sources: SourceInfo[];
  insightSummary?: string;
  keyTerms?: string[]; // เพิ่มคำสำคัญที่เกี่ยวข้องกับคำถาม
  confidenceScore?: number; // คะแนนความเชื่อมั่นโดยรวมของคำตอบ
  executionTimeMs?: number; // เวลาที่ใช้ในการประมวลผล
}

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
