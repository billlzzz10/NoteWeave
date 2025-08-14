// PlatformConnector.tsx
// Component สำหรับจัดการการเชื่อมต่อกับแพลตฟอร์มภายนอก

import React, { useEffect, useState } from 'react';
import { useEngine } from '../lib/useEngine';
import type { PlatformSummary, PlatformType } from 'noteweave-types';
// or if you want to use a relative path:
// import type { PlatformSummary, PlatformType } from '../../types/platform';
import './PlatformConnector.css';

/**
 * Component สำหรับจัดการการเชื่อมต่อกับแพลตฟอร์มภายนอก
 */
export const PlatformConnector: React.FC = () => {
  const {
    api,
    getSupportedPlatforms,
    getAllPlatformConnections,
    connectToPlatform,
    disconnectFromPlatform,
    syncDataWithPlatform,
    importPlatformDataToKnowledgeBase
  } = useEngine();
  const [platforms, setPlatforms] = useState<Array<{
    type: PlatformType;
    name: string;
    description: string;
    website: string;
    icon: string;
    authType: 'apiKey' | 'oauth' | 'both';
    requiredCredentials: string[];
  }>>([]);
  const [connections, setConnections] = useState<PlatformSummary[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // โหลดข้อมูลแพลตฟอร์มและการเชื่อมต่อ
  useEffect(() => {
    const loadData = async () => {
        const platformsData = await getSupportedPlatforms();
        setPlatforms(platformsData);
        
        // โหลดข้อมูลการเชื่อมต่อ
        const connectionsData = await getAllPlatformConnections();
        setConnections(connectionsData);
      } catch (error) {
        console.error('Error loading platform data:', error);
        setError('ไม่สามารถโหลดข้อมูลแพลตฟอร์มได้');
      }
    };
    
    loadData();
  }, [api]);
  
  // เลือกแพลตฟอร์ม
  const handleSelectPlatform = (type: PlatformType) => {
    setSelectedPlatform(type);
    setCredentials({});
    setError(null);
    setSuccessMessage(null);
  };
  
  // กรอกข้อมูลการรับรองตัวตน
  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // เชื่อมต่อกับแพลตฟอร์ม
  const handleConnect = async () => {
    if (!selectedPlatform) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      setSuccessMessage(null);
      
      // ตรวจสอบข้อมูลการรับรองตัวตน
      const platform = platforms.find(p => p.type === selectedPlatform);
      if (!platform) {
        throw new Error('ไม่พบข้อมูลแพลตฟอร์ม');
      }
      
      for (const cred of platform.requiredCredentials) {
        if (!credentials[cred]) {
          throw new Error(`กรุณากรอก ${cred}`);
        }
      }
      const result = await connectToPlatform({
        platformType: selectedPlatform,
      const result = await connectToPlatform({
        platformType: selectedPlatform,
        credentials,
        workspace: credentials.workspace || platform.name
      });
      
      // อัปเดตข้อมูลการเชื่อมต่อ
      setConnections(prev => [...prev, result]);
      setSuccessMessage(`เชื่อมต่อกับ ${platform.name} สำเร็จแล้ว`);
      
      // รีเซ็ตข้อมูล
      setSelectedPlatform(null);
      setCredentials({});
    } catch (error) {
      console.error('Error connecting to platform:', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsConnecting(false);
    }
  };
  
  // ยกเลิกการเชื่อมต่อ
  const handleDisconnect = async (platformId: string) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await disconnectFromPlatform(platformId);
      
      // อัปเดตข้อมูลการเชื่อมต่อ
      setConnections(prev => prev.filter(conn => conn.id !== platformId));
      // อัปเดตข้อมูลการเชื่อมต่อ
      setConnections(prev => prev.filter(conn => conn.id !== platformId));
      
      // แสดงข้อความสำเร็จ
      setSuccessMessage('ยกเลิกการเชื่อมต่อสำเร็จแล้ว');
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการยกเลิกการเชื่อมต่อ');
    }
  };
  
  // ซิงค์ข้อมูล
  const handleSync = async (platformId: string) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const result = await syncDataWithPlatform(
        platformId,
        {
          direction: 'import',
          conflict: 'newer'
        },
        (progress) => {
          console.log('Sync progress:', progress);
        }
      );
      
      // แสดงข้อความสำเร็จ
      setSuccessMessage(`ซิงค์ข้อมูลสำเร็จแล้ว: ${result.itemsProcessed} รายการ`);
    } catch (error) {
      console.error('Error syncing data:', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการซิงค์ข้อมูล');
    }
  };
  
  // นำเข้าข้อมูลไปยัง knowledge base
  const handleImport = async (platformId: string) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const result = await importPlatformDataToKnowledgeBase(
        platformId,
      const result = await importPlatformDataToKnowledgeBase(
        platformId,
        {},
        (progress) => {
          console.log('Import progress:', progress);
        }
      );
      
      // แสดงข้อความสำเร็จ
      setSuccessMessage(`นำเข้าข้อมูลสำเร็จแล้ว: ${result.itemsAdded} รายการ`);
    } catch (error) {
      console.error('Error importing data:', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
    }
  };
    <div className="platform-connector">
      <h2>เชื่อมต่อกับแพลตฟอร์มภายนอก</h2>
      
      {/* แสดงข้อผิดพลาด */}
      {error && <div className="error-message">{error}</div>}
      
      {/* แสดงข้อความสำเร็จ */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {/* แสดงการเชื่อมต่อปัจจุบัน */}
      {connections.length > 0 && (
        <div className="current-connections">
          <h3>การเชื่อมต่อปัจจุบัน</h3>
          <div className="connections-list">
            {connections.map(conn => (
              <div key={conn.id} className="connection-item">
                <div className="connection-info">
                  <h4>{conn.name}</h4>
                  <p><strong>สถานะ:</strong> {conn.status === 'connected' ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}</p>
                  {conn.lastSync && <p><strong>ซิงค์ล่าสุด:</strong> {new Date(conn.lastSync).toLocaleString()}</p>}
                  {conn.itemCount !== undefined && <p><strong>จำนวนรายการ:</strong> {conn.itemCount}</p>}
                </div>
                <div className="connection-actions">
                  <button onClick={() => handleSync(conn.id)}>ซิงค์ข้อมูล</button>
                  <button onClick={() => handleImport(conn.id)}>นำเข้าข้อมูล</button>
                  <button onClick={() => handleDisconnect(conn.id)} className="disconnect-button">ยกเลิกการเชื่อมต่อ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* เพิ่มการเชื่อมต่อใหม่ */}
      <div className="add-connection">
        <h3>เพิ่มการเชื่อมต่อใหม่</h3>
        
        {/* เลือกแพลตฟอร์ม */}
        <div className="platform-selection">
          <h4>เลือกแพลตฟอร์ม</h4>
          <div className="platform-list">
            {platforms.map(platform => (
              <div
                key={platform.type}
                className={`platform-item ${selectedPlatform === platform.type ? 'selected' : ''}`}
                onClick={() => handleSelectPlatform(platform.type)}
              >
                <div className="platform-icon">
                  {/* TODO: แสดงไอคอนของแพลตฟอร์ม */}
                  <span>{platform.name.charAt(0)}</span>
                </div>
                <div className="platform-details">
                  <h5>{platform.name}</h5>
                  <p>{platform.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* กรอกข้อมูลการรับรองตัวตน */}
        {selectedPlatform && (
          <div className="credentials-form">
            <h4>กรอกข้อมูลการรับรองตัวตน</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleConnect(); }}>
              {platforms
                .find(p => p.type === selectedPlatform)
                ?.requiredCredentials.map(cred => (
                  <div key={cred} className="form-group">
                    <label htmlFor={cred}>{cred}</label>
                    <input
                      type={cred.includes('secret') || cred.includes('token') || cred.includes('key') ? 'password' : 'text'}
                      id={cred}
                      value={credentials[cred] || ''}
                      onChange={(e) => handleCredentialChange(cred, e.target.value)}
                      required
                    />
                  </div>
                ))
              }
              
              {/* ชื่อการเชื่อมต่อ */}
              <div className="form-group">
                <label htmlFor="workspace">ชื่อการเชื่อมต่อ (ไม่บังคับ)</label>
                <input
                  type="text"
                  id="workspace"
                  value={credentials.workspace || ''}
                  onChange={(e) => handleCredentialChange('workspace', e.target.value)}
                  placeholder="My Workspace"
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform(null)}
                  className="cancel-button"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="connect-button"
                >
                  {isConnecting ? 'กำลังเชื่อมต่อ...' : 'เชื่อมต่อ'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
