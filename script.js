document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     EmailJS config
     Sign up free at https://www.emailjs.com, create an email
     service + template, then paste your real IDs below. Until
     you do, the form falls back to opening the visitor's email
     app (the old mailto behaviour) automatically.
     ============================================================ */
  const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
  };

  const emailjsReady = typeof emailjs !== 'undefined' &&
    !EMAILJS_CONFIG.publicKey.startsWith('YOUR_');

  if (emailjsReady) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close image">&times;</button>
    <img src="" alt="">
  `;
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('img');

  function openLightbox(src, alt) {
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------------- Services grid + detail panel ---------------- */
  const servicesInfo = {
    'MacBook Repair': {
      desc: 'Complete MacBook repair including screen, battery, keyboard and motherboard.',
      images: ['images/services/mac-repair.jpg', 'images/services/windows-repair.jpg', 'images/services/software.jpg']
    },
    'Windows Laptop Repair': {
      desc: 'All Windows laptop repair and software troubleshooting.',
      images: ['images/services/windows-repair.jpg', 'images/services/software.jpg', 'images/services/chip-repair.jpg']
    },
    'Motherboard Repair': {
      desc: 'Advanced chip-level motherboard repair.',
      images: ['images/services/chip-repair.jpg', 'images/services/mac-repair.jpg', 'images/services/software.jpg']
    },
    'Data Recovery': {
      desc: 'Recover lost or deleted data from drives.',
      images: ['images/services/software.jpg', 'images/services/windows-repair.jpg', 'images/services/chip-repair.jpg']
    },
    'OS Installation': {
      desc: 'Install macOS, Windows, Linux with drivers.',
      images: ['images/services/software.jpg', 'images/services/mac-repair.jpg', 'images/services/windows-repair.jpg']
    }
  };

  const detailBox = document.getElementById('serviceDetails');

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.service;
      const service = name ? servicesInfo[name] : null;

      // Cards with a matching service (services.html) open the detail panel.
      if (service && detailBox) {
        const sliderImages = service.images.map(img =>
          `<img src="${img}" class="slide" alt="${name} service image">`
        ).join('');

        detailBox.innerHTML = `
          <h2>${name}</h2>
          <p>${service.desc}</p>
          <div class="slider">${sliderImages}</div>
        `;
        detailBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Plain product/preview cards (index.html, products.html) open a lightbox instead.
      const img = card.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  // Slider thumbnails inside the detail panel also open the lightbox.
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('slide')) {
      e.stopPropagation();
      openLightbox(e.target.src, e.target.alt);
    }
  });

  /* ---------------- Before / after compare sliders ---------------- */
  document.querySelectorAll('.compare').forEach(compare => {
    const after = compare.querySelector('.compare-after');
    const handle = compare.querySelector('.compare-handle');
    if (!after || !handle) return;

    let dragging = false;

    function setPosition(clientX) {
      const rect = compare.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = `${pct}%`;
    }

    handle.addEventListener('pointerdown', () => { dragging = true; });
    window.addEventListener('pointerup', () => { dragging = false; });
    window.addEventListener('pointermove', (e) => {
      if (dragging) setPosition(e.clientX);
    });
    compare.addEventListener('click', (e) => setPosition(e.clientX));
  });

  /* ---------------- Request forms ---------------- */
  document.querySelectorAll('.request-form').forEach(form => {
    const statusId = form.dataset.statusId;
    const formStatus = statusId ? document.getElementById(statusId) : null;

    if (!formStatus) {
      return;
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = form.querySelector('input[name="name"]')?.value?.trim() || '';
      const email = form.querySelector('input[name="email"]')?.value?.trim() || '';
      const message = form.querySelector('textarea[name="message"]')?.value?.trim() || '';

      if (!name || !email) {
        formStatus.innerText = 'Please enter your name and email.';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');

      function fallbackToMailto() {
        const mailtoLink = `mailto:sales@msmacsolutions.in?subject=${encodeURIComponent('Service Request from Website')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nIssue Details:\n${message}`)}`;
        formStatus.innerText = 'Your request has been prepared in your email app.';
        window.location.href = mailtoLink;
        form.reset();
      }

      if (emailjsReady) {
        if (submitBtn) submitBtn.disabled = true;
        formStatus.innerText = 'Sending your request...';

        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
          from_name: name,
          from_email: email,
          message: message
        }).then(() => {
          formStatus.innerText = "Thanks! Your request has been sent — we'll get back to you shortly.";
          form.reset();
        }).catch(() => {
          formStatus.innerText = 'Could not send automatically, opening your email app instead...';
          fallbackToMailto();
        }).finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
      } else {
        fallbackToMailto();
      }
    });
  });

});
