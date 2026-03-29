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
  async loadAndInject() {
    const footerEl = document.getElementById('site-footer');
    const modalEl = document.getElementById('legal-modal');
    if (!footerEl && !modalEl) return;

    let data;
    try {
      const scriptEl = document.querySelector('script[src*="site.js"]');
      const base = scriptEl ? scriptEl.src.replace(/js\/site\.js.*$/, '') : '/';
      const resp = await fetch(base + 'data/site.json');
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
    return `
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

/* ---------- Initialize ---------- */
document.addEventListener('DOMContentLoaded', () => {
  SiteTheme.init();
  MobileMenu.init();
  LegalModal.init();
  SiteFooter.loadAndInject();
});
