# NoteWeave Development Setup

ไฟล์นี้อธิบายการตั้งค่าสภาพแวดล้อมการพัฒนาสำหรับโปรเจค NoteWeave

## 1. การตั้งค่า VS Code

### 1.1 ส่วนขยาย (Extensions) ที่จำเป็น

- **ESLint**: สำหรับตรวจสอบโค้ด TypeScript
- **Prettier**: สำหรับจัดรูปแบบโค้ด
- **TypeScript**: สำหรับการพัฒนาด้วย TypeScript
- **Jupyter**: สำหรับวิเคราะห์ข้อมูลและทำ RAG ผ่าน Notebook
- **Python**: สำหรับการพัฒนาส่วน RAG
- **Markdown All in One**: สำหรับทำงานกับ Markdown
- **Mermaid**: สำหรับสร้างแผนภาพใน Markdown

### 1.2 การตั้งค่าพื้นฐาน

สร้างหรือแก้ไขไฟล์ `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "eslint.validate": [
    "javascript",
    "typescript",
    "typescriptreact"
  ],
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/dist": true,
    "**/.cache": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true
  },
  "jupyter.notebookFileRoot": "${workspaceFolder}",
  "python.analysis.extraPaths": [
    "${workspaceFolder}/python_analysis"
  ]
}
```

## 2. การตั้งค่า Terminal

### 2.1 การตั้งค่า PowerShell

เพิ่มโปรไฟล์ PowerShell สำหรับ NoteWeave โดยสร้างไฟล์ `Microsoft.PowerShell_profile.ps1`:

```powershell
# NoteWeave PowerShell Profile

# แสดงข้อความต้อนรับ
Write-Host "NoteWeave Development Environment" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# กำหนด alias สำหรับคำสั่งที่ใช้บ่อย
function Start-NoteWeave-Engine { cd F:\repos\NoteWeave\NoteWeave-Engine; npm start }
function Start-NoteWeave-UI { cd F:\repos\NoteWeave\NoteWeave-UI; npm start }

New-Alias -Name nwe -Value Start-NoteWeave-Engine
New-Alias -Name nwu -Value Start-NoteWeave-UI

# Environment Variables สำหรับ Ollama
$env:OLLAMA_HOST = "http://localhost:11434"

# ฟังก์ชันช่วยเหลือสำหรับ NoteWeave
function Get-NoteWeaveHelp {
    Write-Host "`nNoteWeave Commands:" -ForegroundColor Cyan
    Write-Host "  nwe       - Start NoteWeave Engine"
    Write-Host "  nwu       - Start NoteWeave UI"
    Write-Host "  nw-lm     - Start LM Studio"
    Write-Host "  nw-sync   - Sync all repositories"
    Write-Host "  nw-update - Update all dependencies"
    Write-Host ""
}

function Start-LMStudio {
    # Replace with actual path to LM Studio
    Start-Process "C:\Program Files\LM Studio\LM Studio.exe"
}

New-Alias -Name nw-lm -Value Start-LMStudio
New-Alias -Name nw-help -Value Get-NoteWeaveHelp

# แสดงคำสั่งที่มีให้ใช้งาน
Get-NoteWeaveHelp
```

### 2.2 การตั้งค่า Ollama (กรณียังต้องการใช้ Ollama)

สร้างสคริปต์สำหรับการตั้งค่า Ollama เพื่อจัดการปัญหาหน่วยความจำ:

```powershell
# Set Ollama memory limits
$env:OLLAMA_GPU_LAYERS=0  # Use CPU mode if GPU has memory issues
# $env:OLLAMA_MODEL="llama3.1:8b"  # Default model
```

## 3. การติดตั้งเครื่องมือที่จำเป็น

### 3.1 Node.js และ NPM

```
npm install -g typescript ts-node nodemon
```

### 3.2 Python และ Libraries สำหรับ RAG

```
pip install jupyter pandas numpy matplotlib seaborn plotly networkx scikit-learn sentence-transformers
```

### 3.3 LM Studio

ดาวน์โหลดและติดตั้ง LM Studio จาก: https://lmstudio.ai/

### 3.4 n8n

ติดตั้ง n8n สำหรับการทดสอบ workflow automation:

```
npm install -g n8n
```

### 3.5 Supabase CLI

ติดตั้ง Supabase CLI สำหรับการพัฒนากับ Supabase:

```
npm install -g supabase
```

## 4. การตั้งค่า Workflow

### 4.1 การเริ่มต้นพัฒนา

1. เปิด Terminal และรัน:
   ```
   cd F:\repos\NoteWeave
   npm install
   ```

2. เริ่มต้น NoteWeave Engine:
   ```
   cd NoteWeave-Engine
   npm start
   ```

3. ในอีก Terminal หนึ่ง เริ่มต้น NoteWeave UI:
   ```
   cd NoteWeave-UI
   npm start
   ```

### 4.2 การวิเคราะห์ข้อมูล

1. เปิด Jupyter Notebook:
   ```
   cd F:\repos\NoteWeave
   jupyter notebook
   ```

2. เปิดไฟล์ `notebooks/noteweave_analysis.ipynb`
