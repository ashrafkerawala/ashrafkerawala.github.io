/**
 * Timeline — Scroll-based line draw animation
 */
(function () {
  'use strict';

  var line = document.getElementById('timeline-line');
  var track = document.querySelector('.timeline__track');
  if (!line || !track) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    line.style.clipPath = 'none';
    return;
  }

  function updateLine() {
    var rect = track.getBoundingClientRect();
    var windowHeight = window.innerHeight;

    // Calculate how much of the track is visible
    var trackTop = rect.top;
    var trackHeight = rect.height;

    // Start drawing when the track enters the viewport
    var scrolled = windowHeight - trackTop;
    var progress = Math.max(0, Math.min(1, scrolled / (trackHeight + windowHeight * 0.3)));

    var clipBottom = (1 - progress) * 100;
    line.style.clipPath = 'inset(0 0 ' + clipBottom + '% 0)';
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateLine();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateLine();
})();
