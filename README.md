# Resume Site — Paradon Lambensa

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
│       ├── portrait.png    ← รูปโปรไฟล์ (crop เป็นจัตุรัส 640×640 พอดีวงแหวน)
│       └── favicon.svg      ← ไอคอนแท็บ (แก้อักษรย่อข้างใน)
├── .nojekyll               ← บอก GitHub Pages ไม่ต้องประมวลผลด้วย Jekyll
└── README.md
```

## โครงหน้าเว็บ

`01 About` · `02 Projects` · `03 Activities` · `04 Skills` · `05 Education` · `06 Contact`

## เริ่มแก้ยังไง

เนื้อหาเป็นข้อมูลจริงแล้ว เหลือจุดที่ยังต้องเติม ซึ่งมีคอมเมนต์ **`[แก้]`** กำกับไว้
เปิด `index.html` กด Ctrl+F หา `[แก้]` ไล่ดูได้เลย ตอนนี้เหลือ:

- **PSU Cyber Security** — ปีที่ไปแข่ง ประเภทการแข่ง บทบาทในทีม และผลการแข่ง
- **Education** — ปีที่เข้า/คาดว่าจบ และ GPA ถ้าอยากใส่
- **ลิงก์ติดต่อ** — ตอนนี้มีแค่ GitHub จะเพิ่ม LinkedIn ก็ก๊อป `<li>` มาเติม
- **`og:url` / `og:image`** — ชี้ไป GitHub Pages ไว้แล้ว ถ้า deploy ที่อื่นต้องแก้

เพิ่มผลงาน: ก๊อป `<article class="card">` ทั้งก้อน
เพิ่มกิจกรรม/ประสบการณ์: ก๊อป `<li class="job">` ทั้งก้อน

> ถ้าได้งานฝึกงานแล้ว แนะนำให้เพิ่ม section `Experience` ไว้ก่อน `Projects`
> โดยก๊อปโครง `<section class="section">` ของ Activities มาทั้งก้อน แล้วไล่เลขหัวข้อใหม่
> (`section__num`) กับเพิ่มลิงก์ใน nav ให้ตรงลำดับด้วย — scroll-spy อ่านลำดับจาก nav

### สองภาษา (ไทย / อังกฤษ)

ข้อความที่ต้องแปลเก็บไว้คู่กันใน HTML แบบนี้ — แก้ทั้งสองอัน:

```html
<span lang="en">Looking for an internship</span><span lang="th">กำลังหาที่ฝึกงาน</span>
```

ชื่อคน ชื่อโปรเจค และชื่อเทคโนโลยี ไม่ต้องแปล ปล่อยไว้อันเดียวได้เลย

CSS จะซ่อนภาษาที่ไม่ได้เลือกให้เอง (ดู `:root[lang="en"] [lang="th"]` ใน `style.css`)
ปุ่มสลับอยู่บน nav และจำภาษาที่เลือกไว้ ถ้ายังไม่เคยเลือกจะเดาจากภาษาเบราว์เซอร์

> **กฎข้อเดียวที่ห้ามผิด:** `class="reveal"` ต้องอยู่บน element ที่ครอบ span ภาษาไว้
> ห้ามเอาไปแปะบน span ภาษาเอง เพราะ IntersectionObserver ไม่ยิงใส่ element ที่
> `display:none` ตอนโหลด — พอสลับภาษาข้อความจะโผล่มาแบบโปร่งใสค้างอยู่

อยากใช้ภาษาเดียว: ลบ span ของอีกภาษาออกให้หมด แล้วลบปุ่ม `#langToggle` ใน nav ทิ้ง

ชื่อแท็บของแต่ละภาษาอยู่ที่ `data-title-en` / `data-title-th` บนแท็ก `<html>`

### เปลี่ยนสี

แก้ที่ `:root` ใน `assets/css/style.css` ที่เดียว — มีชุดสีสองชุด (สว่าง/มืด)
ตัวที่เห็นผลชัดสุดคือ `--accent` (ตอนนี้เป็นสีแดง `#d7352b`)

## ดูผลตอนแก้

เปิด `index.html` ด้วยเบราว์เซอร์ตรงๆ ได้เลย หรือถ้าอยากรันเป็นเซิร์ฟเวอร์:

```bash
python -m http.server 5173
```

แล้วเปิด http://localhost:5173

## ที่มีให้แล้ว

- **สองภาษา ไทย/อังกฤษ** — สลับได้จาก nav จำค่าไว้ ครั้งแรกเดาจากภาษาเบราว์เซอร์ ข้อความทั้งสองภาษาอยู่ใน HTML จริง ไม่ได้ render ด้วย JS
- **ฉากหลังสามชั้น** — แสงสีเบลอสองดวงลอยช้า ๆ, เส้นกริดแนวตั้งที่ล็อกตรงกับคอลัมน์เนื้อหาจริง, และเกรนกระดาษบาง ๆ ทั้งหมดอยู่ใน `.bg` เป็น `position:fixed` เลยรู้สึกว่าเนื้อหาลอยอยู่เหนือมันตอนเลื่อน
- **ไฟส่องตามเมาส์** ใน hero + รูปโปรไฟล์ขยับช้ากว่าหน้าเว็บนิดหน่อยตอนเลื่อน (ปิดเองถ้าตั้ง reduce motion หรือเป็นจอสัมผัส)
- **โหมดสว่าง/มืด** — ตามค่าระบบ กดสลับเองได้ และจำค่าไว้
- **Download CV** — ปุ่มนี้เรียก `window.print()` ซึ่งมี print stylesheet จัดหน้าให้เป็น CV แบบพอดีกระดาษ (ซ่อน nav/ปุ่ม, ย่อรูปเหลือ 82pt, บีบผลงานเป็น 2 คอลัมน์, พิมพ์ URL ต่อท้ายลิงก์) — กด Ctrl+P แล้วเลือก "Save as PDF" พิมพ์ออกมาเป็นภาษาที่เลือกอยู่ตอนนั้น
- **Scroll-spy** — เมนูด้านบนไฮไลต์ section ที่กำลังดูอยู่ ใช้ "เส้นอ่าน" ที่ 20% ของจอ ไม่ใช่ขอบบน เพราะ section ท้าย ๆ ของหน้าสั้นเลื่อนไปชิดบนไม่ได้ และจะไม่มีทางถูกไฮไลต์เลย
- **Progress bar** ด้านบนสุด + animation ตอน scroll (ปิดเองอัตโนมัติถ้าผู้ใช้ตั้งค่า reduce motion)
- **Responsive** — ตรวจแล้วที่ 375px และ 1280px ไม่มี scroll แนวนอน
- **SEO** — meta description, Open Graph, JSON-LD `Person`
- **ใช้ได้แม้ JS พัง** — เนื้อหาทั้งหมดอยู่ใน HTML ตรงๆ ไม่ได้ render ด้วย JS

## Deploy ขึ้น GitHub Pages

repo อยู่ที่ https://github.com/paradonlambensa/resume-site แล้ว เหลือแค่เปิด Pages:

**Settings → Pages → Source: Deploy from a branch → main / (root)**

รอสักครู่จะได้ URL `https://paradonlambensa.github.io/resume-site/`
ซึ่งตรงกับที่ตั้งไว้ใน `og:url` และ JSON-LD อยู่แล้ว ไม่ต้องแก้อะไรเพิ่ม

ครั้งต่อ ๆ ไปแค่ push ก็ deploy เอง:

```bash
git add -A
git commit -m "update resume"
git push
```

ทางเลือกอื่น: Netlify หรือ Vercel — ลากโฟลเดอร์นี้ทั้งอันไปวางได้เลย ไม่ต้องตั้งค่า build อะไร
