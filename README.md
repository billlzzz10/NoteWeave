# 🪶 Noteweave – AI สังเคราะห์ความรู้ส่วนตัวของคุณ ที่เชื่อมทุกเครื่องมือ

[![Build Status](https://img.shields.io/github/actions/workflow/status/USERNAME/noteweave/ci.yml?branch=main&style=for-the-badge)](https://github.com/USERNAME/noteweave/actions)
[![Latest Release](https://img.shields.io/github/v/release/USERNAME/noteweave?style=for-the-badge)](https://github.com/USERNAME/noteweave/releases)
[![MIT License](https://img.shields.io/github/license/USERNAME/noteweave?style=for-the-badge)](LICENSE)
[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&query=%24%5B'noteweave'%5D.downloads&label=downloads&style=for-the-badge&color=7B68EE)](https://obsidian.md/plugins)

> **เชื่อมต่อและสังเคราะห์องค์ความรู้ของคุณจาก Obsidian, ClickUp, Notion, และ Airtable** เปลี่ยนข้อมูลที่กระจัดกระจายให้กลายเป็นฐานความรู้หนึ่งเดียวที่พูดคุยและโต้ตอบได้ ขับเคลื่อนด้วยเทคโนโลยี Retrieval-Augmented Generation (RAG)

---

### 1. วิสัยทัศน์และหลักการสำคัญ
-   **ความเป็นส่วนตัวต้องมาก่อน (Privacy-First):** ข้อมูลของคุณจะถูกเก็บไว้ในเครื่องเป็นค่าเริ่มต้น และคุณคือผู้ควบคุมข้อมูลทั้งหมด
-   **รวมศูนย์บริบทความรู้ (Context Unification):** ทลายกำแพงข้อมูล ทำให้คุณสามารถค้นหาข้อมูลข้าม Obsidian, Notion, ClickUp และอื่นๆ ได้ในครั้งเดียว
-   **สถาปัตยกรรมแบบแยกส่วนและเป็นอิสระ (Modular & Agnostic):** ยืดหยุ่นในการเลือกใช้ AI หรือแหล่งข้อมูล โดยไม่ถูกผูกมัดกับระบบใดระบบหนึ่ง

### 2. ความสามารถหลัก
| ด้าน | ความสามารถ |
|---|---|
| **ความสามารถใน Vault** | ค้นหาและสนทนากับข้อมูลทั้ง Vault ของ Obsidian ด้วย RAG ที่ทรงพลัง |
| **การสังเคราะห์ข้ามเครื่องมือ** | เชื่อมต่อกับ Notion, ClickUp, Airtable ผ่าน Model Context Protocol (MCP) |
| **ความยืดหยุ่นของ Provider** | เลือกใช้ AI ได้ทั้ง **Local** (Ollama, LM Studio) และ **Cloud** (OpenAI, Anthropic) |
| **การทำงานร่วมกับเครื่องมือภาพ** | ใช้งานร่วมกับ Graph View, Canvas, และ Excalidraw ได้อย่างสมบูรณ์ |
| **พร้อมสำหรับระบบอัตโนมัติ** | ส่งออกผลลัพธ์เป็น JSON หรือ Markdown เพื่อใช้ใน Workflow อื่นๆ |

### 3. ตัวอย่างการใช้งานจริง
-   **ถาม:** _“ช่วยสรุปงาน ClickUp ที่มีความสำคัญสูงสุด และหาโน้ตที่เกี่ยวข้องใน Obsidian ให้หน่อย”_
-   **สร้าง:** _“สร้าง Project Brief โดยดึงข้อมูลกลยุทธ์จาก Notion มาสังเคราะห์กับข้อมูลใน Vault”_

### 4. สถาปัตยกรรม: ศูนย์กลางการสังเคราะห์ข้อมูล
![แผนภาพสถาปัตยกรรมของ Noteweave](https://raw.githubusercontent.com/USERNAME/noteweave/main/assets/architecture-diagram.png)

### 5. ทำไมต้อง Noteweave?
| คุณสมบัติ | เครื่องมืออื่น | 🪶 Noteweave |
|---|---|---|
| **บริบทของข้อมูล** | แยกขาดในแต่ละแอป | **เชื่อมถึงกันทั้งระบบ** |
| **ความเป็นส่วนตัว** | ต้องพึ่งพาคลาวด์ | **ควบคุมได้เองทั้งหมด** |
| **ผู้ให้บริการ AI** | ผูกมัดกับเจ้าใดเจ้าหนึ่ง | **เป็นอิสระ เลือกได้** |

### 6. การเริ่มต้นใช้งาน
#### สำหรับผู้ใช้ทั่วไป
1.  ติดตั้ง **Noteweave** จาก Community Plugins
2.  ไปที่ Settings → Noteweave
3.  เลือก AI Provider (Local หรือ Cloud)
4.  (ทางเลือก) เปิดใช้งาน Integrations เพื่อเชื่อมต่อกับเครื่องมือภายนอก

#### สำหรับนักพัฒนา
1.  Clone repository และติดตั้ง dependencies (`npm install`)
2.  รัน `npm run build` และคัดลอกไฟล์ไปยังโฟลเดอร์ปลั๊กอินของ Obsidian

### 7. การเชื่อมต่อกับเครื่องมือภายนอก (MCP)
Noteweave สามารถทำหน้าที่เป็น "ไคลเอนต์" เพื่อพูดคุยกับเครื่องมือภายนอกที่คุณใช้งานอยู่ (เช่น Notion, ClickUp) ผ่าน **Model Context Protocol (MCP)** ได้

**หลักการ:** คุณต้องมี "เซิร์ฟเวอร์ตัวกลาง" (MCP Server) ที่ทำหน้าที่เป็นสะพานเชื่อมไปยังเครื่องมือนั้นๆ ก่อน จากนั้น Noteweave จะเข้าไปเชื่อมต่อกับเซิร์ฟเวอร์ตัวกลางนี้

**กรณีศึกษา: เชื่อม Noteweave กับ Notion Database**
1.  **เตรียมเซิร์ฟเวอร์ปลายทาง:** ติดตั้งและรัน [notion-mcp-server](https://github.com/awkoy/notion-mcp-server) (หรือเซิร์ฟเวอร์อื่นที่รองรับ MCP)
2.  **เพิ่มการเชื่อมต่อใน Noteweave:**
    - ไปที่ `Settings` → `Noteweave` → `Integrations`
    - ในหัวข้อ **"MCP Connections"** กด **"Add New Connection"**
    - ตั้งชื่อเล่น (เช่น `งานใน Notion`) และใส่ URL ของเซิร์ฟเวอร์ (เช่น `http://localhost:3000`)
3.  **เริ่มใช้งาน:** เมื่อเชื่อมต่อสำเร็จ คุณสามารถถามคำถามที่อ้างอิงถึงข้อมูลใน Notion ได้ทันที เช่น _"จาก `งานใน Notion` มีโปรเจกต์ไหนที่ยังไม่เสร็จบ้าง?"_

### 8. แผนการพัฒนา (Roadmap)
![แผนภาพ Roadmap ของ Noteweave](https://raw.githubusercontent.com/USERNAME/noteweave/main/assets/roadmap-diagram.png)

### 9. การมีส่วนร่วม (Contributing)
เรายินดีต้อนรับการมีส่วนร่วมทุกรูปแบบผ่านทาง GitHub Repository
-   **Repo:** `https://github.com/USERNAME/noteweave`
-   **Issues:** ใช้ GitHub Issue Tracker
-   **Community:** พูดคุยกันได้ที่ Obsidian Forum หรือ GitHub Discussions

### 10. สัญญาอนุญาต (License)
โปรเจกต์นี้อยู่ภายใต้สัญญาอนุญาตแบบ **MIT License**
