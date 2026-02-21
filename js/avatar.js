/**
 * Avatar — Mouse & touch-tracking 3D parallax with lerped RAF loop
 */
(function () {
  'use strict';

  var avatar = document.getElementById('avatar');
  var wrap = document.getElementById('avatar-wrap');
  if (!avatar || !wrap) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var maxRotation = 15;
  var lerpFactor = 0.1;
  var convergenceThreshold = 0.01;

  var targetX = 0;
  var targetY = 0;
  var currentX = 0;
  var currentY = 0;
  var rafId = null;
  var isInteracting = false;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function update() {
    currentX = lerp(currentX, targetX, lerpFactor);
    currentY = lerp(currentY, targetY, lerpFactor);

    avatar.style.transform = 'rotateY(' + currentX + 'deg) rotateX(' + currentY + 'deg)';

    var dx = Math.abs(currentX - targetX);
    var dy = Math.abs(currentY - targetY);

    if (dx > convergenceThreshold || dy > convergenceThreshold) {
      rafId = requestAnimationFrame(update);
    } else {
      // Snap to final target and stop loop
      currentX = targetX;
      currentY = targetY;
      if (targetX === 0 && targetY === 0) {
        avatar.style.transform = '';
        avatar.style.animationPlayState = '';
      } else {
        avatar.style.transform = 'rotateY(' + currentX + 'deg) rotateX(' + currentY + 'deg)';
      }
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
  }

  function handlePointerInput(clientX, clientY) {
    var rect = wrap.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;

    var mouseX = clientX - centerX;
    var mouseY = clientY - centerY;

    var rotateY = (mouseX / (rect.width / 2)) * maxRotation;
    var rotateX = -(mouseY / (rect.height / 2)) * maxRotation;

    targetX = Math.max(-maxRotation, Math.min(maxRotation, rotateY));
    targetY = Math.max(-maxRotation, Math.min(maxRotation, rotateX));

    startLoop();
  }

  function handleEnd() {
    isInteracting = false;
    targetX = 0;
    targetY = 0;
    startLoop();
  }

  // Mouse events
  wrap.addEventListener('mouseenter', function () {
    isInteracting = true;
    avatar.style.animationPlayState = 'paused';
  });

  wrap.addEventListener('mousemove', function (e) {
    if (!isInteracting) return;
    handlePointerInput(e.clientX, e.clientY);
  });

  wrap.addEventListener('mouseleave', handleEnd);

  // Touch events
  wrap.addEventListener('touchstart', function (e) {
    isInteracting = true;
    avatar.style.animationPlayState = 'paused';
    var touch = e.touches[0];
    handlePointerInput(touch.clientX, touch.clientY);
  }, { passive: true });

  wrap.addEventListener('touchmove', function (e) {
    if (!isInteracting) return;
    var touch = e.touches[0];
    handlePointerInput(touch.clientX, touch.clientY);
  }, { passive: true });

  wrap.addEventListener('touchend', handleEnd);
  wrap.addEventListener('touchcancel', handleEnd);
})();
