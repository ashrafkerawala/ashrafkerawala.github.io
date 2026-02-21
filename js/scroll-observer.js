/**
 * Scroll Observer — IntersectionObserver for scroll-triggered animations
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  function createObserver(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const defaults = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    const config = { ...defaults, ...options };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, config);

    elements.forEach(function (el) {
      observer.observe(el);
    });

    return observer;
  }

  // General reveals
  createObserver('.reveal');

  // Skills with staggered delay
  var skills = document.querySelectorAll('.skill');
  skills.forEach(function (skill) {
    var i = parseInt(skill.style.getPropertyValue('--i')) || 0;
    skill.style.transitionDelay = (i * 0.05) + 's';
  });
  createObserver('.skill', { threshold: 0.1 });

  // Timeline items
  createObserver('.timeline__group', { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

  // Project cards
  var projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.1) + 's';
  });
  createObserver('.project-card', { threshold: 0.1 });

  // Stat counters
  var statNumbers = document.querySelectorAll('.stat__number');
  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) {
    statObserver.observe(el);
  });

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'));
    var duration = 1500;
    var start = performance.now();
    var rafId = null;

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + '+';

      if (progress < 1) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    }

    rafId = requestAnimationFrame(update);
  }
})();
