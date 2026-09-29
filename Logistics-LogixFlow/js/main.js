/**
 * LogixFlow Global — Principal Telemetry JavaScript Engine
 * Architecture: Decoupled State Dispatcher, ARIA Live Announcements, Smooth Interpolation
 */

document.addEventListener('DOMContentLoaded', () => {
  initBespokeNavbarAndFooter();
  initShipmentTelemetryEngine();
  initFreightEstimatorEngine();
  initAnimatedTelemetryCounters();
  initInteractiveMapNodes();
});

/* Bespoke Industrial Terminal Navbar & Mission Control Footer Engine */
function initBespokeNavbarAndFooter() {
  const navbar = document.querySelector('.navbar-logix-terminal');
  const linksWrapper = document.querySelector('.terminal-nav-wrapper');
  const slidingPill = document.getElementById('terminalSlidingIndicator');
  const navLinks = document.querySelectorAll('.terminal-nav-links a');
  const mobileToggle = document.getElementById('mobileLogixToggle');
  const mobileClose = document.getElementById('mobileLogixClose');
  const mobileDrawer = document.getElementById('mobileDrawerLogix');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-logix-links a');

  // Scroll Elevation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Monospace Sliding Indicator
  function moveIndicator(el) {
    if (!el || !slidingPill || !linksWrapper) return;
    const parentRect = linksWrapper.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    slidingPill.style.width = `${rect.width}px`;
    slidingPill.style.left = `${rect.left - parentRect.left}px`;
    slidingPill.style.opacity = '1';
  }

  const activeLink = document.querySelector('.terminal-nav-links a.active');
  if (activeLink) moveIndicator(activeLink);

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      moveIndicator(link);
    });
  });

  linksWrapper?.addEventListener('mouseleave', () => {
    const currActive = document.querySelector('.terminal-nav-links a.active');
    if (currActive) moveIndicator(currActive);
    else if (slidingPill) slidingPill.style.opacity = '0';
  });

  // Mobile Command Drawer
  function toggleDrawer(open) {
    mobileDrawer?.classList.toggle('is-open', open);
    mobileToggle?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mobileClose?.focus();
  }

  mobileToggle?.addEventListener('click', () => toggleDrawer(true));
  mobileClose?.addEventListener('click', () => toggleDrawer(false));
  drawerLinks.forEach(l => l.addEventListener('click', () => toggleDrawer(false)));

  // UTC Live Clock
  const utcEl = document.getElementById('navUtcTime');
  function updateUtc() {
    if (!utcEl) return;
    const now = new Date();
    const utcStr = now.toISOString().substring(11, 19);
    utcEl.textContent = `UTC ${utcStr}`;
  }
  setInterval(updateUtc, 1000);
  updateUtc();

  // Footer Webhook Subscribe
  const logixBtn = document.getElementById('footerLogixBtn');
  const logixEmail = document.getElementById('footerLogixEmail');
  const logixStatus = document.getElementById('footerLogixStatus');
  logixBtn?.addEventListener('click', () => {
    const val = logixEmail?.value.trim();
    if (val && logixStatus) {
      logixStatus.textContent = '✓ EDI Dispatch Webhook listener registered!';
      logixEmail.value = '';
      setTimeout(() => { logixStatus.textContent = ''; }, 3500);
    }
  });
}

/* ==========================================================================
   1. Telemetry State Dispatcher & Gauge Physics
   ========================================================================== */
function initShipmentTelemetryEngine() {
  const presetButtons = document.querySelectorAll('.preset-chip-btn');
  const tempGaugeRing = document.getElementById('tempGaugeVal');
  const humidGaugeRing = document.getElementById('humidGaugeVal');
  const shockGaugeRing = document.getElementById('shockGaugeVal');

  const tempDisplay = document.getElementById('tempGaugeText');
  const humidDisplay = document.getElementById('humidGaugeText');
  const shockDisplay = document.getElementById('shockGaugeText');

  const statusPill = document.getElementById('telemetryStatusPill');
  const originDisplay = document.getElementById('telemetryOriginText');
  const destDisplay = document.getElementById('telemetryDestText');
  const etaDisplay = document.getElementById('telemetryEtaText');
  const vesselDisplay = document.getElementById('telemetryVesselText');
  const stepperNodes = document.querySelectorAll('.stepper-node');

  // Grounded Domain Telemetry Records
  const telemetryDatabase = {
    'LX-8024': {
      status: 'In Transit — North Sea Ocean Corridor',
      origin: 'Tokyo (NRT) • Berth 04',
      dest: 'Rotterdam (RTM) • Gate 12',
      eta: 'In 3 Days (08:45 UTC)',
      vessel: 'B777-F Intercontinental Skyfreight / LX-88',
      temp: 3.8,
      tempStr: '+3.8°C',
      humid: 42,
      humidStr: '42%',
      shock: 0.12,
      shockStr: '0.12G',
      stepIndex: 2
    },
    'LX-9912': {
      status: 'Automated Port Customs Clearance Verified',
      origin: 'Singapore (SIN) • Anchorage 09',
      dest: 'Los Angeles (LAX) • Terminal 4',
      eta: 'Tomorrow (14:15 PST)',
      vessel: 'Ultra-Large Container Vessel EVER-NEXUS',
      temp: 18.2,
      tempStr: '+18.2°C',
      humid: 65,
      humidStr: '65%',
      shock: 0.28,
      shockStr: '0.28G',
      stepIndex: 3
    },
    'LX-4410': {
      status: 'Final Mile Zero-Emission Dispatch',
      origin: 'Frankfurt (FRA) • Hub 01',
      dest: 'Chicago (ORD) • Facility 8',
      eta: 'Today (16:30 CST)',
      vessel: 'Autonomous Heavy EV Fleet #404',
      temp: -20.4,
      tempStr: '-20.4°C',
      humid: 28,
      humidStr: '28%',
      shock: 0.05,
      shockStr: '0.05G',
      stepIndex: 4
    }
  };

  const CIRCUMFERENCE = 276.46; // 2 * Math.PI * 44

  function dispatchTelemetryState(containerId) {
    const data = telemetryDatabase[containerId] || telemetryDatabase['LX-8024'];

    if (statusPill) statusPill.textContent = data.status;
    if (originDisplay) originDisplay.textContent = data.origin;
    if (destDisplay) destDisplay.textContent = data.dest;
    if (etaDisplay) etaDisplay.textContent = data.eta;
    if (vesselDisplay) vesselDisplay.textContent = data.vessel;

    if (tempDisplay) tempDisplay.textContent = data.tempStr;
    if (humidDisplay) humidDisplay.textContent = data.humidStr;
    if (shockDisplay) shockDisplay.textContent = data.shockStr;

    // Gauge Dashoffset calculation
    if (tempGaugeRing) {
      const normalizedTemp = Math.min(Math.abs(data.temp) / 40, 1);
      tempGaugeRing.style.strokeDashoffset = `${CIRCUMFERENCE - (normalizedTemp * CIRCUMFERENCE * 0.75)}`;
      tempGaugeRing.parentElement?.setAttribute('aria-valuenow', data.temp);
    }

    if (humidGaugeRing) {
      const normalizedHumid = Math.min(data.humid / 100, 1);
      humidGaugeRing.style.strokeDashoffset = `${CIRCUMFERENCE - (normalizedHumid * CIRCUMFERENCE * 0.75)}`;
      humidGaugeRing.parentElement?.setAttribute('aria-valuenow', data.humid);
    }

    if (shockGaugeRing) {
      const normalizedShock = Math.min(data.shock / 1.0, 1);
      shockGaugeRing.style.strokeDashoffset = `${CIRCUMFERENCE - (normalizedShock * CIRCUMFERENCE * 0.75)}`;
      shockGaugeRing.parentElement?.setAttribute('aria-valuenow', data.shock);
    }

    // Stepper Node Progression
    stepperNodes.forEach((node, idx) => {
      node.classList.remove('completed', 'active');
      if (idx < data.stepIndex) {
        node.classList.add('completed');
      } else if (idx === data.stepIndex) {
        node.classList.add('active');
      }
    });
  }

  // Preset Button Listeners
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.id;
      dispatchTelemetryState(id);
    });
  });

  // Initialize Default State
  dispatchTelemetryState('LX-8024');
}

/* ==========================================================================
   2. Freight Transit & Carbon Estimator Engine
   ========================================================================== */
function initFreightEstimatorEngine() {
  const weightInput = document.getElementById('cargoWeightInput');
  const airCostEl = document.getElementById('airCostOutput');
  const airCo2El = document.getElementById('airCo2Output');
  const oceanCostEl = document.getElementById('oceanCostOutput');
  const oceanCo2El = document.getElementById('oceanCo2Output');

  function calculateEstimates() {
    const tons = Math.max(1, parseFloat(weightInput?.value || 5));

    // Realistic multi-modal calculations
    const airCost = Math.round(tons * 3800);
    const airCo2 = (tons * 1.85).toFixed(1);

    const oceanCost = Math.round(tons * 920);
    const oceanCo2 = (tons * 0.12).toFixed(2);

    if (airCostEl) airCostEl.textContent = `$${airCost.toLocaleString('en-US')}`;
    if (airCo2El) airCo2El.textContent = `${airCo2} t CO2`;

    if (oceanCostEl) oceanCostEl.textContent = `$${oceanCost.toLocaleString('en-US')}`;
    if (oceanCo2El) oceanCo2El.textContent = `${oceanCo2} t CO2`;
  }

  weightInput?.addEventListener('input', calculateEstimates);
  calculateEstimates();
}

/* ==========================================================================
   3. Animated Telemetry Intersection Counters
   ========================================================================== */
function initAnimatedTelemetryCounters() {
  const counters = document.querySelectorAll('.telemetry-counter-num');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target || 0);
        const decimals = parseInt(el.dataset.decimals || 0);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 40;

        const update = () => {
          current += increment;
          if (current < target) {
            el.textContent = (decimals ? current.toFixed(decimals) : Math.round(current).toLocaleString()) + suffix;
            requestAnimationFrame(update);
          } else {
            el.textContent = (decimals ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
          }
        };

        update();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   4. Interactive Map Mega-Hub Inspector
   ========================================================================== */
function initInteractiveMapNodes() {
  const pins = document.querySelectorAll('.map-hub-marker');
  const banner = document.getElementById('mapHubBannerText');

  const hubSpecs = {
    'rtm': 'Port of Rotterdam (RTM) • 42 Active Berths • 14.5M TEU / yr Throughput (Status: 100% Operational)',
    'sin': 'Port of Singapore (SIN) • 88 Vessels in Anchorage • Automated Port Clearance (Status: Optimal Flow)',
    'lax': 'Port of Los Angeles (LAX) • 29 Vessels at Pier • Express Rail Intermodal Active (Status: Normal)',
    'pvg': 'Port of Shanghai (PVG) • 112 Active Ocean Carriers • 47.3M TEU / yr Capacity (Status: High Volume)'
  };

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      const key = pin.dataset.hub;
      if (banner && hubSpecs[key]) {
        banner.innerHTML = `<strong>📍 Active Hub:</strong> ${hubSpecs[key]}`;
      }
    });
  });
}
