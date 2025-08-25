import { DocumentRelationship } from "../types";

interface Vector {
  id: string;
  content: string;
  embedding: number[]; // สมมติว่ามี embedding
  documentId: string;
  metadata: any;
}

export class VectorStore {
  private vectors: Map<string, Vector> = new Map();
  private documentToVectors: Map<string, string[]> = new Map();

  constructor() {
    // ในการใช้งานจริง อาจจะโหลดจาก persistent storage
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // นี่คือส่วนที่ต้องเชื่อมต่อกับ Embedding Model จริงๆ
    // สำหรับตอนนี้ เราจะส่งคืนเวกเตอร์จำลอง
    const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return [hash % 1000 / 1000, (hash * 7) % 1000 / 1000, (hash * 13) % 1000 / 1000];
  }

  async addVector(data: { content: string; documentId: string; metadata: any }): Promise<string> {
    const id = `vec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const embedding = await this.generateEmbedding(data.content);
    const vector: Vector = { id, embedding, ...data };
    this.vectors.set(id, vector);

    if (!this.documentToVectors.has(data.documentId)) {
      this.documentToVectors.set(data.documentId, []);
    }
    this.documentToVectors.get(data.documentId)?.push(id);
    return id;
  }

  async search(query: string, k: number): Promise<Vector[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    const results: { vector: Vector; score: number }[] = [];

    for (const vector of this.vectors.values()) {
      const score = this.cosineSimilarity(queryEmbedding, vector.embedding);
      results.push({ vector, score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, k).map((r) => r.vector);
  }

  async getVectorsByDocumentId(documentId: string): Promise<Vector[]> {
    const vectorIds = this.documentToVectors.get(documentId) || [];
    return vectorIds.map(id => this.vectors.get(id)!).filter(v => v !== undefined);
  }

  async removeDocument(documentId: string): Promise<boolean> {
    const vectorIds = this.documentToVectors.get(documentId);
    if (vectorIds) {
      for (const vecId of vectorIds) {
        this.vectors.delete(vecId);
      }
      this.documentToVectors.delete(documentId);
      return true;
    }
    return false;
  }

  async getStats(): Promise<{ documentCount: number; vectorCount: number }> {
    return {
      documentCount: this.documentToVectors.size,
      vectorCount: this.vectors.size,
    };
  }

  async exportData(): Promise<{ documents: any[]; vectors: any[] }> {
    const documents: any[] = [];
    const vectors: any[] = [];

    for (const [docId, vecIds] of this.documentToVectors.entries()) {
      const docVectors = vecIds.map(id => this.vectors.get(id)!);
      if (docVectors.length > 0) {
        documents.push({ id: docId, metadata: docVectors[0].metadata });
        vectors.push(...docVectors);
      }
    }
    return { documents, vectors };
  }

  async importData(data: { documents: any[]; vectors: any[] }, progressCallback?: (progress: { processed: number; total: number; status: string }) => void): Promise<void> {
    this.vectors.clear();
    this.documentToVectors.clear();

    let processed = 0;
    const total = data.vectors.length;

    for (const vector of data.vectors) {
      this.vectors.set(vector.id, vector);
      if (!this.documentToVectors.has(vector.documentId)) {
        this.documentToVectors.set(vector.documentId, []);
      }
      this.documentToVectors.get(vector.documentId)?.push(vector.id);

      processed++;
      if (progressCallback) {
        progressCallback({ processed, total, status: 'running' });
      }
    }
    if (progressCallback) {
      progressCallback({ processed, total, status: 'completed' });
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }
}