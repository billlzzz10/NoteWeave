# ✅ Checklist แผนการพัฒนา NoteWeave (ฉบับสมบูรณ์)

แผนการพัฒนาแบ่งเป็น 5 เฟสหลัก โดยแต่ละเฟสจะต่อยอดจากเฟสก่อนหน้า เพื่อให้โปรเจกต์เติบโตอย่างมีเสถียรภาพ

---

## Phase 1: Foundation & Core RAG Engine
**🎯 เป้าหมายหลัก:** สร้างรากฐาน Monorepo ที่มั่นคง และพัฒนา MVP ที่สามารถแชทกับเอกสารใน Vault ได้

**✅ รายการงาน (Task Checklist):**

**Monorepo & General**
- [x] ตั้งค่า GitHub Repository (`billlzzz10/NoteWeave`)
- [x] สร้างไฟล์พื้นฐานที่ Root (`LICENSE`, `.gitignore`, `README.md` v1)
- [x] ตั้งค่า Monorepo ในไฟล์ `package.json` หลัก
- [x] สร้างแพ็กเกจเริ่มต้น 3 แพ็กเกจ: `NoteWeave-Engine`, `NoteWeave-UI`, `types`
- [x] สร้าง `tsconfig.base.json` และตั้งค่า `tsconfig.json` ในแต่ละแพ็กเกจ
- [ ] ตั้งค่า CI/CD เบื้องต้นสำหรับ Monorepo ด้วย GitHub Actions

**NoteWeave-Engine (The Backend Plugin)**
- [x] จัดโครงสร้างโฟลเดอร์ภายใน Engine/src (`core`, `services`, `providers`)
- [x] พัฒนา `embedding.service.ts` เพื่อสร้าง Vector จากไฟล์ Markdown (mockup)
- [ ] ตั้งค่า VectorStore (เริ่มต้นด้วย ChromaDB หรือ FAISS แบบ In-memory)
- [x] พัฒนา `rag.service.ts` เวอร์ชันแรกที่ทำงานกับข้อมูลจาก VectorStore (mockup)
- [x] พัฒนา Provider สำหรับ `ollama.provider.ts` เพื่อเชื่อมต่อกับ Local LLM (mockup)
- [x] พัฒนา Provider สำหรับ `openai.provider.ts` เพื่อเชื่อมต่อกับ Cloud LLM (mockup)
- [x] สร้าง `api.ts` เพื่อกำหนด Public API ที่จะให้ NoteWeave-UI เรียกใช้ (mockup)

**NoteWeave-UI (The Frontend Plugin)**
- [ ] ตั้งค่าโปรเจกต์ปลั๊กอิน Obsidian (`main.ts`, `manifest.json`)
- [ ] พัฒนา `SettingsTab.tsx` สำหรับการตั้งค่าพื้นฐาน
- [x] พัฒนา `ChatPanel.tsx` เป็น UI หลักในการสนทนา (mockup)
- [x] สร้าง `useEngine.ts` (Custom Hook) สำหรับเชื่อมต่อกับ NoteWeave-Engine (mockup)

---

## Phase 2: The Data View Engine (Read-Only)
**🎯 เป้าหมายหลัก:** แสดงผลข้อมูลจาก Notion/ClickUp ในรูปแบบตารางและบอร์ดได้ (แบบอ่านอย่างเดียว)

**✅ รายการงาน (Task Checklist):**

**NoteWeave-Engine**
- [ ] พัฒนา `notion.service.ts` และ `clickup.service.ts` สำหรับดึงข้อมูลผ่าน API
- [x] พัฒนา Platform Connectors สำหรับ Notion และ MS365
- [x] สร้าง `platformManager.service.ts` สำหรับจัดการการเชื่อมต่อกับแพลตฟอร์มภายนอก
- [x] เพิ่ม API สำหรับการเชื่อมต่อกับแพลตฟอร์มผ่าน `platform-api.ts`
- [ ] สร้างโมเดลสำหรับแปลงข้อมูล (Data Transformation) จาก API ให้อยู่ในรูปแบบมาตรฐาน
- [ ] เพิ่มฟังก์ชันใหม่ใน `api.ts` สำหรับการดึงข้อมูล View (เช่น `getViewData(source, viewId)`)

**NoteWeave-UI**
- [x] อัปเดต API ใน UI สำหรับเชื่อมต่อกับแพลตฟอร์มภายนอก
- [x] เพิ่มฟังก์ชัน Platform API ใน `useEngine.ts` hook
- [ ] พัฒนา Code Block Processor สำหรับ `noteweave-view` เพื่ออ่านค่าพารามิเตอร์จากผู้ใช้
- [ ] สร้าง React Component สำหรับแสดงผล: `TableView.tsx` และ `BoardView.tsx`
- [ ] ปรับปรุง `useEngine.ts` เพื่อเรียกใช้ฟังก์ชัน `getViewData` ใหม่
- [ ] เชื่อมต่อ Logic เพื่อนำข้อมูลที่ได้จาก Engine มาแสดงผลใน View Components

---

## Phase 3: Interactivity & Two-Way Sync
**🎯 เป้าหมายหลัก:** ทำให้ผู้ใช้สามารถแก้ไขข้อมูลใน View และซิงค์กลับไปที่ต้นทางได้

**✅ รายการงาน (Task Checklist):**

**NoteWeave-Engine**
- [ ] เพิ่ม Logic ใน `notion.service.ts` และ `clickup.service.ts` สำหรับการเขียน/อัปเดตข้อมูลกลับไปยัง API ต้นทาง
- [ ] เพิ่มฟังก์ชันใหม่ใน `api.ts` สำหรับการอัปเดตข้อมูล (เช่น `updatePage(source, pageId, data)`)

**NoteWeave-UI**
- [ ] เพิ่ม Event Handlers ใน `BoardView.tsx` (เช่น `onCardMove`) และ `TableView.tsx` (เช่น `onCellEdit`)
- [ ] เขียน Logic ใน Component เพื่อเรียกใช้ฟังก์ชัน `updatePage` จาก `useEngine.ts` เมื่อมีการเปลี่ยนแปลงเกิดขึ้น
- [ ] (Optional) ทำ Optimistic UI Update เพื่อให้หน้าจอของผู้ใช้ตอบสนองทันทีโดยไม่ต้องรอ API

---

## Phase 4: AI-Powered Enhancements & API Gateway
**🎯 เป้าหมายหลัก:** ผสานพลัง AI เข้ากับ Data View และ เปิดให้ระบบภายนอกสามารถเชื่อมต่อได้ผ่าน API Gateway

**✅ รายการงาน (Task Checklist):**

**AI Enhancements**
- [ ] Backend: ปรับปรุง `rag.service.ts` ให้สามารถรับ "ข้อมูลบริบทเพิ่มเติม" (Structured JSON data) จาก View ได้
- [ ] Backend: พัฒนา Logic การสร้าง "Meta-Prompt" ที่รวมคำถามของผู้ใช้เข้ากับข้อมูลบริบทจาก View
- [ ] Frontend: ทำให้ `ChatPanel.tsx` "รับรู้" ถึง View ที่ผู้ใช้กำลังเปิดอยู่เพื่อใช้เป็นบริบทในการสนทนา

**API Gateway & Master Key**
- [ ] Backend: พัฒนาโมดูล Local Server (เช่น ใช้ Hono หรือ Express) เพื่อทำหน้าที่เป็น API Gateway
- [ ] Backend: เขียน Logic การจัดการ Request: ตรวจสอบ Master Key, ส่งต่อไปยัง Service ที่ถูกต้อง
- [ ] Backend: สร้างฟังก์ชันสำหรับสร้าง, จัดเก็บ, และเพิกถอน (Revoke) Master Key ของผู้ใช้
- [ ] Backend: เพิ่มฟังก์ชันใหม่ใน `api.ts` สำหรับควบคุม Gateway
- [ ] Frontend: เพิ่มหน้า UI ใน `SettingsTab.tsx` สำหรับ "API Gateway"

---

## Phase 5: Polish, Optimization, & Release
**🎯 เป้าหมายหลัก:** เตรียมโปรเจกต์ให้พร้อมสำหรับการเปิดตัวสู่สาธารณะ

**✅ รายการงาน (Task Checklist):**

**General & Monorepo**
- [ ] เขียนเอกสารคู่มือการใช้งานสำหรับผู้ใช้ทั่วไปให้สมบูรณ์
- [ ] อัปเดต `README.md` หลัก และสร้าง `CHANGELOG.md`
- [ ] ตั้งค่า Build & Release Pipeline ใน GitHub Actions สำหรับการเผยแพร่ทั้ง 2 ปลั๊กอิน
- [ ] เริ่มต้น Beta Testing กับกลุ่มผู้ใช้ขนาดเล็กเพื่อเก็บ Feedback

**NoteWeave-Engine**
- [ ] เพิ่มประสิทธิภาพการทำงาน (Performance Optimization) และการทำ Caching
- [ ] เพิ่มระบบ Error Handling และ Logging ที่ครอบคลุม
- [ ] เขียน Unit Test และ Integration Test

**NoteWeave-UI**
- [ ] ปรับปรุง UI/UX ตาม Feedback ที่ได้รับ
- [ ] ตรวจสอบและแก้ไขการแสดงผลบนอุปกรณ์ต่างๆ (Responsive Design)
- [ ] เตรียมความพร้อมสำหรับการส่งปลั๊กอินเข้าสู่ Community Plugins ของ Obsidian
