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
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------- progress bar + scroll-spy ------------------------ */
  var progress = document.getElementById('progress');
  var links = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('a')) : [];
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle('is-stuck', y > 8);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + '%';
    }

    // section ที่ active = อันสุดท้ายที่ขอบบนเลยใต้ nav ไปแล้ว
    var offset = (nav ? nav.offsetHeight : 0) + 24;
    var current = -1;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top - offset <= 0) current = i;
    }
    // ถึงท้ายหน้าแล้วให้ไฮไลต์ section สุดท้ายเสมอ
    if (sections.length && y + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sections.length - 1;
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

  /* ----------------------------- copy email ----------------------------- */
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email || '';
      var done = function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = original; }, 1600);
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

  /* ------------------------- download CV = print ------------------------ */
  // print stylesheet ใน style.css จัดหน้าให้เป็น CV อยู่แล้ว
  ['printBtn', 'printBtn2'].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', function () { window.print(); });
  });

  /* ------------------------------ footer -------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
