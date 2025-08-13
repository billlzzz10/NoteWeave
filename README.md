# 🪶 Noteweave – AI สังเคราะห์ความรู้ส่วนตัวของคุณ ที่เชื่อมทุกเครื่องมือ

[![Build Status](https://img.shields.io/github/actions/workflow/status/USERNAME/noteweave/ci.yml?branch=main&style=for-the-badge)](https://github.com/USERNAME/noteweave/actions)
[![Latest Release](https://img.shields.io/github/v/release/USERNAME/noteweave?style=for-the-badge)](https://github.com/USERNAME/noteweave/releases)
[![MIT License](https://img.shields.io/github/license/USERNAME/noteweave?style=for-the-badge)](LICENSE)
[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&query=%24%5B'noteweave'%5D.downloads&label=downloads&style=for-the-badge&color=7B68EE)](https://obsidian.md/plugins)

> **เชื่อมต่อและสังเคราะห์องค์ความรู้ของคุณจาก Obsidian, ClickUp, Notion, และ Airtable** เปลี่ยนข้อมูลที่กระจัดกระจายให้กลายเป็นฐานความรู้หนึ่งเดียวที่พูดคุยและโต้ตอบได้ ขับเคลื่อนด้วยเทคโนโลยี Retrieval-Augmented Generation (RAG)
> 

---

## 1. วิสัยทัศน์และหลักการสำคัญ

<aside>
🔒

**ความเป็นส่วนตัวต้องมาก่อน (Privacy-First):** ข้อมูลของคุณจะถูกเก็บไว้ในเครื่องเป็นค่าเริ่มต้น และคุณคือผู้ควบคุมข้อมูลทั้งหมด

</aside>

<aside>
🔗

**รวมศูนย์บริบทความรู้ (Context Unification):** ทลายกำแพงข้อมูล ทำให้คุณสามารถค้นหาข้อมูลข้าม Obsidian, Notion, ClickUp และเครื่องมืออื่นๆ ได้ในครั้งเดียว

</aside>

<aside>
🧩

**สถาปัตยกรรมแบบแยกส่วนและเป็นอิสระ (Modular & Agnostic):** ยืดหยุ่นในการเลือกใช้ AI หรือแหล่งข้อมูล โดยไม่ถูกผูกมัดกับระบบใดระบบหนึ่ง

</aside>

---

## 2. ความสามารถหลัก

| **ด้าน** | **ความสามารถ** |
| --- | --- |
| **ความสามารถใน Vault** | ค้นหาและสนทนากับข้อมูลทั้ง Vault ของ Obsidian ด้วย RAG ที่ทรงพลัง |
| **การสังเคราะห์ข้ามเครื่องมือ** | เชื่อมต่อกับ Notion, ClickUp, Airtable ผ่าน Model Context Protocol (MCP) |
| **ความยืดหยุ่นของ Provider** | เลือกใช้ AI ได้ทั้ง **Local** (Ollama, LM Studio) และ **Cloud** (OpenAI, Anthropic) |
| **การทำงานร่วมกับเครื่องมือภาพ** | ใช้งานร่วมกับ Graph View, Canvas, และ Excalidraw ได้อย่างสมบูรณ์ |
| **พร้อมสำหรับระบบอัตโนมัติ** | ส่งออกผลลัพธ์เป็น JSON หรือ Markdown เพื่อใช้ใน Workflow อัตโนมัติอื่นๆ |

---

## 3. ตัวอย่างการใช้งานจริง

<aside>
💬

**ถาม:** *"ช่วยสรุปงานจาก ClickUp ที่มีความสำคัญสูงสุด และหาโน้ตที่เกี่ยวข้องใน Obsidian ให้หน่อย"*

</aside>

<aside>
📝

**สร้าง:** *"สร้าง Project Brief โดยดึงข้อมูลกลยุทธ์จาก Notion มาสังเคราะห์กับข้อมูลงานวิจัยใน Vault"*

</aside>

---

## 4. สถาปัตยกรรม: ศูนย์กลางการสังเคราะห์ข้อมูล

```
flowchart TD
    User[👤 ผู้ใช้] --> NW[🪶 NoteWeave Core]
    
    subgraph "Data Sources"
        OB[📚 Obsidian Vault]
        NO[🗂️ Notion Database]
        CU[✅ ClickUp Tasks]
        AT[📊 Airtable Records]
    end
    
    subgraph "AI Providers"
        LOCAL[🖥️ Local AI<br/>Ollama / LM Studio]
        CLOUD[☁️ Cloud AI<br/>OpenAI / Anthropic]
    end
    
    NW -->|MCP| NO
    NW -->|MCP| CU
    NW -->|MCP| AT
    NW -->|RAG| OB
    
    NW --> LOCAL
    NW --> CLOUD
    
    LOCAL --> Result[✨ สังเคราะห์ความรู้]
    CLOUD --> Result
    
    Result --> Export[📤 Export: JSON/Markdown]
    
    style NW fill:#e8f5e8
    style User fill:#fce4ec
    style Result fill:#fff3e0
```

---

## 5. ทำไมต้อง NoteWeave?

| **คุณสมบัติ** | **เครื่องมืออื่น** | **🪶 NoteWeave** |
| --- | --- | --- |
| **บริบทของข้อมูล** | แยกขาดและทำงานได้แค่ในแอปของตัวเอง | **เชื่อมถึงกันทั้งระบบ** |
| **ความเป็นส่วนตัว** | ต้องพึ่งพาคลาวด์และส่งข้อมูลให้ภายนอกเสมอ | **ควบคุมได้เองทั้งหมด** |
| **ผู้ให้บริการ AI** | ถูกผูกมัดกับผู้ให้บริการรายใดรายหนึ่ง | **เป็นอิสระ เลือกได้** |

---

## 6. การเริ่มต้นใช้งาน

### สำหรับผู้ใช้ทั่วไป

1. ติดตั้ง **NoteWeave** จาก Community Plugins ในโปรแกรม Obsidian
2. ไปที่ `Settings` → `NoteWeave`
3. เลือก AI Provider ที่คุณต้องการ (Local หรือ Cloud)
4. (ทางเลือก) เปิดใช้งาน Integrations เพื่อเชื่อมต่อกับเครื่องมือภายนอก

### สำหรับนักพัฒนา

**ข้อกำหนดเบื้องต้น:** ติดตั้ง Node.js (เวอร์ชัน 18 ขึ้นไป) และ `npm`

1. Clone a repository: `git clone <repository-url>`
2. เข้าไปในโฟลเดอร์โปรเจกต์: `cd NoteWeave`
3. ติดตั้ง dependencies: `npm install`
4. รัน build script: `npm run build`
5. คัดลอกไฟล์ `main.js`, `manifest.json`, และ `styles.css` ไปยัง vault ของคุณในโฟลเดอร์ `/.obsidian/plugins/noteweave/`
6. ใน Obsidian, ไปที่ `Settings` → `Community plugins` แล้วเปิดใช้งาน NoteWeave

---

## 7. การเชื่อมต่อกับเครื่องมือภายนอก (MCP)

<aside>
🔗

NoteWeave สามารถทำหน้าที่เป็น "ไคลเอนต์" เพื่อพูดคุยกับเครื่องมือภายนอกที่คุณใช้งานอยู่ (เช่น Notion, ClickUp) ผ่าน **Model Context Protocol (MCP)**

</aside>

### กรณีศึกษา: เชื่อม NoteWeave กับ Notion Database

**1. เปิดใช้งาน MCP ใน Notion:**

- ไปที่ `Settings & Members` → `Connections` ใน Notion แล้วเปิดใช้งาน "MCP Access"
- กำหนดสิทธิ์ให้เข้าถึง Database ที่คุณต้องการ
- คัดลอก **`MCP URL`** และ **`API Key`** ที่ Notion สร้างให้

**2. เพิ่มการเชื่อมต่อใน NoteWeave:**

- ไปที่ `Settings` → `NoteWeave` → `Integrations`
- กด **"Add Connection"** แล้วนำข้อมูลจากขั้นตอนที่ 1 มากรอก

**3. เริ่มใช้งาน:** เมื่อเชื่อมต่อสำเร็จ คุณสามารถเริ่มถามคำถามที่อ้างอิงถึงข้อมูลใน Notion ได้ทันที

---

## 8. แผนการพัฒนา (Roadmap)

```
gantt
    title NoteWeave Development Roadmap
    dateFormat  YYYY-MM-DD
    section Core Features
    Basic RAG Implementation    :done,    core1, 2025-08-01, 2025-08-05
    MCP Integration            :active,  core2, 2025-08-06, 2025-08-15
    Multi-Provider Support     :         core3, 2025-08-16, 2025-08-25
    section Integrations
    Notion & ClickUp           :         int1, 2025-08-20, 2025-08-30
    Airtable & Custom APIs     :         int2, 2025-09-01, 2025-09-10
    section Enhancement
    Advanced UI & UX           :         enh1, 2025-09-05, 2025-09-15
    Performance Optimization   :         enh2, 2025-09-12, 2025-09-22
    section Release
    Beta Testing               :         rel1, 2025-09-20, 2025-09-30
    Public Release             :         rel2, 2025-10-01, 2025-10-05
```

---

## 9. การมีส่วนร่วม (Contributing)

เรายินดีต้อนรับการมีส่วนร่วมทุกรูปแบบผ่านทาง GitHub Repository ของเรา

- 📚 **Repository:** (เพิ่ม URL หลังสร้าง repo)
- 🐛 **แจ้งปัญหา (Issues):** GitHub Issues
- 💬 **พูดคุย (Community):** เข้าร่วมได้ที่ GitHub Discussions หรือ Obsidian Forum

---

## 10. สัญญาอนุญาต (License)

<aside>
⚖️

โปรเจกต์นี้อยู่ภายใต้สัญญาอนุญาตแบบ **MIT License** ดูรายละเอียดเพิ่มเติมได้ในไฟล์ `LICENSE`

</aside>

---

> 🚀 **พร้อมเริ่มต้นแล้ว?** ติดตาม development ได้ที่ GitHub และร่วมพูดคุยในชุมชน Obsidian!"
>
