/* ============================================
   NurSon — JS Engine v2
   ============================================ */

(function () {
  'use strict';

  /* ---- Loader ---- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('done');
        setTimeout(() => loader.remove(), 900);
      }, 1600);
    });
  }

  /* ---- Custom Cursor ---- */
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  if (dot && ring) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function followCursor() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(followCursor);
    }
    followCursor();

    // Hover effect on interactive elements
    const hoverEls = document.querySelectorAll('a, button, .option-btn, .gallery-thumb, .tab-btn, .testi-card, .why-card, details summary');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ---- Scroll progress bar ---- */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    document.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ---- Nav scroll behavior ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Active nav link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    // Remove any hardcoded --active modifier, let JS handle it
    link.classList.remove('nav__link--active');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Mobile menu ---- */
  const menuBtn = document.querySelector('.nav__menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav__close');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav && mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- Announcement bar messages ---- */
  const barMsgs = [
    '🌙 LIVRAISON OFFERTE DÈS 60€ · EXPÉDITION 24–48H',
    '✦ QUALITÉ PREMIUM · CONÇU EN FRANCE',
    '🤲 RETOUR GRATUIT 30 JOURS · PAIEMENT SÉCURISÉ',
    '✨ RAMADAN MUBARAK · OFFREZ LA LUMIÈRE DU CORAN'
  ];
  const barSpan = document.querySelector('.announcement-bar span');
  if (barSpan) {
    let barIdx = 0;
    setInterval(() => {
      barSpan.style.opacity = '0';
      barSpan.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        barIdx = (barIdx + 1) % barMsgs.length;
        barSpan.textContent = barMsgs[barIdx];
        barSpan.style.transition = 'none';
        barSpan.style.transform = 'translateY(8px)';
        setTimeout(() => {
          barSpan.style.transition = 'opacity 0.4s, transform 0.4s';
          barSpan.style.opacity = '1';
          barSpan.style.transform = 'translateY(0)';
        }, 20);
      }, 400);
      barSpan.style.transition = 'opacity 0.4s, transform 0.4s';
    }, 4000);
  }

  /* ---- Scroll reveal (Intersection Observer) ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-line, .reveal-fade').forEach(el => {
    revealObserver.observe(el);
  });

  /* ---- Counter animation ---- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ---- Magnetic buttons ---- */
  document.querySelectorAll('.mag-btn').forEach(wrap => {
    const btn = wrap.querySelector('.btn') || wrap;
    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => btn.style.transition = '', 500);
    });
  });

  /* ---- Tilt cards ---- */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
      card.style.transition = 'transform 0.6s var(--ease-out)';
      setTimeout(() => card.style.transition = '', 600);
    });
  });

  /* ---- Parallax on scroll ---- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    document.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const rect = el.parentElement.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  /* ---- Product gallery ---- */
  const thumbs = document.querySelectorAll('.gallery-thumb');
  if (thumbs.length) {
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const mainContent = document.querySelector('.gallery-main');
        if (mainContent && thumb.dataset.content) {
          mainContent.innerHTML = thumb.dataset.content;
        }
      });
    });
    if (thumbs[0]) thumbs[0].classList.add('active');
  }

  /* ---- Quantity selector ---- */
  const qtyInput = document.querySelector('.qty-input');
  const qtyMinus = document.querySelector('.qty-minus');
  const qtyPlus = document.querySelector('.qty-plus');
  if (qtyInput && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', () => { if (+qtyInput.value > 1) qtyInput.value--; });
    qtyPlus.addEventListener('click', () => { if (+qtyInput.value < 99) qtyInput.value++; });
  }

  /* ---- Option buttons ---- */
  document.querySelectorAll('.option-group').forEach(group => {
    group.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  /* ---- Product tabs ---- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      if (tabPanels[i]) tabPanels[i].classList.add('active');
    });
  });

  /* ---- Testimonials slider ---- */
  const track = document.querySelector('.testimonials__track');
  const navBtns = document.querySelectorAll('.testi-nav-btn');
  if (track && navBtns.length) {
    let current = 0;
    const cards = track.querySelectorAll('.testi-card');
    const max = Math.max(0, cards.length - 3);

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, max));
      const cardW = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardW}px)`;
    }

    navBtns[0].addEventListener('click', () => goTo(current - 1));
    navBtns[1].addEventListener('click', () => goTo(current + 1));
  }

  /* ---- Toast ---- */
  window.showToast = (msg, duration = 3500) => {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), duration);
  };

  /* ---- Add to cart ---- */
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const badge = document.querySelector('.cart-badge');
      if (badge) { badge.textContent = (+badge.textContent || 0) + 1; badge.style.display = 'flex'; }
      showToast('✦ Ajouté au panier');
    });
  });

  /* ---- Stripe redirect ---- */
  window.redirectToStripe = (priceId) => {
    // Remplacez par votre Stripe Payment Link
    const LINK = 'https://buy.stripe.com/VOTRE_LIEN_STRIPE';
    window.location.href = LINK;
  };

  /* ---- Contact form ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('[type=submit]');
      const original = btn.textContent;
      btn.textContent = 'Envoi…';
      btn.disabled = true;
      // Replace with Formspree fetch or similar
      setTimeout(() => {
        showToast('✦ Message envoyé avec succès');
        contactForm.reset();
        btn.textContent = original;
        btn.disabled = false;
      }, 1200);
    });
  }

  /* ---- Smooth anchor scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

})();
