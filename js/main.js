
document.addEventListener('DOMContentLoaded', () => {
  // ── Theme Initialisation (runs before paint via inline script ideally,
  //    but also here as fallback) ──────────────────────────────────────
  const html = document.documentElement;
  const saved = localStorage.getItem('senden-theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  // Theme toggle button
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('senden-theme', next);
    });
  }

  // Also sync when OS preference changes (no manual override)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('senden-theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  // Page Transitions
  const transition = document.querySelector('.page-transition');
  const internalLinks = document.querySelectorAll('a[href^="./"], a[href^="/"], a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) return;
      if (href === window.location.pathname.split('/').pop()) return;

      e.preventDefault();
      transition.classList.add('active');

      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });

  // Remove transition on load
  setTimeout(() => {
    transition.classList.remove('active');
  }, 100);

  // Navigation scroll effect
  const nav = document.querySelector('.main-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Parallax
  const parallaxElements = document.querySelectorAll('.hero-bg, .parallax-bg');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(el => {
      const speed = el.dataset.speed || 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Intersection Observer for reveals
  const revealElements = document.querySelectorAll('.reveal, .img-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Mobile Menu ───────────────────────────────────────────────────
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('open');
      navLinks.classList.toggle('open');
      menuBtn.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on any nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when tapping outside the nav
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.main-nav') && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Skeleton removal
  const skeletons = document.querySelectorAll('.skeleton');
  setTimeout(() => {
    skeletons.forEach(s => {
      s.classList.remove('skeleton');
    });
  }, 1500);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
