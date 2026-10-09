/**
 * Anesthesia SmartSite — Shared Site JavaScript
 * Handles: theme toggle, mobile menu, legal modals, footer/modal injection
 */

/* ---------- Theme ---------- */
const SiteTheme = {
  init() {
    const stored = localStorage.getItem('theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);

    document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  toggle() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';

    if (next === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', next);
    }
    localStorage.setItem('theme', next);
  },
};

/* ---------- Mobile Menu ---------- */
const MobileMenu = {
  init() {
    this.toggle = document.querySelector('.mobile-menu-toggle');
    this.nav = document.getElementById('mobile-nav');
    this.overlay = document.getElementById('mobile-overlay');
    this.closeBtn = document.getElementById('mobile-nav-close');

    if (!this.toggle || !this.nav) return;

    this.toggle.addEventListener('click', () => this.handleToggle());
    this.overlay?.addEventListener('click', () => this.close());
    this.closeBtn?.addEventListener('click', () => this.close());

    this.nav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => this.close());
    });
  },

  handleToggle() {
    const isOpen = this.toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? this.close() : this.open();
  },

  open() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    this.toggle.setAttribute('aria-expanded', 'true');
    this.toggle.setAttribute('aria-label', 'Close menu');
    this.nav.classList.add('open');
    this.overlay?.classList.add('active');
    document.body.classList.add('menu-open');
  },

  close() {
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-label', 'Open menu');
    this.nav.classList.remove('open');
    this.overlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
    document.body.style.removeProperty('--scrollbar-width');
  },
};

/* ---------- Legal Modal ---------- */
const LegalModal = {
  init() {
    this.modal = document.getElementById('legal-modal');
    if (!this.modal) return;

    this.sections = ['disclaimer', 'privacy', 'terms'];

    document.querySelectorAll('[data-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.open(btn.getAttribute('data-modal'));
      });
    });

    document.getElementById('modal-close')?.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  },

  open(section) {
    this.sections.forEach((s) => {
      const el = document.getElementById(`modal-content-${s}`);
      if (el) el.style.display = s === section ? 'block' : 'none';
    });
    this.modal.classList.add('active');
    document.body.classList.add('menu-open');
    this.modal.querySelector('.modal-close')?.focus();
  },

  close() {
    this.modal.classList.remove('active');
    document.body.classList.remove('menu-open');
  },
};

/* ---------- Footer & Modal Injection ---------- */
const SiteFooter = {
  siteUrl(path) {
    const value = String(path || '');
    if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(value)) return value;
    return new URL(value.replace(/^\//, ''), this.base || new URL('./', window.location.href)).href;
  },

  async loadAndInject() {
    const footerEl = document.getElementById('site-footer');
    const modalEl = document.getElementById('legal-modal');
    if (!footerEl && !modalEl) return;

    let data;
    try {
      const scriptEl = document.querySelector('script[src*="site.js"]');
      this.base = scriptEl ? scriptEl.src.replace(/js\/site\.js.*$/, '') : new URL('./', window.location.href).href;
      const resp = await fetch(this.base + 'data/site.json');
      data = await resp.json();
    } catch {
      return; // Fail silently — footer/modal HTML may already be in-page
    }

    if (footerEl && !footerEl.dataset.loaded) {
      footerEl.innerHTML = this.renderFooter(data);
      footerEl.dataset.loaded = 'true';
    }

    if (modalEl && !modalEl.dataset.loaded) {
      modalEl.innerHTML = this.renderModal(data);
      modalEl.dataset.loaded = 'true';
    }

    // Re-init modal after injection
    LegalModal.init();
  },

  renderFooter(data) {
    const { author, authorTitle } = data.site;
    const groups = data.footerNav || [];
    // Long pages (the appraisal parts run past a thousand words) end here, so
    // the footer is the natural place to offer somewhere to go next.
    const nav = groups.length
      ? `<nav class="site-footer__nav" aria-label="Site">
          ${groups
            .map(
              (group) => `<div class="site-footer__group">
              <h2 class="site-footer__heading">${group.heading}</h2>
              <ul>${group.links
                .map((link) => `<li><a href="${this.siteUrl(link.href)}">${link.label}</a></li>`)
                .join('')}</ul>
            </div>`
            )
            .join('')}
        </nav>`
      : '';

    return `
      ${nav}
      <div class="site-footer__inner">
        <p class="site-footer__author">${author} &middot; ${authorTitle}</p>
        <div class="site-footer__links">
          <button class="site-footer__link" data-modal="disclaimer">Disclaimer</button>
          <button class="site-footer__link" data-modal="privacy">Privacy Policy</button>
          <button class="site-footer__link" data-modal="terms">Terms of Service</button>
        </div>
      </div>`;
  },

  renderModal(data) {
    const { legal } = data;
    const closeBtn = `<button class="modal-close" id="modal-close" aria-label="Close">
      <svg viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
    </button>`;

    const disclaimerHTML = legal.disclaimer.sections
      .map((p) => `<p>${p}</p>`)
      .join('');

    const privacyHTML = legal.privacy.sections
      .map((s) => `<h3>${s.heading}</h3><p>${s.text}</p>`)
      .join('');

    const termsHTML = legal.terms.sections
      .map((s) => `<h3>${s.heading}</h3><p>${s.text}</p>`)
      .join('');

    return `<div class="modal">
      ${closeBtn}
      <div id="modal-content-disclaimer" style="display:none;">
        <h2>${legal.disclaimer.title}</h2>${disclaimerHTML}
      </div>
      <div id="modal-content-privacy" style="display:none;">
        <h2>${legal.privacy.title}</h2><p>${legal.privacy.intro}</p>${privacyHTML}
      </div>
      <div id="modal-content-terms" style="display:none;">
        <h2>${legal.terms.title}</h2><p>${legal.terms.intro}</p>${termsHTML}
      </div>
    </div>`;
  },
};

/* ---------- Sticky chrome measurement ----------
 * The section nav sticks directly beneath the navbar, and anchor links have to
 * clear both. Neither height is a constant (the navbar reflows with viewport
 * width, and the subnav is absent on most pages), so publish them as custom
 * properties instead of hardcoding a magic number in the CSS.
 */
const SiteChrome = {
  init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const subnavBar = document.querySelector('.section-bar');

    const measure = () => {
      const navH = navbar.offsetHeight;
      const root = document.documentElement;
      root.style.setProperty('--nav-h', navH + 'px');
      root.style.setProperty('--sticky-h', navH + (subnavBar ? subnavBar.offsetHeight : 0) + 'px');
    };

    measure();
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(measure);
      ro.observe(navbar);
      if (subnavBar) ro.observe(subnavBar);
    }
    addEventListener('resize', measure, { passive: true });
    // Webfont swap changes the nav's height after first paint.
    if (document.fonts?.ready) document.fonts.ready.then(measure);
  },
};

/* ---------- Current-section highlighting ----------
 * Pages that live at their own URL mark the matching nav link with
 * aria-current="page" in the HTML, so the state is right before this file
 * runs. The home page's nav points at in-page sections instead, which markup
 * alone cannot resolve, so track the section being read and mark it
 * aria-current="true" ("a current item" rather than "the current page").
 *
 * Deliberately a scroll handler rather than an IntersectionObserver: there are
 * four sections, the work is a handful of getBoundingClientRect calls behind a
 * rAF gate, and "which section am I reading" is a question about a threshold
 * line, which observers express awkwardly through rootMargin.
 */
const SectionNav = {
  // Fraction of the viewport below which a section counts as the one in view.
  LINE: 0.35,

  init() {
    const pairs = [];
    for (const link of document.querySelectorAll('.nav-link')) {
      const href = link.getAttribute('href') || '';
      let hash;
      if (href.startsWith('#')) {
        hash = href;
      } else {
        const url = new URL(href, location.href);
        if (!url.hash || url.pathname !== location.pathname) continue;
        hash = url.hash;
      }
      const section = document.getElementById(decodeURIComponent(hash.slice(1)));
      // Every nav link gets its own entry. Desktop and mobile both point at the
      // same section, so keying a map by section would drop one of them.
      if (section) pairs.push({ link, section });
    }
    if (!pairs.length) return;

    this.pairs = pairs;
    this.sections = [...new Set(pairs.map((p) => p.section))];

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; this.update(); });
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    this.update();
  },

  update() {
    const line = innerHeight * this.LINE;
    let active = null;

    // The section in view is the last one whose top has crossed the line.
    for (const section of this.sections) {
      if (section.getBoundingClientRect().top <= line) active = section;
    }
    // Above the first section (the hero) nothing is current, which is correct.
    // At the very bottom the last section wins even if it never crossed.
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) {
      active = this.sections[this.sections.length - 1];
    }

    for (const { link, section } of this.pairs) {
      if (section === active) {
        link.setAttribute('aria-current', 'true');
      } else if (link.getAttribute('aria-current') === 'true') {
        // Only clear what we set, so a hardcoded aria-current="page" survives.
        link.removeAttribute('aria-current');
      }
    }
  },
};

/* ---------- Initialize ---------- */
/* ---------- Sub-nav overflow hint ----------
 * On narrow screens the Journal Club tabs scroll sideways. Flag the bar while
 * tabs are hidden to the right so CSS can fade that edge; clear it at the end.
 */
const SubNavFade = {
  init() {
    const bar = document.querySelector('.section-bar');
    const nav = bar?.querySelector('.section-nav');
    if (!bar || !nav) return;
    const update = () => {
      bar.classList.toggle('has-more', nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 2);
    };
    nav.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(update);
    update();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  SiteTheme.init();
  SiteChrome.init();
  MobileMenu.init();
  LegalModal.init();
  SectionNav.init();
  SubNavFade.init();
  SiteFooter.loadAndInject();
});
