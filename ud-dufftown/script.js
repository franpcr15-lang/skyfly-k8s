/* ============================================
   UD DUFFTOWN — Script principal
   ============================================ */

(function () {
  'use strict';

  // ---------- Año dinámico ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Header con scroll ----------
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const back = document.getElementById('backTop');
    if (window.scrollY > 600) back.classList.add('show');
    else back.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Menú móvil ----------
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const mmClose = document.getElementById('mmClose');
  const backdrop = document.getElementById('mobileBackdrop');

  const openMenu = () => {
    mainNav.classList.add('open');
    backdrop.classList.add('show');
    navToggle.classList.add('open');
    document.body.classList.add('menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mainNav.classList.remove('open');
    backdrop.classList.remove('show');
    navToggle.classList.remove('open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    if (mainNav.classList.contains('open')) closeMenu();
    else openMenu();
  });
  if (mmClose) mmClose.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Cerrar el menú al pulsar enlaces
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) closeMenu();
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) closeMenu();
  });

  // Cerrar si la ventana crece a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && mainNav.classList.contains('open')) closeMenu();
  });

  // ---------- Slider del hero ----------
  const slides = document.querySelectorAll('#heroSlider .slide');
  const slogans = document.querySelectorAll('#heroSlogans .slogan');
  const dots = document.querySelectorAll('#heroDots .dot');
  let current = 0;
  let timer;

  const goToSlide = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
    slogans.forEach((s, idx) => s.classList.toggle('active', idx === current % slogans.length));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  };

  const nextSlide = () => goToSlide(current + 1);

  const startAutoplay = () => {
    stopAutoplay();
    timer = setInterval(nextSlide, 6000);
  };
  const stopAutoplay = () => { if (timer) clearInterval(timer); };

  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      goToSlide(i);
      startAutoplay();
    });
  });

  // Pausa el slider si la pestaña no está visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  startAutoplay();

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll(
    '.section-head, .news-card, .hl-card, .video-card, .partner-box, ' +
    '.cta-text, .cta-card, .kit-piece, .history-text, .history-photos, ' +
    '.contact-form, .contact-grid > div, .partners-cta, .table-wrap, .standings-legend'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // ---------- Sistema de notificaciones Toast ----------
  function showToast(type, title, message, duration = 6000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Crear el toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Iconos según el tipo
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || '✓'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Cerrar">×</button>
    `;

    container.appendChild(toast);

    // Botón de cerrar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // Auto-cerrar
    const timer = setTimeout(() => removeToast(toast), duration);

    // Limpiar timer si se cierra manualmente
    toast._timer = timer;
  }

  function removeToast(toast) {
    if (toast._timer) clearTimeout(toast._timer);
    toast.classList.add('toast-removing');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }

  // ---------- Formulario de contacto con Web3Forms ----------
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value;
      const message = form.message.value.trim();

      // Validaciones
      if (!name || !email || !message) {
        showToast('error', 'Campos incompletos', 'Por favor, completa todos los campos requeridos.');
        return;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        showToast('error', 'Email inválido', 'Por favor, introduce un email válido.');
        return;
      }

      // Deshabilitar botón mientras se envía
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // Mostrar notificación de envío
      showToast('warning', 'Enviando mensaje...', 'Por favor, espera un momento.', 3000);

      // Enviar con Web3Forms
      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Éxito
          showToast(
            'success', 
            '¡Mensaje enviado!', 
            `Gracias ${name}, hemos recibido tu mensaje. Te responderemos muy pronto.`,
            8000
          );
          form.reset();
        } else {
          // Error del servidor
          showToast('error', 'Error al enviar', 'Hubo un problema. Por favor, inténtalo de nuevo.');
          console.error('Error:', data);
        }
      } catch (error) {
        // Error de red
        showToast('error', 'Error de conexión', 'No se pudo enviar el mensaje. Verifica tu conexión.');
        console.error('Error:', error);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // ---------- Botones de play (placeholder) ----------
  document.querySelectorAll('.video-play').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.video-card');
      const title = card?.querySelector('h3')?.textContent || 'video';
      // Aquí puedes integrar YouTube, TikTok o un reproductor propio.
      // Ejemplo de integración:
      //   window.open('https://youtu.be/XXXX', '_blank');
      alert('Reproducir: ' + title + '\n\n(Sustituye este aviso por tu reproductor de YouTube/TikTok o archivo propio)');
    });
  });

  // ---------- Smooth scroll para enlaces internos ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('siteHeader').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Control de visibilidad del botón WhatsApp ----------
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn) {
    // Opcional: mostrar/ocultar según scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      // Mostrar después de 300px de scroll
      if (currentScroll > 300) {
        whatsappBtn.style.opacity = '1';
        whatsappBtn.style.transform = 'scale(1) translateY(0)';
      } else {
        whatsappBtn.style.opacity = '0';
        whatsappBtn.style.transform = 'scale(0) translateY(20px)';
      }
      
      lastScroll = currentScroll;
    });
  }

  // ---------- Sistema de Cookies (RGPD) ----------
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieModal = document.getElementById('cookieModal');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieReject = document.getElementById('cookieReject');
  const cookieConfig = document.getElementById('cookieConfig');
  const cookieModalClose = document.getElementById('cookieModalClose');
  const cookieSave = document.getElementById('cookieSave');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieSettings = document.getElementById('cookieSettings');

  // Verificar si el usuario ya aceptó/rechazó cookies
  function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Si no hay consentimiento, mostrar banner después de 1 segundo
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    } else {
      // Si hay consentimiento, aplicar las preferencias
      applyCookiePreferences(JSON.parse(consent));
    }
  }

  // Guardar consentimiento
  function saveCookieConsent(analytics = false, marketing = false) {
    const consent = {
      essential: true, // Siempre true
      analytics: analytics,
      marketing: marketing,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    applyCookiePreferences(consent);
    hideBanner();
  }

  // Aplicar preferencias de cookies
  function applyCookiePreferences(consent) {
    // Aquí puedes añadir lógica para activar/desactivar scripts según las preferencias
    
    if (consent.analytics) {
      // Activar Google Analytics u otras herramientas analíticas
      console.log('✅ Cookies analíticas activadas');
      // Ejemplo: gtag('consent', 'update', { 'analytics_storage': 'granted' });
    } else {
      console.log('❌ Cookies analíticas desactivadas');
    }

    if (consent.marketing) {
      // Activar cookies de marketing
      console.log('✅ Cookies de marketing activadas');
      // Ejemplo: fbq('consent', 'grant');
    } else {
      console.log('❌ Cookies de marketing desactivadas');
    }
  }

  // Ocultar banner
  function hideBanner() {
    cookieBanner.classList.remove('show');
    setTimeout(() => {
      cookieBanner.style.display = 'none';
    }, 400);
  }

  // Mostrar modal
  function showModal() {
    cookieModal.classList.add('show');
    // Cargar preferencias actuales si existen
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      const preferences = JSON.parse(consent);
      document.getElementById('cookieAnalytics').checked = preferences.analytics;
      document.getElementById('cookieMarketing').checked = preferences.marketing;
    }
  }

  // Ocultar modal
  function hideModal() {
    cookieModal.classList.remove('show');
  }

  // Event listeners
  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      saveCookieConsent(true, true); // Aceptar todas
    });
  }

  if (cookieReject) {
    cookieReject.addEventListener('click', () => {
      saveCookieConsent(false, false); // Solo esenciales
    });
  }

  if (cookieConfig) {
    cookieConfig.addEventListener('click', () => {
      showModal();
    });
  }

  if (cookieModalClose) {
    cookieModalClose.addEventListener('click', () => {
      hideModal();
    });
  }

  if (cookieSave) {
    cookieSave.addEventListener('click', () => {
      const analytics = document.getElementById('cookieAnalytics').checked;
      const marketing = document.getElementById('cookieMarketing').checked;
      saveCookieConsent(analytics, marketing);
      hideModal();
    });
  }

  if (cookieAcceptAll) {
    cookieAcceptAll.addEventListener('click', () => {
      saveCookieConsent(true, true);
      hideModal();
    });
  }

  // Enlace "Configurar cookies" en el footer
  if (cookieSettings) {
    cookieSettings.addEventListener('click', (e) => {
      e.preventDefault();
      cookieBanner.style.display = 'block';
      setTimeout(() => {
        cookieBanner.classList.add('show');
        showModal();
      }, 100);
    });
  }

  // Cerrar modal al hacer click fuera
  if (cookieModal) {
    cookieModal.addEventListener('click', (e) => {
      if (e.target === cookieModal) {
        hideModal();
      }
    });
  }

  // Inicializar sistema de cookies
  checkCookieConsent();

})();
