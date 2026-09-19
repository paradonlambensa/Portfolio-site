/* ==========================================================================
   RESUME SITE — behaviour
   ทุกอย่างเป็น optional enhancement: ถ้าไฟล์นี้ไม่โหลด หน้าเว็บยังอ่านได้ครบ
   ========================================================================== */
(function () {
  'use strict';

  // บอก CSS ว่า JS ทำงาน — ปลดล็อก animation ตอน scroll
  // (ต้องมาก่อนอย่างอื่น ไม่งั้น .reveal จะค้างเป็น opacity:0 หากโค้ดข้างล่าง error)
  document.documentElement.classList.add('js');

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------ theme -------------------------------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) { /* โหมดส่วนตัว / ปิด storage — แค่ไม่จำข้ามหน้า */ }
    });
  }

  /* ------------------------------ language ------------------------------
     ข้อความทั้งสองภาษาอยู่ใน HTML แล้ว CSS เป็นคนซ่อน/แสดงตาม <html lang>
     ที่นี่แค่สลับค่า lang, จำไว้, และอัปเดตของที่ CSS จัดการไม่ได้ (ชื่อแท็บ)
     ---------------------------------------------------------------------- */
  var restoreCopyLabel = function () {};   // ถูกแทนที่จริงในส่วน copy email ข้างล่าง

  function applyLang(lang) {
    root.lang = lang;
    var title = root.dataset[lang === 'th' ? 'titleTh' : 'titleEn'];
    if (title) document.title = title;
    restoreCopyLabel();   // ปุ่ม copy อาจค้างคำว่า "Copied" ภาษาเดิมอยู่
  }

  // head script ตั้ง lang ไว้แล้ว — เรียกซ้ำเพื่อให้ชื่อแท็บตรงกับภาษาที่เลือก
  applyLang(root.lang === 'th' ? 'th' : 'en');

  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var next = root.lang === 'th' ? 'en' : 'th';
      applyLang(next);
      try {
        localStorage.setItem('lang', next);
      } catch (e) { /* ไม่จำข้ามหน้า แต่สลับได้ปกติ */ }
      // ความสูงของหน้าเปลี่ยนไปตามความยาวข้อความ — คำนวณ scroll-spy ใหม่
      onScroll();
    });
  }

  /* ------------------------ nav: burger + stuck ------------------------- */
  var nav = document.getElementById('nav');
  var navLinks = document.getElementById('navLinks');
  var burger = document.getElementById('burger');

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    // ปิดเมนูหลังกดลิงก์บนมือถือ
    // ต้องใช้ closest('a') ไม่ใช่ e.target.tagName เพราะข้างในลิงก์มี <span lang>
    // ครอบข้อความอยู่ — คลิกจะโดน span ไม่ใช่ <a>
    navLinks.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('a')) return;
      navLinks.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  }

  /* ------------------- progress bar + scroll-spy ------------------------ */
  var progress = document.getElementById('progress');
  var links = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('a')) : [];
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var ticking = false;

  // section ท้าย ๆ ของหน้าสั้น ๆ เลื่อนขึ้นไปชิดบนไม่ได้ (หน้าหมดก่อน) กดลิงก์ไปแล้ว
  // scroll-spy จึงคำนวณได้เป็นอันอื่นเสมอ — ยึดอันที่ผู้ใช้กดไว้จนกว่าจะเลื่อนเอง
  var pinnedIndex = -1;
  if (navLinks) {
    navLinks.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (a) pinnedIndex = links.indexOf(a);
    });
  }
  ['wheel', 'touchmove', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, function () { pinnedIndex = -1; }, { passive: true });
  });

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle('is-stuck', y > 8);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + '%';
    }

    parallax(y);

    // active = section สุดท้ายที่ขอบบนขึ้นมาเหนือ "เส้นอ่าน" (ใต้ nav ลงมา 20% ของจอ)
    // ใช้เส้นอ่านแทนขอบบนจอเฉย ๆ เพราะบนหน้าสั้น section ท้าย ๆ เลื่อนไปชิดบนไม่ได้
    // เลยไม่มีทางถูกไฮไลต์เลยสักครั้ง
    var offset = (nav ? nav.offsetHeight : 0) + 24;
    var line = offset + window.innerHeight * 0.2;
    var current = -1;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) current = i;
    }
    // ถึงท้ายหน้าแล้วให้ไฮไลต์ section สุดท้ายเสมอ
    if (sections.length && y + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sections.length - 1;
    }
    if (pinnedIndex > -1) {
      // พอเลื่อนมาถึงจุดที่คำนวณเองได้ตรงกับอันที่กด ก็ปล่อยการยึดได้แล้ว
      // ไม่ปล่อยไม่ได้ เพราะการลากแถบเลื่อนไม่ยิง wheel/touchmove/keydown
      // ไฮไลต์ก็จะค้างอยู่ที่อันที่กดไปตลอดจนกว่าจะหมุนล้อหรือกดปุ่ม
      if (current === pinnedIndex) pinnedIndex = -1;
      else current = pinnedIndex;
    }
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle('is-active', j === current);
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* --------------------------- reveal on scroll ------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // ไม่มี observer หรือผู้ใช้ปิด animation — แสดงทั้งหมดทันที
    for (var k = 0; k < revealables.length; k++) revealables[k].classList.add('is-visible');
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // ไล่โผล่ทีละชิ้นในกลุ่มเดียวกัน ให้ดูเป็นจังหวะ
        var siblings = Array.prototype.slice.call(entry.target.parentNode.children);
        var delay = Math.min(siblings.indexOf(entry.target), 5) * 70;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    for (var m = 0; m < revealables.length; m++) observer.observe(revealables[m]);
  }

  /* --------------------- ลูกเล่นฉากหลัง (ตกแต่งล้วน) --------------------- */
  var hero = document.querySelector('.hero');
  var portrait = document.querySelector('.hero__portrait img');
  var finePointer = window.matchMedia('(hover: hover)').matches;

  // ไฟส่องตามเมาส์ใน hero — ส่งตำแหน่งเป็น % ให้ CSS ผ่าน custom property
  // เขียนค่าแค่รอบละครั้งต่อเฟรม ไม่งั้น mousemove จะยิงถี่เกินจำเป็น
  if (hero && finePointer && !reduceMotion) {
    var spotPending = false;
    var spotX = 0, spotY = 0;

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      spotX = ((e.clientX - r.left) / r.width) * 100;
      spotY = ((e.clientY - r.top) / r.height) * 100;
      if (spotPending) return;
      spotPending = true;
      window.requestAnimationFrame(function () {
        hero.style.setProperty('--mx', spotX + '%');
        hero.style.setProperty('--my', spotY + '%');
        spotPending = false;
      });
    }, { passive: true });
  }

  // รูปโปรไฟล์ขยับช้ากว่าหน้าเว็บนิดหน่อยตอนเลื่อน ให้รู้สึกมีระยะ
  // ต้องขยับที่ <img> ไม่ใช่ <figure> เพราะ figure มี class reveal ที่ใช้ transform อยู่
  function parallax(y) {
    if (!portrait || reduceMotion) return;
    portrait.style.transform = 'translate3d(0,' + (y * -0.05).toFixed(1) + 'px,0)';
  }

  /* --------------------- mailto ที่ไม่มีอะไรเกิดขึ้น ---------------------
     เครื่องที่ไม่ได้ตั้งโปรแกรมอีเมลไว้ (เจอบ่อยมากบน Windows และคนที่ใช้ Gmail
     ผ่านเบราว์เซอร์เฉย ๆ) กด mailto แล้วจะเงียบสนิท ไม่มี error ไม่มีอะไรเลย
     เช็กด้วยการดูว่าหน้าเว็บเสียโฟกัสไหมหลังคลิก — ถ้าไม่เสีย แปลว่าไม่มีอะไรเปิดขึ้นมา
     แล้วค่อยพาไปที่ช่องติดต่อพร้อมคัดลอกอีเมลให้ จะได้ไม่เป็นทางตัน
     ---------------------------------------------------------------------- */
  var contactSection = document.getElementById('contact');
  var contactAddr = document.querySelector('.contact__addr');
  var flashTimer = null;

  function mailtoFallback() {
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center'
      });
    }
    if (copyBtn) copyBtn.click();           // คัดลอกให้เลย จะได้เอาไปวางในเว็บเมลได้
    if (contactAddr) {
      contactAddr.classList.remove('is-flash');
      void contactAddr.offsetWidth;          // บังคับ reflow ให้ animation เล่นซ้ำได้
      contactAddr.classList.add('is-flash');
      // ต้องถอดคลาสออกด้วย ไม่งั้นคนที่ตั้ง reduce motion จะโดนไฮไลต์ค้างถาวร
      // (โหมดนั้นไม่มี animation ใช้การทาพื้นหลังไว้เฉย ๆ แทน)
      clearTimeout(flashTimer);
      flashTimer = setTimeout(function () {
        contactAddr.classList.remove('is-flash');
      }, 1800);
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('a[href^="mailto:"]'), function (a) {
    a.addEventListener('click', function () {
      var leftPage = false;
      var mark = function () { leftPage = true; };
      window.addEventListener('blur', mark);
      document.addEventListener('visibilitychange', mark);

      setTimeout(function () {
        window.removeEventListener('blur', mark);
        document.removeEventListener('visibilitychange', mark);
        if (!leftPage) mailtoFallback();
      }, 700);
    });
  });

  /* ----------------------------- copy email ----------------------------- */
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    // ปุ่มนี้มี span สองภาษาอยู่ข้างใน — เก็บ innerHTML ไว้ก่อนจะทับด้วยคำว่า "Copied"
    // ถ้าใช้ textContent เก็บ/คืน span จะหายไปทั้งคู่และปุ่มจะว่างเปล่าหลังสลับภาษา
    var copyOriginal = copyBtn.innerHTML;
    var copyTimer = null;

    restoreCopyLabel = function () {
      if (copyTimer === null) return;
      clearTimeout(copyTimer);
      copyTimer = null;
      copyBtn.innerHTML = copyOriginal;
    };

    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email || '';
      var done = function () {
        copyBtn.textContent =
          copyBtn.dataset[root.lang === 'th' ? 'copiedTh' : 'copiedEn'] || 'Copied';
        clearTimeout(copyTimer);
        copyTimer = setTimeout(function () {
          copyTimer = null;
          copyBtn.innerHTML = copyOriginal;
        }, 1600);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done, fallback);
      } else {
        fallback();
      }

      // file:// และ http ธรรมดาไม่มี clipboard API — ใช้ textarea ชั่วคราวแทน
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:absolute;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* ผู้ใช้ก๊อปเองได้ */ }
        document.body.removeChild(ta);
      }
    });
  }

  /* ------------------------------ footer -------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
