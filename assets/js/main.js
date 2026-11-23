(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('primary-nav');

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    const desktop = window.matchMedia('(min-width: 881px)');
    desktop.addEventListener('change', function (event) {
      if (event.matches) closeNav();
    });
  }

  /* ---------- Article filtering (articles.html) ---------- */
  const grid = document.querySelector('[data-article-grid]');

  if (grid) {
    const cards = Array.prototype.slice.call(grid.querySelectorAll('[data-article]'));
    const chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    const search = document.getElementById('article-search');
    const count = document.getElementById('article-count');
    const empty = document.getElementById('article-empty');

    let activeCategory = 'all';
    let query = '';

    function applyFilters() {
      let visible = 0;

      cards.forEach(function (card) {
        const category = card.dataset.category || '';
        const haystack = ((card.dataset.title || '') + ' ' + (card.dataset.keywords || '')).toLowerCase();
        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        const matchesQuery = haystack.indexOf(query) !== -1;
        const matches = matchesCategory && matchesQuery;

        card.hidden = !matches;
        if (matches) visible += 1;
      });

      if (count) {
        count.textContent = visible + (visible === 1 ? ' article' : ' articles');
      }
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeCategory = chip.dataset.filter;
        chips.forEach(function (c) {
          c.setAttribute('aria-pressed', String(c === chip));
        });
        applyFilters();
      });
    });

    if (search) {
      search.addEventListener('input', function () {
        query = search.value.trim().toLowerCase();
        applyFilters();
      });
    }

    applyFilters();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealItems.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

      revealItems.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- Placeholder links (files not published yet) ---------- */
  document.addEventListener('click', function (event) {
    const placeholder = event.target.closest('[data-pending]');
    if (placeholder) event.preventDefault();
  });

  /* ---------- Footer year ---------- */
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(year);
  });
})();
