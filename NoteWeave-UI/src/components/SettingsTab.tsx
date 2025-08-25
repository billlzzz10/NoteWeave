import React, { useState, useEffect } from 'react';
import { useEngine } from '../lib/useEngine';
import type { AIProviderType, TextChunkingOptions } from 'noteweave-types';
import './SettingsTab.css'; // สมมติว่ามีไฟล์ CSS สำหรับสไตล์
import KnowledgeBaseSettings from './KnowledgeBaseSettings';
import ChatCommandSettings from './ChatCommandSettings';

/**
 * คอมโพเนนต์สำหรับหน้าตั้งค่า NoteWeave ใน Obsidian
 */
export const SettingsTab: React.FC = () => {
  const { currentProvider, changeProvider, getAvailableProviders } = useEngine();
  const [apiKey, setApiKey] = useState('');
  const [chunkingOptions, setChunkingOptions] = useState<Partial<TextChunkingOptions>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'knowledgeBase' | 'chatCommands'>('general');

  const providers = getAvailableProviders();

  // Load settings from storage on mount (mockup)
  useEffect(() => {
    // ในการใช้งานจริง จะต้องโหลดการตั้งค่าที่บันทึกไว้
    // const savedSettings = await loadPluginSettings();
    // setApiKey(savedSettings.apiKey || '');
    // setChunkingOptions(savedSettings.chunkingOptions || {});
    // changeProvider(savedSettings.provider || 'ollama');
  }, []);

  const handleSaveSettings = () => {
    // ในการใช้งานจริง จะต้องบันทึกการตั้งค่า
    // await savePluginSettings({
    //   provider: currentProvider,
    //   apiKey,
    //   chunkingOptions,
    // });
    alert('Settings saved!'); // Placeholder
  };

  const handleChunkingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const isChecked = (e.target as HTMLInputElement).checked;

    setChunkingOptions(prev => ({
      ...prev,
      [name]: isCheckbox ? isChecked : parseInt(value, 10),
    }));
  };

  return (
    <div className="noteweave-settings-tab">
      <h1>NoteWeave Settings</h1>
      <nav className="settings-nav">
        <button onClick={() => setActiveTab('general')} className={activeTab === 'general' ? 'active' : ''}>
          General
        </button>
        <button onClick={() => setActiveTab('knowledgeBase')} className={activeTab === 'knowledgeBase' ? 'active' : ''}>
          Knowledge Base
        </button>
        <button onClick={() => setActiveTab('chatCommands')} className={activeTab === 'chatCommands' ? 'active' : ''}>
          Chat Commands
        </button>
      </nav>

      <div className="settings-content">
        {activeTab === 'general' && (
          <div>
            <h2>General Settings</h2>
            <section>
              <h3>AI Provider</h3>
              <p>เลือก AI Provider ที่คุณต้องการใช้สำหรับ RAG และการสนทนา</p>
              <div className="setting-item">
                <label htmlFor="provider-select">Provider</label>
                <select
                  id="provider-select"
                  value={currentProvider}
                  onChange={(e) => changeProvider(e.target.value as AIProviderType)}
                >
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              {providers.find(p => p.id === currentProvider)?.requiresApiKey && (
                <div className="setting-item">
                  <label htmlFor="api-key-input">API Key</label>
                  <input
                    id="api-key-input"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API Key"
                  />
                </div>
              )}
            </section>

            <section>
              <h3>Chunking Settings</h3>
              <p>ปรับแต่งวิธีการแบ่งเอกสารเป็นส่วนย่อย (chunks) สำหรับ RAG</p>
              <div className="setting-item">
                <label htmlFor="chunkSize">Chunk Size (ตัวอักษร)</label>
                <input
                  id="chunkSize"
                  name="chunkSize"
                  type="number"
                  value={chunkingOptions.chunkSize || 1000}
                  onChange={handleChunkingChange}
                />
              </div>
              <div className="setting-item">
                <label htmlFor="chunkOverlap">Chunk Overlap (ตัวอักษร)</label>
                <input
                  id="chunkOverlap"
                  name="chunkOverlap"
                  type="number"
                  value={chunkingOptions.chunkOverlap || 200}
                  onChange={handleChunkingChange}
                />
              </div>
            </section>

            <button className="save-button" onClick={handleSaveSettings}>
              Save Settings
            </button>
          </div>
        )}
        {activeTab === 'knowledgeBase' && <KnowledgeBaseSettings />}
        {activeTab === 'chatCommands' && <ChatCommandSettings />}
      </div>
    </div>
  );
};
