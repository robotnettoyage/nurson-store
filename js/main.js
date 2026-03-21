/* ============================================
   NurSon — Scripts principaux
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Announcement bar rotation ----
  const messages = [
    '🌙 Livraison offerte dès 60€ d\'achat',
    '✨ Qualité premium, fabrication éthique',
    '📦 Expédition sous 24–48h ouvrées',
    '🤲 Produits conçus pour nourrir la foi'
  ];

  const bar = document.querySelector('.announcement-bar span');
  if (bar) {
    let index = 0;
    setInterval(() => {
      index = (index + 1) % messages.length;
      bar.style.opacity = '0';
      setTimeout(() => {
        bar.textContent = messages[index];
        bar.style.opacity = '1';
      }, 300);
    }, 4000);
  }

  // ---- Mobile menu ----
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav__close');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav && mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Product gallery (product page) ----
  const thumbs = document.querySelectorAll('.gallery__thumb');
  const mainImg = document.querySelector('.gallery__main-img');

  if (thumbs.length && mainImg) {
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const src = thumb.querySelector('img')?.src;
        if (src) mainImg.src = src;
      });
    });
  }

  // ---- Quantity selector ----
  const qtyInput = document.querySelector('.qty-input');
  const qtyMinus = document.querySelector('.qty-minus');
  const qtyPlus = document.querySelector('.qty-plus');

  if (qtyInput && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value, 10);
      if (val > 1) qtyInput.value = val - 1;
    });
    qtyPlus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value, 10);
      if (val < 99) qtyInput.value = val + 1;
    });
    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 99) val = 99;
      qtyInput.value = val;
    });
  }

  // ---- Option buttons (color/version) ----
  document.querySelectorAll('.option-group').forEach(group => {
    const btns = group.querySelectorAll('.option-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // ---- Product tabs ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length) {
    tabBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (tabPanels[i]) tabPanels[i].classList.add('active');
      });
    });
  }

  // ---- Toast notification ----
  window.showToast = function(message, duration = 3000) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  };

  // ---- Add to cart (mock) ----
  const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Update cart badge
      const badge = document.querySelector('.cart-badge');
      if (badge) {
        const count = parseInt(badge.textContent || '0', 10);
        badge.textContent = count + 1;
        badge.style.display = 'flex';
      }
      showToast('✓ Produit ajouté au panier !');
    });
  });

  // ---- Stripe Checkout redirect ----
  window.redirectToStripe = function(priceId) {
    // Replace STRIPE_PAYMENT_LINK with your actual Stripe Payment Link URL
    // or use Stripe.js with your publishable key + price ID
    const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/VOTRE_LIEN_STRIPE';
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  // ---- Contact form ----
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.textContent = 'Envoi en cours…';
      btn.disabled = true;

      // Replace with your form submission endpoint (Formspree, Netlify Forms, etc.)
      // For now, simulate success
      setTimeout(() => {
        btn.textContent = 'Message envoyé !';
        showToast('✓ Votre message a bien été envoyé !');
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = 'Envoyer le message';
          btn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }

  // ---- Scroll animations (Intersection Observer) ----
  const animatedEls = document.querySelectorAll('.fade-in');
  if (animatedEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animatedEls.forEach(el => observer.observe(el));
  }

});
