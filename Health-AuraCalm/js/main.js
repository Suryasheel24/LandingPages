document.addEventListener('DOMContentLoaded', () => {
  initNavbarAndDrawer();
  initCircadianCanvas();
  initCircadianAmbiance();
  initScrollAnimations();
  initMorphingBreathing();
  initSoundscapesWithWaveforms();
  initBinauralSynthesizer();
  initReactiveSleepCalculator();
  initHabitTracker();
  initMeditationTimer();
  initPricingToggle();
  initAssessmentModal();
  initFooterUtilities();
});

function initNavbarAndDrawer() {
  const navbar = document.querySelector('.navbar-floating-dock');
  const linksWrapper = document.querySelector('.nav-links-wrapper');
  const slidingPill = document.getElementById('navSlidingPill');
  const navLinks = document.querySelectorAll('.nav-links-aura a');
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileClose = document.getElementById('mobileNavClose');
  const mobileDrawer = document.getElementById('mobileDrawerAura');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');

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

  const activeLink = document.querySelector('.nav-links-aura a.active');
  if (activeLink) {
    setTimeout(() => movePill(activeLink), 120);
  }

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => movePill(link));
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      movePill(link);
    });
  });

  linksWrapper?.addEventListener('mouseleave', () => {
    const currActive = document.querySelector('.nav-links-aura a.active');
    if (currActive) movePill(currActive);
    else if (slidingPill) slidingPill.style.opacity = '0';
  });

  function toggleDrawer(open) {
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('is-open', open);
    mobileToggle?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mobileClose?.focus();
  }

  mobileToggle?.addEventListener('click', () => toggleDrawer(true));
  mobileClose?.addEventListener('click', () => toggleDrawer(false));
  drawerLinks.forEach(l => l.addEventListener('click', () => toggleDrawer(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
      toggleDrawer(false);
    }
  });
}

function initCircadianCanvas() {
  const canvas = document.getElementById('circadianCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let currentTheme = 'dawn';

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticlesForTheme(currentTheme);
  }
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX - width / 2) * 0.012;
    mouseY = (e.clientY - height / 2) * 0.012;
  });

  function initParticlesForTheme(theme) {
    currentTheme = theme;
    particles = [];

    if (theme === 'dawn') {
      // Dawn Mist: Floating soft morning dew droplets & mist vapor
      particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 1.5,
        alpha: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.1,
        color: Math.random() > 0.5 ? '254, 215, 170' : '224, 231, 255'
      }));
    } else if (theme === 'noon') {
      // Solar Noon: Shimmering golden solar rays & warm caustic light motes
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.4 + 0.15,
        pulse: Math.random() * 0.03 + 0.01,
        vx: (Math.random() - 0.5) * 0.4,
        vy: Math.random() * 0.25 + 0.1,
        color: Math.random() > 0.4 ? '253, 224, 71' : '186, 230, 253'
      }));
    } else if (theme === 'twilight') {
      // Twilight Rose: Floating ethereal rose-lavender petals & dusk spores rising gently
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4.5 + 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        alpha: Math.random() * 0.4 + 0.15,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.15,
        color: Math.random() > 0.5 ? '244, 114, 182' : '192, 132, 252'
      }));
    } else if (theme === 'midnight') {
      // Midnight Starlight: 90+ shimmering constellation stars
      particles = Array.from({ length: 90 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.025 + 0.006,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        color: Math.random() > 0.3 ? '165, 180, 252' : '224, 231, 255'
      }));
    }
  }

  resize();

  function renderCanvas() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      if (currentTheme === 'midnight') {
        p.alpha += p.pulseSpeed;
        if (p.alpha > 0.95 || p.alpha < 0.2) p.pulseSpeed = -p.pulseSpeed;

        ctx.beginPath();
        ctx.arc(p.x + mouseX, p.y + mouseY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha)})`;
        if (p.radius > 1.2) {
          ctx.shadowColor = '#818CF8';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      } else if (currentTheme === 'twilight') {
        p.rotation += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x + mouseX, p.y + mouseY);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * 1.6, p.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowColor = '#C084FC';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      } else if (currentTheme === 'noon') {
        p.alpha += p.pulse;
        if (p.alpha > 0.5 || p.alpha < 0.1) p.pulse = -p.pulse;
        ctx.beginPath();
        ctx.arc(p.x + mouseX, p.y + mouseY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha)})`;
        ctx.shadowColor = '#FDE047';
        ctx.shadowBlur = 12;
        ctx.fill();
      } else {
        // Dawn
        ctx.beginPath();
        ctx.arc(p.x + mouseX, p.y + mouseY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowColor = '#FED7AA';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    });

    requestAnimationFrame(renderCanvas);
  }
  renderCanvas();

  window.setCircadianCanvasTheme = (theme) => {
    initParticlesForTheme(theme);
  };
}

function initCircadianAmbiance() {
  const btns = document.querySelectorAll('.circadian-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const time = btn.dataset.time;
      document.body.className = `circadian-${time}`;
      if (window.setCircadianCanvasTheme) {
        window.setCircadianCanvasTheme(time);
      }
    });
  });
}

function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el, index) => {
    el.style.transitionDelay = `${(index % 3) * 80}ms`;
    observer.observe(el);
  });
}

function initMorphingBreathing() {
  const svgBlob = document.getElementById('morphingSvg');
  const glow = document.getElementById('radialPulseGlow');
  const stateLabel = document.getElementById('orbStateLabel');
  const countdownEl = document.getElementById('orbCountdown');
  const toggleBtn = document.getElementById('breatheToggleBtn');
  const modeBtns = document.querySelectorAll('.mode-btn');

  const modes = {
    box: [
      { name: 'Inhale', duration: 4, class: 'inhale' },
      { name: 'Hold', duration: 4, class: 'hold' },
      { name: 'Exhale', duration: 4, class: 'exhale' },
      { name: 'Hold', duration: 4, class: 'hold' }
    ],
    relax: [
      { name: 'Inhale', duration: 4, class: 'inhale' },
      { name: 'Hold', duration: 7, class: 'hold' },
      { name: 'Exhale', duration: 8, class: 'exhale' }
    ],
    calm: [
      { name: 'Inhale', duration: 5, class: 'inhale' },
      { name: 'Exhale', duration: 5, class: 'exhale' }
    ]
  };

  let currentMode = 'box';
  let isRunning = false;
  let phaseIndex = 0;
  let seconds = 4;
  let timer = null;

  function updatePhase() {
    const seq = modes[currentMode];
    const p = seq[phaseIndex];
    if (svgBlob) {
      svgBlob.className = 'morph-svg ' + p.class;
      svgBlob.style.transitionDuration = `${p.duration}s`;
    }
    if (glow) {
      glow.className = 'radial-pulse-glow ' + p.class;
      glow.style.transitionDuration = `${p.duration}s`;
    }
    if (stateLabel) stateLabel.textContent = p.name;
    seconds = p.duration;
    if (countdownEl) countdownEl.textContent = `${seconds}s`;
    playSoftBreathTone(p.class);
  }

  function tick() {
    seconds--;
    if (seconds > 0) {
      if (countdownEl) countdownEl.textContent = `${seconds}s`;
    } else {
      const seq = modes[currentMode];
      phaseIndex = (phaseIndex + 1) % seq.length;
      updatePhase();
    }
  }

  toggleBtn?.addEventListener('click', () => {
    if (isRunning) {
      isRunning = false;
      if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-play-fill fs-5"></i><span>Start Session</span>';
      clearInterval(timer);
      if (svgBlob) svgBlob.className = 'morph-svg';
      if (glow) glow.className = 'radial-pulse-glow';
      if (stateLabel) stateLabel.textContent = 'Ready';
      if (countdownEl) countdownEl.textContent = '4s';
    } else {
      isRunning = true;
      if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-pause-fill fs-5"></i><span>Pause Session</span>';
      phaseIndex = 0;
      updatePhase();
      timer = setInterval(tick, 1000);
    }
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      if (isRunning) toggleBtn?.click();
    });
  });

  function playSoftBreathTone(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = type === 'inhale' ? 432 : (type === 'hold' ? 528 : 360);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch(e) {}
  }
}

function initSoundscapesWithWaveforms() {
  const activeSounds = {
    rain: { isPlaying: false, volume: 0.7 },
    ocean: { isPlaying: false, volume: 0.7 },
    chimes: { isPlaying: false, volume: 0.7 },
    binaural: { isPlaying: false, volume: 0.7 }
  };

  const canvases = document.querySelectorAll('.waveform-canvas');
  const navbarAudioPill = document.getElementById('navbarAudioPill');
  const navbarMuteBtn = document.getElementById('navbarQuickMuteBtn');

  function updateNavbarAudioState() {
    const isAnyActive = Object.values(activeSounds).some(s => s.isPlaying);
    if (navbarAudioPill) {
      navbarAudioPill.style.display = isAnyActive ? 'inline-flex' : 'none';
    }
  }

  function render() {
    canvases.forEach(c => {
      const ctx = c.getContext('2d');
      const sound = c.dataset.sound;
      const isPlay = activeSounds[sound]?.isPlaying;
      const vol = activeSounds[sound]?.volume || 0.7;

      ctx.clearRect(0, 0, c.width, c.height);
      ctx.lineWidth = 2;
      const isMidnight = document.body.classList.contains('circadian-midnight');
      ctx.strokeStyle = isPlay ? (isMidnight ? '#818CF8' : '#0F172A') : (isMidnight ? '#334155' : '#CBD5E1');
      ctx.beginPath();
      const t = Date.now() * 0.003;
      for (let x = 0; x < c.width; x += 4) {
        const amplitude = isPlay ? (Math.sin(x * 0.05 + t) * 9 + Math.sin(x * 0.1 - t) * 4) * vol : 0;
        const y = (c.height / 2) + amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    requestAnimationFrame(render);
  }
  render();

  const soundCards = document.querySelectorAll('.soundscape-card');
  soundCards.forEach(card => {
    const key = card.dataset.sound;
    const btn = card.querySelector('.sound-toggle-btn');
    const slider = card.querySelector('.volume-slider');
    const volVal = card.querySelector('.volume-val');

    btn?.addEventListener('click', () => {
      activeSounds[key].isPlaying = !activeSounds[key].isPlaying;
      card.classList.toggle('playing', activeSounds[key].isPlaying);
      if (btn) {
        btn.textContent = activeSounds[key].isPlaying ? 'Mute Track' : 'Enable Track';
        btn.className = activeSounds[key].isPlaying ? 'btn-solid-dark w-100 justify-content-center mt-3 sound-toggle-btn' : 'btn-outline-pill w-100 justify-content-center mt-3 sound-toggle-btn';
      }
      updateNavbarAudioState();
    });

    slider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      activeSounds[key].volume = val / 100;
      if (volVal) volVal.textContent = `${val}%`;
    });
  });

  navbarMuteBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    Object.keys(activeSounds).forEach(k => { activeSounds[k].isPlaying = false; });
    soundCards.forEach(c => {
      c.classList.remove('playing');
      const b = c.querySelector('.sound-toggle-btn');
      if (b) {
        b.textContent = 'Enable Track';
        b.className = 'btn-outline-pill w-100 justify-content-center mt-3 sound-toggle-btn';
      }
    });
    updateNavbarAudioState();
  });

  const presetBtns = document.querySelectorAll('.preset-sound-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.dataset.preset;

      Object.keys(activeSounds).forEach(k => { activeSounds[k].isPlaying = false; });
      soundCards.forEach(c => {
        c.classList.remove('playing');
        const b = c.querySelector('.sound-toggle-btn');
        if (b) {
          b.textContent = 'Enable Track';
          b.className = 'btn-outline-pill w-100 justify-content-center mt-3 sound-toggle-btn';
        }
      });

      if (preset === 'sleep') {
        activeSounds.rain.isPlaying = true;
        activeSounds.binaural.isPlaying = true;
      } else if (preset === 'anxiety') {
        activeSounds.ocean.isPlaying = true;
        activeSounds.chimes.isPlaying = true;
      } else if (preset === 'focus') {
        activeSounds.rain.isPlaying = true;
      } else if (preset === 'zen') {
        activeSounds.chimes.isPlaying = true;
        activeSounds.binaural.isPlaying = true;
      }

      Object.keys(activeSounds).forEach(k => {
        if (activeSounds[k].isPlaying) {
          const card = document.querySelector(`.soundscape-card[data-sound="${k}"]`);
          card?.classList.add('playing');
          const b = card?.querySelector('.sound-toggle-btn');
          if (b) {
            b.textContent = 'Mute Track';
            b.className = 'btn-solid-dark w-100 justify-content-center mt-3 sound-toggle-btn';
          }
        }
      });
      updateNavbarAudioState();
    });
  });
}

function initBinauralSynthesizer() {
  const slider = document.getElementById('waveHzSlider');
  const hzDisplay = document.getElementById('waveHzDisplay');
  const labelDisplay = document.getElementById('waveLabel');
  const presetBtns = document.querySelectorAll('.wave-preset-btn');
  const playBtn = document.getElementById('binauralPlayBtn');
  const canvas = document.getElementById('binauralCanvas');

  let currentHz = 2.5;
  let isPlaying = false;
  let audioCtx = null;
  let oscLeft = null;
  let oscRight = null;
  let gainNode = null;

  function updateWaveVisuals() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isMidnight = document.body.classList.contains('circadian-midnight');
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isPlaying ? (isMidnight ? '#38BDF8' : '#6366F1') : (isMidnight ? '#475569' : '#CBD5E1');

    ctx.beginPath();
    const t = Date.now() * 0.004;
    for (let x = 0; x < canvas.width; x += 3) {
      const freq1 = Math.sin(x * 0.04 + t) * 16;
      const freq2 = Math.sin(x * (0.04 + (currentHz * 0.002)) - t) * 12;
      const y = (canvas.height / 2) + ((freq1 + freq2) * (isPlaying ? 0.9 : 0.2));
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    requestAnimationFrame(updateWaveVisuals);
  }
  updateWaveVisuals();

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentHz = parseFloat(btn.dataset.hz);
      if (slider) slider.value = currentHz;
      if (hzDisplay) hzDisplay.textContent = `${currentHz.toFixed(1)} Hz`;
      if (labelDisplay) labelDisplay.textContent = btn.dataset.wave;
      if (isPlaying && oscRight && audioCtx) {
        oscRight.frequency.setValueAtTime(432 + currentHz, audioCtx.currentTime);
      }
    });
  });

  slider?.addEventListener('input', (e) => {
    currentHz = parseFloat(e.target.value);
    if (hzDisplay) hzDisplay.textContent = `${currentHz.toFixed(1)} Hz`;
    let waveName = 'Custom Frequency';
    if (currentHz <= 4) waveName = 'Delta (Sleep)';
    else if (currentHz <= 8) waveName = 'Theta (Meditation)';
    else if (currentHz <= 12) waveName = 'Alpha (Flow)';
    else waveName = 'Gamma (Focus)';
    if (labelDisplay) labelDisplay.textContent = `${waveName} ${currentHz.toFixed(1)}Hz`;

    if (isPlaying && oscRight && audioCtx) {
      oscRight.frequency.setValueAtTime(432 + currentHz, audioCtx.currentTime);
    }
  });

  playBtn?.addEventListener('click', () => {
    if (isPlaying) {
      isPlaying = false;
      playBtn.innerHTML = '<i class="bi bi-play-fill"></i><span>Test Harmonic Pulse</span>';
      if (gainNode && audioCtx) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        setTimeout(() => {
          try {
            oscLeft?.stop();
            oscRight?.stop();
          } catch(e) {}
        }, 300);
      }
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        audioCtx = new AudioCtx();
        oscLeft = audioCtx.createOscillator();
        oscRight = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscLeft.type = 'sine';
        oscLeft.frequency.setValueAtTime(432, audioCtx.currentTime);

        oscRight.type = 'sine';
        oscRight.frequency.setValueAtTime(432 + currentHz, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.5);

        oscLeft.connect(gainNode);
        oscRight.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscLeft.start();
        oscRight.start();
        isPlaying = true;
        playBtn.innerHTML = '<i class="bi bi-pause-fill"></i><span>Pause Harmonic Pulse</span>';
      } catch(e) {}
    }
  });
}

function initReactiveSleepCalculator() {
  const wakeHour = document.getElementById('wakeHourSelect');
  const wakeMinute = document.getElementById('wakeMinuteSelect');
  const wakeAmpm = document.getElementById('wakeAmpmSelect');
  const resultsContainer = document.getElementById('sleepCyclesResult');

  const routineModal = document.getElementById('routineModal');
  const closeRoutineBtn = document.getElementById('closeRoutineModalBtn');
  const routineCurfewTime = document.getElementById('routineCurfewTime');
  const routineAudioTime = document.getElementById('routineAudioTime');
  const routineBedTime = document.getElementById('routineBedTime');

  function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  }

  function calculateOptimalBedtimes() {
    if (!resultsContainer) return;
    let hour = parseInt(wakeHour?.value || 7);
    const minute = parseInt(wakeMinute?.value || 0);
    const ampm = wakeAmpm?.value || 'AM';

    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;

    const targetDate = new Date();
    targetDate.setHours(hour, minute, 0, 0);
    if (targetDate.getTime() <= Date.now()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const cycles = [6, 5, 4, 3];
    resultsContainer.innerHTML = '';

    cycles.forEach((cycleCount) => {
      const minutesBefore = (cycleCount * 90) + 14;
      const bedTime = new Date(targetDate.getTime() - (minutesBefore * 60 * 1000));
      const isOptimal = cycleCount === 5;

      const col = document.createElement('div');
      col.className = 'col-6 col-md-3';
      col.innerHTML = `
        <div class="sleep-chip ${isOptimal ? 'optimal' : ''}" data-cycles="${cycleCount}" data-bedtime="${formatTime(bedTime)}" data-bedraw="${bedTime.getTime()}">
          <small class="fw-bold text-muted d-block" style="font-size: 0.75rem;">${cycleCount} Cycles (${(cycleCount * 1.5).toFixed(1)}h)</small>
          <div class="h5 fw-bold my-1 text-dark font-mono">${formatTime(bedTime)}</div>
          <small class="${isOptimal ? 'text-success fw-bold' : 'text-muted'}" style="font-size: 0.75rem;">${isOptimal ? '🌟 Peak Rest' : 'Light Rest'}</small>
        </div>
      `;
      resultsContainer.appendChild(col);
    });

    const chips = resultsContainer.querySelectorAll('.sleep-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('optimal'));
        chip.classList.add('optimal');

        const bedRaw = parseInt(chip.dataset.bedraw);
        const bedDate = new Date(bedRaw);
        const curfewDate = new Date(bedRaw - (45 * 60 * 1000));
        const audioDate = new Date(bedRaw - (15 * 60 * 1000));

        if (routineBedTime) routineBedTime.textContent = formatTime(bedDate);
        if (routineCurfewTime) routineCurfewTime.textContent = formatTime(curfewDate);
        if (routineAudioTime) routineAudioTime.textContent = formatTime(audioDate);
        if (routineModal) routineModal.style.display = 'flex';
      });
    });
  }

  wakeHour?.addEventListener('change', calculateOptimalBedtimes);
  wakeMinute?.addEventListener('change', calculateOptimalBedtimes);
  wakeAmpm?.addEventListener('change', calculateOptimalBedtimes);

  closeRoutineBtn?.addEventListener('click', () => { if (routineModal) routineModal.style.display = 'none'; });
  routineModal?.addEventListener('click', (e) => { if (e.target === routineModal) routineModal.style.display = 'none'; });

  calculateOptimalBedtimes();
}

function initHabitTracker() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const feedback = document.getElementById('moodFeedbackText');
  const habits = document.querySelectorAll('.habit-item');
  const progressFill = document.getElementById('habitProgressFill');
  const progressText = document.getElementById('habitProgressText');

  const responses = {
    grateful: "✨ Gratitude floods your nervous system with restorative dopamine.",
    serene: "🌿 You are in deep parasympathetic equilibrium. Perfect for contemplation.",
    energized: "⚡ Channel this vitality into creative flow with structured breathwork.",
    overwhelmed: "🌧️ Settle in. 2 minutes of box breathing will lower sympathetic heart rate.",
    fatigued: "😴 Rest is productive. We recommend an evening wind-down with theta frequencies."
  };

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('selected', 'border-dark'));
      btn.classList.add('selected', 'border-dark');
      if (feedback) feedback.textContent = responses[btn.dataset.mood] || "Mindfulness acknowledged.";
    });
  });

  function updateHabitProgress() {
    const total = habits.length;
    const completed = document.querySelectorAll('.habit-item.completed').length;
    const pct = Math.round((completed / total) * 100);
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${completed}/${total} completed (${pct}%)`;
  }

  habits.forEach(item => {
    item.addEventListener('click', () => {
      const isDone = item.classList.toggle('completed');
      const icon = item.querySelector('i');
      if (icon) {
        icon.className = isDone ? 'bi bi-check-circle-fill text-success fs-5' : 'bi bi-circle text-muted fs-5';
      }
      updateHabitProgress();
    });
  });
  updateHabitProgress();
}

function initMeditationTimer() {
  const durationBtns = document.querySelectorAll('.timer-duration-btn');
  const displayEl = document.getElementById('meditationTimerDisplay');
  const startBtn = document.getElementById('startMeditationBtn');
  const progressCircle = document.getElementById('timerProgressRing');

  let durationSecs = 300;
  let currentSecs = 300;
  let isTimerRunning = false;
  let timerInterval = null;

  const C = 2 * Math.PI * 80;
  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${C} ${C}`;
    progressCircle.style.strokeDashoffset = `0`;
  }

  function formatTime(s) {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateRing() {
    if (!progressCircle) return;
    const progress = (durationSecs - currentSecs) / durationSecs;
    progressCircle.style.strokeDashoffset = `${progress * C}`;
  }

  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      durationSecs = parseInt(btn.dataset.mins) * 60;
      currentSecs = durationSecs;
      if (displayEl) displayEl.textContent = formatTime(currentSecs);
      updateRing();
      if (isTimerRunning) startBtn?.click();
    });
  });

  startBtn?.addEventListener('click', () => {
    if (isTimerRunning) {
      isTimerRunning = false;
      startBtn.innerHTML = '<i class="bi bi-play-fill me-1"></i> Start Meditation';
      clearInterval(timerInterval);
    } else {
      isTimerRunning = true;
      startBtn.innerHTML = '<i class="bi bi-pause-fill me-1"></i> Pause Meditation';
      playChime();
      timerInterval = setInterval(() => {
        currentSecs--;
        if (displayEl) displayEl.textContent = formatTime(currentSecs);
        updateRing();
        if (currentSecs <= 0) {
          clearInterval(timerInterval);
          isTimerRunning = false;
          startBtn.innerHTML = '<i class="bi bi-play-fill me-1"></i> Start Meditation';
          playChime();
          currentSecs = durationSecs;
          if (displayEl) displayEl.textContent = formatTime(currentSecs);
          updateRing();
          alert('🧘 Meditation session complete. Carry this stillness forward.');
        }
      }, 1000);
    }
  });

  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.0);
    } catch(e) {}
  }
}

function initPricingToggle() {
  const toggle = document.getElementById('billingPlanToggle');
  const starter = document.getElementById('priceStarter');
  const pro = document.getElementById('pricePro');

  toggle?.addEventListener('change', (e) => {
    if (e.target.checked) {
      if (starter) starter.textContent = '$4.99';
      if (pro) pro.textContent = '$8.99';
    } else {
      if (starter) starter.textContent = '$8.99';
      if (pro) pro.textContent = '$14.99';
    }
  });
}

function initAssessmentModal() {
  const modal = document.getElementById('assessmentModal');
  const openBtns = document.querySelectorAll('[data-open-modal="assessmentModal"]');
  const closeBtn = document.getElementById('closeModalBtn');
  const submitBtn = document.getElementById('submitAssessmentBtn');
  const step1 = document.getElementById('modalStep1');
  const step2 = document.getElementById('modalStep2');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.style.display = 'flex';
    });
  });

  closeBtn?.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  submitBtn?.addEventListener('click', () => {
    if (step1 && step2) {
      step1.style.display = 'none';
      step2.style.display = 'block';
    }
  });
}

function initFooterUtilities() {
  const clockEl = document.getElementById('footerCircadianClock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = `🕒 ${now.toLocaleTimeString(undefined, { hour12: false })}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  const newsletterBtn = document.getElementById('footerNewsletterBtn');
  const newsletterEmail = document.getElementById('footerNewsletterEmail');
  const newsletterStatus = document.getElementById('footerNewsletterStatus');
  newsletterBtn?.addEventListener('click', () => {
    const val = newsletterEmail?.value.trim();
    if (val && newsletterStatus) {
      newsletterStatus.textContent = '✓ Mindful journeys protocol dispatched!';
      newsletterEmail.value = '';
      setTimeout(() => { newsletterStatus.textContent = ''; }, 3500);
    }
  });
}
