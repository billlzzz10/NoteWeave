# คำแนะนำการติดตั้งและทดสอบ RAG Engine

## ขั้นตอนการติดตั้ง

1. ติดตั้ง dependencies:

```bash
cd NoteWeave-Engine
npm install
```

2. ตรวจสอบให้แน่ใจว่าคุณมี Ollama ทำงานอยู่บนเครื่อง:

```bash
# เช็คว่า Ollama กำลังทำงานอยู่
curl http://localhost:11434/api/version

# ถ้ายังไม่มี ให้ติดตั้งตามคำแนะนำที่ https://ollama.com/download
```

3. ติดตั้งโมเดลที่จำเป็น:

```bash
# ติดตั้งโมเดลสำหรับ embedding
ollama pull nomic-embed-text

# ติดตั้งโมเดลสำหรับ completion/generation
ollama pull llama3
```

## การสร้างและทดสอบ

1. สร้าง (build) โปรเจค:

```bash
npm run build
```

2. ทดสอบการทำงานของ RAG:

```bash
# รันตัวอย่างการทดสอบ
node examples/test-rag.js
```

## การเพิ่มเอกสารเข้าในฐานความรู้

คุณสามารถเพิ่มเอกสาร Markdown เข้าไปในฐานความรู้ได้ง่ายๆ:

```javascript
// เพิ่มไฟล์เดี่ยว
await api.addMarkdownFile('/path/to/your/note.md');

// เพิ่มทั้งโฟลเดอร์
await api.addMarkdownFolder('/path/to/your/notes/folder');

// หรือเพิ่มข้อความโดยตรง
await api.addMarkdownDocument('# เนื้อหาที่ต้องการเพิ่ม', 'source-name', { 
  title: 'ชื่อเอกสาร',
  tags: ['tag1', 'tag2']
});
```

## การใช้งาน Semantic Search และ RAG

```javascript
// ค้นหาแบบ Semantic
const results = await api.semanticSearch('คำค้นหาของคุณ', 5);

// ถามคำถามโดยใช้ RAG
const answer = await api.askQuestion('คำถามของคุณ', { 
  provider: 'ollama',  // หรือ 'openai' ถ้ามี API key
  model: 'llama3',     // หรือโมเดลอื่นที่ติดตั้งไว้
  topK: 5              // จำนวนเอกสารที่จะดึงมาเป็นบริบท
});
```

## ข้อควรระวัง

- ตรวจสอบให้แน่ใจว่ามีโฟลเดอร์ `.noteweave` ในโฟลเดอร์ที่คุณรันโปรเจค หรือแก้ไขเส้นทางใน `.env`
- หากต้องการใช้ OpenAI ให้เพิ่ม API key ใน `.env`
