/**
 * Custom Cursor — Acid green circle with lerp, desktop only
 * Pauses RAF when tab is hidden via Page Visibility API
 */
(function () {
  'use strict';

  // Only on hover-capable (desktop) devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  var cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    cursor.style.display = 'none';
    return;
  }

  var mouseX = 0;
  var mouseY = 0;
  var cursorX = 0;
  var cursorY = 0;
  var lerp = 0.15;
  var rafId = null;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    cursorX += (mouseX - cursorX) * lerp;
    cursorY += (mouseY - cursorY) * lerp;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    rafId = requestAnimationFrame(animate);
  }

  function startLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Page Visibility API — stop RAF when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  startLoop();

  // Scale on hover targets
  var hoverTargets = document.querySelectorAll('a, button, .btn, .skill, .project-card');
  hoverTargets.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cursor.classList.add('custom-cursor--hover');
    });
    el.addEventListener('mouseleave', function () {
      cursor.classList.remove('custom-cursor--hover');
    });
  });
})();
