// ═══════════════════════════════════════════════════════════════════
// RSPBA London · shared content data
//
// Single source of truth for events (contests, AGM) and news bulletins.
// Every page on the site reads from RSPBA_DATA.
//
// To edit: append/modify the arrays below. Or in the prototype, open
// any page with ?admin=1 to use the in-page admin editor.
//
// In PRODUCTION, this file should be replaced with content sourced from
// a CMS (Sanity, Decap CMS, Strapi, etc) or a static-data layer
// (MDX + content collections in Astro/Next). Keep the shape stable.
// ═══════════════════════════════════════════════════════════════════

window.RSPBA_DATA = {

  // ─── EVENTS (contests, AGM, training) ─────────────────────────────
  // status: 'past' is computed automatically from `date`; you can leave
  // it out. Use it explicitly only to override (e.g. cancelled events).
  // `tier`: 'branch' | 'major' | 'agm'
  // `category`: 'indoor' | 'outdoor' | 'memorial' | 'major' | 'agm' | 'training'
  events: [
    {
      id: 'miniband-2026',
      date: '2026-04-19T10:00:00+01:00',
      name: 'Miniband Contest',
      shortName: 'Miniband Contest',
      location: "Gordon's School, Woking",
      address: "Gordon's School, Woking GU24 9PT",
      tier: 'branch',
      category: 'indoor',
      grades: ['Quartets', 'Mini Bands', 'Solo Piping', 'Solo Drumming'],
      description: "The Branch's indoor opener, hosted annually at Gordon's School. Quartet and mini-band competition alongside solo piping & drumming across all junior and senior grades.",
      entryForm: null,   // 'placeholder.html?doc=…' or real URL
      resultsAnchor: 'miniband'
    },
    {
      id: 'jim-mcginn-2026',
      date: '2026-05-17T10:00:00+01:00',
      name: 'PM Jim McGinn Memorial Contest',
      shortName: 'PM Jim McGinn Memorial',
      location: 'Wyton on the Hill, Huntingdon',
      address: 'Wyton on the Hill, Huntingdon, Cambridgeshire PE28 2EF',
      tier: 'branch',
      category: 'memorial',
      grades: ['Full Band', 'Mini Band', 'Quartet', 'Solo Piping', 'Solo Drumming'],
      description: 'In memory of Pipe Major Jim McGinn, longtime branch stalwart. Full band, mini-band, quartet and solo competition across branch grades.',
      entryForm: null,
      resultsAnchor: 'jim-mcginn'
    },
    {
      id: 'colchester-2026',
      date: '2026-06-14T10:00:00+01:00',
      name: 'Pipes in the Park, Colchester Contest',
      shortName: 'Pipes in the Park, Colchester',
      location: 'Castle Park, Colchester',
      address: 'Castle Park, Colchester CO1 1UG',
      tier: 'branch',
      category: 'outdoor',
      grades: ['Full Band', 'Mini Band', 'Quartet', 'Solo Piping', 'Solo Drumming'],
      description: "The flagship outdoor branch contest, held in Colchester's Castle Park. Solos, mini-bands, quartets and full-band competition across all branch grades, finishing with massed bands.",
      entryForm: 'placeholder.html?doc=2026+Colchester+band+entry+form',
      resultsAnchor: 'colchester'
    },
    {
      id: 'corby-2026',
      date: '2026-07-12T10:00:00+01:00',
      name: 'Corby Highland Gathering',
      shortName: 'Corby Highland Gathering',
      location: 'East Carlton Country Park, Corby',
      address: 'East Carlton Country Park, Corby NN17 3BP',
      tier: 'branch',
      category: 'outdoor',
      grades: ['Full Band', 'Quartet', 'Solo Piping'],
      description: 'A long-running outdoor highland games hosted in Northamptonshire. Branch contest runs alongside the wider games programme.',
      entryForm: null,
      resultsAnchor: 'corby'
    },
    {
      id: 'chatsworth-2026',
      date: '2026-09-05T10:00:00+01:00',
      endDate: '2026-09-06T17:00:00+01:00',
      name: 'Chatsworth Country Fair · All England Championships',
      shortName: 'Chatsworth — All England Championships',
      location: 'Chatsworth House, Bakewell, Derbyshire',
      address: 'Chatsworth House, Bakewell DE45 1PP',
      tier: 'major',
      category: 'major',
      grades: ['Open · All grades', 'Solo Piping'],
      description: "The All-England Championships, hosted across two days in the grounds of Chatsworth House — the Branch's flagship event of the season.",
      entryForm: null,
      resultsAnchor: 'chatsworth'
    },
    {
      id: 'agm-2026',
      date: '2026-11-28T13:30:00+00:00',
      name: 'Branch AGM 2026',
      shortName: 'Branch AGM 2026',
      location: 'University of Bedfordshire, Luton',
      address: 'University of Bedfordshire, Luton Campus, LU1 3JU',
      tier: 'agm',
      category: 'agm',
      grades: [],
      description: 'Branch AGM preceded by a training workshop at 11:30. AGM begins 13:30.',
      entryForm: null,
      resultsAnchor: null
    }
  ],

  // ─── RESULTS (per-contest mark sheets) ───────────────────────────
  // Linked by `eventId`. Top of `placings` array = winner.
  // The first placing across all grades is highlighted on the print
  // sheet cover (use the lowest grade-number band as "top grade",
  // since Grade 1 > Grade 2 > Grade 3 etc).
  results: [
    {
      eventId: 'jim-mcginn-2026',
      date: '2026-05-17',
      adjudicators: { piping: 'A. Sloane', drumming: 'J. Cairns', ensemble: 'R. Mathieson' },
      grades: [
        {
          name: 'Grade 3A',
          gradeRank: 3,
          placings: [
            { pos: 1, band: 'City of London',                         piping: 92, drumming: 89, ensemble: 91, total: 272 }
          ]
        },
        {
          name: 'Grade 3B',
          gradeRank: 3.5,
          placings: [
            { pos: 1, band: 'Scots Guards Association — South',       piping: 88, drumming: 91, ensemble: 87, total: 266 }
          ]
        },
        {
          name: 'Grade 4A',
          gradeRank: 4,
          placings: [
            { pos: 1, band: 'City of Plymouth',                       piping: 85, drumming: 83, ensemble: 86, total: 254 },
            { pos: 2, band: 'Ratae',                                  piping: 78, drumming: 79, ensemble: 78, total: 235 }
          ]
        },
        {
          name: 'Grade 4B',
          gradeRank: 4.5,
          placings: [
            { pos: 1, band: 'Reading Scottish',                       piping: 82, drumming: 84, ensemble: 82, total: 248 },
            { pos: 2, band: 'Suffolk Glenmoriston',                   piping: 78, drumming: 80, ensemble: 79, total: 237 },
            { pos: 3, band: 'Milton Keynes & District',               piping: 76, drumming: 76, ensemble: 77, total: 229 }
          ]
        }
      ]
    },
    {
      eventId: 'miniband-2026',
      date: '2026-04-19',
      adjudicators: { music: 'T. Sloane', execution: 'I. Graham', ensemble: 'D. Belfield' },
      grades: [
        {
          name: 'MB Grade 1',
          gradeRank: 1,
          placings: [
            { pos: 1, band: 'Reading Scottish Mini A', music: 94, execution: 92, ensemble: 93, total: 279 },
            { pos: 2, band: 'Hampshire Caledonian',    music: 89, execution: 88, ensemble: 87, total: 264 }
          ]
        },
        {
          name: 'MB Grade 2',
          gradeRank: 2,
          placings: [
            { pos: 1, band: 'Stow Caledonian',         music: 83, execution: 82, ensemble: 81, total: 246 },
            { pos: 2, band: "Gordon's School",         music: 78, execution: 79, ensemble: 78, total: 235 }
          ]
        }
      ]
    }
  ],

  // ─── NEWS BULLETINS ──────────────────────────────────────────────
  news: [
    {
      id: 'jim-mcginn-2026-results',
      date: '2026-05-18',
      tag: 'Results',
      title: 'PM Jim McGinn Memorial Contest results published',
      summary: 'Mark sheets and adjudicator critiques from the contest held at Wyton-on-the-Hill, Huntingdon on 17 May 2026 are now available.',
      link: { label: 'View results', url: 'results.html#jim-mcginn' }
    },
    {
      id: 'rules-cio-2026',
      date: '2026-05-06',
      tag: 'Admin',
      title: 'Updated Branch Local Rules & CIO Model available',
      summary: 'The Branch governance documents have been refreshed for the 2026 season. Download from the Documents page.',
      link: { label: 'Documents', url: 'about.html#documents' }
    },
    {
      id: 'miniband-2026-results',
      date: '2026-04-28',
      tag: 'Results',
      title: "Miniband Contest results · Gordon's School, Woking",
      summary: 'Results from the indoor mini-band and solo contests held on 19 April 2026 are now published.',
      link: { label: 'View results', url: 'results.html#miniband' }
    },
    {
      id: 'agm-2025-docs',
      date: '2026-01-09',
      tag: 'Admin',
      title: 'Branch AGM 2025 documents archived',
      summary: 'Minutes from the 2023, 2024 and 2025 AGMs are available to download.',
      link: { label: 'AGM archive', url: 'about.html#agm' }
    },
    {
      id: 'sqa-signup-2026',
      date: '2025-10-21',
      tag: 'Education',
      title: 'Sign up · SQA-accredited Piping & Drumming Qualifications',
      summary: 'Registration open with Cliff Hall, Branch Education Officer, for the 28 March 2026 exam window.',
      link: { label: 'Find out more', url: 'learn.html#sqa' }
    },
    {
      id: 'subs-due-2025',
      date: '2025-10-20',
      tag: 'Admin',
      title: 'RSPBA subscriptions due end November',
      summary: 'Reminder to all bands that 2026 subscriptions are due by 30 November 2025. Late penalties apply thereafter.',
      link: { label: 'Subscribe', url: 'about.html#documents' }
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// HELPERS
//   - Pull "next" / "past" events
//   - Pull recent news
//   - Find a contest's top-grade winner for the print sheet
// ═══════════════════════════════════════════════════════════════════
window.RSPBA = {

  /** Returns an object: { past: [...], next: event|null, upcoming: [...] }
   *  - past: events whose date has passed (most recent first)
   *  - next: the very next future event
   *  - upcoming: everything after `next`, in date order
   */
  partitionEvents: function () {
    const now = Date.now();
    const sorted = (RSPBA_DATA.events || [])
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const past = sorted.filter(e => new Date(e.date).getTime() <= now).reverse();
    const future = sorted.filter(e => new Date(e.date).getTime() > now);
    return { past, next: future[0] || null, upcoming: future.slice(1) };
  },

  /** Returns the single next future event, or null. */
  nextEvent: function () { return this.partitionEvents().next; },

  /** Returns true if `evt.date` is in the past. */
  isPast: function (evt) { return new Date(evt.date).getTime() <= Date.now(); },

  /** Compute days/hrs/min/sec until `date`. */
  countdownTo: function (date) {
    const diff = Math.max(0, new Date(date).getTime() - Date.now());
    return {
      diff: diff,
      d: Math.floor(diff / 86400000),
      h: Math.floor(diff % 86400000 / 3600000),
      m: Math.floor(diff % 3600000 / 60000),
      s: Math.floor(diff % 60000 / 1000)
    };
  },

  /** Format event date nicely. */
  formatDate: function (date, fmt) {
    const d = new Date(date);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthsLong = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    if (fmt === 'long')  return d.getDate() + ' ' + monthsLong[d.getMonth()] + ' ' + d.getFullYear();
    if (fmt === 'short') return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    if (fmt === 'day')   return String(d.getDate()).padStart(2, '0');
    if (fmt === 'month') return months[d.getMonth()];
    if (fmt === 'iso')   return d.toISOString().slice(0, 10);
    return d.toLocaleDateString();
  },

  /** Recent news, newest first. */
  recentNews: function (limit) {
    const list = (RSPBA_DATA.news || [])
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return limit ? list.slice(0, limit) : list;
  },

  /** Find the results record for an event. */
  resultsFor: function (eventId) {
    return (RSPBA_DATA.results || []).find(r => r.eventId === eventId) || null;
  },

  /** Find the headline winner of a contest — the band that won the
   *  highest grade competing (lowest gradeRank number = top grade).
   *  Returns { grade, band, placing } or null. */
  topGradeWinner: function (eventId) {
    const r = this.resultsFor(eventId);
    if (!r || !r.grades || !r.grades.length) return null;
    const ranked = r.grades.slice().sort((a, b) => (a.gradeRank || 99) - (b.gradeRank || 99));
    const top = ranked[0];
    const winner = (top.placings || [])[0];
    if (!winner) return null;
    return { grade: top.name, band: winner.band, placing: winner };
  }
};
