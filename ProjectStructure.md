NoteWeave-Engine/
├── 📁 src/
│   ├── 📁 core/                   # แกนหลักของ Business Logic
│   │   └── 📄 rag.service.ts     # Logic การทำ RAG, Orchestrate service อื่นๆ
│   │
│   ├── 📁 services/               # ✨ **หัวใจของการขยายระบบ**
│   │   ├── 📄 notion.service.ts    # Logic ทั้งหมดที่เกี่ยวกับ Notion
│   │   ├── 📄 clickup.service.ts   # Logic ทั้งหมดที่เกี่ยวกับ ClickUp
│   │   ├── 📄 ollama.provider.ts   # Logic การคุยกับ Ollama
│   │   ├── 📄 openai.provider.ts  # Logic การคุยกับ OpenAI
│   │   └── 📄 embedding.service.ts # Logic การสร้าง Embedding
│   │
│   ├── 📁 types/                  # เก็บ Type Definitions และ Interfaces
│   │   ├── 📄 data-views.types.ts
│   │   └── 📄 external-apis.types.ts
│   │
│   ├── 📄 main.ts                 # Entry point ของ Engine Plugin
│   └── 📄 api.ts                  # Public API ที่เปิดให้ UI Plugin เรียกใช้
│
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 README.md



NoteWeave-UI/
├── 📁 src/
│   ├── 📁 components/             # React Components สำหรับ UI
│   │   ├── 📁 views/             # Components สำหรับ Data Views
│   │   │   ├── 📄 TableView.tsx
│   │   │   └── 📄 BoardView.tsx
│   │   ├── 📄 ChatPanel.tsx
│   │   └── 📄 SettingsTab.tsx
│   │
│   ├── 📁 lib/                    # (หรือ hooks/) สำหรับจัดการ State และการเรียก API
│   │   └── 📄 useEngine.ts        # Custom Hook สำหรับเรียกใช้ Engine API
│   │
│   ├── 📄 main.ts                 # Entry point ของ UI Plugin
│   └── 📄 styles.css
│
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 README.md