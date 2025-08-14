NoteWeave is a monorepo designed to manage both backend and frontend plugins for collaborative note-taking and knowledge management.

NoteWeave/  (The Single Repository)
│   ├── 📁 NoteWeave-Engine/  (Plugin A: "Kitchen" - The Headless Backend)
│   │   ├── 📁 src/
│   │   │   ├── 📁 core/
│   │   │   │   └── 📄 rag.service.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── 📄 notion.service.ts
│   │   │   │   ├── 📄 clickup.service.ts
│   │   │   │   └── 📄 embedding.service.ts
│   │   │   ├── 📁 providers/
│   │   │   │   ├── 📄 ollama.provider.ts
│   │   │   │   └── 📄 openai.provider.ts
│   │   │   ├── 📄 main.ts
│   │   │   └── 📄 api.ts  (Public API สำหรับ UI Plugin / Public API for UI Plugin)
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   │
│   ├── 📁NoteWeave-UI/      (Plugin B: "Frontend" - The Storefront)
│   │   ├── 📁 src/
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📁 views/
│   │   │   │   └── 📄 ChatPanel.tsx
│   │   │   ├── 📁 lib/
│   │   │   │   └── 📄 useEngine.ts
│   │   │   └── 📄 main.ts
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   │
│   └── 📁 types/   (แพ็กเกจสำหรับแชร์ Type ข้อมูล / Package for sharing data types)
│       ├── 📄 index.ts
│       └── 📄 package.json
│
├── 📄 .gitignore
├── 📄 LICENSE
├── 📄 package.json        (Main file for managing Monorepo Workspaces / ไฟล์หลักสำหรับจัดการ Monorepo Workspaces)
├── 📄 README.md
└── 📄 tsconfig.base.json  (Base TS config ที่แชร์กันใช้ / Base TS config shared by all)