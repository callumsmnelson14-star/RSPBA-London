// ═══════════════════════════════════════════════════════════════════
// RSPBA London · render.js
// Per-section renderers that read from window.RSPBA_DATA and write
// into the DOM. Pages call only the renderers they need.
// ═══════════════════════════════════════════════════════════════════

window.RSPBA_RENDER = (function () {

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]));
  }
  function escapeAttr(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  // ─── 1. HOMEPAGE FLOATING EVENT CARD (with countdown) ────────────
  function eventCard(el) {
    if (!el) return;
    let timer = null;

    function paint() {
      const next = RSPBA.nextEvent();
      if (!next) {
        el.innerHTML = `
          <div class="ec-row"><span class="ec-month">—</span></div>
          <div class="ec-body">
            <span class="ec-kicker">Next Branch Contest</span>
            <h3 class="ec-title">No upcoming contests scheduled</h3>
            <p class="ec-loc">Check the diary for next season's fixtures.</p>
            <a class="ec-cta" href="diary.html">View diary →</a>
          </div>
        `;
        return;
      }

      const d = new Date(next.date);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const monthsLong = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const cd = RSPBA.countdownTo(next.date);
      const isMajor = next.tier === 'major';
      const isAgm = next.tier === 'agm';
      const kicker = isMajor ? 'Major Championship' : isAgm ? 'Annual General Meeting' : 'Next Branch Contest';
      const ctaHref = next.entryForm || ('contests.html#contest-' + next.id);
      const ctaLabel = isAgm ? 'See AGM details →' : (next.entryForm ? 'Enter contest →' : 'View contest details →');
      const locTime = next.location + (isAgm ? '' : ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

      el.innerHTML = `
        <div class="ec-row">
          <span class="ec-month">${monthsLong[d.getMonth()]}</span>
          <span class="ec-day">${d.getDate()}</span>
          <span class="ec-year">${d.getFullYear()}</span>
        </div>
        <div class="ec-divider"></div>
        <div class="ec-body">
          <span class="ec-kicker">${kicker}</span>
          <h3 class="ec-title">${escapeHtml(next.shortName || next.name)}</h3>
          <p class="ec-loc">${escapeHtml(locTime)}</p>
          <div class="ec-countdown">
            <span><b data-u="d">${String(cd.d).padStart(2,'0')}</b> days</span>
            <span><b data-u="h">${String(cd.h).padStart(2,'0')}</b> hrs</span>
            <span><b data-u="m">${String(cd.m).padStart(2,'0')}</b> min</span>
            <span><b data-u="s">${String(cd.s).padStart(2,'0')}</b> sec</span>
          </div>
          <a class="ec-cta" href="${escapeAttr(ctaHref)}">${ctaLabel}</a>
        </div>
      `;
    }

    function tick() {
      const next = RSPBA.nextEvent();
      if (!next) { paint(); return; }
      const cd = RSPBA.countdownTo(next.date);
      // If we've rolled past the current event, repaint the whole card
      if (cd.diff <= 0) { paint(); return; }
      const set = (u, v) => {
        const x = el.querySelector('[data-u="' + u + '"]');
        if (x) x.textContent = String(v).padStart(2, '0');
      };
      set('d', cd.d); set('h', cd.h); set('m', cd.m); set('s', cd.s);
    }

    paint();
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  // ─── 2. HOMEPAGE DIARY (6 upcoming cards, .dx) ───────────────────
  function homeDiary(el) {
    if (!el) return;
    const partition = RSPBA.partitionEvents();
    // Show two most-recent past + next + upcoming, up to 6 total
    const ordered = []
      .concat(partition.past.slice(0, 2).reverse())
      .concat(partition.next ? [partition.next] : [])
      .concat(partition.upcoming);
    const list = ordered.slice(0, 6);

    el.innerHTML = list.map(evt => {
      const d = new Date(evt.date);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const isPast = RSPBA.isPast(evt);
      const isNext = partition.next && partition.next.id === evt.id;
      const isMajor = evt.tier === 'major';
      const isAgm = evt.tier === 'agm';
      const status = isPast ? 'Past' : isNext ? 'Next' : isMajor ? 'Major' : isAgm ? 'AGM' : (evt.category || 'Contest');
      const cls = ['dx', isPast ? 'past' : '', isNext ? 'next' : '', isMajor ? 'major' : ''].filter(Boolean).join(' ');
      const ctaHref = isPast
        ? (evt.resultsAnchor ? 'results.html#' + evt.resultsAnchor : 'results.html')
        : isNext
          ? (evt.entryForm || 'contests.html#contest-' + evt.id)
          : 'diary.html#' + evt.id;
      const ctaLabel = isPast ? 'Results &rarr;' : isNext ? 'Enter &rarr;' : 'Details &rarr;';
      return `
        <article class="${cls}">
          <header>
            <span class="dx-month">${months[d.getMonth()]}</span>
            <span class="dx-day">${d.getDate() <= 31 ? d.getDate() : ''}</span>
            <span class="dx-status ${(isNext || isMajor) ? 'highlight' : ''}">${status}</span>
          </header>
          <h4>${escapeHtml(evt.shortName || evt.name)}</h4>
          <span class="dx-loc">${escapeHtml(evt.location || '')}</span>
          <a href="${escapeAttr(ctaHref)}">${ctaLabel}</a>
        </article>
      `;
    }).join('');
  }

  // ─── 3. HOMEPAGE NEWS GRID (mix of card sizes) ───────────────────
  function homeNews(el) {
    if (!el) return;
    const news = RSPBA.recentNews(4);
    if (!news.length) { el.innerHTML = ''; return; }
    el.innerHTML = news.map((item, idx) => {
      const tagClass = item.tag === 'Admin' ? 'tag-admin'
                     : item.tag === 'Education' ? 'tag-edu'
                     : '';
      const isLg = idx === 0;
      const isQuote = item.tag === 'Education' && idx === news.length - 1;
      if (isQuote) {
        return `
          <article class="card card-quote">
            <div class="card-body">
              <span class="card-tag">${escapeHtml(item.tag || 'Notice')}</span>
              <h3 class="quote">${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.summary)}</p>
              <a href="${escapeAttr((item.link||{}).url || '#')}">${escapeHtml((item.link||{}).label || 'Read more')} →</a>
            </div>
          </article>
        `;
      }
      return `
        <article class="card ${isLg ? 'card-lg' : ''}">
          <image-slot id="news-${idx}" shape="rounded" radius="3" placeholder="${isLg ? 'Contest action · 16:9' : 'Image · 4:3'}"></image-slot>
          <div class="card-body">
            <div class="card-meta">
              <span class="card-tag ${tagClass}">${escapeHtml(item.tag || 'Notice')}</span>
              <time>${RSPBA.formatDate(item.date, 'long')}</time>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            <a href="${escapeAttr((item.link||{}).url || '#')}">${escapeHtml((item.link||{}).label || 'Read more')} →</a>
          </div>
        </article>
      `;
    }).join('');
  }

  // ─── 4. CONTESTS PAGE — full contest list ────────────────────────
  function contestList(el) {
    if (!el) return;
    const events = RSPBA_DATA.events.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const partition = RSPBA.partitionEvents();

    el.innerHTML = events.map(evt => {
      const d = new Date(evt.date);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const monthsLong = ['Jan.','Feb.','March','April','May','June','July','August','September','October','November','December'];
      const isPast = RSPBA.isPast(evt);
      const isNext = partition.next && partition.next.id === evt.id;
      const isMajor = evt.tier === 'major';
      const isAgm = evt.tier === 'agm';
      const cls = ['contest-card', isPast ? 'past' : '', isNext ? 'next' : '', isMajor ? 'major' : ''].filter(Boolean).join(' ');
      const tag = isPast ? (evt.category || 'Past')
                : isNext ? 'Next contest'
                : isMajor ? 'Major championship'
                : isAgm ? 'Annual general meeting'
                : (evt.category || 'Upcoming');
      const tagClass = isNext ? 'highlight' : isMajor ? 'major' : '';
      const flag = isNext ? '<span class="fx-flag">Next</span>' : isMajor ? '<span class="fx-flag">Major</span>' : '';
      const grades = (evt.grades || []).join(', ');
      const downloads = evt.entryForm
        ? `<div class="fx-downloads"><a href="${escapeAttr(evt.entryForm)}">↓ Entry form (PDF)</a></div>`
        : (isPast ? '' : `<div class="fx-downloads"><a href="placeholder.html?doc=${encodeURIComponent(evt.name + ' entry form')}">↓ Entry form (PDF)</a></div>`);
      const cta = isPast
        ? `<a class="btn btn-text" href="results.html${evt.resultsAnchor ? '#' + evt.resultsAnchor : ''}">Results &rarr;</a>`
        : isNext
          ? `<a class="btn btn-primary" href="${escapeAttr(evt.entryForm || 'placeholder.html?doc=' + encodeURIComponent(evt.name + ' entry form'))}">Enter contest &rarr;</a>
             <a class="btn btn-text" href="diary.html#${escapeAttr(evt.id)}">Diary entry</a>`
          : `<a class="btn btn-text" href="diary.html#${escapeAttr(evt.id)}">Diary entry &rarr;</a>`;
      return `
        <article class="${cls}" id="contest-${escapeAttr(evt.id)}">
          <header class="fx-date">
            <span class="fx-d">${d.getDate()}</span>
            <span class="fx-m">${monthsLong[d.getMonth()]}</span>
            <span class="fx-y">${d.getFullYear()}</span>
            ${flag}
          </header>
          <div class="fx-body">
            <span class="fx-tag ${tagClass}">${escapeHtml(tag)}</span>
            <h2>${escapeHtml(evt.name)}</h2>
            <p class="fx-loc">${escapeHtml(evt.address || evt.location || '')}</p>
            ${evt.description ? `<p class="fx-desc">${escapeHtml(evt.description)}</p>` : ''}
            ${grades ? `<p class="fx-loc" style="font-size: 13px; color: var(--muted); margin-bottom: 6px;"><strong style="font-family: var(--sans); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; font-size: 10px;">Grades</strong> &nbsp; ${escapeHtml(grades)}</p>` : ''}
            ${downloads}
          </div>
          <div class="fx-cta">${cta}</div>
        </article>
      `;
    }).join('');
  }

  // ─── 5. DIARY PAGE — vertical timeline ───────────────────────────
  function diaryTimeline(el) {
    if (!el) return;
    const events = RSPBA_DATA.events.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const partition = RSPBA.partitionEvents();

    el.innerHTML = events.map(evt => {
      const d = new Date(evt.date);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const monthsLong = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const isPast = RSPBA.isPast(evt);
      const isNext = partition.next && partition.next.id === evt.id;
      const cls = ['tl-item', isPast ? 'past' : '', isNext ? 'next' : ''].filter(Boolean).join(' ');
      const dateLabel = isPast ? ' · Past' : isNext ? ' · Next' : '';
      const ctaHref = isPast
        ? 'results.html' + (evt.resultsAnchor ? '#' + evt.resultsAnchor : '')
        : isNext
          ? 'contests.html#contest-' + evt.id
          : 'contests.html#contest-' + evt.id;
      const ctaLabel = isPast ? 'Results &rarr;' : isNext ? 'Enter &rarr;' : 'Entry forms &rarr;';
      return `
        <article class="${cls}" id="${escapeAttr(evt.id)}">
          <header><span class="tl-d">${d.getDate()}</span><span class="tl-m">${monthsLong[d.getMonth()]}${dateLabel}</span></header>
          <div class="tl-body">
            <h4>${escapeHtml(evt.name)}</h4>
            <p>${escapeHtml(evt.address || evt.location || '')}${evt.grades && evt.grades.length ? ' · ' + escapeHtml(evt.grades.join(', ')) : ''}</p>
          </div>
          <a class="tl-cta" href="${escapeAttr(ctaHref)}">${ctaLabel}</a>
        </article>
      `;
    }).join('');
  }

  // ─── 6. NEWS PAGE — full feed ────────────────────────────────────
  function newsFeed(el) {
    if (!el) return;
    const news = RSPBA.recentNews();
    el.innerHTML = news.map(item => {
      const tagClass = item.tag === 'Admin' ? 'admin'
                     : item.tag === 'Education' ? 'edu'
                     : item.tag === 'Tribute' ? 'tribute'
                     : '';
      return `
        <li>
          <span class="nf-date">${RSPBA.formatDate(item.date, 'long')}</span>
          <div class="nf-body">
            <span class="nf-tag ${tagClass}">${escapeHtml(item.tag || 'Notice')}</span>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.summary)}</p>
          </div>
          <a class="nf-cta" href="${escapeAttr((item.link||{}).url || '#')}">${escapeHtml((item.link||{}).label || 'Read')} &rarr;</a>
        </li>
      `;
    }).join('');
  }

  return { eventCard, homeDiary, homeNews, contestList, diaryTimeline, newsFeed };
})();
