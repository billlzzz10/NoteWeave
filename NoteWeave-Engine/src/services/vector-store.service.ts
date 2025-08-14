import { EmbeddedDocument, SearchResult, VectorStoreConfig } from '../types';
import fs from 'fs';
import path from 'path';

// Simplified in-memory vector store for development
// In production we would use FAISS or another vector DB
export class VectorStore {
  private documents: EmbeddedDocument[] = [];
  private dimension: number;
  private similarityMetric: 'cosine' | 'euclid' | 'innerProduct';
  private storePath?: string;

  constructor(config: VectorStoreConfig) {
    this.dimension = config.dimension;
    this.similarityMetric = config.similarityMetric;
    this.storePath = config.path;

    // If path is provided, try to load existing vector store
    if (this.storePath && fs.existsSync(this.storePath)) {
      try {
        const data = fs.readFileSync(this.storePath, 'utf8');
        this.documents = JSON.parse(data);
        console.log(`Loaded ${this.documents.length} documents from vector store`);
      } catch (error) {
        console.error('Failed to load vector store:', error);
        this.documents = [];
      }
    }
  }

  // Add a document to the vector store
  async addDocument(document: EmbeddedDocument): Promise<void> {
    // Check if document with same ID already exists
    const existingIndex = this.documents.findIndex(doc => doc.id === document.id);
    
    if (existingIndex !== -1) {
      // Replace existing document
      this.documents[existingIndex] = document;
    } else {
      // Add new document
      this.documents.push(document);
    }

    // Save to disk if path is provided
    if (this.storePath) {
      await this.save();
    }
  }

  // Add multiple documents to the vector store
  async addDocuments(documents: EmbeddedDocument[]): Promise<void> {
    for (const doc of documents) {
      const existingIndex = this.documents.findIndex(d => d.id === doc.id);
      if (existingIndex !== -1) {
        this.documents[existingIndex] = doc;
      } else {
        this.documents.push(doc);
      }
    }

    // Save to disk if path is provided
    if (this.storePath) {
      await this.save();
    }
  }

  // Remove a document from the vector store
  async removeDocument(id: string): Promise<boolean> {
    const initialLength = this.documents.length;
    this.documents = this.documents.filter(doc => doc.id !== id);
    
    const removed = initialLength > this.documents.length;
    
    // Save to disk if path is provided and a document was removed
    if (removed && this.storePath) {
      await this.save();
    }
    
    return removed;
  }

  // Find similar documents based on embedding
  async similaritySearch(embedding: number[], limit = 5): Promise<SearchResult[]> {
    if (this.documents.length === 0) {
      return [];
    }

    // Calculate similarity scores
    const scores = this.documents.map(doc => ({
      document: doc,
      score: this.calculateSimilarity(embedding, doc.embedding)
    }));

    // Sort by score (higher is better for cosine and inner product, lower is better for euclidean)
    const sortedScores = this.similarityMetric === 'euclid'
      ? scores.sort((a, b) => a.score - b.score) // For euclidean, lower is better
      : scores.sort((a, b) => b.score - a.score); // For cosine and inner product, higher is better

    // Return top results
    return sortedScores.slice(0, limit).map(result => ({
      document: {
        id: result.document.id,
        content: result.document.content,
        metadata: result.document.metadata
      },
      score: result.score
    }));
  }

  // Calculate similarity between two embeddings
  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    switch (this.similarityMetric) {
      case 'cosine':
        return this.cosineSimilarity(embedding1, embedding2);
      case 'euclid':
        return this.euclideanDistance(embedding1, embedding2);
      case 'innerProduct':
        return this.innerProduct(embedding1, embedding2);
      default:
        return this.cosineSimilarity(embedding1, embedding2);
    }
  }

  // Cosine similarity
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Euclidean distance
  private euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }
    
    return Math.sqrt(sum);
  }

  // Inner product (dot product)
  private innerProduct(a: number[], b: number[]): number {
    let sum = 0;
    
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    
    return sum;
  }

  // Save the vector store to disk
  private async save(): Promise<void> {
    if (!this.storePath) {
      return;
    }

    try {
      // Ensure directory exists
      const dir = path.dirname(this.storePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write to file
      fs.writeFileSync(this.storePath, JSON.stringify(this.documents, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save vector store:', error);
    }
  }

  // Get all documents in the vector store
  getAllDocuments(): EmbeddedDocument[] {
    return this.documents;
  }

  // Get document count
  getDocumentCount(): number {
    return this.documents.length;
  }
}
