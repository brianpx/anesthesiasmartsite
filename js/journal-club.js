/**
 * Journal Club catalog: search on the hub, handout render on the session page.
 */
const JournalClub = {
  async load() {
    const resp = await fetch('/data/journal-club.json');
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

  presenters(session) {
    const names = [...(session.residents || []), ...(session.faculty || [])];
    if (names.length && session.cohort) return `${names.join(', ')} · ${session.cohort}`;
    if (names.length) return names.join(', ');
    if (session.cohort) return session.cohort;
    return 'Presenters not listed';
  },

  handoutName(path) {
    const file = path.split('/').pop() || 'handout';
    return file.endsWith('.pdf') ? 'Download handout (PDF)' : 'Download handout (Word)';
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

      if (!matches.length) {
        status.textContent = 'No sessions match that search.';
        const empty = this.el('p', {
          className: 'jc-empty',
          text: 'No sessions match that search.',
        });
        list.append(empty);
        return;
      }

      const noun = matches.length === 1 ? 'session' : 'sessions';
      status.textContent = query
        ? `${matches.length} ${noun} match that search.`
        : `${matches.length} ${noun}.`;

      matches.forEach((session) => {
        const article = this.el('article', { className: 'jc-row' });
        const when = this.el('p', {
          className: 'jc-kicker',
          text: session.time ? `${this.formatDate(session.date)} · ${session.time}` : this.formatDate(session.date),
        });
        const title = this.el('h3');
        title.append(
          this.el('a', {
            href: `/journal-club/session.html?id=${encodeURIComponent(session.id)}`,
            text: session.topic,
            className: 'jc-row-title',
          })
        );
        const who = this.el('p', { className: 'jc-meta', text: this.presenters(session) });
        const papers = this.el('p', {
          className: 'jc-meta',
          text: session.articles.map((item) => item.label).join(' · '),
        });
        const actions = this.el('p', { className: 'jc-actions' });
        actions.append(
          this.el('a', {
            href: `/journal-club/session.html?id=${encodeURIComponent(session.id)}`,
            text: 'Open handout',
            className: 'jc-link',
          })
        );
        if (session.handout) {
          const download = this.el('a', {
            href: session.handout,
            text: this.handoutName(session.handout),
            className: 'jc-link',
          });
          download.setAttribute('download', '');
          actions.append(download);
        }
        article.append(when, title, who, papers, actions);
        list.append(article);
      });
    };

    input.addEventListener('input', render);
    clearBtn?.addEventListener('click', () => {
      input.value = '';
      input.focus();
      render();
    });
    render();
  },

  appendList(parent, items, ordered) {
    const list = this.el(ordered ? 'ol' : 'ul', { className: 'jc-list' });
    items.forEach((item) => list.append(this.el('li', { text: item })));
    parent.append(list);
  },

  renderChecklist(data, mount) {
    const section = this.el('section');
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
      const title = this.el('p', { className: 'jc-check-title' });
      title.append(document.createTextNode(group.heading));
      title.append(this.el('span', { className: 'jc-check-sub', text: ` (${group.subtitle})` }));
      item.append(title);
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
    const crumb = document.getElementById('jc-crumb');
    if (!mount) return;
    mount.replaceChildren();
    const id = new URLSearchParams(window.location.search).get('id');
    const session = id ? this.sessionById(data, id) : null;

    if (!session) {
      document.title = 'Session not found — Journal Club';
      if (crumb) crumb.textContent = 'Session not found';
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
    if (crumb) crumb.textContent = this.formatDate(session.date);

    const header = this.el('header', { className: 'jc-session-head' });
    header.append(this.el('p', { className: 'jc-kicker', text: when }));
    header.append(this.el('h1', { text: session.topic }));
    const facts = this.el('dl', { className: 'jc-facts' });
    const addFact = (label, value) => {
      if (!value) return;
      facts.append(this.el('dt', { text: label }));
      facts.append(this.el('dd', { text: value }));
    };
    addFact('Cohort', session.cohort);
    addFact('Resident leads', session.residents?.join(', '));
    addFact('Faculty leads', session.faculty?.join(', '));
    header.append(facts);
    if (session.handout) {
      const download = this.el('a', {
        href: session.handout,
        text: this.handoutName(session.handout),
        className: 'jc-button',
      });
      download.setAttribute('download', '');
      header.append(download);
    }
    mount.append(header);

    const addSection = (title, paragraphs) => {
      const section = this.el('section');
      section.append(this.el('h2', { text: title }));
      paragraphs.forEach((text) => section.append(this.el('p', { text })));
      mount.append(section);
      return section;
    };

    addSection('Purpose', [session.purpose]);

    const objectives = this.el('section');
    objectives.append(this.el('h2', { text: 'Objectives' }));
    this.appendList(objectives, session.objectives, true);
    mount.append(objectives);

    const articles = this.el('section');
    articles.append(this.el('h2', { text: 'Articles for review' }));
    session.articles.forEach((article) => {
      const card = this.el('article', { className: 'jc-article' });
      card.append(this.el('h3', { text: article.label }));
      card.append(this.el('p', { text: article.citation }));
      card.append(this.el('p', { className: 'jc-meta', text: article.design }));
      const links = this.el('p', { className: 'jc-actions' });
      if (article.doi) links.append(this.externalLink(`https://doi.org/${article.doi}`, 'DOI'));
      if (article.pubmed) links.append(this.externalLink(article.pubmed, 'PubMed'));
      card.append(links);
      articles.append(card);
    });
    mount.append(articles);

    const pico = this.el('section');
    pico.append(this.el('h2', { text: 'PICO at a glance' }));
    const wrap = this.el('div', { className: 'jc-table-wrap' });
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
    pico.append(wrap);
    mount.append(pico);

    this.renderChecklist(data, mount);
    this.renderNotes(session, mount);

    const prework = this.el('section');
    prework.append(this.el('h2', { text: 'Pre-work' }));
    this.appendList(prework, data.prework, false);
    if (session.cases?.length) {
      prework.append(this.el('h3', { text: 'Cases to be ready to discuss' }));
      this.appendList(prework, session.cases, true);
    }
    mount.append(prework);

    this.renderBottomLine(session, mount);

    const references = this.el('section');
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
