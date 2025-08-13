#🪡 Noteweave

Weave your notes into knowledge — AI‑powered RAG, Chat & Integrations for Obsidian

![Build](https://github.com/USERNAME/REPO/actions)
![Release](https://github.com/USERNAME/REPO/releases)
![License](LICENSE)
![Downloads](https://github.com/USERNAME/REPO/releases)

---

1. 🎯 วิสัยทัศน์
Noteweave คือ สมองเสริมใน Obsidian ที่จะ:
- เปลี่ยนคลังโน้ตทั้งหมดให้เป็นฐานความรู้ที่ค้นหาและสังเคราะห์ได้ด้วย AI
- เก็บข้อมูลจริงของคุณ ไว้ในเครื่อง (Local) เพื่อความเป็นส่วนตัวสูงสุด
- ให้คุณเลือก AI Provider ได้อย่างยืดหยุ่น: Cloud หรือ Local (Ollama / LM Studio / WASM / Bridge)
- ใช้งานได้ทั้งเดสก์ท็อปและมือถือ
- ผสานเข้ากับ Graph View, Canvas, Excalidraw, และระบบ Automation เช่น Template/QuickAdd

---

2. 🚀 ความสามารถหลัก

| หมวด | ฟีเจอร์ | รายละเอียด |
|------|---------|-------------|
| RAG | Semantic Search | ดึง context จาก Vault, Graph, Canvas, Excalidraw ด้วย embedding |
| Chat | Flexible Model | Chat provider และ Embedding provider แยกกันได้ |
| Mobile | Ready & Private | อ่าน index ที่ sync มา หรือ embed/query บนมือถือ |
| Integrations | Graph, Canvas, Excalidraw | ใช้ selection เป็น context หรือสร้างเนื้อหาใหม่ในที่เดียว |
| Automation | Template/QuickAdd | เรียกใช้ Noteweave commands ใน workflow อื่น |
| Sync | Flexible Sync | OS sync (Drive/Dropbox) หรือ Smart Connector + encryption |

---

3. 🏗 สถาปัตยกรรม

`mermaid
flowchart LR
    A[Local Vault & Index] -->|Retrieve context| RAGService
    U[User Query] --> RAGService
    RAGService -->|context + query| ProviderChoice{AI Provider}
    ProviderChoice --> Local[Local LLM<br/>(Ollama / LM Studio / WASM)]
    ProviderChoice --> Cloud[Cloud LLM<br/>(OpenAI / Anthropic)]
    ProviderChoice --> Bridge[Bridge to Desktop/Server]
    Local & Cloud & Bridge --> Resp[Answer + Citations]
    Resp --> UI[Chat Panel / Integrations]
`

Layers
1. UI Layer — Settings (Easy/Advanced), Chat Panel, Integrations  
2. Service Layer — ChatService, RAGService, Provider Adapters, SyncManager, IndexManager  
3. Data Layer — VectorStore, MetadataStore, FileWatcher, Persister  
4. Integration Layer — GraphParser, CanvasParser, ExcalidrawParser, Template/QuickAdd API

---

4. 📂 โครงสร้างโปรเจกต์

`plaintext
noteweave/
├─ package.json
├─ manifest.json
├─ esbuild.config.mjs
├─ src/
│  ├─ main.ts
│  ├─ settings/
│  ├─ ui/
│  ├─ services/
│  │   ├─ Provider/
│  │   ├─ Sync/
│  │   └─ Integration/
│  ├─ types.ts
│  └─ utils.ts
└─ indexes/
`

---

5. 🗺 Roadmap

`mermaid
gantt
    title Noteweave Roadmap
    dateFormat  YYYY-MM-DD
    section Core
    Phase 1: Core RAG Engine (เสถียร)       :done,    2025-08-01, 10d
    Phase 2: Provider Support (Cloud+Local) :active,  2025-08-12, 14d
    Phase 3: Mobile & Sync (OS+Connector)   :         2025-08-26, 14d
    section Integrations
    Phase 4: Graph/Canvas/Excalidraw        :         2025-09-09, 14d
    Phase 5: Templates/QuickAdd             :         2025-09-23, 10d
    section Release
    Phase 6: UX & Settings (Easy+Adv)       :         2025-10-03, 7d
    Phase 7: Performance & QA               :         2025-10-10, 14d
`

> กลยุทธ์: โฟกัส Core ให้เสถียรก่อน แล้วค่อยขยายฟีเจอร์

---

6. ⚠ ประเด็นทางเทคนิคและแนวทางแก้
- Mobile Performance: มือถือใช้ index ที่ sync มาจากเดสก์ท็อป, On-device embedding เป็นโหมด Experimental  
- Sync Complexity: ใช้ atomic write และ file lock, คู่มือการตั้งค่า sync ที่ชัดเจน  
- Index Management: UI แสดงสถานะ index, ปุ่ม re‑build, summary ข้อมูล index  

---

7. 📞 ช่องทางติดต่อ
- Repo: (เพิ่ม URL หลังสร้าง repo)
- Issues: GitHub Issues
- Community: Obsidian Forum / Discussions
- Releases: GitHub Releases

---

8. 🛠 Tech Stack
- TypeScript, Obsidian API, React  
- esbuild  
- Ollama / LM Studio (Local LLM)  
- Transformers.js / ONNX + WASM/WebGPU (Mobile)  
- Vector Store (JSONL float16) + optional HNSW  
- OS‑based Sync / Smart Connector (OAuth PKCE + AES‑GCM)

---

9. ⚙ การตั้งค่า
- Easy Mode: เลือก Provider / เปิดปิด RAG / Integrations  
- Advanced Mode: ปรับ chunk, topK, mmr, embedding model  
- Custom Commands: แมปคำสั่งกับปุ่ม/Shortcut เพื่อความถนัด  

---

10. 🚀 Getting Started

ติดตั้ง
1. ดาวน์โหลด/โคลน repo:
   `bash
   git clone https://github.com/USERNAME/REPO.git
   `
2. ติดตั้ง dependencies:
   `bash
   npm install
   `
3. สร้าง build:
   `bash
   npm run build
   `
4. คัดลอกโฟลเดอร์ไปไว้ใน:
   - Windows: %APPDATA%\Obsidian\plugins
   - macOS: ~/Library/Application Support/obsidian/plugins
   - Linux: ~/.config/obsidian/plugins

ตั้งค่าเริ่มต้น
1. เปิด Obsidian → Settings → Community plugins → เปิด Noteweave
2. ไปที่ Settings ของ Noteweave
3. เลือก Chat Provider และ Embedding Provider ตามต้องการ  
4. เปิดใช้งาน Integrations (Graph/Canvas/Excalidraw) ตามที่ต้องการ

---

> สรุป: README นี้คือ Project Charter + Blueprint + Quickstart ในไฟล์เดียว พร้อมให้สร้าง GitHub Repository และเริ่มพัฒนา/ทดสอบได้ทันที
`

---
