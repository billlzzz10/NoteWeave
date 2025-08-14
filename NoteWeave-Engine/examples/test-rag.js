// examples/test-rag.js
// ตัวอย่างการใช้งาน RAG และ Semantic Search

// Import the API
const { api } = require('../dist/main');

// Main function
async function main() {
  try {
    console.log('เริ่มการทดสอบ RAG และ Semantic Search...');

    // 1. เพิ่มเอกสารตัวอย่าง
    console.log('\n1. กำลังเพิ่มเอกสารตัวอย่าง...');
    
    const sampleDocument = `
# NoteWeave คืออะไร

NoteWeave เป็นระบบจัดการความรู้ส่วนตัวที่ช่วยเชื่อมต่อและสังเคราะห์ข้อมูลจากหลากหลายแหล่ง เช่น Obsidian, Notion, ClickUp และ Airtable เข้าด้วยกัน

## หลักการสำคัญ

- **ความเป็นส่วนตัวต้องมาก่อน:** ข้อมูลของคุณถูกเก็บไว้ในเครื่องเป็นค่าเริ่มต้น
- **รวมศูนย์บริบทความรู้:** ทลายกำแพงข้อมูล ค้นหาข้อมูลข้ามแพลตฟอร์มได้ในครั้งเดียว
- **สถาปัตยกรรมแบบแยกส่วน:** ยืดหยุ่นในการเลือกใช้ AI และแหล่งข้อมูล

## เทคโนโลยีหลัก

NoteWeave ใช้เทคโนโลยี RAG (Retrieval-Augmented Generation) ในการค้นหาและสังเคราะห์ข้อมูล โดยสามารถทำงานได้ทั้งกับ AI แบบ Local และ Cloud
    `;
    
    await api.addMarkdownDocument(sampleDocument, 'example-doc', { title: 'เอกสารแนะนำ NoteWeave' });
    console.log('เพิ่มเอกสารตัวอย่างเรียบร้อยแล้ว');
    
    // 2. ทดสอบ Semantic Search
    console.log('\n2. กำลังทดสอบ Semantic Search...');
    
    const searchQuery = 'ความเป็นส่วนตัวและการจัดการข้อมูล';
    console.log(`คำค้นหา: "${searchQuery}"`);
    
    const searchResults = await api.semanticSearch(searchQuery, 3);
    console.log('ผลการค้นหา:');
    searchResults.forEach((result, index) => {
      console.log(`\n[${index + 1}] Score: ${result.score.toFixed(4)}`);
      console.log(`สาระสำคัญ: ${result.document.content.substring(0, 150)}...`);
      console.log(`แหล่งที่มา: ${result.document.metadata.source}`);
    });
    
    // 3. ทดสอบ RAG
    console.log('\n3. กำลังทดสอบ RAG...');
    
    const question = 'NoteWeave มีหลักการสำคัญอะไรบ้าง และใช้เทคโนโลยีอะไร?';
    console.log(`คำถาม: "${question}"`);
    
    const ragResult = await api.askQuestion(question, { provider: 'ollama', model: 'llama3' });
    console.log('\nคำตอบ:');
    console.log(ragResult.answer);
    
    console.log('\nแหล่งข้อมูล:');
    ragResult.sources.forEach((source, index) => {
      console.log(`\n[${index + 1}] Score: ${source.score.toFixed(4)}`);
      console.log(`สาระสำคัญ: ${source.content.substring(0, 100)}...`);
    });
    
    // 4. แสดงสถิติ
    console.log('\n4. สถิติของฐานความรู้:');
    const stats = api.getKnowledgeBaseStats();
    console.log(`จำนวนเอกสารทั้งหมด: ${stats.documentCount}`);
    
    console.log('\nการทดสอบเสร็จสิ้น');
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการทดสอบ:', error);
  }
}

// Run the main function
main().catch(console.error);
