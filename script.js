/* ===== TEAM AD ASTRA — UPGRADED MAIN JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', () => {
  // Register plugins if they exist
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initPreloader();
  initEnhancedStarCanvas();
  initNavbar();
  initMobileMenu();
  initSwiper();
  initSubsystemInteractions();
  initProjectInteractions();
  initCompetitionInteractions();
  initGoalInteractions();
  initBatchTabs();
  initContactForm();
  initAdminVault();

  // Wait a small delay to ensure DOM is ready for GSAP measurements
  setTimeout(() => {
    if (typeof gsap !== 'undefined' && window.innerWidth > 768) {
      initGSAPAnimations();
    } else {
      initFallbackReveals();
    }
  }, 100);

  initMagneticButtons();
  initCounters();
  initSmoothScroll();
  initActiveNavHighlight();
  initHeroTyped();
});

/* ===== PRELOADER ===== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });
  setTimeout(() => preloader.classList.add('hidden'), 3500);
}



/* ===== ENHANCED WEBGL-LIKE STAR CANVAS (Warp Effect) ===== */
function initEnhancedStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let speedX = 0;
  let speedY = 0;
  let targetSpeedX = 0;
  let targetSpeedY = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetSpeedX = x * 8;
    targetSpeedY = y * 8;
  });

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.z = Math.random() * 2000;
      this.pz = this.z;
    }
    update() {
      this.z -= 5;

      // Mouse interaction
      this.x += speedX * (2000 / this.z) * 0.5;
      this.y += speedY * (2000 / this.z) * 0.5;

      if (this.z <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
        this.z = 2000;
      }
    }
    draw() {
      let x = (this.x - canvas.width / 2) * (2000 / this.z) + canvas.width / 2;
      let y = (this.y - canvas.height / 2) * (2000 / this.z) + canvas.height / 2;
      let radius = (2000 / this.z) * 1.2;

      let px = (this.x - canvas.width / 2) * (2000 / this.pz) + canvas.width / 2;
      let py = (this.y - canvas.height / 2) * (2000 / this.pz) + canvas.height / 2;

      this.pz = this.z;

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.lineWidth = radius;

      // Color closer stars orange to mix with the rover theme
      if (this.z < 500 && Math.random() > 0.8) {
        ctx.strokeStyle = `rgba(232, 122, 45, ${1 - this.z / 2000})`;
      } else {
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - this.z / 2000})`;
      }
      ctx.stroke();
    }
  }

  const renderStars = window.innerWidth < 768 ? 200 : 700;
  for (let i = 0; i < renderStars; i++) {
    stars.push(new Star());
  }

  function animate() {
    ctx.fillStyle = 'rgba(5, 5, 8, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    speedX += (targetSpeedX - speedX) * 0.05;
    speedY += (targetSpeedY - speedY) * 0.05;

    stars.forEach(star => {
      star.update();
      star.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== SWIPER COVERFLOW INIT (MOBILE RESPONSIVE) ===== */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.achievements-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1.1,
    spaceBetween: 20,
    speed: 800,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 'auto',
        spaceBetween: 40,
        coverflowEffect: { rotate: 15, depth: 300 }
      }
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    keyboard: { enabled: true },
    loop: true,
  });
}

/* ===== GSAP SCROLL ANIMATIONS ===== */
function initGSAPAnimations() {
  // Parallax the starfield for depth
  gsap.to('#star-canvas', {
    y: '40%',
    ease: "none",
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Hero Parallax
  gsap.to('.hero-content', {
    y: window.innerHeight * 0.3,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Rover drives slightly on scroll in Hero
  gsap.to('.rover-silhouette', {
    x: 300,
    ease: "none",
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Floating Orbs Parallax
  gsap.utils.toArray('.orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: (i + 1) * 100,
      ease: "none",
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // General element reveals
  const reveals = gsap.utils.toArray('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  reveals.forEach(el => {
    let xOffset = 0;
    let yOffset = 60;

    if (el.classList.contains('reveal-left')) { xOffset = -80; yOffset = 0; }
    if (el.classList.contains('reveal-right')) { xOffset = 80; yOffset = 0; }

    // Check if element is a card inside a grid for staggered reveal
    if (el.classList.contains('subsystem-card') || el.classList.contains('competition-card') || el.classList.contains('mission-card')) {
      // Group staggered animation handled below
    } else {
      gsap.fromTo(el,
        { autoAlpha: 0, y: yOffset, x: xOffset },
        {
          autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  // Staggered Grids (Subsystems & Competitions)
  const grids = ['.subsystems-grid', '.competitions-grid', '.missions-grid'];
  grids.forEach(gridClass => {
    const grid = document.querySelector(gridClass);
    if (grid) {
      const cards = grid.querySelectorAll('.reveal, .reveal-scale');
      gsap.fromTo(cards,
        { autoAlpha: 0, y: 40, scale: 0.95 },
        {
          autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)', stagger: 0.1,
          scrollTrigger: {
            trigger: grid,
            start: 'top 95%',
          }
        }
      );
    }
  });

  // Tree element reveals (CSS class based animation)
  const treeItems = gsap.utils.toArray('.tree-reveal, .line-reveal');
  treeItems.forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      onEnter: () => el.classList.add('revealed')
    });
  });
}

function initFallbackReveals() {
  // Fallback for mobile or when GSAP is disabled
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observer.observe(el));
}

/* ===== HERO TYPED ANIMATION ===== */
function initHeroTyped() {
  const target = document.getElementById('hero-typed');
  if (!target) return;
  const text = "Designing Mars rovers to explore the Red Planet.";
  let index = 0;
  target.textContent = "";
  
  function type() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(type, 50);
    }
  }
  
  // Start typing after a short delay
  setTimeout(type, 1200);
}


/* ===== MAGNETIC BUTTONS ===== */
function initMagneticButtons() {
  const magnets = document.querySelectorAll('.btn-primary, .btn-outline, .subsystem-icon, .social-link');

  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - h;

      // Inject CSS variables for background glow effect
      btn.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);

      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
      }
    });
  });
}


/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const mobileLinks = mobileMenu.querySelectorAll('a');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ===== ANIMATED COUNTERS ===== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let counted = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          let startTimestamp = null;
          const duration = 2000;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentObj = Math.floor(easedProgress * target);

            counter.textContent = currentObj + (target > 5 ? '+' : '');
            if (progress < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) observer.observe(statsSection);
}

/* ===== SMOOTH SCROLLING ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

/* ===== ACTIVE NAV HIGHLIGHT ===== */
function initActiveNavHighlight() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    // Basic match
    if (href === currentPath || href.includes(currentPath + '#')) {
      link.classList.add('active');
    }
  });

  // Scroll logic strictly for index.html sections
  if (currentPath === 'index.html' || currentPath === '') {
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.scrollY;
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      if (current) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === '#' + current || href === 'index.html#' + current || (current === 'home' && href === 'index.html')) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ===== FORM SUBMIT & STORAGE ===== */
/* ===== CONTACT FORM SUBMISSION (WEB3FORMS) ===== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  const btn = document.getElementById('submit-btn');
  const msg = document.getElementById('form-msg');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const accessKey = form.querySelector('[name="access_key"]').value;
    if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
      msg.innerHTML = "Configuration missing: Please add your free Web3Forms Access Key in contact.html!";
      msg.style.display = "block";
      setTimeout(() => { msg.style.display = 'none'; }, 6000);
      return;
    }

    // Fallback: Save to LocalStorage for Admin Vault
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      timestamp: new Date().toISOString()
    };
    let submissions = JSON.parse(localStorage.getItem('adAstraQueries') || '[]');
    submissions.push(formData);
    localStorage.setItem('adAstraQueries', JSON.stringify(submissions));

    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        msg.innerHTML = "Message sent successfully!";
        msg.style.color = "var(--accent)";
        msg.style.display = "block";
        form.reset();
      } else {
        msg.innerHTML = json.message || "Something went wrong!";
        msg.style.color = "red";
        msg.style.display = "block";
      }
    })
    .catch(error => {
      msg.innerHTML = "Error sending message. Please try again.";
      msg.style.color = "red";
      msg.style.display = "block";
      console.error('Error!', error);
    })
    .finally(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => { msg.style.display = 'none'; }, 5000);
    });
  });
}

/* ===== SUBSYSTEM INTERACTIONS ===== */
function initSubsystemInteractions() {
  const cards = document.querySelectorAll('.subsystem-card');
  const visuals = document.querySelectorAll('.bg-visual');
  if (!cards.length || !visuals.length) return;

  // Track the actively clicked subsystem
  let clickedTarget = null;

  cards.forEach(card => {
    const target = card.getAttribute('data-target');

    card.addEventListener('mouseenter', () => {
      if (window.innerWidth < 768) return; 
      // Always show visual on hover
      visuals.forEach(v => v.classList.remove('active'));
      const activeVisual = document.getElementById(`bg-${target}`);
      if (activeVisual) activeVisual.classList.add('active');
    });

    card.addEventListener('mouseleave', () => {
      // Only remove visual if we didn't just click something (meaning clickedTarget exists)
      if (!clickedTarget) {
        visuals.forEach(v => v.classList.remove('active'));
      } else {
        // Return to the clicked visual
        visuals.forEach(v => v.classList.remove('active'));
        const activeVisual = document.getElementById(`bg-${clickedTarget}`);
        if (activeVisual) activeVisual.classList.add('active');
      }
    });

    card.addEventListener('click', (e) => {
      e.preventDefault();
      const allPanes = document.querySelectorAll('.details-pane');
      const targetPane = document.getElementById(`details-${target}`);
      const isAlreadyActive = targetPane && targetPane.classList.contains('active');

      // Reset
      allPanes.forEach(p => {
        p.classList.remove('active');
        p.style.opacity = '0';
      });

      if (!isAlreadyActive && targetPane) {
        clickedTarget = target;
        targetPane.classList.add('active');
        
        // Trigger reflow for transition
        void targetPane.offsetWidth;
        targetPane.style.opacity = '1';
        
        // Keep correct visual
        visuals.forEach(v => v.classList.remove('active'));
        const activeVisual = document.getElementById(`bg-${target}`);
        if (activeVisual) activeVisual.classList.add('active');
        
        // Scroll elegantly
        setTimeout(() => {
          const y = targetPane.getBoundingClientRect().top + window.scrollY - 150;
          window.scrollTo({top: y, behavior: 'smooth'});
        }, 100);
      } else {
        clickedTarget = null;
        visuals.forEach(v => v.classList.remove('active'));
      }
    });

  });
}

/* ===== ADMIN VAULT ===== */
function initAdminVault() {
  const logo = document.querySelector('.footer-brand .nav-logo');
  if (!logo) return;

  let clickCount = 0;
  let clickTimer = null;

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);

    clickTimer = setTimeout(() => { clickCount = 0; }, 800);

    if (clickCount >= 5) {
      clickCount = 0;
      const pin = prompt("Enter Admin PIN:");
      if (pin === "0000" || pin === "adastra") {
        showAdminModal();
      } else if (pin !== null) {
        alert("Access Denied");
      }
    }
  });
}

function showAdminModal() {
  let modal = document.getElementById('admin-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(5,5,8,0.95); z-index: 999999;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 20px; color: white; font-family: 'JetBrains Mono', monospace; backdrop-filter: blur(10px);
    `;
    document.body.appendChild(modal);
  }

  const submissions = JSON.parse(localStorage.getItem('adAstraQueries') || '[]');
  let html = `<div style="max-width:800px; width: 100%; background: #111; border: 1px solid #333; border-radius: 12px; padding: 30px; max-height: 80vh; overflow-y: auto;">
    <div style="display:flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 15px;">
      <h2 style="color: #E87A2D; margin:0">Vault: Queries & Forms</h2>
      <button onclick="document.getElementById('admin-modal').style.display='none'" style="background:none; border:none; color:white; font-size: 2rem; line-height: 1; cursor:pointer">×</button>
    </div>`;

  if (submissions.length === 0) {
    html += `<p style="color: #aaa; text-align: center; padding: 40px 0;">No active queries found in local memory.</p>`;
  } else {
    submissions.forEach((sub, i) => {
      html += `<div style="background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.05);">
        <strong style="font-size: 1.1rem; color: #fff;">#${i + 1} : ${sub.name || sub.firstName}</strong> <span style="color: #E87A2D; margin-left: 10px;">(${sub.email})</span><br>
        <div style="margin: 12px 0; display: inline-block; background: rgba(232,122,45,0.1); padding: 5px 12px; border-radius: 5px; font-size:0.8rem; color: #E87A2D; border: 1px solid rgba(232,122,45,0.2);">Subject: ${sub.subject || sub.subsystem || 'N/A'}</div>
        <div style="margin-top:8px; font-size:0.9rem; color:#bbb; line-height: 1.6; border-left: 2px solid #333; padding-left: 15px;">${sub.message || 'No message provided.'}</div>
        <div style="margin-top:12px; font-size: 0.7rem; color: #555;">Submitted: ${new Date(sub.timestamp).toLocaleString()}</div>
      </div>`;
    });
  }

  html += `</div>`;
  modal.innerHTML = html;
  modal.style.display = 'flex';
}

/* ===== COMPETITION INTERACTIONS ===== */
function initCompetitionInteractions() {
  const cards = document.querySelectorAll('.competition-card[data-comp]');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking the "Know More" button
      if (e.target.closest('.btn')) return;

      e.preventDefault();
      const target = card.getAttribute('data-comp');
      const allPanes = document.querySelectorAll('#comp-details-container .details-pane');
      const targetPane = document.getElementById(`comp-${target}`);
      const isAlreadyActive = targetPane && targetPane.classList.contains('active');

      // Reset all
      allPanes.forEach(p => {
        p.classList.remove('active');
        p.style.opacity = '0';
      });

      // Remove active state from all cards
      cards.forEach(c => c.classList.remove('comp-active'));

      if (!isAlreadyActive && targetPane) {
        card.classList.add('comp-active');
        targetPane.classList.add('active');
        void targetPane.offsetWidth;
        targetPane.style.opacity = '1';

        setTimeout(() => {
          const y = targetPane.getBoundingClientRect().top + window.scrollY - 150;
          window.scrollTo({top: y, behavior: 'smooth'});
        }, 100);
      }
    });
  });
}

/* ===== BATCH TABS ===== */
function initBatchTabs() {
  const tabs = document.querySelectorAll('.batch-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide all panels
      const targetBatch = tab.getAttribute('data-batch');
      const allPanels = document.querySelectorAll('.batch-panel');
      allPanels.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      // Show target panel
      const targetPanel = document.getElementById(`batch-${targetBatch}`);
      if (targetPanel) {
        targetPanel.style.display = 'block';
        // Force reflow for animation
        void targetPanel.offsetWidth;
        targetPanel.classList.add('active');
        
        // Re-trigger GSAP animations if present
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    });
  });
}

/* ===== GOAL/PRINCIPLE DETAILS INTERACTIONS ===== */
function initGoalInteractions() {
  const cards = document.querySelectorAll('.goals-grid .goal-card[data-goal]');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const target = card.getAttribute('data-goal');
      const allPanes = document.querySelectorAll('#goals-details-container .details-pane');
      const targetPane = document.getElementById(`details-${target}`);
      const isAlreadyActive = targetPane && targetPane.classList.contains('active');

      // Reset all details panes
      allPanes.forEach(p => {
        p.classList.remove('active');
        p.style.opacity = '0';
      });

      // Reset active state of all cards
      cards.forEach(c => c.classList.remove('active'));

      if (!isAlreadyActive && targetPane) {
        card.classList.add('active');
        targetPane.classList.add('active');
        
        // Trigger reflow for transition
        void targetPane.offsetWidth;
        targetPane.style.opacity = '1';
        
        // Scroll elegantly to the opened detail pane
        setTimeout(() => {
          const y = targetPane.getBoundingClientRect().top + window.scrollY - 150;
          window.scrollTo({top: y, behavior: 'smooth'});
        }, 100);
      }
    });
  });
}

/* ===== PROJECT DETAILS INTERACTIONS ===== */
function initProjectInteractions() {
  const cards = document.querySelectorAll('.projects-grid .project-card[data-target]');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const target = card.getAttribute('data-target');
      const allPanes = document.querySelectorAll('#project-details-container .project-details-pane');
      const targetPane = document.getElementById(`details-${target}`);
      const isAlreadyActive = targetPane && targetPane.classList.contains('active');

      // Reset all details panes
      allPanes.forEach(p => {
        p.classList.remove('active');
        p.style.opacity = '0';
      });

      // Reset active state of all cards
      cards.forEach(c => c.classList.remove('active'));

      if (!isAlreadyActive && targetPane) {
        card.classList.add('active');
        targetPane.classList.add('active');
        
        // Trigger reflow for transition
        void targetPane.offsetWidth;
        targetPane.style.opacity = '1';
        
        // Scroll elegantly to the opened detail pane
        setTimeout(() => {
          const y = targetPane.getBoundingClientRect().top + window.scrollY - 150;
          window.scrollTo({top: y, behavior: 'smooth'});
        }, 100);

        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    });
  });
}


