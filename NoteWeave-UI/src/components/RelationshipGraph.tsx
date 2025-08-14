import React, { useEffect, useRef } from 'react';
import { SearchResult } from 'noteweave-types';
// or if you want to use a relative path:
// import { SearchResult } from '../../types/index';

interface RelationshipGraphProps {
  results: SearchResult[];
  query: string;
  width?: number;
  height?: number;
}

/**
 * คอมโพเนนต์แสดงความสัมพันธ์ระหว่างเอกสาร
 */
export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  results,
  query,
  width = 600,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ฟังก์ชันวาดกราฟความสัมพันธ์
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // เคลียร์แคนวาส
    ctx.clearRect(0, 0, width, height);
    
    // ถ้าไม่มีผลลัพธ์ ให้แสดงข้อความ
    if (results.length === 0) {
      ctx.font = '16px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText('ไม่พบข้อมูลความสัมพันธ์', width / 2, height / 2);
      return;
    }
    
    // ข้อมูลสำหรับวาด
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35; // รัศมีของวงกลมกลาง
    
    // วาดวงกลมกลาง (คำค้นหา)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#4a8eff';
    ctx.fill();
    
    // วาดข้อความคำค้นหา
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // ตัดข้อความให้พอดีกับวงกลม
    const queryText = query.length > 20 ? query.substring(0, 17) + '...' : query;
    ctx.fillText(queryText, centerX, centerY);
    
    // วาดเอกสารที่เกี่ยวข้อง
    const angleStep = (Math.PI * 2) / results.length;
    
    results.forEach((result, index) => {
      // คำนวณตำแหน่ง
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // คำนวณขนาดวงกลมตามค่า score (0.5-1.0)
      const normalizedScore = Math.max(0.5, Math.min(1.0, result.score));
      const nodeRadius = 15 + normalizedScore * 15;
      
      // วาดเส้นเชื่อม
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = `rgba(74, 142, 255, ${normalizedScore.toFixed(2)})`;
      ctx.lineWidth = 1 + normalizedScore * 3;
      ctx.stroke();
      
      // วาดวงกลมเอกสาร
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74, 142, 255, ${(normalizedScore * 0.7).toFixed(2)})`;
      ctx.fill();
      
      // วาดข้อความชื่อเอกสาร
      ctx.font = '11px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // ดึงชื่อเอกสารจาก metadata
      const docTitle = result.document.metadata.title || 
                       result.document.metadata.filename || 
                       'เอกสาร ' + (index + 1);
                       
      // ตัดข้อความให้พอดี
      const title = docTitle.length > 15 ? docTitle.substring(0, 12) + '...' : docTitle;
      ctx.fillText(title, x, y);
      
      // วาดค่า score
      ctx.font = '9px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText(`${(result.score * 100).toFixed(0)}%`, x, y + nodeRadius + 12);
    });
  };
  
  // วาดกราฟเมื่อข้อมูลเปลี่ยน
  useEffect(() => {
    drawGraph();
  }, [results, query, width, height]);
  
  return (
    <div className="relationship-graph">
      <h3>แผนภาพความสัมพันธ์</h3>
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ddd', borderRadius: '4px' }}
      />
    </div>
  );
};

export default RelationshipGraph;
