// ChatPanel.tsx
// UI หลักสำหรับสนทนาและค้นหาข้อมูล
import React, { useState, useEffect } from 'react';
import { useEngine } from '../lib/useEngine';

export function ChatPanel() {
  const { 
    response, 
    loading, 
    error, 
    currentProvider,
    searchResults,
    ragResponse, 
    sendMessage,
    semanticSearch,
    askQuestion,
    changeProvider,
    getAvailableProviders
  } = useEngine();
  
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chat' | 'search' | 'rag'>('rag');
  const [searchQuery, setSearchQuery] = useState('');
  const [question, setQuestion] = useState('');
  const [providers] = useState(getAvailableProviders());
  
  // แสดง loading indicator
  const loadingIndicator = loading && (
    <div className="loading-indicator">กำลังประมวลผล...</div>
  );
  
  // แสดงข้อความผิดพลาด
  const errorMessage = error && (
    <div className="error-message">{error}</div>
  );
  
  // แสดงผลลัพธ์การค้นหา
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return <div className="no-results">ไม่พบผลลัพธ์</div>;
    }
    
    return (
      <div className="search-results">
        <h3>ผลการค้นหา</h3>
        {searchResults.map((result, index) => (
          <div key={result.document.id} className="search-result-item">
            <div className="result-header">
              <span className="result-number">{index + 1}</span>
              <span className="result-confidence">
                {result.relevancePercentage || Math.round(result.score * 100)}% 
                ความเกี่ยวข้อง
              </span>
            </div>
            <div className="result-source">
              แหล่งที่มา: {result.document.metadata.source}
            </div>
            <div className="result-content">
              {result.highlightedText || result.document.content}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // แสดงผลลัพธ์ RAG
  const renderRagResponse = () => {
    if (!ragResponse) {
      return null;
    }
    
    return (
      <div className="rag-response">
        <h3>คำตอบ</h3>
        <div className="answer">{ragResponse.answer}</div>
        
        {ragResponse.insightSummary && (
          <div className="insight-summary">
            <h4>สรุปข้อมูลสำคัญ</h4>
            <p>{ragResponse.insightSummary}</p>
          </div>
        )}
        
        <div className="sources">
          <h4>แหล่งข้อมูล</h4>
          <ul>
            {ragResponse.sources.map((source, index) => (
              <li key={index}>
                {source.metadata?.source || `แหล่งข้อมูล ${index + 1}`}
                {' '}
                <span className="confidence">
                  ({source.relevancePercentage || Math.round(source.score * 100)}% ความเกี่ยวข้อง)
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {ragResponse.executionTimeMs && (
          <div className="execution-time">
            เวลาที่ใช้: {(ragResponse.executionTimeMs / 1000).toFixed(2)} วินาที
          </div>
        )}
      </div>
    );
  };
  
  // จัดการการส่งข้อความ chat
  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage(input, currentProvider);
    setInput('');
  };
  
  // จัดการการค้นหา
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    semanticSearch(searchQuery);
  };
  
  // จัดการการถามคำถาม RAG
  const handleAskQuestion = () => {
    if (!question.trim()) return;
    askQuestion(question, {
      provider: currentProvider,
      enhanceWithSummary: true,
      highlightKeywords: true
    });
  };
  
  return (
    <div className="chat-panel">
      <h2>NoteWeave</h2>
      
      <div className="mode-selector">
        <button 
          className={mode === 'chat' ? 'active' : ''} 
          onClick={() => setMode('chat')}
        >
          Chat
        </button>
        <button 
          className={mode === 'search' ? 'active' : ''} 
          onClick={() => setMode('search')}
        >
          ค้นหา
        </button>
        <button 
          className={mode === 'rag' ? 'active' : ''} 
          onClick={() => setMode('rag')}
        >
          ถามคำถาม (RAG)
        </button>
      </div>
      
      <div className="provider-selector">
        <label>AI Provider:</label>
        <select 
          value={currentProvider} 
          onChange={e => changeProvider(e.target.value as any)}
          aria-label="Select AI Provider"
        >
          {providers.map(provider => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>
      
      {errorMessage}
      
      {mode === 'chat' && (
        <div className="chat-mode">
          <div className="input-area">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="พิมพ์ข้อความ..." 
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} disabled={loading}>ส่งข้อความ</button>
          </div>
          
          {loadingIndicator}
          
          <div className="response-area">
            {response}
          </div>
        </div>
      )}
      
      {mode === 'search' && (
        <div className="search-mode">
          <div className="input-area">
            <input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="พิมพ์คำค้นหา..." 
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={loading}>ค้นหา</button>
          </div>
          
          {loadingIndicator}
          
          <div className="results-area">
            {renderSearchResults()}
          </div>
        </div>
      )}
      
      {mode === 'rag' && (
        <div className="rag-mode">
          <div className="input-area">
            <input 
              value={question} 
              onChange={e => setQuestion(e.target.value)} 
              placeholder="พิมพ์คำถาม..." 
              onKeyPress={e => e.key === 'Enter' && handleAskQuestion()}
            />
            <button onClick={handleAskQuestion} disabled={loading}>ถามคำถาม</button>
          </div>
          
          {loadingIndicator}
          
          <div className="results-area">
            {renderRagResponse()}
          </div>
        </div>
      )}
      
      <style>
        {`
        .chat-panel {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }
        
        .mode-selector {
          display: flex;
          margin-bottom: 1rem;
        }
        
        .mode-selector button {
          flex: 1;
          padding: 0.5rem;
          background: #f0f0f0;
          border: 1px solid #ccc;
          cursor: pointer;
        }
        
        .mode-selector button.active {
          background: #007bff;
          color: white;
        }
        
        .provider-selector {
          margin-bottom: 1rem;
        }
        
        .provider-selector select {
          margin-left: 0.5rem;
          padding: 0.25rem;
        }
        
        .input-area {
          display: flex;
          margin-bottom: 1rem;
        }
        
        .input-area input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
        }
        
        .input-area button {
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }
        
        .input-area button:disabled {
          background: #ccc;
        }
        
        .loading-indicator {
          text-align: center;
          padding: 0.5rem;
          color: #666;
        }
        
        .error-message {
          background: #ffdddd;
          border: 1px solid #ff0000;
          color: #ff0000;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }
        
        .search-result-item {
          margin-bottom: 1rem;
          padding: 0.5rem;
          border: 1px solid #eee;
          border-radius: 4px;
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
          font-weight: bold;
        }
        
        .result-source {
          font-style: italic;
          color: #666;
          margin-bottom: 0.25rem;
        }
        
        .result-content {
          white-space: pre-line;
        }
        
        .rag-response {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 1rem;
        }
        
        .insight-summary {
          background: #f8f9fa;
          padding: 0.5rem;
          border-radius: 4px;
          margin: 1rem 0;
        }
        
        .sources {
          margin-top: 1rem;
        }
        
        .confidence {
          color: #666;
        }
        
        .execution-time {
          text-align: right;
          font-size: 0.8rem;
          color: #999;
          margin-top: 1rem;
        }
        `}
      </style>
    </div>
  );
}
