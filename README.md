# 🪶 Noteweave – AI สังเคราะห์ความรู้ส่วนตัวของคุณ ที่เชื่อมทุกเครื่องมือ

[![Build Status](https://img.shields.io/github/actions/workflow/status/USERNAME/noteweave/ci.yml?branch=main&style=for-the-badge)](https://github.com/USERNAME/noteweave/actions)
[![Latest Release](https://img.shields.io/github/v/release/USERNAME/noteweave?style=for-the-badge)](https://github.com/USERNAME/noteweave/releases)
[![MIT License](https://img.shields.io/github/license/USERNAME/noteweave?style=for-the-badge)](LICENSE)
[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&query=%24%5B'noteweave'%5D.downloads&label=downloads&style=for-the-badge&color=7B68EE)](https://obsidian.md/plugins)

> **เชื่อมต่อและสังเคราะห์องค์ความรู้ของคุณจาก Obsidian, ClickUp, Notion, และ Airtable** เปลี่ยนข้อมูลที่กระจัดกระจายให้กลายเป็นฐานความรู้หนึ่งเดียวที่พูดคุยและโต้ตอบได้ ขับเคลื่อนด้วยเทคโนโลยี Retrieval-Augmented Generation (RAG)

---

### 1. วิสัยทัศน์และหลักการสำคัญ

Noteweave ถูกออกแบบมาเพื่อเป็นศูนย์กลางการสังเคราะห์ความรู้ด้วย AI ของคุณ โดยยึดหลักการสำคัญ 3 ข้อ:

-   **ความเป็นส่วนตัวต้องมาก่อน (Privacy-First):** ข้อมูลของคุณจะถูกเก็บไว้ในเครื่องเป็นค่าเริ่มต้น การประมวลผลทั้งหมดเกิดขึ้นบนคอมพิวเตอร์ของคุณเอง เว้นแต่คุณจะเลือกใช้ AI Provider บนคลาวด์ด้วยตัวเอง คุณคือผู้ควบคุมข้อมูลทั้งหมด
-   **รวมศูนย์บริบทความรู้ (Context Unification):** ทลายกำแพงข้อมูลที่แยกจากกัน Noteweave ช่วยให้คุณถามคำถามและรับคำตอบที่สังเคราะห์ขึ้นจากทั้ง Obsidian vault, งานใน ClickUp, หน้าเอกสารใน Notion, และฐานข้อมูลใน Airtable ได้ภายในการค้นหาครั้งเดียว
-   **สถาปัตยกรรมแบบแยกส่วนและเป็นอิสระ (Modular & Agnostic):** ระบบถูกสร้างขึ้นให้ยืดหยุ่น คุณสามารถสลับโมเดล AI (local หรือ cloud), ผู้ให้บริการ embedding, หรือเพิ่มแหล่งข้อมูลใหม่ๆ ได้อย่างง่ายดาย โดยไม่ถูกผูกมัดกับระบบใดระบบหนึ่ง

### 2. ความสามารถหลัก

| ด้าน                         | ความสามารถ                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| **ความสามารถใน Vault** | ค้นหาและสนทนากับข้อมูลทั้ง Vault ของ Obsidian ด้วย RAG ที่ทรงพลัง รองรับทั้งโน้ต, PDF, และรูปภาพ |
| **การสังเคราะห์ข้ามเครื่องมือ** | เชื่อมต่อและอ้างอิงข้อมูลระหว่าง Obsidian กับเครื่องมือภายนอกอย่าง ClickUp, Notion, และ Airtable ผ่าน Model Context Protocol (MCP) |
| **ความยืดหยุ่นของ Provider** | เลือก AI Provider ที่คุณต้องการ: **Local** (Ollama, LM Studio, WASM) หรือ **Cloud** (OpenAI, Anthropic, Google Gemini) |
| **การทำงานร่วมกับเครื่องมือภาพ** | ทำงานร่วมกับ **Graph View, Canvas, และ Excalidraw** ได้อย่างสมบูรณ์ เพื่อใช้ส่วนที่เลือก (selection) เป็นบริบทในการค้นหา |
| **พร้อมสำหรับระบบอัตโนมัติ** | ส่งออกผลลัพธ์การค้นหาในรูปแบบ **JSON หรือ Markdown** ที่มีโครงสร้างชัดเจน เพื่อนำไปใช้ต่อใน Workflow อัตโนมัติกับ Templater หรือ QuickAdd |

### 3. ตัวอย่างการใช้งานจริง

-   **ถาม:** _“ช่วยสรุปงาน ClickUp ที่มีความสำคัญสูงสุดของโปรเจกต์ 'Q4 Launch' และหาโน้ตที่เกี่ยวข้องใน Obsidian ให้หน่อย”_
-   **สร้าง:** _“สร้าง Project Brief ในโน้ตใหม่ โดยดึงข้อมูลกลยุทธ์จากหน้า Notion 'Project Phoenix' มาสังเคราะห์กับข้อมูลสเปคทางเทคนิคใน Vault ของฉัน”_
-   **สังเคราะห์:** _“ฟีดแบ็กสำคัญจากลูกค้าใน Airtable เดือนที่แล้วมีอะไรบ้าง และมันสอดคล้องกับบันทึกการประชุมใน Obsidian ของฉันอย่างไร?”_

### 4. สถาปัตยกรรม: ศูนย์กลางการสังเคราะห์ข้อมูล

สถาปัตยกรรมของ Noteweave ถูกออกแบบมาเพื่อความยืดหยุ่นและการควบคุม โดยเชื่อมต่อแหล่งข้อมูลต่างๆ ผ่านเลเยอร์กลาง

![แผนภาพสถาปัตยกรรมของ Noteweave](https://raw.githubusercontent.com/USERNAME/noteweave/main/assets/architecture-diagram.png)

### 5. ทำไมต้อง Noteweave?

| คุณสมบัติ                 | เครื่องมืออื่นและปลั๊กอินทั่วไป         | 🪶 Noteweave                                        |
| -------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| **บริบทของข้อมูล** | แยกขาดและทำงานได้แค่ในแอปของตัวเอง          | **บริบทที่เชื่อมถึงกัน** ทั่วทั้งระบบการทำงานของคุณ  |
| **โมเดลความเป็นส่วนตัว** | ต้องพึ่งพาคลาวด์และส่งข้อมูลออกไปเสมอ      | **เน้นความเป็นส่วนตัว** ควบคุมการประมวลผลได้เองทั้งหมด  |
| **ผู้ให้บริการ AI** | ถูกผูกมัดกับผู้ให้บริการรายเดียว (เช่น OpenAI) | **เป็นอิสระ** รองรับทั้งโมเดล Local และ Cloud       |
| **โปรโตคอลการเชื่อมต่อ** | เป็นระบบปิด เชื่อมต่อแบบเฉพาะกิจ          | **เป็นระบบเปิดและต่อยอดได้** ผ่าน Model Context Protocol (MCP) |
| **กรรมสิทธิ์ในข้อมูล** | ข้อมูลอยู่ในฐานข้อมูลของผู้ให้บริการอื่น     | **คุณเป็นเจ้าของข้อมูล** โดยมี Obsidian เป็นศูนย์กลาง   |

### 6. การเริ่มต้นใช้งาน

#### สำหรับผู้ใช้ทั่วไป (วิธีที่แนะนำ)
1.  ติดตั้ง **Noteweave** จาก Community Plugins ในโปรแกรม Obsidian
2.  ไปที่ Settings → Noteweave
3.  **เลือก AI Provider:** เลือกตัวเลือก Local เช่น Ollama เพื่อความเป็นส่วนตัวสูงสุด หรือใส่ API key สำหรับ Provider บนคลาวด์
4.  **เปิดใช้งาน Integrations:** เชื่อมต่อกับ ClickUp, Notion, หรือ Airtable เพื่อปลดล็อกความสามารถในการค้นหาข้ามเครื่องมือ
5.  เริ่มต้นการสนทนาและถามคำถามที่เชื่อมโยงทุกองค์ความรู้ของคุณได้ทันที!

#### สำหรับนักพัฒนา
1.  Clone a repository: `git clone https://github.com/USERNAME/noteweave.git`
2.  ติดตั้ง dependencies: `npm install`
3.  รัน build script: `npm run build`
4.  คัดลอกไฟล์ `main.js`, `manifest.json`, และ `styles.css` ไปยัง `/.obsidian/plugins/noteweave/` ใน vault ของคุณ
5.  รีโหลด Obsidian และเปิดใช้งานปลั๊กอินในการตั้งค่า

### 7. แผนการพัฒนา (Roadmap)

เรามุ่งเน้นการสร้างแกนหลักที่เสถียรก่อน แล้วจึงขยายการเชื่อมต่อไปยังส่วนอื่นๆ

![แผนภาพ Roadmap ของ Noteweave](https://raw.githubusercontent.com/USERNAME/noteweave/main/assets/roadmap-diagram.png)

### 8. การมีส่วนร่วม (Contributing)

Noteweave เป็นโปรเจกต์โอเพนซอร์ส เรายินดีต้อนรับการมีส่วนร่วมทุกรูปแบบ ตั้งแต่การรายงานบั๊ก, การเสนอฟีเจอร์ใหม่ๆ, ไปจนถึงการส่งโค้ดและช่วยปรับปรุงเอกสาร โปรดอ่านรายละเอียดเพิ่มเติมในไฟล์ `CONTRIBUTING.md`

-   **Repo:** `https://github.com/USERNAME/noteweave`
-   **Issues:** ใช้ GitHub Issue Tracker ในการแจ้งปัญหา
-   **Community:** พูดคุยกันได้ที่ Obsidian Forum หรือ GitHub Discussions

### 9. สัญญาอนุญาต (License)

โปรเจกต์นี้อยู่ภายใต้สัญญาอนุญาตแบบ **MIT License** ดูรายละเอียดเพิ่มเติมได้ในไฟล์ `LICENSE`

