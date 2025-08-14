# NoteWeave Engine

NoteWeave Engine เป็น Core Backend ของระบบ NoteWeave ที่รับผิดชอบในการทำ RAG (Retrieval-Augmented Generation) และ Semantic Search บนข้อมูลความรู้ส่วนตัว

## โครงสร้างโปรเจค

```
NoteWeave-Engine/
├── src/
│   ├── core/            # Core services
│   │   └── rag.service.ts   # RAG implementation
│   ├── services/        # Utility services
│   │   ├── embedding.service.ts  # Embedding generation
│   │   ├── vector-store.service.ts  # Vector storage/retrieval
│   ├── providers/       # AI provider implementations
│   │   ├── ollama.provider.ts  # Ollama integration
│   │   ├── openai.provider.ts  # OpenAI integration
│   ├── types/           # TypeScript type definitions
│   ├── main.ts          # Entry point
│   └── api.ts           # Public API for UI
```

## การติดตั้ง

```bash
# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env (สามารถคัดลอกจาก .env.example)
cp .env.example .env
```

## การเริ่มต้นใช้งาน

1. ตรวจสอบให้แน่ใจว่าคุณมี Ollama ทำงานอยู่บนเครื่องแล้ว (ที่ http://localhost:11434)
2. ตรวจสอบว่าคุณมีโมเดล embedding และ completion พร้อมใช้งาน:

```bash
# ติดตั้งโมเดลที่จำเป็น
ollama pull nomic-embed-text
ollama pull llama3
```

3. รันโปรเจค:

```bash
# สำหรับการพัฒนา
npm run dev

# หรือสำหรับการใช้งานจริง
npm run build
npm run start
```

## การทดสอบ RAG และ Semantic Search

1. ก่อนอื่นเพิ่มข้อมูล Markdown เข้าไปในระบบ:

```typescript
import { addMarkdownFile, addMarkdownFolder } from './api';

// เพิ่มไฟล์เดี่ยว
await addMarkdownFile('/path/to/your/note.md');

// หรือเพิ่มทั้งโฟลเดอร์
await addMarkdownFolder('/path/to/your/notes/folder');
```

2. ทดสอบการถามคำถาม (RAG):

```typescript
import { askQuestion } from './api';

const result = await askQuestion('ช่วยสรุปข้อมูลเกี่ยวกับ NoteWeave');
console.log(result.answer);
console.log(result.sources); // แหล่งข้อมูลที่ใช้ในการตอบคำถาม
```

3. ทดสอบการค้นหาแบบ Semantic:

```typescript
import { semanticSearch } from './api';

const results = await semanticSearch('การจัดการความรู้ส่วนตัว');
console.log(results); // ผลลัพธ์ที่เกี่ยวข้องที่สุด
```

## การใช้งานกับ NoteWeave-UI

NoteWeave Engine ถูกออกแบบมาให้ทำงานร่วมกับ NoteWeave-UI ซึ่งเป็นส่วนติดต่อผู้ใช้ในรูปแบบ Obsidian Plugin API ในโปรเจค api.ts มีการเปิดเผย functions ที่จำเป็นสำหรับการเชื่อมต่อกับ UI
