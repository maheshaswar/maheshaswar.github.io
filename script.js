/* ─── NAVBAR SCROLL ─────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── MOBILE NAV TOGGLE ─────────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.cssText = 'transform: translateY(6.5px) rotate(45deg)';
    spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
    spans[2].style.cssText = 'transform: translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = entry.target.closest('.container, section')
        ?.querySelectorAll('.reveal:not(.visible)') || [];
      let delay = 0;
      siblings.forEach(el => {
        if (el === entry.target) {
          entry.target.style.transitionDelay = delay + 'ms';
          entry.target.classList.add('visible');
        }
      });
      // Fallback: just reveal it
      if (!entry.target.classList.contains('visible')) {
        entry.target.classList.add('visible');
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Staggered reveal within each section
function initReveal() {
  const sections = document.querySelectorAll('section, footer');
  sections.forEach(section => {
    const reveals = section.querySelectorAll('.reveal');
    reveals.forEach((el, i) => {
      el.dataset.delay = i * 80;
    });
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

// Override observer to use per-element delay
const betterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      betterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Group by section for stagger
  const section = el.closest('section');
  if (section) {
    const siblings = Array.from(section.querySelectorAll('.reveal'));
    const idx = siblings.indexOf(el);
    el.dataset.delay = idx * 90;
  }
  betterObserver.observe(el);
});

/* ─── ACTIVE NAV LINK ON SCROLL ─────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--teal)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── SMOOTH SCROLL OFFSET (for fixed nav) ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── HERO PARALLAX ─────────────────────────────────────────────────────── */
const heroBgText = document.querySelector('.hero-bg-text');
window.addEventListener('scroll', () => {
  if (heroBgText) {
    const y = window.scrollY;
    heroBgText.style.transform = `translate(-50%, calc(-50% + ${y * 0.3}px))`;
  }
}, { passive: true });

/* ─── CURSOR GLOW (desktop only) ────────────────────────────────────────── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 300px; height: 300px;
    border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(26,158,158,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ─── SKILL CARD HOVER TILT ─────────────────────────────────────────────── */
document.querySelectorAll('.skill-card, .project-card, .contact-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── YEAR IN FOOTER ─────────────────────────────────────────────────────── */
const footerYear = document.querySelector('footer p');
if (footerYear) {
  footerYear.innerHTML = footerYear.innerHTML.replace('2026', new Date().getFullYear());
}
