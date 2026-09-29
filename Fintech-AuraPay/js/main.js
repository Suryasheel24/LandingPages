document.addEventListener('DOMContentLoaded', () => {
  initBespokeNavbarAndFooter();
  initMaterialSwitcher();
  initCardFlipper();
  initCard3DTilt();
  initFxConverter();
  initCashback();
  initSecuritySwitches();
  initNameStamping();
});

/* Bespoke Obsidian Floating Island Navbar & Private Wealth Footer Engine */
function initBespokeNavbarAndFooter() {
  const navbar = document.querySelector('.navbar-aurapay');
  const linksWrapper = document.querySelector('.nav-aura-wrapper');
  const slidingPill = document.getElementById('navGoldSlidingPill');
  const navLinks = document.querySelectorAll('.nav-links-aurapay a');
  const mobileToggle = document.getElementById('mobileAuraToggle');
  const mobileClose = document.getElementById('mobileAuraClose');
  const mobileDrawer = document.getElementById('mobileDrawerAuraPay');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-aurapay-links a');

  // Scroll Elevation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Gold Sliding Indicator Pill
  function movePill(el) {
    if (!el || !slidingPill || !linksWrapper) return;
    const parentRect = linksWrapper.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    slidingPill.style.width = `${rect.width}px`;
    slidingPill.style.left = `${rect.left - parentRect.left}px`;
    slidingPill.style.opacity = '1';
  }

  const activeLink = document.querySelector('.nav-links-aurapay a.active');
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
    const currActive = document.querySelector('.nav-links-aurapay a.active');
    if (currActive) movePill(currActive);
    else if (slidingPill) slidingPill.style.opacity = '0';
  });

  // Mobile Curtain Drawer
  function toggleDrawer(open) {
    mobileDrawer?.classList.toggle('is-open', open);
    mobileToggle?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mobileClose?.focus();
  }

  mobileToggle?.addEventListener('click', () => toggleDrawer(true));
  mobileClose?.addEventListener('click', () => toggleDrawer(false));
  drawerLinks.forEach(l => l.addEventListener('click', () => toggleDrawer(false)));

  // Footer NY Clock & Market Status
  const nyEl = document.getElementById('footerNyClock');
  function updateNyClock() {
    if (!nyEl) return;
    const options = { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const nyTime = new Intl.DateTimeFormat([], options).format(new Date());
    nyEl.textContent = `🕒 NY TIME: ${nyTime} EST`;
  }
  setInterval(updateNyClock, 1000);
  updateNyClock();

  // Footer Advisory Request
  const auraBtn = document.getElementById('footerAuraBtn');
  const auraEmail = document.getElementById('footerAuraEmail');
  const auraStatus = document.getElementById('footerAuraStatus');
  auraBtn?.addEventListener('click', () => {
    const val = auraEmail?.value.trim();
    if (val && auraStatus) {
      auraStatus.textContent = '✓ Private wealth allocation dossier dispatched.';
      auraEmail.value = '';
      setTimeout(() => { auraStatus.textContent = ''; }, 3500);
    }
  });
}

function playHapticTone(freq = 1200) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (_) {}
}

function initMaterialSwitcher() {
  const front = document.getElementById('metalCardFront');
  const back = document.getElementById('metalCardBack');
  const btns = document.querySelectorAll('.material-pill-btn');
  const label = document.getElementById('cardEditionLabel');

  const names = {
    obsidian: 'OBSIDIAN BLACK',
    gold: '18K BRUSHED GOLD',
    platinum: 'FROSTED PLATINUM',
    titanium: 'RAW TITANIUM'
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.replace('btn-warning', 'btn-dark') || b.classList.remove('active'));
      btn.classList.replace('btn-dark', 'btn-warning');
      btn.classList.add('active');

      const mat = btn.dataset.material;
      if (front) front.className = `metal-card-container material-${mat}`;
      if (back) back.className = `metal-card-container metal-card-back material-${mat}`;
      if (label) label.textContent = names[mat] || 'BLACK EDITION';

      playHapticTone(1400);
    });
  });
}

function initCardFlipper() {
  const flipper = document.getElementById('cardFlipper');
  const flipBtn = document.getElementById('flipCardFaceBtn');

  flipBtn?.addEventListener('click', () => {
    flipper?.classList.toggle('is-flipped');
    playHapticTone(900);
  });
}

function initCard3DTilt() {
  const flipper = document.getElementById('cardFlipper');
  const scene = document.querySelector('.card-3d-scene');
  const glare = document.querySelector('.card-glare');

  const isTouchDevice = !window.matchMedia('(hover: hover)').matches;
  if (isTouchDevice || !scene || !flipper) return;

  scene.addEventListener('mousemove', (e) => {
    const rect = scene.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -18;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 18;

    const isFlipped = flipper.classList.contains('is-flipped');
    flipper.style.transform = isFlipped
      ? `rotateY(${180 + ry}deg) rotateX(${rx}deg)`
      : `rotateX(${rx}deg) rotateY(${ry}deg)`;

    if (glare) {
      const gx = (x / rect.width) * 100;
      const gy = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`;
    }
  });

  scene.addEventListener('mouseleave', () => {
    const isFlipped = flipper.classList.contains('is-flipped');
    flipper.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateX(0deg) rotateY(0deg)';
  });
}

function initFxConverter() {
  const amtInput = document.getElementById('fxAmount');
  const fromSel = document.getElementById('fxFrom');
  const toSel = document.getElementById('fxTo');
  const resEl = document.getElementById('fxResult');
  const execBtn = document.getElementById('executeFxBtn');
  const toast = document.getElementById('fxOrderToast');
  const details = document.getElementById('fxOrderDetails');

  const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 154.5, BTC: 0.000015, ETH: 0.00038 };

  function calculate() {
    const amt = parseFloat(amtInput?.value || 0);
    const from = fromSel?.value || 'USD';
    const to = toSel?.value || 'EUR';
    const converted = (amt / rates[from]) * rates[to];

    if (resEl) {
      resEl.textContent = to === 'BTC' || to === 'ETH'
        ? `${converted.toFixed(5)} ${to}`
        : `${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}`;
    }
  }

  amtInput?.addEventListener('input', calculate);
  fromSel?.addEventListener('change', calculate);
  toSel?.addEventListener('change', calculate);
  calculate();

  execBtn?.addEventListener('click', () => {
    const amt = amtInput?.value || '2500';
    const from = fromSel?.value || 'USD';
    const converted = resEl?.textContent || '';

    playHapticTone(1600);
    if (toast && details) {
      details.textContent = `Instant settlement confirmed! ${amt} ${from} converted to ${converted} at zero spread. Saved ~$42.50 vs traditional banks.`;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 4000);
    }
  });
}

function initCashback() {
  const slider = document.getElementById('spendSlider');
  const spendVal = document.getElementById('spendDisplayVal');
  const rewardVal = document.getElementById('rewardDisplayVal');

  slider?.addEventListener('input', (e) => {
    const spend = parseInt(e.target.value, 10);
    const reward = Math.round(spend * 0.05 * 12);
    if (spendVal) spendVal.textContent = `$${spend.toLocaleString()}/mo`;
    if (rewardVal) rewardVal.textContent = `+$${reward.toLocaleString()}/yr`;
  });
}

function initSecuritySwitches() {
  const switches = document.querySelectorAll('.security-toggle-switch');
  const logEl = document.getElementById('securityStatusFeedback');
  const cvvEl = document.getElementById('cardCvvDisplay');

  switches.forEach(sw => {
    sw.addEventListener('change', (e) => {
      const feat = e.target.dataset.feature;
      const state = e.target.checked ? 'ENABLED' : 'DISABLED';

      if (logEl) {
        logEl.textContent = `✓ ${feat} is now ${state}. Hardware cryptographic handshake complete.`;
      }
      if (feat === 'Disposable CVV' && e.target.checked && cvvEl) {
        cvvEl.textContent = String(Math.floor(100 + Math.random() * 900));
      }

      playHapticTone(800);
    });
  });
}

function initNameStamping() {
  const input = document.getElementById('customCardNameInput');
  const display = document.getElementById('cardHolderDisplay');

  input?.addEventListener('input', (e) => {
    const val = e.target.value.trim().toUpperCase() || 'ALEX MERCER';
    if (display) display.textContent = val;
  });
}
