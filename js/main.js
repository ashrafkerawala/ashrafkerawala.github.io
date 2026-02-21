/**
 * Main — Entry point
 */
(function () {
  'use strict';

  // Hide custom cursor on touch devices
  if ('ontouchstart' in window) {
    var cursor = document.querySelector('.custom-cursor');
    if (cursor) cursor.style.display = 'none';
  }

  // Tap-to-glitch on hero name for non-hover devices
  var heroName = document.querySelector('.hero__name');
  if (heroName && !window.matchMedia('(hover: hover)').matches) {
    heroName.addEventListener('click', function () {
      heroName.classList.add('is-glitching');
      heroName.addEventListener('animationend', function handler() {
        heroName.classList.remove('is-glitching');
        heroName.removeEventListener('animationend', handler);
      });
    });
  }
})();

/* About View More (mobile only) */
(function () {
  var btn = document.getElementById('about-more-btn');
  var extra = document.getElementById('about-extra');
  if (!btn || !extra) return;

  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    var nowExpanded = !expanded;

    extra.classList.toggle('is-expanded', nowExpanded);
    extra.setAttribute('aria-hidden', String(!nowExpanded));
    btn.setAttribute('aria-expanded', String(nowExpanded));
    btn.textContent = nowExpanded ? '> read less' : '> read more';
  });
})();

/* Skills View More */
(function () {
  var btn = document.getElementById('skills-more-btn');
  var extra = document.getElementById('skills-extra');
  if (!btn || !extra) return;

  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    var nowExpanded = !expanded;

    extra.classList.toggle('is-expanded', nowExpanded);
    extra.setAttribute('aria-hidden', String(!nowExpanded));
    btn.setAttribute('aria-expanded', String(nowExpanded));
    btn.textContent = nowExpanded ? '> view less skills' : '> view more skills';

    // Stagger-animate newly visible skill tags
    if (nowExpanded) {
      var skills = extra.querySelectorAll('.skill');
      skills.forEach(function (s, i) {
        setTimeout(function () { s.classList.add('is-visible'); }, i * 50);
      });
    }
  });
})();

/* Timeline View More */
(function () {
  document.querySelectorAll('.timeline__more-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-target');
      var ul = document.getElementById(targetId);
      if (!ul) return;

      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var nowExpanded = !expanded;
      var extras = ul.querySelectorAll('.timeline__achievement--extra');

      extras.forEach(function (li) {
        li.classList.toggle('is-visible', nowExpanded);
      });

      btn.setAttribute('aria-expanded', String(nowExpanded));
      btn.textContent = nowExpanded ? '> view less' : '> view more';
    });
  });
})();
