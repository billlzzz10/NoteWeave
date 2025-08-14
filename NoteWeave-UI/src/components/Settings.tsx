import React, { useState } from 'react';
import { TextChunkingOptions } from 'noteweave-types';

interface SettingsProps {
  defaultChunkingOptions: TextChunkingOptions;
  onSave: (options: TextChunkingOptions) => void;
}

/**
 * คอมโพเนนต์สำหรับการตั้งค่าการแบ่ง chunk และอื่นๆ
 */
export const Settings: React.FC<SettingsProps> = ({ defaultChunkingOptions, onSave }) => {
  const [chunkingOptions, setChunkingOptions] = useState<TextChunkingOptions>(defaultChunkingOptions);
  
  // จัดการการเปลี่ยนแปลงค่าตัวเลข
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChunkingOptions({
      ...chunkingOptions,
      [name]: parseInt(value, 10)
    });
  };
  
  // จัดการการเปลี่ยนแปลงค่าตรรกะ (boolean)
  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setChunkingOptions({
      ...chunkingOptions,
      [name]: checked
    });
  };
  
  // บันทึกการตั้งค่า
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(chunkingOptions);
  };
  
  return (
    <div className="settings-panel">
      <h2>การตั้งค่า</h2>
      
      <form onSubmit={handleSubmit}>
        <h3>การแบ่ง Chunk ของเอกสาร</h3>
        
        <div className="setting-item">
          <label htmlFor="chunkSize">ขนาด Chunk (จำนวนตัวอักษร)</label>
          <input
            type="number"
            id="chunkSize"
            name="chunkSize"
            value={chunkingOptions.chunkSize}
            onChange={handleNumberChange}
            min={100}
            max={10000}
          />
          <p className="setting-hint">
            ขนาดโดยประมาณของแต่ละ chunk ที่จะถูกสร้างขึ้น ค่าที่แนะนำคือ 1,000-1,500 ตัวอักษร
          </p>
        </div>
        
        <div className="setting-item">
          <label htmlFor="chunkOverlap">ส่วนที่ซ้อนทับ (จำนวนตัวอักษร)</label>
          <input
            type="number"
            id="chunkOverlap"
            name="chunkOverlap"
            value={chunkingOptions.chunkOverlap}
            onChange={handleNumberChange}
            min={0}
            max={5000}
          />
          <p className="setting-hint">
            จำนวนตัวอักษรที่ซ้อนทับกันระหว่าง chunks เพื่อรักษาบริบท ค่าที่แนะนำคือ 100-200 ตัวอักษร
          </p>
        </div>
        
        <div className="setting-item">
          <label htmlFor="minChunkSize">ขนาด Chunk ขั้นต่ำ</label>
          <input
            type="number"
            id="minChunkSize"
            name="minChunkSize"
            value={chunkingOptions.minChunkSize}
            onChange={handleNumberChange}
            min={50}
            max={5000}
          />
          <p className="setting-hint">
            ขนาดขั้นต่ำของ chunk ที่ยอมรับได้ chunks ที่เล็กกว่านี้จะถูกรวมกับ chunk ถัดไป
          </p>
        </div>
        
        <div className="setting-item checkbox">
          <input
            type="checkbox"
            id="splitByParagraph"
            name="splitByParagraph"
            checked={chunkingOptions.splitByParagraph}
            onChange={handleBooleanChange}
          />
          <label htmlFor="splitByParagraph">แบ่งตามย่อหน้า</label>
          <p className="setting-hint">
            พยายามแบ่ง chunks ตามย่อหน้า (บรรทัดว่าง) เพื่อรักษาโครงสร้างของเนื้อหา
          </p>
        </div>
        
        <div className="setting-item checkbox">
          <input
            type="checkbox"
            id="respectCodeBlocks"
            name="respectCodeBlocks"
            checked={chunkingOptions.respectCodeBlocks}
            onChange={handleBooleanChange}
          />
          <label htmlFor="respectCodeBlocks">รักษาโค้ดบล็อก</label>
          <p className="setting-hint">
            ไม่แบ่งโค้ดบล็อก (ระหว่าง ```) เพื่อรักษาโครงสร้างของโค้ด
          </p>
        </div>
        
        <div className="settings-actions">
          <button type="submit" className="primary-button">บันทึกการตั้งค่า</button>
          <button 
            type="button" 
            onClick={() => setChunkingOptions(defaultChunkingOptions)}
            className="secondary-button"
          >
            คืนค่าเริ่มต้น
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
