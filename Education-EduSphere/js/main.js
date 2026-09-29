document.addEventListener('DOMContentLoaded', () => {
  initBespokeNavbarAndFooter();
  initLiveSandbox();
  initCourseFilters();
  initProgressRings();
  initBenchmark();
  initMentorHub();
  initWasmTerminal();
  initCertificate();
});

function initBespokeNavbarAndFooter() {
  const navbar = document.querySelector('.navbar-edusphere');
  const linksWrapper = document.querySelector('.nav-edu-wrapper');
  const slidingPill = document.getElementById('navEduSlidingPill');
  const navLinks = document.querySelectorAll('.nav-links-edusphere a');
  const mobileToggle = document.getElementById('mobileEduToggle');
  const mobileClose = document.getElementById('mobileEduClose');
  const mobileDrawer = document.getElementById('mobileDrawerEdu');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-edu-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  function movePill(el) {
    if (!el || !slidingPill || !linksWrapper) return;
    const parentRect = linksWrapper.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    slidingPill.style.width = `${rect.width}px`;
    slidingPill.style.left = `${rect.left - parentRect.left}px`;
    slidingPill.style.opacity = '1';
  }

  const activeLink = document.querySelector('.nav-links-edusphere a.active');
  if (activeLink) movePill(activeLink);

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => movePill(link));
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      movePill(link);
    });
  });

  linksWrapper?.addEventListener('mouseleave', () => {
    const currActive = document.querySelector('.nav-links-edusphere a.active');
    if (currActive) movePill(currActive);
    else if (slidingPill) slidingPill.style.opacity = '0';
  });

  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const matchedLink = document.querySelector(`.nav-links-edusphere a[href="#${id}"]`);
        if (matchedLink) {
          navLinks.forEach(l => l.classList.remove('active'));
          matchedLink.classList.add('active');
          movePill(matchedLink);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  function toggleDrawer(open) {
    mobileDrawer?.classList.toggle('is-open', open);
    mobileToggle?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mobileClose?.focus();
  }

  mobileToggle?.addEventListener('click', () => toggleDrawer(true));
  mobileClose?.addEventListener('click', () => toggleDrawer(false));
  drawerLinks.forEach(l => l.addEventListener('click', () => toggleDrawer(false)));

  const sfEl = document.getElementById('footerSfClock');
  function updateSfClock() {
    if (!sfEl) return;
    const options = { timeZone: 'America/Los_Angeles', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const sfTime = new Intl.DateTimeFormat([], options).format(new Date());
    sfEl.textContent = `🕒 SF Studio: ${sfTime} PST`;
  }
  setInterval(updateSfClock, 1000);
  updateSfClock();

  const eduBtn = document.getElementById('footerEduBtn');
  const eduEmail = document.getElementById('footerEduEmail');
  const eduStatus = document.getElementById('footerEduStatus');
  eduBtn?.addEventListener('click', () => {
    const val = eduEmail?.value.trim();
    if (val && eduStatus) {
      eduStatus.textContent = '✓ Architecture Brief issue dispatched!';
      eduEmail.value = '';
      setTimeout(() => { eduStatus.textContent = ''; }, 3500);
    }
  });
}

function initLiveSandbox() {
  const codeBlock = document.getElementById('ideCodeBlock');
  const lineNumbers = document.getElementById('ideLineNumbers');
  const preview = document.getElementById('sandboxLivePreview');
  const presetPills = document.querySelectorAll('.code-preset-pill');
  const tabBtns = document.querySelectorAll('.ide-tab');
  const copyBtn = document.getElementById('ideCopyBtn');
  const copyIcon = document.getElementById('ideCopyIcon');
  const statusFileInfo = document.getElementById('ideStatusFileInfo');

  let activePreset = 'neon';
  let activeFile = 'Button.tsx';

  let neonRuns = 0;
  let glassOnline = true;
  let bentoScore = 99.4;

  const presets = {
    neon: {
      name: 'Neon Glow',
      files: {
        'Button.tsx': {
          lang: 'TypeScript React',
          raw: `import React, { useState } from 'react';
import styles from './glass.module.scss';

export const NeonButton: React.FC = () => {
  const [runs, setRuns] = useState(0);

  return (
    <button 
      className={styles.neonGlow}
      onClick={() => setRuns(c => c + 1)}
    >
      <span className={styles.pulseDot} />
      <span>Launch Kernel</span>
      <span className={styles.counter}>{runs} runs</span>
    </button>
  );
};`,
          tokens: `<span class="syn-kw">import</span> <span class="syn-type">React</span>, { <span class="syn-fn">useState</span> } <span class="syn-kw">from</span> <span class="syn-str">'react'</span>;
<span class="syn-kw">import</span> <span class="syn-prop">styles</span> <span class="syn-kw">from</span> <span class="syn-str">'./glass.module.scss'</span>;

<span class="syn-kw">export</span> <span class="syn-kw">const</span> <span class="syn-fn">NeonButton</span>: <span class="syn-type">React</span>.<span class="syn-type">FC</span> = () => {
  <span class="syn-kw">const</span> [<span class="syn-prop">runs</span>, <span class="syn-fn">setRuns</span>] = <span class="syn-fn">useState</span>(<span class="syn-val">0</span>);

  <span class="syn-kw">return</span> (
    <span class="syn-tag">&lt;button</span> 
      <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">neonGlow</span><span class="syn-punct">}</span>
      <span class="syn-prop">onClick</span>=<span class="syn-punct">{() =&gt;</span> <span class="syn-fn">setRuns</span>(<span class="syn-prop">c</span> =&gt; <span class="syn-prop">c</span> + <span class="syn-val">1</span>)<span class="syn-punct">}</span>
    <span class="syn-tag">&gt;</span>
      <span class="syn-tag">&lt;span</span> <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">pulseDot</span><span class="syn-punct">}</span> <span class="syn-tag">/&gt;</span>
      <span class="syn-tag">&lt;span&gt;</span>Launch Kernel<span class="syn-tag">&lt;/span&gt;</span>
      <span class="syn-tag">&lt;span</span> <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">counter</span><span class="syn-punct">}</span><span class="syn-tag">&gt;</span><span class="syn-punct">{</span><span class="syn-prop">runs</span><span class="syn-punct">}</span> runs<span class="syn-tag">&lt;/span&gt;</span>
    <span class="syn-tag">&lt;/button&gt;</span>
  );
};`
        },
        'glass.module.scss': {
          lang: 'SCSS Design Tokens',
          raw: `@use 'tokens' as *;

.neonGlow {
  background: linear-gradient(135deg, #4F46E5, #EC4899);
  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.45);
  transform: translateZ(0);
  transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 14px 30px rgba(236, 72, 153, 0.65);
  }
}`,
          tokens: `<span class="syn-kw">@use</span> <span class="syn-str">'tokens'</span> <span class="syn-kw">as</span> *;

.<span class="syn-fn">neonGlow</span> <span class="syn-punct">{</span>
  <span class="syn-prop">background</span>: <span class="syn-fn">linear-gradient</span>(<span class="syn-val">135deg</span>, <span class="syn-val">#4F46E5</span>, <span class="syn-val">#EC4899</span>);
  <span class="syn-prop">box-shadow</span>: <span class="syn-val">0 10px 25px</span> <span class="syn-fn">rgba</span>(<span class="syn-val">236</span>, <span class="syn-val">72</span>, <span class="syn-val">153</span>, <span class="syn-val">0.45</span>);
  <span class="syn-prop">transform</span>: <span class="syn-fn">translateZ</span>(<span class="syn-val">0</span>);
  <span class="syn-prop">transition</span>: <span class="syn-prop">transform</span> <span class="syn-val">180ms</span> <span class="syn-fn">cubic-bezier</span>(<span class="syn-val">0.16</span>, <span class="syn-val">1</span>, <span class="syn-val">0.3</span>, <span class="syn-val">1</span>);

  &amp;:<span class="syn-kw">hover</span> <span class="syn-punct">{</span>
    <span class="syn-prop">transform</span>: <span class="syn-fn">translateY</span>(<span class="syn-val">-2px</span>) <span class="syn-fn">scale</span>(<span class="syn-val">1.02</span>);
    <span class="syn-prop">box-shadow</span>: <span class="syn-val">0 14px 30px</span> <span class="syn-fn">rgba</span>(<span class="syn-val">236</span>, <span class="syn-val">72</span>, <span class="syn-val">153</span>, <span class="syn-val">0.65</span>);
  <span class="syn-punct">}</span>
<span class="syn-punct">}</span>`
        }
      }
    },
    glass: {
      name: 'Frosted Glass',
      files: {
        'Button.tsx': {
          lang: 'TypeScript React',
          raw: `import React, { useState } from 'react';
import styles from './glass.module.scss';

export const GlassPill: React.FC = () => {
  const [online, setOnline] = useState(true);

  return (
    <div 
      className={styles.frostedCard}
      onClick={() => setOnline(!online)}
    >
      <span className={styles.sheen} />
      <span>Telemetry Stream</span>
      <span className={online ? styles.active : styles.paused}>
        {online ? 'ONLINE' : 'PAUSED'}
      </span>
    </div>
  );
};`,
          tokens: `<span class="syn-kw">import</span> <span class="syn-type">React</span>, { <span class="syn-fn">useState</span> } <span class="syn-kw">from</span> <span class="syn-str">'react'</span>;
<span class="syn-kw">import</span> <span class="syn-prop">styles</span> <span class="syn-kw">from</span> <span class="syn-str">'./glass.module.scss'</span>;

<span class="syn-kw">export</span> <span class="syn-kw">const</span> <span class="syn-fn">GlassPill</span>: <span class="syn-type">React</span>.<span class="syn-type">FC</span> = () => {
  <span class="syn-kw">const</span> [<span class="syn-prop">online</span>, <span class="syn-fn">setOnline</span>] = <span class="syn-fn">useState</span>(<span class="syn-val">true</span>);

  <span class="syn-kw">return</span> (
    <span class="syn-tag">&lt;div</span> 
      <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">frostedCard</span><span class="syn-punct">}</span>
      <span class="syn-prop">onClick</span>=<span class="syn-punct">{() =&gt;</span> <span class="syn-fn">setOnline</span>(!<span class="syn-prop">online</span>)<span class="syn-punct">}</span>
    <span class="syn-tag">&gt;</span>
      <span class="syn-tag">&lt;span</span> <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">sheen</span><span class="syn-punct">}</span> <span class="syn-tag">/&gt;</span>
      <span class="syn-tag">&lt;span&gt;</span>Telemetry Stream<span class="syn-tag">&lt;/span&gt;</span>
      <span class="syn-tag">&lt;span</span> <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">online</span> ? <span class="syn-prop">styles</span>.<span class="syn-prop">active</span> : <span class="syn-prop">styles</span>.<span class="syn-prop">paused</span><span class="syn-punct">}</span><span class="syn-tag">&gt;</span>
        <span class="syn-punct">{</span><span class="syn-prop">online</span> ? <span class="syn-str">'ONLINE'</span> : <span class="syn-str">'PAUSED'</span><span class="syn-punct">}</span>
      <span class="syn-tag">&lt;/span&gt;</span>
    <span class="syn-tag">&lt;/div&gt;</span>
  );
};`
        },
        'glass.module.scss': {
          lang: 'SCSS Design Tokens',
          raw: `@use 'tokens' as *;

.frostedCard {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
  transform: translateZ(0);

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    transform: translateY(-2px) scale(1.02);
  }
}`,
          tokens: `<span class="syn-kw">@use</span> <span class="syn-str">'tokens'</span> <span class="syn-kw">as</span> *;

.<span class="syn-fn">frostedCard</span> <span class="syn-punct">{</span>
  <span class="syn-prop">background</span>: <span class="syn-fn">rgba</span>(<span class="syn-val">255</span>, <span class="syn-val">255</span>, <span class="syn-val">255</span>, <span class="syn-val">0.08</span>);
  <span class="syn-prop">backdrop-filter</span>: <span class="syn-fn">blur</span>(<span class="syn-val">20px</span>) <span class="syn-fn">saturate</span>(<span class="syn-val">180%</span>);
  <span class="syn-prop">border</span>: <span class="syn-val">1px solid</span> <span class="syn-fn">rgba</span>(<span class="syn-val">255</span>, <span class="syn-val">255</span>, <span class="syn-val">255</span>, <span class="syn-val">0.22</span>);
  <span class="syn-prop">box-shadow</span>: <span class="syn-val">0 20px 40px -10px</span> <span class="syn-fn">rgba</span>(<span class="syn-val">0</span>, <span class="syn-val">0</span>, <span class="syn-val">0</span>, <span class="syn-val">0.4</span>);
  <span class="syn-prop">transform</span>: <span class="syn-fn">translateZ</span>(<span class="syn-val">0</span>);

  &amp;:<span class="syn-kw">hover</span> <span class="syn-punct">{</span>
    <span class="syn-prop">background</span>: <span class="syn-fn">rgba</span>(<span class="syn-val">255</span>, <span class="syn-val">255</span>, <span class="syn-val">255</span>, <span class="syn-val">0.14</span>);
    <span class="syn-prop">transform</span>: <span class="syn-fn">translateY</span>(<span class="syn-val">-2px</span>) <span class="syn-fn">scale</span>(<span class="syn-val">1.02</span>);
  <span class="syn-punct">}</span>
<span class="syn-punct">}</span>`
        }
      }
    },
    bento: {
      name: 'Bento',
      files: {
        'Button.tsx': {
          lang: 'TypeScript React',
          raw: `import React, { useState } from 'react';
import styles from './glass.module.scss';

export const BentoWidget: React.FC = () => {
  const [score, setScore] = useState(99.4);

  return (
    <div 
      className={styles.bentoTile}
      onClick={() => setScore(s => +(s + 0.1).toFixed(1))}
    >
      <div className={styles.header}>
        <span>WASM COMPILER</span>
        <span className={styles.ping} />
      </div>
      <div className={styles.stat}>{score}%</div>
      <p className={styles.desc}>Zero runtime overhead</p>
    </div>
  );
};`,
          tokens: `<span class="syn-kw">import</span> <span class="syn-type">React</span>, { <span class="syn-fn">useState</span> } <span class="syn-kw">from</span> <span class="syn-str">'react'</span>;
<span class="syn-kw">import</span> <span class="syn-prop">styles</span> <span class="syn-kw">from</span> <span class="syn-str">'./glass.module.scss'</span>;

<span class="syn-kw">export</span> <span class="syn-kw">const</span> <span class="syn-fn">BentoWidget</span>: <span class="syn-type">React</span>.<span class="syn-type">FC</span> = () => {
  <span class="syn-kw">const</span> [<span class="syn-prop">score</span>, <span class="syn-fn">setScore</span>] = <span class="syn-fn">useState</span>(<span class="syn-val">99.4</span>);

  <span class="syn-kw">return</span> (
    <span class="syn-tag">&lt;div</span> 
      <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">bentoTile</span><span class="syn-punct">}</span>
      <span class="syn-prop">onClick</span>=<span class="syn-punct">{() =&gt;</span> <span class="syn-fn">setScore</span>(<span class="syn-prop">s</span> =&gt; +(<span class="syn-prop">s</span> + <span class="syn-val">0.1</span>).<span class="syn-fn">toFixed</span>(<span class="syn-val">1</span>))<span class="syn-punct">}</span>
    <span class="syn-tag">&gt;</span>
      <span class="syn-tag">&lt;div</span> <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">header</span><span class="syn-punct">}</span><span class="syn-tag">&gt;</span>
        <span class="syn-tag">&lt;span&gt;</span>WASM COMPILER<span class="syn-tag">&lt;/span&gt;</span>
        <span class="syn-tag">&lt;span</span> <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">ping</span><span class="syn-punct">}</span> <span class="syn-tag">/&gt;</span>
      <span class="syn-tag">&lt;/div&gt;</span>
      <span class="syn-tag">&lt;div</span> <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">stat</span><span class="syn-punct">}</span><span class="syn-tag">&gt;</span><span class="syn-punct">{</span><span class="syn-prop">score</span><span class="syn-punct">}</span>%<span class="syn-tag">&lt;/div&gt;</span>
      <span class="syn-tag">&lt;p</span> <span class="syn-prop">className</span>=<span class="syn-punct">{</span><span class="syn-prop">styles</span>.<span class="syn-prop">desc</span><span class="syn-punct">}</span><span class="syn-tag">&gt;</span>Zero runtime overhead<span class="syn-tag">&lt;/p&gt;</span>
    <span class="syn-tag">&lt;/div&gt;</span>
  );
};`
        },
        'glass.module.scss': {
          lang: 'SCSS Design Tokens',
          raw: `@use 'tokens' as *;

.bentoTile {
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 14px;
  box-shadow: 0 18px 36px -8px rgba(0, 0, 0, 0.5);
  transform: translateZ(0);

  &:hover {
    border-color: #38BDF8;
    transform: translateY(-2px) scale(1.02);
  }
}`,
          tokens: `<span class="syn-kw">@use</span> <span class="syn-str">'tokens'</span> <span class="syn-kw">as</span> *;

.<span class="syn-fn">bentoTile</span> <span class="syn-punct">{</span>
  <span class="syn-prop">background</span>: <span class="syn-val">#0F172A</span>;
  <span class="syn-prop">border</span>: <span class="syn-val">1px solid</span> <span class="syn-val">#334155</span>;
  <span class="syn-prop">border-radius</span>: <span class="syn-val">14px</span>;
  <span class="syn-prop">box-shadow</span>: <span class="syn-val">0 18px 36px -8px</span> <span class="syn-fn">rgba</span>(<span class="syn-val">0</span>, <span class="syn-val">0</span>, <span class="syn-val">0</span>, <span class="syn-val">0.5</span>);
  <span class="syn-prop">transform</span>: <span class="syn-fn">translateZ</span>(<span class="syn-val">0</span>);

  &amp;:<span class="syn-kw">hover</span> <span class="syn-punct">{</span>
    <span class="syn-prop">border-color</span>: <span class="syn-val">#38BDF8</span>;
    <span class="syn-prop">transform</span>: <span class="syn-fn">translateY</span>(<span class="syn-val">-2px</span>) <span class="syn-fn">scale</span>(<span class="syn-val">1.02</span>);
  <span class="syn-punct">}</span>
<span class="syn-punct">}</span>`
        }
      }
    }
  };

  function renderEditor() {
    const fileData = presets[activePreset].files[activeFile];
    if (!fileData) return;

    if (codeBlock) {
      codeBlock.innerHTML = fileData.tokens;
    }

    if (lineNumbers) {
      const lineCount = fileData.raw.split('\n').length;
      lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => i + 1).join('<br>');
    }

    if (statusFileInfo) {
      statusFileInfo.textContent = `${fileData.lang} · UTF-8`;
    }
  }

  function renderPreview() {
    if (!preview) return;

    if (activePreset === 'neon') {
      preview.innerHTML = `
        <div class="preview-stage" id="previewStage">
          <button type="button" class="preview-neon-btn" id="interactiveNeonBtn" aria-label="Interactive Neon Button">
            <span class="neon-pulse-dot" aria-hidden="true"></span>
            <span>Launch Kernel</span>
            <span class="neon-counter-pill" id="neonCounterPill">${neonRuns} runs</span>
          </button>
          <div class="preview-hint-caption">
            <i class="bi bi-hand-index-thumb"></i> Click to invoke kernel
          </div>
        </div>
      `;

      const neonBtn = document.getElementById('interactiveNeonBtn');
      const counterPill = document.getElementById('neonCounterPill');
      neonBtn?.addEventListener('click', () => {
        neonRuns += 1;
        if (counterPill) counterPill.textContent = `${neonRuns} runs`;
        neonBtn.classList.remove('clicked');
        void neonBtn.offsetWidth;
        neonBtn.classList.add('clicked');
      });
    } else if (activePreset === 'glass') {
      preview.innerHTML = `
        <div class="preview-stage" id="previewStage">
          <div class="preview-glass-card" id="interactiveGlassCard" role="button" tabindex="0" aria-label="Interactive Telemetry Pill">
            <span class="glass-sheen" aria-hidden="true"></span>
            <div class="glass-body">
              <span class="glass-live-dot" aria-hidden="true"></span>
              <span class="glass-title">Telemetry Stream</span>
            </div>
            <span class="glass-status-badge ${glassOnline ? 'online' : 'paused'}" id="glassStatusBadge">
              ${glassOnline ? 'ONLINE' : 'PAUSED'}
            </span>
          </div>
          <div class="preview-hint-caption">
            <i class="bi bi-toggle2-on"></i> Click or press space to toggle
          </div>
        </div>
      `;

      const glassCard = document.getElementById('interactiveGlassCard');
      const badge = document.getElementById('glassStatusBadge');
      function toggleGlass() {
        glassOnline = !glassOnline;
        if (badge) {
          badge.className = `glass-status-badge ${glassOnline ? 'online' : 'paused'}`;
          badge.textContent = glassOnline ? 'ONLINE' : 'PAUSED';
        }
      }
      glassCard?.addEventListener('click', toggleGlass);
      glassCard?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleGlass();
        }
      });
    } else if (activePreset === 'bento') {
      preview.innerHTML = `
        <div class="preview-stage" id="previewStage">
          <div class="preview-bento-tile" id="interactiveBentoTile" role="button" tabindex="0" aria-label="Interactive Bento Telemetry Tile">
            <div class="bento-header-row">
              <span class="bento-node-tag">WASM COMPILER</span>
              <span class="bento-ping-dot" aria-hidden="true"></span>
            </div>
            <div class="bento-metric-val" id="bentoMetricVal">${bentoScore.toFixed(1)}%</div>
            <div class="bento-metric-caption">
              <i class="bi bi-cpu text-info"></i> Zero runtime overhead
            </div>
          </div>
          <div class="preview-hint-caption">
            <i class="bi bi-speedometer2"></i> Click to benchmark speed
          </div>
        </div>
      `;

      const bentoTile = document.getElementById('interactiveBentoTile');
      const metricVal = document.getElementById('bentoMetricVal');
      function bumpBento() {
        bentoScore = bentoScore >= 99.9 ? 99.4 : +(bentoScore + 0.1).toFixed(1);
        if (metricVal) {
          metricVal.textContent = `${bentoScore.toFixed(1)}%`;
          metricVal.style.transform = 'scale(1.08)';
          setTimeout(() => { if (metricVal) metricVal.style.transform = 'scale(1)'; }, 150);
        }
      }
      bentoTile?.addEventListener('click', bumpBento);
      bentoTile?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          bumpBento();
        }
      });
    }
  }

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');
      activePreset = pill.dataset.preset || 'neon';
      renderEditor();
      renderPreview();
    });
  });

  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeFile = tab.dataset.file || 'Button.tsx';
      renderEditor();
    });
  });

  copyBtn?.addEventListener('click', () => {
    const raw = presets[activePreset].files[activeFile]?.raw || '';
    navigator.clipboard?.writeText(raw).then(() => {
      copyBtn.classList.add('copied');
      if (copyIcon) copyIcon.className = 'bi bi-check2';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (copyIcon) copyIcon.className = 'bi bi-clipboard';
      }, 1800);
    }).catch(() => {});
  });

  renderEditor();
  renderPreview();
}

function initCourseFilters() {
  const searchInput = document.getElementById('courseSearchInput');
  const filterBtns = document.querySelectorAll('.course-filter-btn');
  const courseCards = document.querySelectorAll('.course-item-col');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilter() {
    courseCards.forEach(card => {
      const cat = card.dataset.category || '';
      const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
      const matchesCat = activeCategory === 'all' || cat === activeCategory;
      const matchesSearch = title.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());

      card.style.display = matchesCat && matchesSearch ? '' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter || 'all';
      applyFilter();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target.value || '').trim();
    applyFilter();
  });
}

function initProgressRings() {
  const ring = document.getElementById('progressRingCircle');
  if (!ring) return;

  const r = ring.r.baseVal.value || 48;
  const circumference = 2 * Math.PI * r;
  const percent = parseFloat(ring.dataset.percent || '82');
  const offset = circumference - (percent / 100) * circumference;

  ring.style.strokeDasharray = `${circumference} ${circumference}`;
  ring.style.strokeDashoffset = `${circumference}`;

  requestAnimationFrame(() => {
    setTimeout(() => {
      ring.style.strokeDashoffset = `${offset}`;
    }, 200);
  });
}

function initBenchmark() {
  const sCss = document.getElementById('sliderCss');
  const sWasm = document.getElementById('sliderWasm');
  const sWebgl = document.getElementById('sliderWebgl');
  const sAi = document.getElementById('sliderAi');

  const vCss = document.getElementById('valCss');
  const vWasm = document.getElementById('valWasm');
  const vWebgl = document.getElementById('valWebgl');
  const vAi = document.getElementById('valAi');

  const polygon = document.getElementById('radarPolygon');
  const scoreBadge = document.getElementById('benchmarkTierBadge');
  const overallScore = document.getElementById('benchmarkOverallScore');
  const recEl = document.getElementById('benchmarkRecommendation');

  if (!sCss || !sWasm || !sWebgl || !sAi || !polygon) return;

  function updateRadar() {
    const css = parseInt(sCss.value, 10);
    const wasm = parseInt(sWasm.value, 10);
    const webgl = parseInt(sWebgl.value, 10);
    const ai = parseInt(sAi.value, 10);

    if (vCss) vCss.textContent = `${css}%`;
    if (vWasm) vWasm.textContent = `${wasm}%`;
    if (vWebgl) vWebgl.textContent = `${webgl}%`;
    if (vAi) vAi.textContent = `${ai}%`;

    const cx = 120;
    const cy = 120;
    const maxR = 90;

    const topY = cy - (css / 100) * maxR;
    const rightX = cx + (wasm / 100) * maxR;
    const bottomY = cy + (webgl / 100) * maxR;
    const leftX = cx - (ai / 100) * maxR;

    polygon.setAttribute('points', `${cx},${topY} ${rightX},${cy} ${cx},${bottomY} ${leftX},${cy}`);

    const avg = Math.round((css + wasm + webgl + ai) / 4);
    if (overallScore) overallScore.textContent = `${avg} / 100`;

    if (scoreBadge && recEl) {
      if (avg >= 88) {
        scoreBadge.textContent = 'Principal Systems Architect';
        recEl.innerHTML = 'Recommended Track: <strong class="text-dark">WASM Compilers & WebGL 2.0 Math</strong>';
      } else if (avg >= 75) {
        scoreBadge.textContent = 'Staff UI Architect';
        recEl.innerHTML = 'Recommended Track: <strong class="text-dark">Generative UI & LLM Streaming Interfaces</strong>';
      } else {
        scoreBadge.textContent = 'Core Frontend Specialist';
        recEl.innerHTML = 'Recommended Track: <strong class="text-dark">Advanced CSS Layouts, Subgrids & Bento Design</strong>';
      }
    }
  }

  [sCss, sWasm, sWebgl, sAi].forEach(s => s.addEventListener('input', updateRadar));
  updateRadar();
}

function initMentorHub() {
  const reqBtn = document.getElementById('requestReviewBtn');
  reqBtn?.addEventListener('click', () => {
    reqBtn.disabled = true;
    const originalText = reqBtn.innerHTML;
    reqBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span> Matching Architect...';
    
    setTimeout(() => {
      reqBtn.innerHTML = '✓ Mentor Elena Assigned (Room #884)';
      reqBtn.classList.replace('btn-solid-primary', 'btn-outline-primary-pill');
      setTimeout(() => {
        reqBtn.innerHTML = originalText;
        reqBtn.classList.replace('btn-outline-primary-pill', 'btn-solid-primary');
        reqBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

function initWasmTerminal() {
  const output = document.getElementById('wasmTerminalOutput');
  const input = document.getElementById('wasmTerminalInput');
  const form = document.getElementById('wasmTerminalForm');
  const chips = document.querySelectorAll('.wasm-chip-btn');

  function appendLine(text, type = 'dim') {
    if (!output) return;
    const line = document.createElement('div');
    line.className = `wasm-log-line wasm-log-${type}`;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function runCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase().replace(/^(\$|edusphere)\s*/, '');
    appendLine(`$ edusphere ${cleanCmd}`, 'prompt');

    if (cleanCmd === 'clear') {
      if (output) output.innerHTML = '';
      appendLine('# Terminal output cleared.', 'dim');
      return;
    }

    if (cleanCmd === 'test' || cleanCmd === 'test --math') {
      appendLine('[TEST RUNNER] Initializing SIMD f32 vector test runner...', 'info');
      setTimeout(() => {
        appendLine('✓ test_css_clamp_interpolation (0.12ms) - PASS', 'success');
        appendLine('✓ test_subgrid_gap_resolution (0.08ms) - PASS', 'success');
        appendLine('✓ test_webgl_matrix4_mult (0.34ms) - PASS', 'success');
        appendLine('[RESULT] 3/3 tests passed with 0 memory leaks.', 'info');
      }, 250);
      return;
    }

    if (cleanCmd === 'compile' || cleanCmd === 'compile --wasm') {
      appendLine('[WASM COMPILER] Target: wasm32-unknown-unknown', 'info');
      setTimeout(() => {
        appendLine('[OPTIMIZE] Running tree-shaking & dead code elimination...', 'dim');
        appendLine('✓ Emitted edusphere_runtime.wasm (42.8 KB)', 'success');
        appendLine('✓ Bytecode verified with WASI preview 1 (14.2ms)', 'info');
      }, 300);
      return;
    }

    if (cleanCmd === 'audit' || cleanCmd === 'audit --perf') {
      appendLine('[AUDIT] Sampling 60fps frame budgets over 1000ms...', 'info');
      setTimeout(() => {
        appendLine('✓ Core Web Vitals: LCP: 0.6s (Good) • CLS: 0.00 (Good) • INP: 8ms (Good)', 'success');
        appendLine('✓ GPU Composition: 100% Hardware Accelerated (0 layer thrashing)', 'success');
      }, 280);
      return;
    }

    if (cleanCmd === 'help') {
      appendLine('Available commands:', 'info');
      appendLine('  test --math       Run SIMD math and layout tests', 'dim');
      appendLine('  compile --wasm    Compile runtime WebAssembly bytecode', 'dim');
      appendLine('  audit --perf      Sample Web Vitals & 60fps frame budget', 'dim');
      appendLine('  status            Show compiler telemetry & active memory', 'dim');
      appendLine('  clear             Clear terminal screen', 'dim');
      return;
    }

    if (cleanCmd === 'status') {
      appendLine('WASM v3.2 Engine: Active • Memory: 14.2MB • JIT tier: Baseline', 'success');
      return;
    }

    appendLine(`Command '${cleanCmd}' not recognized. Type 'help' for available commands.`, 'dim');
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd || '';
      runCommand(cmd);
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input) return;
    const val = input.value.trim();
    if (val) {
      runCommand(val);
      input.value = '';
    }
  });
}

function initCertificate() {
  const input = document.getElementById('certStudentName');
  const display = document.getElementById('certDisplayName');
  const copyHashBtn = document.getElementById('copyCertHashBtn');
  const linkedInBtn = document.getElementById('shareLinkedInBtn');
  const certStatus = document.getElementById('certActionStatus');

  input?.addEventListener('input', (e) => {
    const val = e.target.value.trim() || 'Alex Mercer';
    if (display) display.textContent = val;
  });

  copyHashBtn?.addEventListener('click', () => {
    navigator.clipboard?.writeText('0x7f9a8842c94bd63e120f8372').then(() => {
      if (certStatus) {
        certStatus.textContent = '✓ Hash ID copied to clipboard!';
        setTimeout(() => { certStatus.textContent = ''; }, 3000);
      }
    });
  });

  linkedInBtn?.addEventListener('click', () => {
    if (certStatus) {
      certStatus.textContent = '✓ Credential certificate exported for LinkedIn!';
      setTimeout(() => { certStatus.textContent = ''; }, 3000);
    }
  });
}
