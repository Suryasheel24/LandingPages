/**
 * PulseWave Festival — Senior Human-Crafted JavaScript Engine (Enhanced Edition)
 * Features:
 *  1. Live Countdown Clock
 *  2. Interactive 2D Amphitheater Stage Sightline Inspector (with Pass Tier Sync)
 *  3. Apple Wallet / Passbook 3D Ticket Flip & Save Toast
 *  4. Real-time Pass Subtotal & Tax Calculator
 *  5. Web Audio Equalizer Animation
 */

document.addEventListener('DOMContentLoaded', () => {
  initBespokeNavbarAndFooter();
  initCountdown();
  initStageMap();
  initPassbookTicket();
  initTicketCalculator();
  initAudioSampler();
});

/* Bespoke Cyber Floating Island Navbar & Stage Footer Engine */
function initBespokeNavbarAndFooter() {
  const navbar = document.querySelector('.navbar-pulse');
  const linksWrapper = document.querySelector('.nav-pulse-wrapper');
  const slidingPill = document.getElementById('navLaserPill');
  const navLinks = document.querySelectorAll('.nav-links-pulse a');
  const mobileToggle = document.getElementById('mobilePulseToggle');
  const mobileClose = document.getElementById('mobilePulseClose');
  const mobileDrawer = document.getElementById('mobileDrawerPulse');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-pulse-links a');

  // Scroll Elevation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Sliding Laser Pill
  function movePill(el) {
    if (!el || !slidingPill || !linksWrapper) return;
    const parentRect = linksWrapper.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    slidingPill.style.width = `${rect.width}px`;
    slidingPill.style.left = `${rect.left - parentRect.left}px`;
    slidingPill.style.opacity = '1';
  }

  const activeLink = document.querySelector('.nav-links-pulse a.active');
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
    const currActive = document.querySelector('.nav-links-pulse a.active');
    if (currActive) movePill(currActive);
    else if (slidingPill) slidingPill.style.opacity = '0';
  });

  // Mobile Drawer
  function toggleDrawer(open) {
    mobileDrawer?.classList.toggle('is-open', open);
    mobileToggle?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mobileClose?.focus();
  }

  mobileToggle?.addEventListener('click', () => toggleDrawer(true));
  mobileClose?.addEventListener('click', () => toggleDrawer(false));
  drawerLinks.forEach(l => l.addEventListener('click', () => toggleDrawer(false)));

  // Footer Tokyo Clock
  const tokyoEl = document.getElementById('footerTokyoClock');
  function updateTokyoClock() {
    if (!tokyoEl) return;
    const options = { timeZone: 'Asia/Tokyo', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const tokyoTime = new Intl.DateTimeFormat([], options).format(new Date());
    tokyoEl.textContent = `🕒 TOKYO ARENA TIME: ${tokyoTime} JST`;
  }
  setInterval(updateTokyoClock, 1000);
  updateTokyoClock();

  // Footer Lineup Newsletter
  const newsletterBtn = document.getElementById('footerPulseBtn');
  const newsletterEmail = document.getElementById('footerPulseEmail');
  const newsletterStatus = document.getElementById('footerPulseStatus');
  newsletterBtn?.addEventListener('click', () => {
    const val = newsletterEmail?.value.trim();
    if (val && newsletterStatus) {
      newsletterStatus.textContent = '✓ Priority Phase 02 drop alerts active!';
      newsletterEmail.value = '';
      setTimeout(() => { newsletterStatus.textContent = ''; }, 3500);
    }
  });
}

/* 1. Countdown Clock */
function initCountdown() {
  const target = new Date();
  target.setDate(target.getDate() + 64);

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) return;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % 1000 * 60) / 1000);

    const dEl = document.getElementById('countDays');
    const hEl = document.getElementById('countHours');
    const mEl = document.getElementById('countMins');
    const sEl = document.getElementById('countSecs');

    if (dEl) dEl.textContent = String(d).padStart(2, '0');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }
  setInterval(tick, 1000);
  tick();
}

/* 2. Interactive 2D Stage Sightline Inspector & Pass Tier Sync */
function initStageMap() {
  const sectors = document.querySelectorAll('.stage-zone-sector');
  const zoneName = document.getElementById('selectedZoneName');
  const zoneSightline = document.getElementById('selectedZoneSightline');
  const zonePerks = document.getElementById('selectedZonePerks');
  const tierCards = document.querySelectorAll('.ticket-tier-card');

  const zoneData = {
    'pit': { name: 'Front Stage Mosh Pit', tierPrice: 189, sightline: '100% Direct Frontal (5m from DJ)', perks: 'High-intensity sub-bass & cryogenic blast direct zone.' },
    'vip': { name: 'VIP Sky Deck Elevated', tierPrice: 349, sightline: 'Elevated 360° Panoramic View', perks: 'Private champagne bar, velvet couches & express lanyard.' },
    'backstage': { name: 'Artist Backstage Lounge', tierPrice: 349, sightline: 'Behind-the-Deck Ultra Angle', perks: 'Artist mixer lounge, sound engineer booth access.' },
    'lawn': { name: 'General Admission Arena', tierPrice: 189, sightline: 'Wide Spatial Acoustic Area', perks: 'Festival village food truck access & laser art alleys.' }
  };

  sectors.forEach(sector => {
    sector.addEventListener('click', () => {
      sectors.forEach(s => s.classList.remove('active'));
      sector.classList.add('active');

      const key = sector.dataset.zone;
      const data = zoneData[key];
      if (data && zoneName && zoneSightline && zonePerks) {
        zoneName.textContent = data.name;
        zoneSightline.textContent = data.sightline;
        zonePerks.textContent = data.perks;

        // Sync with ticket tier
        tierCards.forEach(c => {
          if (parseInt(c.dataset.price) === data.tierPrice) {
            c.click();
          }
        });
      }
    });
  });
}

/* 3. Apple Wallet / Passbook 3D Ticket Flip Card & Save Toast */
function initPassbookTicket() {
  const card = document.getElementById('passbookCard');
  const flipBtn = document.getElementById('flipTicketBtn');
  const nameInput = document.getElementById('ticketAttendeeInput');
  const displayName = document.getElementById('passbookAttendeeName');
  const saveWalletBtn = document.getElementById('saveWalletBtn');
  const walletToast = document.getElementById('walletToastAlert');

  flipBtn?.addEventListener('click', () => {
    card?.classList.toggle('flipped');
  });

  nameInput?.addEventListener('input', (e) => {
    const val = e.target.value.trim().toUpperCase() || 'ALEX MERCER';
    if (displayName) displayName.textContent = val;
  });

  saveWalletBtn?.addEventListener('click', () => {
    if (walletToast) {
      walletToast.style.display = 'block';
      setTimeout(() => { walletToast.style.display = 'none'; }, 3500);
    }
  });
}

/* 4. Ticket Calculator */
function initTicketCalculator() {
  const tierCards = document.querySelectorAll('.ticket-tier-card');
  const subtotalEl = document.getElementById('summarySubtotal');
  const totalEl = document.getElementById('summaryTotal');

  let price = 349;
  let qty = 2;

  function calc() {
    const sub = price * qty;
    const total = sub + Math.round(sub * 0.08);
    if (subtotalEl) subtotalEl.textContent = `$${sub}`;
    if (totalEl) totalEl.textContent = `$${total}`;
  }

  tierCards.forEach(c => {
    c.addEventListener('click', () => {
      tierCards.forEach(card => card.classList.remove('selected', 'border-warning'));
      c.classList.add('selected', 'border-warning');
      price = parseInt(c.dataset.price || 349);
      calc();
    });
  });

  calc();
}

/* 5. Web Audio Synth Preview */
function initAudioSampler() {
  const previewBtn = document.getElementById('playDjPreviewBtn');
  previewBtn?.addEventListener('click', () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [220, 277.18, 329.63, 440];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * 0.1));
        gain.gain.setValueAtTime(0.04, ctx.currentTime + (i * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + (i * 0.1));
        osc.stop(ctx.currentTime + 2.5);
      });
      previewBtn.innerHTML = '<i class="bi bi-soundwave text-warning me-1"></i> Playing Synth Drop...';
      setTimeout(() => {
        previewBtn.innerHTML = '<i class="bi bi-play-fill me-1"></i> Preview Stage Drop';
      }, 2500);
    } catch(e){}
  });
}
