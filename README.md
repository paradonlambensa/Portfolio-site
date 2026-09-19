# Resume Site

เว็บ resume / portfolio หน้าเดียว เขียนด้วย HTML + CSS + JavaScript ล้วน
ไม่มี framework ไม่มี build step ไม่มี dependency — เปิดไฟล์ `index.html` ก็ใช้ได้เลย

## โครงไฟล์

```
resume-site/
├── index.html              ← เนื้อหาทั้งหมดอยู่ในไฟล์นี้
├── assets/
│   ├── css/style.css       ← สไตล์ทั้งหมด (สีอยู่ใน :root ด้านบนสุด)
│   ├── js/main.js          ← theme toggle, scroll-spy, animation, copy email
│   └── img/
│       ├── portrait.svg    ← รูป placeholder — เปลี่ยนเป็นรูปจริง
│       └── favicon.svg     ← ไอคอนแท็บ (แก้อักษรย่อข้างใน)
├── .nojekyll               ← บอก GitHub Pages ไม่ต้องประมวลผลด้วย Jekyll
└── README.md
```

## เริ่มแก้ยังไง

เนื้อหาตอนนี้เป็นข้อมูลตัวอย่างทั้งหมด **ทุกจุดที่ต้องแก้มีคอมเมนต์ `[แก้]` กำกับไว้**
เปิด `index.html` แล้วกด Ctrl+F หา `[แก้]` ไล่แก้ทีละจุดได้เลย

ลำดับที่แนะนำ:

1. `<title>` และ meta tags บนสุด — ชื่อ + ตำแหน่ง
2. Hero — ชื่อ, ตำแหน่ง, ประโยคแนะนำตัว, อีเมล, ลิงก์โซเชียล
3. About → Experience → Projects → Skills → Education → Contact
4. JSON-LD ท้ายไฟล์ — ข้อมูลเดียวกัน แต่ให้ Google อ่าน
5. `assets/img/favicon.svg` — เปลี่ยน `YN` เป็นอักษรย่อของคุณ
6. `assets/img/portrait.svg` — ลบทิ้งแล้ววางรูปจริง จากนั้นแก้ `src` ใน hero

เพิ่มงาน/ผลงานใหม่: ก๊อปบล็อก `<li class="job">` หรือ `<article class="card">` ทั้งก้อนแล้วแก้ข้างใน

### เปลี่ยนสี

แก้ที่ `:root` ใน `assets/css/style.css` ที่เดียว — มีชุดสีสองชุด (สว่าง/มืด)
ตัวที่เห็นผลชัดสุดคือ `--accent` (ตอนนี้เป็นสีแดง `#d7352b`)

### ใช้ภาษาไทย

ฟอนต์ไทย (IBM Plex Sans Thai) โหลดมาให้แล้ว พิมพ์ไทยลงไปได้เลย
ถ้าเนื้อหาเป็นไทยทั้งหน้า เปลี่ยน `<html lang="en">` เป็น `<html lang="th">` ด้วย

## ดูผลตอนแก้

เปิด `index.html` ด้วยเบราว์เซอร์ตรงๆ ได้เลย หรือถ้าอยากรันเป็นเซิร์ฟเวอร์:

```bash
python -m http.server 5173
```

แล้วเปิด http://localhost:5173

## ที่มีให้แล้ว

- **โหมดสว่าง/มืด** — ตามค่าระบบ กดสลับเองได้ และจำค่าไว้
- **Download CV** — ปุ่มนี้เรียก `window.print()` ซึ่งมี print stylesheet จัดหน้าให้เป็น CV แบบพอดีกระดาษ (ซ่อน nav/ปุ่ม/รูป, บีบ 2 คอลัมน์, พิมพ์ URL ต่อท้ายลิงก์) — กด Ctrl+P แล้วเลือก "Save as PDF"
- **Scroll-spy** — เมนูด้านบนไฮไลต์ section ที่กำลังดูอยู่
- **Progress bar** ด้านบนสุด + animation ตอน scroll (ปิดเองอัตโนมัติถ้าผู้ใช้ตั้งค่า reduce motion)
- **Responsive** — ตรวจแล้วที่ 375px และ 1280px ไม่มี scroll แนวนอน
- **SEO** — meta description, Open Graph, JSON-LD `Person`
- **ใช้ได้แม้ JS พัง** — เนื้อหาทั้งหมดอยู่ใน HTML ตรงๆ ไม่ได้ render ด้วย JS

## Deploy ขึ้น GitHub Pages

```bash
git add -A
git commit -m "my resume"
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

จากนั้นในหน้า repo → **Settings → Pages → Source: Deploy from a branch → main / (root)**
รอสักครู่จะได้ URL `https://<user>.github.io/<repo>/`

อย่าลืมกลับมาแก้ `og:url` กับ `og:image` ใน `index.html` ให้เป็น URL จริง
ไม่งั้นตอนแชร์ลิงก์จะไม่ขึ้นรูปตัวอย่าง

> ถ้าอยากได้ URL สั้นแบบ `https://<user>.github.io/` ให้ตั้งชื่อ repo เป็น `<user>.github.io`

ทางเลือกอื่น: Netlify หรือ Vercel — ลากโฟลเดอร์นี้ทั้งอันไปวางได้เลย ไม่ต้องตั้งค่า build อะไร
