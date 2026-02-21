/* ============================================
   Command Palette — Mobile Navigation
   IIFE pattern matching existing JS
   ============================================ */
(function () {
  'use strict';

  var mql = window.matchMedia('(max-width: 768px)');
  var palette = document.getElementById('cmd-palette');
  var handle = document.getElementById('cmd-handle');
  var handleText = document.getElementById('cmd-handle-text');
  var links = palette ? palette.querySelectorAll('.cmd-palette__link') : [];
  var flickerTimeout = null;

  if (!palette || !handle || !links.length) return;

  /* ---------- helpers ---------- */
  function isOpen() {
    return handle.getAttribute('aria-expanded') === 'true';
  }

  function openPalette() {
    palette.classList.add('is-open', 'is-opening');
    palette.setAttribute('aria-hidden', 'false');
    handle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus the active link or first link
    var active = palette.querySelector('.cmd-palette__link.is-active') || links[0];
    if (active) active.focus();

    // Remove is-opening after flicker animation
    clearTimeout(flickerTimeout);
    flickerTimeout = setTimeout(function () {
      palette.classList.remove('is-opening');
    }, 400);
  }

  function closePalette() {
    palette.classList.remove('is-open', 'is-opening');
    palette.setAttribute('aria-hidden', 'true');
    handle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    clearTimeout(flickerTimeout);
    handle.focus();
  }

  /* ---------- Handle interaction ---------- */
  handle.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    if (isOpen()) {
      closePalette();
    } else {
      openPalette();
    }
  });

  /* ---------- Swipe detection ---------- */
  var touchStartY = 0;
  var touchStartX = 0;

  // Swipe UP on handle to open
  handle.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  handle.addEventListener('touchend', function (e) {
    var dy = touchStartY - e.changedTouches[0].clientY;
    var dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
    if (dy > 60 && dx < dy && !isOpen()) {
      openPalette();
    }
  }, { passive: true });

  // Swipe DOWN on palette to close
  palette.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  palette.addEventListener('touchend', function (e) {
    var dy = e.changedTouches[0].clientY - touchStartY;
    var dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
    if (dy > 60 && dx < dy && isOpen()) {
      closePalette();
    }
  }, { passive: true });

  /* ---------- Link clicks ---------- */
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var href = link.getAttribute('href');
      var target = href ? document.querySelector(href) : null;
      closePalette();
      if (target) {
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    });
  });

  /* ---------- Keyboard ---------- */
  palette.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePalette();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var arr = Array.from(links);
      var idx = arr.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        idx = (idx + 1) % arr.length;
      } else {
        idx = (idx - 1 + arr.length) % arr.length;
      }
      arr[idx].focus();
    }
  });

  /* ---------- Active section tracking ---------- */
  var sections = document.querySelectorAll('section[id]');
  var rafId = null;

  function updateActiveSection() {
    rafId = null;
    var current = '';
    var atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60;

    if (atBottom) {
      current = sections[sections.length - 1].getAttribute('id');
    } else {
      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.getAttribute('id');
        }
      });
    }

    // Update handle text
    if (current && current !== 'hero') {
      handleText.textContent = '> /' + current + ' _';
    } else {
      handleText.textContent = '> _';
    }

    // Update active link
    links.forEach(function (link) {
      var section = link.getAttribute('data-section');
      if (section === current) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  function onScroll() {
    if (!rafId && mql.matches) {
      rafId = requestAnimationFrame(updateActiveSection);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Media query guard ---------- */
  function onBreakpointChange() {
    if (!mql.matches && isOpen()) {
      closePalette();
    }
  }

  if (mql.addEventListener) {
    mql.addEventListener('change', onBreakpointChange);
  } else if (mql.addListener) {
    mql.addListener(onBreakpointChange);
  }

  // Initial active section check
  if (mql.matches) {
    updateActiveSection();
  }
})();
