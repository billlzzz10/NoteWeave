// main.ts
// Entry point for backend engine
import { startRAGServer } from './core/rag.service';
import * as api from './api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Start the RAG server
async function main() {
  try {
    console.log('Starting NoteWeave Engine...');
    
    // Initialize RAG service
    await startRAGServer();
    
    // Export API for use in the UI
    console.log('API is ready');
    
    // Log some stats
    const stats = api.getKnowledgeBaseStats();
    console.log(`Knowledge base contains ${stats.documentCount} documents`);
    
    // Keep process alive
    process.stdin.resume();
    
    console.log('NoteWeave Engine is running. Press Ctrl+C to exit.');
  } catch (error) {
    console.error('Failed to start NoteWeave Engine:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

// Export API
export { api };
