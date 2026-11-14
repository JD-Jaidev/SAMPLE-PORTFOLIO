/**
 * ==========================================================================
 * JAIDEV PORTFOLIO // CORE SCRIPT & INTERACTION ENGINE
 * Cyberpunk & LARPER-OR-CODER Aesthetic Logic
 * GSAP, Particle Canvas, Interactive Shell, Web Audio SFX & Responsive UX
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. WEB AUDIO API SYNTHESIZER (ZERO ASSET SFX)
  // ==========================================
  class SoundEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
      this.initContext();
    }

    initContext() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('AudioContext not supported');
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playBleep(freq = 750, duration = 0.04, type = 'sine', gainVal = 0.04) {
      if (!this.enabled || !this.ctx) return;
      this.resume();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (err) {
        // Fallback silently
      }
    }

    playKey() {
      // Mechanical terminal keystroke click
      this.playBleep(420 + Math.random() * 80, 0.03, 'triangle', 0.025);
    }

    playHover() {
      // Subtle cyber tick
      this.playBleep(1100, 0.02, 'sine', 0.015);
    }

    playConfirm() {
      // Success chord
      if (!this.enabled || !this.ctx) return;
      this.playBleep(523.25, 0.12, 'sine', 0.03);
      setTimeout(() => this.playBleep(659.25, 0.12, 'sine', 0.03), 60);
      setTimeout(() => this.playBleep(783.99, 0.18, 'sine', 0.03), 120);
    }
  }

  const sfx = new SoundEngine();

  // SFX Toggle button logic
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');
  const sfxText = document.getElementById('sfx-text');

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      if (sfx.enabled) {
        sfx.resume();
        sfx.playConfirm();
        sfxIcon.className = 'ri-volume-up-line';
        sfxText.textContent = 'SFX: ON';
        sfxToggleBtn.style.borderColor = 'var(--neon-green)';
        sfxToggleBtn.style.color = 'var(--neon-green)';
      } else {
        sfxIcon.className = 'ri-volume-mute-line';
        sfxText.textContent = 'SFX: OFF';
        sfxToggleBtn.style.borderColor = 'var(--border-subtle)';
        sfxToggleBtn.style.color = 'var(--text-dim)';
      }
    });
  }

  // Bind interactive SFX to clickable items
  document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => sfx.playHover());
  });

  // ==========================================
  // 2. REAL-TIME UTC / STATUS CLOCK
  // ==========================================
  const clockEl = document.getElementById('local-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ==========================================
  // 3. CUSTOM CURSOR TRACKING
  // ==========================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (cursorRing) {
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    }
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Add hover state to cursor when over clickable targets
  const interactiveTargets = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card');
  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ==========================================
  // 4. PARTICLE CANVAS GRID (CYBER NODES & CONNECTIONS)
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.5 + 0.8;
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse proximity reaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * 0.8;
          this.y -= Math.sin(angle) * 0.8;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const opacity = (1 - dist / 130) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================
  // 5. TERMINAL ROLE TYPING ANIMATION
  // ==========================================
  const typedEl = document.getElementById('typed-role');
  if (typedEl) {
    const roles = [
      'AI Engineer & Software Developer',
      'LLM Architect & PyTorch Specialist',
      'Full-Stack Systems Engineer',
      'High-Performance C++ & Python Hacker',
      'Zero LARP. Pure Production Impact.'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 90;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typedEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeDelay = 45;
      } else {
        typedEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeDelay = 85;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typeDelay = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeDelay = 500;
      }

      setTimeout(typeLoop, typeDelay);
    }
    typeLoop();
  }

  // ==========================================
  // 6. NAVBAR SCROLL & MOBILE MENU
  // ==========================================
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      sfx.playKey();
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 7. SKILLS FILTER MATRIX
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sfx.playKey();
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 8. MAGNETIC 3D TILT EFFECT ON CARDS
  // ==========================================
  const interactiveCards = document.querySelectorAll('.project-card, .cyber-panel');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // ==========================================
  // 9. INTERACTIVE CYBERNETIC TERMINAL
  // ==========================================
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalScreen = document.getElementById('terminal-screen');
  const quickCmdBtns = document.querySelectorAll('.quick-btn');

  const COMMAND_REGISTRY = {
    help: () => `
<span class="text-cyan font-bold">AVAILABLE COMMANDS:</span>
  <span class="text-yellow">about</span>        : Dossier, philosophy & background
  <span class="text-yellow">skills</span>       : Production weapon stack & languages
  <span class="text-yellow">projects</span>     : Deployed systems & key metrics
  <span class="text-yellow">larp-check</span>   : Run anti-larper verification scan
  <span class="text-yellow">contact</span>      : Transmit signal / direct channels
  <span class="text-yellow">resume</span>       : Summary qualifications & ATS spec
  <span class="text-yellow">whoami</span>       : Current user session & clearance
  <span class="text-yellow">matrix</span>       : Visual system benchmark scan
  <span class="text-yellow">clear</span>        : Flush terminal buffer
`,
    about: () => `
<span class="text-green font-bold">SYSTEM_DOSSIER:</span>
  Identity: Jaidev
  Classification: AI Engineer & High-Performance Software Developer
  Doctrine: "Zero LARP. Just Lock In. Ship code that works at scale."
  Core Focus: Deep Learning, ATS Resume Analysis, Real-time Synergy Systems, C++ STL
`,
    skills: () => `
<span class="text-cyan font-bold">PRODUCTION ARSENAL:</span>
  [AI / ML]     : PyTorch, Transformers, LangChain, Embeddings, RAG, OpenCV
  [LANGUAGES]   : Python, C++ (STL/Modern), TypeScript, JavaScript, SQL
  [FULL-STACK]  : React, Next.js, FastAPI, Node.js, WebSockets, TailwindCSS
  [INFRA & DB]  : PostgreSQL, Redis, Docker, Linux/Bash, Git, AWS
`,
    projects: () => `
<span class="text-purple font-bold">DEPLOYED REPOSITORIES:</span>
  1. <span class="text-cyan font-bold">AI Resume Analyzer</span>: Semantic ATS parser & vector embedding score. [94.8% accuracy]
  2. <span class="text-purple font-bold">Team Forge</span>: Hackathon pairing & real-time socket collaboration. [1200+ teams]
  3. <span class="text-green font-bold">AlgoPulse Visualizer</span>: 60FPS memory & graph traversal inspector. [C++ / Wasm]
  4. <span class="text-yellow font-bold">NeuralCode Optimizer</span>: AST-level anti-pattern & Big-O speedup suite.
`,
    'larp-check': () => `
<span class="text-yellow font-bold">[DIAGNOSTIC TEST RUNNING: LARPER OR CODER?]</span>
  > Scanning commit history... <span class="text-green">[PASS: Real Git Diffs]</span>
  > Checking algorithm efficiency... <span class="text-green">[PASS: O(N log N)]</span>
  > Inspecting buzzword density... <span class="text-green">[ZERO UNUSED BUZZWORDS]</span>
  > Stress-testing build in production... <span class="text-green">[ZERO TLE DETECTED]</span>
  -------------------------------------------------------------
  <span class="text-green font-bold">VERDICT: 100% AUTHENTIC CODER. ZERO LARP REGISTERED.</span>
  <span class="text-cyan">"Resume says 10x. Code says 10x."</span>
`,
    contact: () => `
<span class="text-cyan font-bold">COMMUNICATION CHANNELS:</span>
  Email     : <a href="mailto:jaidev.dev.ai@gmail.com" class="text-yellow">jaidev.dev.ai@gmail.com</a>
  GitHub    : <a href="https://github.com/jaidev" target="_blank" class="text-purple">github.com/jaidev</a>
  LinkedIn  : <a href="https://linkedin.com/in/jaidev" target="_blank" class="text-blue">linkedin.com/in/jaidev</a>
  Location  : Remote / India [UTC+5:30]
`,
    resume: () => `
<span class="text-green font-bold">RESUME_SPECIFICATION:</span>
  Candidate: Jaidev
  Roles: AI Engineer / ML Engineer / Full-Stack Developer
  ATS Score: 98/100
  Download / View: Run 'contact' to request complete confidential dossier.
`,
    whoami: () => `guest@jaidev.dev [CLEARANCE: GUEST_LEVEL_1] [STATUS: RECEPTIVE]`,
    matrix: () => `
<span class="text-green">01001010 01000001 01001001 01000100 01000101 01010110</span>
<span class="text-cyan">[SYS_BENCHMARK]: LATENCY 12ms | MEMORY 42MB | 60 FPS NOMINAL</span>
`,
    clear: () => {
      if (terminalOutput) terminalOutput.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    sfx.playKey();

    // Print command line
    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt-symbol">guest@jaidev.dev:~$</span> <span class="text-white">${rawCmd}</span>`;
    terminalOutput.appendChild(userLine);

    // Evaluate
    let outputHTML = '';
    if (COMMAND_REGISTRY[cmd]) {
      outputHTML = COMMAND_REGISTRY[cmd]();
    } else if (cmd.startsWith('cat ')) {
      outputHTML = `<span class="text-muted">cat: ${cmd.substring(4)}: Permission granted. Content: [VERIFIED ENGINEER RECORD]</span>`;
    } else if (cmd === 'sudo') {
      outputHTML = `<span class="text-red font-bold">ACCESS DENIED: Jaidev reserves root privilege. Nice try.</span>`;
    } else {
      outputHTML = `<span class="text-red">Command not recognized: '${rawCmd}'. Type <span class="text-yellow font-bold">'help'</span> for instructions.</span>`;
    }

    if (cmd !== 'clear' && outputHTML) {
      const respLine = document.createElement('div');
      respLine.className = 'term-line';
      respLine.innerHTML = outputHTML;
      terminalOutput.appendChild(respLine);
    }

    // Scroll to bottom
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(terminalInput.value);
        terminalInput.value = '';
      }
    });

    // Terminal quick actions
    quickCmdBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        terminalInput.value = cmd;
        executeCommand(cmd);
        terminalInput.value = '';
      });
    });
  }

  // ==========================================
  // 10. GSAP SCROLLTRIGGER & HERO ENHANCEMENTS
  // ==========================================
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Reveal elements with .gs-reveal
    gsap.utils.toArray('.gs-reveal').forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 25 }, 
        {
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Stat counter animation
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(stat => {
      const targetVal = parseFloat(stat.getAttribute('data-val'));
      gsap.to(stat, {
        innerHTML: targetVal,
        duration: 1.8,
        ease: 'power1.out',
        snap: { innerHTML: 1 },
        scrollTrigger: {
          trigger: stat,
          start: 'top 90%'
        }
      });
    });
  }

  // ==========================================
  // 11. PACKET TRANSMITTER (CONTACT FORM)
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sfx.playConfirm();

      const nameVal = document.getElementById('name').value;
      const emailVal = document.getElementById('email').value;
      const msgVal = document.getElementById('message').value;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> ENCRYPTING & DISPATCHING...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="ri-check-line"></i> PACKET DELIVERED`;

        formStatus.className = 'form-status success';
        formStatus.innerHTML = `> PACKET SENT SUCCESSFULLY // ACK RECEIVED FROM JAIDEV // EXPECT HANDSHAKE SHORTLY.`;

        // Direct mailto fallback link triggers
        const mailSubject = encodeURIComponent(document.getElementById('subject').value || 'Portfolio Collaboration Inquiry');
        const mailBody = encodeURIComponent(`From: ${nameVal} (${emailVal})\n\nMessage:\n${msgVal}`);
        const mailLink = `mailto:jaidev.dev.ai@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        // Create temporary anchor to open user's mail client
        const a = document.createElement('a');
        a.href = mailLink;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = `<i class="ri-send-plane-2-fill"></i> <span class="btn-text">DISPATCH PACKET</span>`;
        }, 4000);
      }, 1200);
    });
  }

});
