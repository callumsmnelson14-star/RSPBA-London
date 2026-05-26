// ═══════════════════════════════════════════════════════════════════
// RSPBA London · ADMIN MODE (prototype)
//
// Activate by adding `?admin=1` to any URL, or by pressing
// Ctrl/Cmd + Shift + A.  Opens a side panel that lets the user edit
// events, contest details and news bulletins live, with changes
// persisted to localStorage and applied across all pages.
//
// This is a PROTOTYPE admin. In production, replace with a proper
// CMS (Sanity, Decap, Strapi, etc.) that authenticates the user and
// writes back to the content store. The hidden activation by URL is
// fine for handing-off-to-developers demos but is NOT production
// security — anyone reaching the page can edit.
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  // ─── Persistence ────────────────────────────────────────────────
  const STORAGE_KEY = 'rspba_data_overrides_v1';

  function applyOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const overrides = JSON.parse(raw);
      if (!overrides || typeof overrides !== 'object') return;
      if (overrides.events) window.RSPBA_DATA.events = overrides.events;
      if (overrides.results) window.RSPBA_DATA.results = overrides.results;
      if (overrides.news) window.RSPBA_DATA.news = overrides.news;
    } catch (e) { console.warn('[RSPBA admin] failed to apply overrides', e); }
  }
  function persistOverrides() {
    const payload = {
      events: window.RSPBA_DATA.events,
      results: window.RSPBA_DATA.results,
      news: window.RSPBA_DATA.news
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  function clearOverrides() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }

  // Apply any stored overrides immediately, before page render uses RSPBA_DATA
  applyOverrides();

  // ─── Activation ──────────────────────────────────────────────────
  const isAdminURL = /(?:^|[?&])admin=1\b/.test(location.search);
  let active = isAdminURL;

  function shouldAutoOpen() { return active; }

  // Keyboard shortcut to toggle
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      active = !active;
      renderPanel();
    }
  });

  // ─── Panel UI ────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('rspba-admin-style')) return;
    const style = document.createElement('style');
    style.id = 'rspba-admin-style';
    style.textContent = `
      .rsa-launcher {
        position: fixed; bottom: 16px; left: 16px; z-index: 2147483645;
        background: #1e2630; color: #e5b87f;
        font: 600 11px/1 ui-monospace, monospace;
        letter-spacing: 0.16em; text-transform: uppercase;
        padding: 10px 14px; border-radius: 999px;
        border: 1px solid rgba(229,184,127,.4);
        cursor: pointer; user-select: none;
        box-shadow: 0 8px 24px rgba(0,0,0,.18);
      }
      .rsa-launcher:hover { background: #2a3340; }
      .rsa-launcher::before {
        content: ''; display: inline-block;
        width: 7px; height: 7px; border-radius: 50%;
        background: #6b9c7e; margin-right: 8px; vertical-align: 1px;
      }
      .rsa-overlay {
        position: fixed; inset: 0;
        background: rgba(15,18,24,.4);
        backdrop-filter: blur(2px);
        z-index: 2147483646;
      }
      .rsa-panel {
        position: fixed; top: 0; right: 0; bottom: 0;
        width: 520px; max-width: 100vw;
        background: #1a2029; color: #f1ece2;
        z-index: 2147483647;
        font: 13px/1.5 ui-sans-serif, system-ui, -apple-system, sans-serif;
        display: flex; flex-direction: column;
        box-shadow: -16px 0 40px rgba(0,0,0,.3);
        animation: rsaIn .2s ease-out;
      }
      @keyframes rsaIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      .rsa-head {
        padding: 16px 22px; display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,.08);
      }
      .rsa-head h2 {
        margin: 0; font: 500 15px/1 "Spectral", Georgia, serif;
        color: #f1ece2;
      }
      .rsa-head .rsa-sub {
        display: block;
        font: 500 10px/1 ui-monospace, monospace;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: #c89968; margin-top: 4px;
      }
      .rsa-x {
        background: transparent; border: 0; color: rgba(255,255,255,.6);
        font-size: 20px; cursor: pointer; padding: 4px 8px;
      }
      .rsa-x:hover { color: #f1ece2; }
      .rsa-tabs {
        display: flex; padding: 8px 16px; gap: 4px;
        border-bottom: 1px solid rgba(255,255,255,.08);
      }
      .rsa-tab {
        background: transparent; border: 0; color: rgba(255,255,255,.5);
        font: 500 12px/1 ui-sans-serif, system-ui, sans-serif;
        letter-spacing: 0.04em;
        padding: 9px 14px; border-radius: 6px;
        cursor: pointer;
      }
      .rsa-tab:hover { color: #f1ece2; background: rgba(255,255,255,.04); }
      .rsa-tab.active {
        color: #1a2029; background: #e5b87f; font-weight: 600;
      }
      .rsa-body {
        flex: 1; overflow-y: auto;
        padding: 20px 22px 80px;
      }
      .rsa-help {
        font: 400 12px/1.55 ui-sans-serif, system-ui, sans-serif;
        color: rgba(255,255,255,.55);
        margin: 0 0 16px;
        padding: 12px 14px;
        background: rgba(229,184,127,.06);
        border-left: 2px solid #c89968;
        border-radius: 0 4px 4px 0;
      }
      .rsa-list { display: flex; flex-direction: column; gap: 14px; }
      .rsa-card {
        background: #232b37;
        border: 1px solid rgba(255,255,255,.06);
        border-radius: 8px;
        padding: 14px 16px;
        display: flex; flex-direction: column; gap: 8px;
      }
      .rsa-card.past { opacity: .55; }
      .rsa-card.next { border-color: #c89968; }
      .rsa-fld { display: flex; flex-direction: column; gap: 4px; }
      .rsa-fld label {
        font: 600 10px/1 ui-monospace, monospace;
        letter-spacing: 0.14em; text-transform: uppercase;
        color: rgba(255,255,255,.45);
      }
      .rsa-fld input, .rsa-fld textarea, .rsa-fld select {
        background: #1a2029; color: #f1ece2;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 4px;
        font: 13px/1.4 ui-sans-serif, system-ui, sans-serif;
        padding: 8px 10px;
        outline: none;
      }
      .rsa-fld input:focus, .rsa-fld textarea:focus, .rsa-fld select:focus {
        border-color: #c89968;
      }
      .rsa-fld textarea { resize: vertical; min-height: 60px; font-family: ui-sans-serif, system-ui, sans-serif; }
      .rsa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .rsa-row { display: flex; align-items: center; gap: 8px; }
      .rsa-row .rsa-fld { flex: 1; }
      .rsa-card .rsa-card-h {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 4px;
      }
      .rsa-card-h strong {
        font: 500 14px/1.2 "Spectral", Georgia, serif;
        color: #f1ece2;
      }
      .rsa-card-h .rsa-status {
        font: 600 9px/1 ui-monospace, monospace;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: rgba(255,255,255,.5);
      }
      .rsa-card.next .rsa-status { color: #c89968; }
      .rsa-del {
        background: transparent; border: 1px solid rgba(255,80,80,.3);
        color: #ff8a8a; font: 500 11px/1 ui-sans-serif, sans-serif;
        padding: 5px 10px; border-radius: 4px; cursor: pointer;
      }
      .rsa-del:hover { background: rgba(255,80,80,.1); }
      .rsa-add {
        margin-top: 8px; padding: 12px;
        background: transparent;
        border: 1px dashed rgba(229,184,127,.4);
        color: #c89968;
        font: 600 12px/1 ui-sans-serif, sans-serif;
        letter-spacing: 0.04em;
        border-radius: 6px; cursor: pointer; width: 100%;
      }
      .rsa-add:hover { background: rgba(229,184,127,.06); }
      .rsa-foot {
        padding: 14px 22px; border-top: 1px solid rgba(255,255,255,.08);
        background: #161b22;
        display: flex; justify-content: space-between; align-items: center; gap: 8px;
      }
      .rsa-btn {
        font: 600 12px/1 ui-sans-serif, sans-serif;
        letter-spacing: 0.04em;
        padding: 10px 16px; border-radius: 6px;
        cursor: pointer; border: 0;
      }
      .rsa-btn.primary { background: #c89968; color: #1a2029; }
      .rsa-btn.primary:hover { background: #e5b87f; }
      .rsa-btn.ghost {
        background: transparent; color: rgba(255,255,255,.65);
        border: 1px solid rgba(255,255,255,.15);
      }
      .rsa-btn.ghost:hover { color: #f1ece2; border-color: rgba(255,255,255,.3); }
      .rsa-btn.danger {
        background: transparent; color: #ff8a8a;
        border: 1px solid rgba(255,80,80,.3);
      }
      .rsa-btn.danger:hover { background: rgba(255,80,80,.1); }
    `;
    document.head.appendChild(style);
  }

  let activeTab = 'events';
  let panelEl;

  function renderPanel() {
    injectStyles();
    if (panelEl) panelEl.remove();
    panelEl = null;
    document.querySelector('.rsa-overlay')?.remove();

    if (!active) {
      renderLauncher();
      return;
    }
    document.querySelector('.rsa-launcher')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'rsa-overlay';
    overlay.addEventListener('click', () => { active = false; renderPanel(); });
    document.body.appendChild(overlay);

    panelEl = document.createElement('aside');
    panelEl.className = 'rsa-panel';
    panelEl.addEventListener('click', (e) => e.stopPropagation());

    panelEl.innerHTML = `
      <header class="rsa-head">
        <div>
          <span class="rsa-sub">RSPBA London · Admin</span>
          <h2>Edit site content</h2>
        </div>
        <button class="rsa-x" aria-label="Close" data-act="close">×</button>
      </header>
      <nav class="rsa-tabs">
        <button class="rsa-tab ${activeTab==='events'?'active':''}" data-tab="events">Events / Contests</button>
        <button class="rsa-tab ${activeTab==='news'?'active':''}" data-tab="news">News bulletins</button>
        <button class="rsa-tab ${activeTab==='json'?'active':''}" data-tab="json">JSON view</button>
      </nav>
      <div class="rsa-body" id="rsa-body"></div>
      <footer class="rsa-foot">
        <button class="rsa-btn danger" data-act="reset">Reset to defaults</button>
        <div style="display:flex; gap: 8px;">
          <button class="rsa-btn ghost" data-act="download">Download data.js</button>
          <button class="rsa-btn primary" data-act="save">Save &amp; preview</button>
        </div>
      </footer>
    `;
    document.body.appendChild(panelEl);

    panelEl.querySelectorAll('[data-tab]').forEach(b => {
      b.addEventListener('click', () => { activeTab = b.dataset.tab; renderPanel(); });
    });
    panelEl.querySelector('[data-act="close"]').addEventListener('click', () => { active = false; renderPanel(); });
    panelEl.querySelector('[data-act="save"]').addEventListener('click', () => {
      persistOverrides();
      location.reload();
    });
    panelEl.querySelector('[data-act="reset"]').addEventListener('click', () => {
      if (confirm('Discard all edits and reload original data?')) clearOverrides();
    });
    panelEl.querySelector('[data-act="download"]').addEventListener('click', downloadDataJs);

    renderBody();
  }

  function renderLauncher() {
    if (document.querySelector('.rsa-launcher')) return;
    const b = document.createElement('button');
    b.className = 'rsa-launcher';
    b.type = 'button';
    b.title = 'Admin mode · Ctrl+Shift+A';
    b.textContent = 'Admin';
    b.addEventListener('click', () => { active = true; renderPanel(); });
    document.body.appendChild(b);
  }

  function renderBody() {
    const body = panelEl.querySelector('#rsa-body');
    if (!body) return;
    if (activeTab === 'events') body.innerHTML = '', renderEventsTab(body);
    if (activeTab === 'news')   body.innerHTML = '', renderNewsTab(body);
    if (activeTab === 'json')   body.innerHTML = '', renderJsonTab(body);
  }

  function renderEventsTab(body) {
    const help = document.createElement('p');
    help.className = 'rsa-help';
    help.innerHTML = 'Edit any contest. <strong>Date</strong> drives the countdown — once an event\'s date passes, the homepage countdown automatically advances to the next event. Drag to reorder is not implemented in this prototype; reorder by editing dates.';
    body.appendChild(help);

    const list = document.createElement('div');
    list.className = 'rsa-list';
    body.appendChild(list);

    const events = RSPBA_DATA.events;
    const partition = RSPBA.partitionEvents();
    events.forEach((evt, i) => {
      const isPast = RSPBA.isPast(evt);
      const isNext = partition.next && partition.next.id === evt.id;
      const card = document.createElement('div');
      card.className = 'rsa-card' + (isPast ? ' past' : '') + (isNext ? ' next' : '');
      card.innerHTML = `
        <div class="rsa-card-h">
          <strong>${escapeHtml(evt.name || 'Untitled')}</strong>
          <span class="rsa-status">${isNext ? 'Next ▸' : isPast ? 'Past' : 'Upcoming'}</span>
        </div>
        <div class="rsa-grid">
          <div class="rsa-fld">
            <label>Date &amp; time (ISO)</label>
            <input type="datetime-local" data-k="date" value="${toLocalDT(evt.date)}">
          </div>
          <div class="rsa-fld">
            <label>Tier</label>
            <select data-k="tier">
              <option value="branch" ${evt.tier==='branch'?'selected':''}>Branch</option>
              <option value="major"  ${evt.tier==='major'?'selected':''}>Major championship</option>
              <option value="agm"    ${evt.tier==='agm'?'selected':''}>AGM</option>
              <option value="training" ${evt.tier==='training'?'selected':''}>Training</option>
            </select>
          </div>
        </div>
        <div class="rsa-fld">
          <label>Contest name</label>
          <input data-k="name" value="${escapeAttr(evt.name || '')}">
        </div>
        <div class="rsa-fld">
          <label>Location</label>
          <input data-k="location" value="${escapeAttr(evt.location || '')}">
        </div>
        <div class="rsa-fld">
          <label>Full address</label>
          <input data-k="address" value="${escapeAttr(evt.address || '')}">
        </div>
        <div class="rsa-fld">
          <label>Description</label>
          <textarea data-k="description">${escapeHtml(evt.description || '')}</textarea>
        </div>
        <div class="rsa-fld">
          <label>Entry form URL</label>
          <input data-k="entryForm" value="${escapeAttr(evt.entryForm || '')}" placeholder="placeholder.html?doc=…">
        </div>
        <div class="rsa-row">
          <div class="rsa-fld" style="flex:1"></div>
          <button class="rsa-del" data-del-event="${evt.id}">Delete contest</button>
        </div>
      `;
      list.appendChild(card);

      // bind inputs
      card.querySelectorAll('[data-k]').forEach(inp => {
        inp.addEventListener('change', () => {
          let val = inp.value;
          if (inp.dataset.k === 'date') {
            val = new Date(val).toISOString();
          }
          events[i][inp.dataset.k] = val;
        });
      });
      card.querySelector('[data-del-event]').addEventListener('click', () => {
        if (confirm('Delete this contest?')) {
          events.splice(i, 1);
          renderBody();
        }
      });
    });

    const add = document.createElement('button');
    add.className = 'rsa-add';
    add.textContent = '+ Add new contest';
    add.addEventListener('click', () => {
      const today = new Date(); today.setHours(10,0,0,0);
      events.push({
        id: 'new-contest-' + Date.now(),
        date: today.toISOString(),
        name: 'New Contest',
        shortName: 'New Contest',
        location: '',
        address: '',
        tier: 'branch',
        category: 'outdoor',
        grades: [],
        description: '',
        entryForm: null,
        resultsAnchor: null
      });
      renderBody();
    });
    body.appendChild(add);
  }

  function renderNewsTab(body) {
    const help = document.createElement('p');
    help.className = 'rsa-help';
    help.innerHTML = 'News bulletins are sorted automatically — newest first by date. Add a bulletin here and it will appear on the homepage and the news archive.';
    body.appendChild(help);

    const list = document.createElement('div');
    list.className = 'rsa-list';
    body.appendChild(list);

    const news = RSPBA_DATA.news;
    news.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'rsa-card';
      card.innerHTML = `
        <div class="rsa-card-h">
          <strong>${escapeHtml(item.title || 'Untitled bulletin')}</strong>
          <span class="rsa-status">${RSPBA.formatDate(item.date, 'short')}</span>
        </div>
        <div class="rsa-grid">
          <div class="rsa-fld">
            <label>Date</label>
            <input type="date" data-k="date" value="${(item.date||'').slice(0,10)}">
          </div>
          <div class="rsa-fld">
            <label>Tag</label>
            <select data-k="tag">
              <option ${item.tag==='Results'?'selected':''}>Results</option>
              <option ${item.tag==='Admin'?'selected':''}>Admin</option>
              <option ${item.tag==='Education'?'selected':''}>Education</option>
              <option ${item.tag==='Tribute'?'selected':''}>Tribute</option>
              <option ${item.tag==='Notice'?'selected':''}>Notice</option>
            </select>
          </div>
        </div>
        <div class="rsa-fld">
          <label>Headline</label>
          <input data-k="title" value="${escapeAttr(item.title || '')}">
        </div>
        <div class="rsa-fld">
          <label>Summary</label>
          <textarea data-k="summary">${escapeHtml(item.summary || '')}</textarea>
        </div>
        <div class="rsa-grid">
          <div class="rsa-fld">
            <label>Link label</label>
            <input data-k="link.label" value="${escapeAttr((item.link||{}).label || '')}">
          </div>
          <div class="rsa-fld">
            <label>Link URL</label>
            <input data-k="link.url" value="${escapeAttr((item.link||{}).url || '')}">
          </div>
        </div>
        <div class="rsa-row">
          <div class="rsa-fld" style="flex:1"></div>
          <button class="rsa-del" data-del-news="${item.id}">Delete bulletin</button>
        </div>
      `;
      list.appendChild(card);

      card.querySelectorAll('[data-k]').forEach(inp => {
        inp.addEventListener('change', () => {
          const k = inp.dataset.k;
          if (k.startsWith('link.')) {
            item.link = item.link || {};
            item.link[k.split('.')[1]] = inp.value;
          } else {
            news[i][k] = inp.value;
          }
        });
      });
      card.querySelector('[data-del-news]').addEventListener('click', () => {
        if (confirm('Delete this bulletin?')) {
          news.splice(i, 1);
          renderBody();
        }
      });
    });

    const add = document.createElement('button');
    add.className = 'rsa-add';
    add.textContent = '+ Add new bulletin';
    add.addEventListener('click', () => {
      news.unshift({
        id: 'news-' + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        tag: 'Notice',
        title: '',
        summary: '',
        link: { label: 'Read more', url: '#' }
      });
      renderBody();
    });
    body.appendChild(add);
  }

  function renderJsonTab(body) {
    const help = document.createElement('p');
    help.className = 'rsa-help';
    help.innerHTML = 'Raw JSON view. Paste exported data here to restore it, or copy out for backup. Hit "Save &amp; preview" to apply.';
    body.appendChild(help);

    const ta = document.createElement('textarea');
    ta.style.cssText = 'width:100%; height: 60vh; background:#0e1116; color:#dde0d8; border:1px solid rgba(255,255,255,.1); border-radius:6px; padding:14px; font:12px/1.5 ui-monospace, monospace;';
    ta.value = JSON.stringify({
      events: RSPBA_DATA.events,
      results: RSPBA_DATA.results,
      news: RSPBA_DATA.news
    }, null, 2);
    ta.addEventListener('change', () => {
      try {
        const parsed = JSON.parse(ta.value);
        if (parsed.events) RSPBA_DATA.events = parsed.events;
        if (parsed.results) RSPBA_DATA.results = parsed.results;
        if (parsed.news)   RSPBA_DATA.news   = parsed.news;
      } catch (e) {
        alert('Invalid JSON: ' + e.message);
      }
    });
    body.appendChild(ta);
  }

  function downloadDataJs() {
    const dataJs =
      '// Generated by Admin panel — ' + new Date().toLocaleString() + '\n' +
      'window.RSPBA_DATA = ' +
      JSON.stringify({
        events: RSPBA_DATA.events,
        results: RSPBA_DATA.results,
        news: RSPBA_DATA.news
      }, null, 2) +
      ';\n';
    // Note: in production, the helpers in window.RSPBA stay in a separate file.
    const blob = new Blob([dataJs], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ─── utilities ───────────────────────────────────────────────────
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]));
  }
  function escapeAttr(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }
  function toLocalDT(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  // ─── boot ────────────────────────────────────────────────────────
  function boot() {
    injectStyles();
    if (shouldAutoOpen()) renderPanel();
    else renderLauncher();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
