// Tweaks · Glen

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#ecebe7", "#4a6e62", "#9c6b3c"],
  "headingStyle": "italic",
  "showStats": true,
  "cardStyle": "raised"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const root = document.documentElement;
  root.style.setProperty('--bg',      t.palette[0]);
  root.style.setProperty('--lichen',  t.palette[1]);
  root.style.setProperty('--heather', t.palette[2]);

  // Heading style — italic em accent vs no italic
  let s = document.getElementById('twk-head');
  if (!s) { s = document.createElement('style'); s.id = 'twk-head'; document.head.appendChild(s); }
  if (t.headingStyle === 'italic') {
    s.textContent = `.hero-title em, .section-title em { font-style: italic !important; }`;
  } else if (t.headingStyle === 'roman') {
    s.textContent = `.hero-title em, .section-title em { font-style: normal !important; color: var(--ink) !important; }`;
  } else {
    s.textContent = `.hero-title em, .section-title em { font-style: normal !important; }`;
  }

  // Hero stats visibility
  const stats = document.querySelector('.hero-stats');
  if (stats) stats.style.display = t.showStats ? '' : 'none';

  // Card style
  let c = document.getElementById('twk-card');
  if (!c) { c = document.createElement('style'); c.id = 'twk-card'; document.head.appendChild(c); }
  if (t.cardStyle === 'flat') {
    c.textContent = `.card, .dx, .result-card { box-shadow: none !important; }
    .card:hover, .dx:hover { box-shadow: none !important; transform: none !important; }`;
  } else if (t.cardStyle === 'bordered') {
    c.textContent = `.card, .dx, .result-card { box-shadow: none !important; border-width: 1.5px !important; }
    .card:hover, .dx:hover { transform: none !important; border-color: var(--lichen) !important; }`;
  } else {
    c.textContent = '';
  }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => applyTweaks(t), [t]);

  return (
    <TweaksPanel title="Tweaks · Glen">
      <TweakSection label="Palette" />
      <TweakColor
        label="Theme"
        value={t.palette}
        options={[
          ['#ecebe7', '#4a6e62', '#9c6b3c'],   // Lichen + Heather
          ['#eef0ea', '#2d5044', '#b8742c'],   // Deep moss + amber
          ['#eee9df', '#5a6478', '#a8623c'],   // Slate + clay
          ['#f4f1ea', '#7a3a4a', '#c89968'],   // Wine + whisky
        ]}
        onChange={(v) => setTweak('palette', v)}
      />

      <TweakSection label="Typography" />
      <TweakRadio
        label="Headline accent"
        value={t.headingStyle}
        options={['italic', 'roman']}
        onChange={(v) => setTweak('headingStyle', v)}
      />

      <TweakSection label="Layout" />
      <TweakToggle
        label="Hero stat row"
        value={t.showStats}
        onChange={(v) => setTweak('showStats', v)}
      />
      <TweakRadio
        label="Card style"
        value={t.cardStyle}
        options={['raised', 'flat', 'bordered']}
        onChange={(v) => setTweak('cardStyle', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
