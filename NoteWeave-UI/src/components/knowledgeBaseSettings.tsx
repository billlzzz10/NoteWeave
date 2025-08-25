import React, { useState, useEffect } from 'react';
import { 
  getKnowledgeBaseStats, 
  addMarkdownDirectoryWithProgress, 
  exportKnowledgeBase, 
  importKnowledgeBase, 
  updateChunkingOptions, 
  getChunkingOptions, 
  removeDocument 
} from 'NoteWeave-Engine/src/api';
import { ProgressCallbackData, TextChunkingOptions } from 'NoteWeave-Engine/src/types';

interface KnowledgeBaseStats {
  totalDocuments: number;
  totalChunks: number;
}

const KnowledgeBaseSettings: React.FC = () => {
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [importExportPath, setImportExportPath] = useState<string>('');
  const [progress, setProgress] = useState<ProgressCallbackData | null>(null);
  const [chunkingOptions, setChunkingOptions] = useState<TextChunkingOptions>({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const [documentToRemove, setDocumentToRemove] = useState<string>('');

  useEffect(() => {
    loadStats();
    loadChunkingOptions();
  }, []);

  const loadStats = async () => {
    try {
      const currentStats = await getKnowledgeBaseStats();
      setStats(currentStats);
    } catch (error) {
      console.error('Failed to load knowledge base stats:', error);
    }
  };

  const loadChunkingOptions = () => {
    try {
      const currentOptions = getChunkingOptions();
      setChunkingOptions(currentOptions);
    } catch (error) {
      console.error('Failed to load chunking options:', error);
    }
  };

  const handleAddDirectory = async () => {
    if (!importExportPath) {
      alert('Please enter a directory path.');
      return;
    }
    setProgress({ completed: 0, total: 0, percentage: 0, status: 'running', currentItem: 'Starting...' });
    try {
      await addMarkdownDirectoryWithProgress(
        importExportPath,
        (data) => {
          setProgress(data);
          if (data.status === 'completed' || data.status === 'failed') {
            loadStats();
          }
        },
        true, // recursive
        {}, // metadata
        chunkingOptions
      );
      alert('Directory added to knowledge base successfully!');
    } catch (error: any) {
      console.error('Error adding directory:', error);
      setProgress({ ...progress!, status: 'failed', error: error.message });
      alert(`Failed to add directory: ${error.message}`);
    }
  };

  const handleExportKnowledgeBase = async () => {
    if (!importExportPath) {
      alert('Please enter an export path.');
      return;
    }
    try {
      const result = await exportKnowledgeBase(importExportPath);
      alert(`Knowledge Base exported to ${result.path} (${(result.fileSize / 1024 / 1024).toFixed(2)} MB) with ${result.documentCount} documents.`);
    } catch (error: any) {
      console.error('Error exporting knowledge base:', error);
      alert(`Failed to export knowledge base: ${error.message}`);
    }
  };

  const handleImportKnowledgeBase = async () => {
    if (!importExportPath) {
      alert('Please enter an import path.');
      return;
    }
    setProgress({ completed: 0, total: 0, percentage: 0, status: 'running', currentItem: 'Starting import...' });
    try {
      const result = await importKnowledgeBase(
        importExportPath,
        (data) => {
          setProgress(data);
          if (data.status === 'completed' || data.status === 'failed') {
            loadStats();
          }
        }
      );
      alert(`Knowledge Base imported successfully! ${result.documentCount} documents added.`);
    } catch (error: any) {
      console.error('Error importing knowledge base:', error);
      setProgress({ ...progress!, status: 'failed', error: error.message });
      alert(`Failed to import knowledge base: ${error.message}`);
    }
  };

  const handleUpdateChunkingOptions = () => {
    try {
      const updated = updateChunkingOptions(chunkingOptions);
      setChunkingOptions(updated);
      alert('Chunking options updated successfully!');
    } catch (error: any) {
      console.error('Error updating chunking options:', error);
      alert(`Failed to update chunking options: ${error.message}`);
    }
  };

  const handleRemoveDocument = async () => {
    if (!documentToRemove) {
      alert('Please enter a document ID to remove.');
      return;
    }
    try {
      const success = await removeDocument(documentToRemove);
      if (success) {
        alert(`Document ${documentToRemove} removed successfully.`);
        loadStats();
        setDocumentToRemove('');
      } else {
        alert(`Failed to remove document ${documentToRemove}. It might not exist.`);
      }
    } catch (error: any) {
      console.error('Error removing document:', error);
      alert(`Failed to remove document: ${error.message}`);
    }
  };

  return (
    <div className="knowledge-base-settings">
      <h2>Knowledge Base Settings</h2>

      <div className="setting-section">
        <h3>Statistics</h3>
        {stats ? (
          <p>Total Documents: {stats.totalDocuments} | Total Chunks: {stats.totalChunks}</p>
        ) : (
          <p>Loading stats...</p>
        )}
        <button onClick={loadStats}>Refresh Stats</button>
      </div>

      <div className="setting-section">
        <h3>Add/Import/Export Data</h3>
        <input
          type="text"
          placeholder="Directory/File Path for import/export"
          value={importExportPath}
          onChange={(e) => setImportExportPath(e.target.value)}
        />
        <button onClick={handleAddDirectory}>Add Markdown Directory</button>
        <button onClick={handleExportKnowledgeBase}>Export Knowledge Base</button>
        <button onClick={handleImportKnowledgeBase}>Import Knowledge Base</button>
        {progress && (
          <div className="progress-bar">
            <p>Status: {progress.status} ({progress.percentage}%)</p>
            <p>Completed: {progress.completed}/{progress.total}</p>
            {progress.currentItem && <p>Processing: {progress.currentItem}</p>}
            {progress.error && <p className="error">Error: {progress.error}</p>}
          </div>
        )}
      </div>

      <div className="setting-section">
        <h3>Chunking Options</h3>
        <label>
          Chunk Size:
          <input
            type="number"
            value={chunkingOptions.chunkSize}
            onChange={(e) => setChunkingOptions({ ...chunkingOptions, chunkSize: parseInt(e.target.value) })}
          />
        </label>
        <label>
          Chunk Overlap:
          <input
            type="number"
            value={chunkingOptions.chunkOverlap}
            onChange={(e) => setChunkingOptions({ ...chunkingOptions, chunkOverlap: parseInt(e.target.value) })}
          />
        </label>
        <button onClick={handleUpdateChunkingOptions}>Update Chunking Options</button>
      </div>

      <div className="setting-section">
        <h3>Remove Document</h3>
        <input
          type="text"
          placeholder="Document ID to remove"
          value={documentToRemove}
          onChange={(e) => setDocumentToRemove(e.target.value)}
        />
        <button onClick={handleRemoveDocument}>Remove Document</button>
      </div>
    </div>
  );
};

export default KnowledgeBaseSettings;