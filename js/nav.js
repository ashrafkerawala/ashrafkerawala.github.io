/**
 * Navigation — Active state tracking + mobile hamburger menu
 */
(function () {
  'use strict';

  var hamburger = document.getElementById('nav-hamburger');
  var navLinks = document.getElementById('nav-links');
  var overlay = document.getElementById('nav-overlay');
  var links = document.querySelectorAll('.nav__link');

  // Mobile menu toggle
  function toggleMenu() {
    var isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-active');
    overlay.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    overlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      toggleMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      closeMenu();
    });
  }

  // Close menu on link click
  links.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Active nav state on scroll
  var sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
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

    links.forEach(function (link) {
      link.classList.remove('is-active');
      if (current && link.getAttribute('href') === '#' + current) {
        link.classList.add('is-active');
      }
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateActiveLink();
})();
