/**
 * Journal Club catalog: search on the hub, handout render on the session page.
 */
const JournalClub = {
  siteUrl(path) {
    const siteRoot = new URL('../', window.location.href);
    return new URL(String(path).replace(/^\//, ''), siteRoot).href;
  },

  async load() {
    const resp = await fetch(this.siteUrl('data/journal-club.json'));
    if (!resp.ok) throw new Error('Catalog request failed');
    return resp.json();
  },

  sessionById(data, id) {
    return data.sessions.find((session) => session.id === id) || null;
  },

  sorted(sessions) {
    return [...sessions].sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  formatDate(iso) {
    const [year, month, day] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));
  },

  dateForms(iso) {
    const [year, month, day] = iso.split('-').map(Number);
    const utc = new Date(Date.UTC(year, month - 1, day));
    const long = this.formatDate(iso);
    const monthYear = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(utc);
    const mon = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      timeZone: 'UTC',
    }).format(utc);
    return [
      iso,
      long,
      monthYear,
      `${mon} ${year}`,
      `${mon} ${day}, ${year}`,
      `${month}/${day}/${year}`,
    ];
  },

  dateParts(iso) {
    const [year, month, day] = iso.split('-').map(Number);
    const utc = new Date(Date.UTC(year, month - 1, day));
    return {
      month: new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(utc),
      day: String(day),
      year: String(year),
    };
  },

  normalize(value) {
    return String(value)
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  haystack(session) {
    const bits = [
      ...this.dateForms(session.date),
      session.time,
      session.cohort,
      session.cohort ? session.cohort.replace('-', '') : '',
      session.topic,
      session.purpose,
      ...(session.residents || []),
      ...(session.faculty || []),
      ...(session.keywords || []),
      ...(session.objectives || []),
      ...(session.articles || []).flatMap((article) => [
        article.label,
        article.citation,
        article.design,
      ]),
    ];
    return bits.filter(Boolean).join(' ');
  },

  matches(session, query) {
    const normalized = this.normalize(query);
    if (!normalized) return true;
    const words = this.normalize(this.haystack(session)).split(' ').filter(Boolean);
    const tokens = normalized.split(' ').filter(Boolean);
    const tokenHit = tokens.every((token) =>
      words.some((word) => word === token || (token.length >= 3 && word.startsWith(token)))
    );
    return tokenHit;
  },

  indexName(name) {
    return String(name).replace(/(?:,\s*(?:MD|MS|MEHP|DO|PhD|MPH|MBA))+$/i, '').trim();
  },

  roleLine(label, names, showEmpty = false) {
    const clean = (names || []).map((name) => this.indexName(name)).filter(Boolean);
    if (!clean.length && !showEmpty) return null;
    const line = this.el('span', { className: 'jc-meta-line' });
    const title = clean.length === 1 ? label : `${label}s`;
    line.append(this.el('span', { className: 'jc-meta-label', text: `${title}:` }));
    if (clean.length) {
      line.append(document.createTextNode(` ${clean.join(', ')}`));
    } else {
      line.append(this.el('span', { className: 'jc-details', text: ' —' }));
    }
    return line;
  },

  articleHref(article) {
    if (article.doi) return `https://doi.org/${article.doi}`;
    return article.pubmed || '';
  },

  todayIso() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  },

  nextSessionId(sessions) {
    const today = this.todayIso();
    const upcoming = sessions
      .filter((session) => session.date >= today)
      .sort((a, b) => (a.date < b.date ? -1 : 1));
    return upcoming[0] ? upcoming[0].id : null;
  },

  handoutName(path) {
    const file = path.split('/').pop() || 'handout';
    return file.endsWith('.pdf') ? 'Download handout (PDF)' : 'Download handout (Word)';
  },

  handoutMeta(path, bytes) {
    const kind = path.endsWith('.pdf') ? 'PDF' : 'Word document';
    if (!bytes) return kind;
    const kb = Math.round(bytes / 1024);
    return kb >= 1024 ? `${kind} \u00b7 ${(kb / 1024).toFixed(1)} MB` : `${kind} \u00b7 ${kb} KB`;
  },

  svg(paths, className) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('viewBox', '0 0 24 24');
    node.setAttribute('aria-hidden', 'true');
    if (className) node.setAttribute('class', className);
    node.innerHTML = paths;
    return node;
  },

  downloadRow(session) {
    const link = this.el('a', { href: this.siteUrl(session.handout), className: 'jc-download' });
    link.setAttribute('download', '');

    const icon = this.el('span', { className: 'jc-download-icon' });
    icon.append(this.svg(
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
      '<polyline points="14 2 14 8 20 8"/>'
    ));

    const text = this.el('span', { className: 'jc-download-text' });
    text.append(this.el('span', { className: 'jc-download-title', text: 'Pre-session handout' }));
    text.append(this.el('span', {
      className: 'jc-download-meta',
      text: this.handoutMeta(session.handout, session.handoutBytes),
    }));

    link.append(icon, text, this.svg(
      '<path d="M12 3v12"/><polyline points="7 10 12 15 17 10"/><path d="M5 21h14"/>',
      'jc-download-arrow'
    ));
    return link;
  },

  el(tag, options = {}) {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className;
    if (options.text != null) node.textContent = options.text;
    if (options.href) node.href = options.href;
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, value));
    }
    return node;
  },

  externalLink(href, text) {
    const link = this.el('a', { href, text, className: 'jc-link' });
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  },

  initHub(data) {
    const input = document.getElementById('jc-search');
    const clearBtn = document.getElementById('jc-clear');
    const list = document.getElementById('jc-results');
    const status = document.getElementById('jc-status');
    if (!input || !list || !status) return;

    const params = new URLSearchParams(window.location.search);
    input.value = params.get('q') || '';

    const render = () => {
      const query = input.value.trim();
      const url = new URL(window.location.href);
      if (query) url.searchParams.set('q', query);
      else url.searchParams.delete('q');
      window.history.replaceState(null, '', url);

      const matches = this.sorted(data.sessions).filter((session) => this.matches(session, query));
      list.replaceChildren();
      document.querySelectorAll('[data-jc-example]').forEach((button) => {
        const example = button.getAttribute('data-jc-example') || '';
        button.setAttribute('aria-pressed', query.toLowerCase() === example.toLowerCase() ? 'true' : 'false');
      });
      if (clearBtn) clearBtn.disabled = !query;

      if (!matches.length) {
        status.textContent = 'No sessions match that search.';
        const empty = this.el('p', {
          className: 'jc-empty',
          text: 'No sessions match that search.',
        });
        list.append(empty);
        return;
      }

      const nextId = this.nextSessionId(data.sessions);
      const next = matches.find((session) => session.id === nextId) || null;
      const grouped = !query && next;
      if (query) {
        status.textContent = matches.length === 1
          ? '1 session matches that search.'
          : `${matches.length} sessions match that search.`;
      } else if (next) {
        status.textContent = `Next session is ${this.formatDate(next.date)}.`;
      } else {
        status.textContent = `${matches.length} sessions, newest first.`;
      }

      const today = this.todayIso();
      const past = grouped ? matches.filter((session) => session.date < today) : [];
      const rows = grouped
        ? matches.filter((session) => session.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1))
        : matches;
      rows.forEach((session) => list.append(this.sessionRow(session, session.id === nextId)));
      if (past.length) {
        list.append(this.el('h3', { className: 'jc-past-title', text: 'Past meetings' }));
        past.forEach((session) => list.append(this.sessionRow(session, false)));
      }
    };

    input.addEventListener('input', render);
    document.getElementById('jc-search-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      render();
    });
    document.querySelectorAll('[data-jc-example]').forEach((button) => {
      button.addEventListener('click', () => {
        input.value = button.getAttribute('data-jc-example') || '';
        input.focus();
        render();
      });
    });
    clearBtn?.addEventListener('click', () => {
      input.value = '';
      input.focus();
      render();
    });
    render();
  },

  sessionRow(session, isNext) {
    const article = this.el('article', { className: isNext ? 'jc-row is-next' : 'jc-row' });
    const parts = this.dateParts(session.date);
    const date = this.el('div', { className: 'jc-date' });
    const spoken = isNext
      ? `Next session, ${this.formatDate(session.date)}`
      : this.formatDate(session.date);
    date.append(this.el('span', { className: 'jc-sr', text: spoken }));
    const visual = this.el('span', { className: 'jc-date-visual', attrs: { 'aria-hidden': 'true' } });
    visual.append(this.el('span', { className: 'jc-date-month', text: parts.month }));
    visual.append(this.el('span', { className: 'jc-date-day', text: parts.day }));
    visual.append(this.el('span', { className: 'jc-date-year', text: parts.year }));
    if (isNext) visual.append(this.el('span', { className: 'jc-next', text: 'Next' }));
    date.append(visual);

    const body = this.el('div', { className: 'jc-row-body' });
    const title = this.el('h3');
    title.append(
      this.el('a', {
        href: this.siteUrl(`journal-club/session.html?id=${encodeURIComponent(session.id)}`),
        text: session.topic,
        className: 'jc-row-title',
      })
    );
    const who = this.el('p', { className: 'jc-meta' });
    // Same three lines on every row so the list scans as a table; a missing
    // value shows a dash instead of dropping the line.
    who.append(this.roleLine('Presenter', session.residents, true));
    who.append(this.roleLine('Facilitator', session.faculty, true));
    const details = [session.cohort, session.time].filter(Boolean);
    who.append(this.el('span', { className: 'jc-meta-line jc-details', text: details.length ? details.join(', ') : '—' }));
    const papers = this.el('ul', { className: 'jc-papers' });
    session.articles.forEach((item) => {
      const li = this.el('li');
      const href = this.articleHref(item);
      li.append(href ? this.externalLink(href, item.label) : document.createTextNode(item.label));
      papers.append(li);
    });
    body.append(title, who, papers);
    article.append(date, body);
    if (session.handout) {
      const actions = this.el('p', { className: 'jc-actions' });
      const download = this.el('a', {
        href: this.siteUrl(session.handout),
        text: this.handoutName(session.handout),
        className: 'jc-link',
      });
      download.setAttribute('download', '');
      actions.append(download);
      article.append(actions);
    }
    return article;
  },

  appendList(parent, items, ordered) {
    const list = this.el(ordered ? 'ol' : 'ul', { className: 'jc-list' });
    items.forEach((item) => list.append(this.el('li', { text: item })));
    parent.append(list);
  },

  renderChecklist(data, mount) {
    const section = this.el('section');
    section.id = 'checklist';
    section.append(this.el('h2', { text: 'Critical appraisal checklist' }));
    section.append(
      this.el('p', {
        className: 'jc-lead',
        text: 'Complete this before the session for your article.',
      })
    );
    const ordered = this.el('ol', { className: 'jc-checklist' });
    data.checklist.forEach((group) => {
      const item = this.el('li');
      item.append(this.el('p', { className: 'jc-check-title', text: group.heading }));
      item.append(this.el('p', { className: 'jc-check-sub', text: group.subtitle }));
      const questions = this.el('ul', { className: 'jc-list' });
      group.items.forEach((question) => questions.append(this.el('li', { text: question })));
      item.append(questions);
      ordered.append(item);
    });
    section.append(ordered);
    mount.append(section);
  },

  renderNotes(session, mount) {
    if (!session.appraisalNotes?.length) return;
    const section = this.el('section');
    section.id = 'notes';
    section.append(this.el('h2', { text: 'Notes prepared with the handout' }));
    section.append(
      this.el('p', {
        className: 'jc-lead',
        text: 'These notes follow that session’s handout. Where the handout disagreed with the paper, the paper is the comparison described here.',
      })
    );
    session.appraisalNotes.forEach((note) => {
      const block = this.el('div', { className: 'jc-note-block' });
      block.append(this.el('h3', { text: note.article }));
      note.sections.forEach((part) => {
        block.append(this.el('h4', { text: part.heading }));
        this.appendList(block, part.notes, false);
      });
      section.append(block);
    });
    mount.append(section);
  },

  renderBottomLine(session, mount) {
    const line = session.bottomLine;
    if (!line) return;
    const section = this.el('section');
    section.id = 'bottom-line';
    section.append(this.el('h2', { text: 'Bottom line' }));
    if (line.reminders) {
      this.appendList(section, line.reminders, false);
    } else {
      const grid = this.el('div', { className: 'jc-columns' });
      [line.left, line.right].filter(Boolean).forEach((column) => {
        const card = this.el('div', { className: 'jc-column' });
        card.append(this.el('h3', { text: column.title }));
        this.appendList(card, column.points, false);
        card.append(this.el('p', { className: 'jc-conclusion', text: column.conclusion }));
        grid.append(card);
      });
      section.append(grid);
      if (line.takeaway) {
        section.append(this.el('p', { className: 'jc-takeaway', text: line.takeaway }));
      }
    }
    mount.append(section);
  },

  initSession(data) {
    const mount = document.getElementById('jc-handout');
    if (!mount) return;
    mount.replaceChildren();
    const id = new URLSearchParams(window.location.search).get('id');
    const session = id ? this.sessionById(data, id) : null;

    if (!session) {
      document.title = 'Session not found — Journal Club';
      mount.append(this.el('h1', { text: 'That session is not in the catalog.' }));
      mount.append(
        this.el('p', {
          className: 'jc-lead',
          text: 'The link may be out of date. The session list has every handout currently posted.',
        })
      );
      mount.append(this.el('a', { href: '/journal-club/', text: 'Back to Journal Club', className: 'jc-link' }));
      return;
    }

    const when = session.time
      ? `${this.formatDate(session.date)} · ${session.time}`
      : this.formatDate(session.date);
    document.title = `${when} — Journal Club`;

    const header = this.el('header', { className: 'jc-session-head' });
    const lead = this.el('div', { className: 'jc-session-lead' });
    lead.append(
      this.el('a', { href: this.siteUrl('journal-club/'), text: '← All sessions', className: 'jc-back' })
    );
    lead.append(
      this.el('p', { className: 'jc-kicker', text: session.cohort ? `${when} · ${session.cohort}` : when })
    );
    lead.append(this.el('h1', { text: session.topic }));
    const facts = this.el('dl', { className: 'jc-facts' });
    const addFact = (label, value) => {
      if (!value) return;
      const fact = this.el('div');
      fact.append(this.el('dt', { text: label }));
      fact.append(this.el('dd', { text: value }));
      facts.append(fact);
    };
    addFact('Presenter', session.residents?.join(', '));
    addFact('Facilitator', session.faculty?.join(', '));
    if (facts.childElementCount) lead.append(facts);
    header.append(lead);
    if (session.handout) header.append(this.downloadRow(session));
    mount.append(header);

    const addSection = (id, title, paragraphs) => {
      const section = this.el('section');
      section.id = id;
      section.append(this.el('h2', { text: title }));
      paragraphs.forEach((text) => section.append(this.el('p', { text })));
      mount.append(section);
      return section;
    };

    addSection('purpose', 'Purpose', [session.purpose]);

    const objectives = this.el('section');
    objectives.id = 'objectives';
    objectives.append(this.el('h2', { text: 'Objectives' }));
    this.appendList(objectives, session.objectives, true);
    mount.append(objectives);

    const articles = this.el('section');
    articles.id = 'articles';
    articles.append(this.el('h2', { text: 'Articles for review' }));
    session.articles.forEach((article) => {
      const card = this.el('article', { className: 'jc-article' });
      const heading = this.el('h3');
      const href = this.articleHref(article);
      heading.append(href ? this.externalLink(href, article.label) : document.createTextNode(article.label));
      card.append(heading);
      if (article.design) card.append(this.el('p', { className: 'jc-design', text: article.design }));
      card.append(this.el('p', { text: article.citation }));
      const links = this.el('p', { className: 'jc-actions' });
      if (article.doi) links.append(this.externalLink(`https://doi.org/${article.doi}`, 'DOI'));
      if (article.pubmed) links.append(this.externalLink(article.pubmed, 'PubMed'));
      card.append(links);
      articles.append(card);
    });
    mount.append(articles);

    const pico = this.el('section');
    pico.id = 'pico';
    pico.append(this.el('h2', { text: 'PICO at a glance' }));
    const wrap = this.el('div', { className: 'jc-table-wrap jc-pico-table' });
    const table = this.el('table', { className: 'jc-table' });
    const caption = this.el('caption', { className: 'jc-sr', text: `PICO for ${session.topic}` });
    table.append(caption);
    const head = this.el('thead');
    const headRow = this.el('tr');
    ['Study', 'Population', 'Intervention', 'Comparison', 'Outcomes', 'Time'].forEach((label) => {
      headRow.append(this.el('th', { text: label, attrs: { scope: 'col' } }));
    });
    head.append(headRow);
    const body = this.el('tbody');
    session.pico.forEach((row) => {
      const tr = this.el('tr');
      const cells = [row.study, row.population, row.intervention, row.comparison, row.outcomes, row.time];
      const headCell = this.el('th', { text: cells[0], attrs: { scope: 'row' } });
      tr.append(headCell);
      cells.slice(1).forEach((cell) => tr.append(this.el('td', { text: cell })));
      body.append(tr);
    });
    table.append(head, body);
    wrap.append(table);
    const stack = this.el('div', { className: 'jc-pico-stack' });
    const fields = [
      ['Population', 'population'],
      ['Intervention', 'intervention'],
      ['Comparison', 'comparison'],
      ['Outcomes', 'outcomes'],
      ['Time', 'time'],
    ];
    session.pico.forEach((row) => {
      const study = this.el('article', { className: 'jc-pico-study' });
      study.append(this.el('h3', { text: row.study }));
      const facts = this.el('dl');
      fields.forEach(([label, key]) => {
        const pair = this.el('div');
        pair.append(this.el('dt', { text: label }));
        pair.append(this.el('dd', { text: row[key] }));
        facts.append(pair);
      });
      study.append(facts);
      stack.append(study);
    });
    pico.append(wrap, stack);
    mount.append(pico);

    this.renderChecklist(data, mount);
    this.renderNotes(session, mount);

    const prework = this.el('section');
    prework.id = 'prework';
    prework.append(this.el('h2', { text: 'Pre-work' }));
    this.appendList(prework, data.prework, false);
    if (session.cases?.length) {
      prework.append(this.el('h3', { text: 'Cases to be ready to discuss' }));
      this.appendList(prework, session.cases, true);
    }
    mount.append(prework);

    this.renderBottomLine(session, mount);

    const references = this.el('section');
    references.id = 'references';
    references.append(this.el('h2', { text: 'References' }));
    const refList = this.el('ol', { className: 'jc-refs' });
    session.articles.forEach((article) => {
      const item = this.el('li');
      item.append(document.createTextNode(`${article.citation} `));
      if (article.doi) {
        item.append(this.externalLink(`https://doi.org/${article.doi}`, `doi:${article.doi}`));
      }
      refList.append(item);
    });
    references.append(refList);
    mount.append(references);
    this.buildToc(mount);
  },

  buildToc(mount) {
    const labels = {
      purpose: 'Purpose',
      objectives: 'Objectives',
      articles: 'Articles',
      pico: 'PICO',
      checklist: 'Checklist',
      notes: 'Notes',
      prework: 'Pre-work',
      'bottom-line': 'Bottom line',
      references: 'References',
    };
    const sections = [...mount.querySelectorAll(':scope > section[id]')];
    if (sections.length < 2) return;
    const nav = this.el('nav', { className: 'jc-toc', attrs: { 'aria-label': 'On this page' } });
    sections.forEach((section) => {
      const label = labels[section.id];
      if (!label) return;
      nav.append(this.el('a', { href: `#${section.id}`, text: label, className: 'jc-toc-link' }));
    });
    const header = mount.querySelector('.jc-session-head');
    if (header) header.after(nav);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-jc-page]');
  if (!root) return;
  const page = root.getAttribute('data-jc-page');
  JournalClub.load()
    .then((data) => {
      if (page === 'hub') JournalClub.initHub(data);
      if (page === 'session') JournalClub.initSession(data);
    })
    .catch(() => {
      const status = document.getElementById('jc-status');
      const mount = document.getElementById('jc-handout') || document.getElementById('jc-results');
      const message = 'The session catalog did not load. Refresh the page.';
      if (status) status.textContent = message;
      if (mount) mount.append(JournalClub.el('p', { className: 'jc-empty', text: message }));
    });
});
