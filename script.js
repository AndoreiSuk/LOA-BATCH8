document.addEventListener('DOMContentLoaded', () => {
  const SUPABASE_URL = 'https://hzurcojzczmiiaxoorob.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_XKpbR-cQloSw353YfIdHcg__hxHsa3t';
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const splash = document.getElementById('splash-screen');
  const mainExp = document.getElementById('main-experience');
  const menuBtn = document.getElementById('menu-button');
  const siteNav = document.getElementById('site-nav');
  const heroImg = document.getElementById('hero-dancer-img');
  const heroImgContainer = document.getElementById('hero-image-container');
  const form = document.getElementById('audition-form');
  const formSuccess = document.getElementById('form-success');
  const resetBtn = document.getElementById('reset-form-btn');

  // 1. Splash Screen Reveal & Scroll Lock
  document.body.classList.add('splash-locked');
  let splashState = 'visible';

  function enterExperience() {
    if (splashState !== 'visible') return;
    splashState = 'leaving';
    document.body.classList.remove('splash-locked');
    splash.classList.add('is-leaving');
    mainExp.classList.remove('waiting');
    mainExp.classList.add('revealed');
    requestUpdate();
    setTimeout(() => {
      splashState = 'hidden';
      splash.remove();
      requestUpdate();
    }, 900);
  }

  splash.addEventListener('click', enterExperience);
  splash.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      enterExperience();
    }
  });

  // 2. Mobile Menu & Smooth Scroll to Form
  menuBtn.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('[data-scroll-apply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.querySelector('#apply')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 3. Hero Image Fallback
  heroImg.addEventListener('error', () => {
    heroImgContainer.setAttribute('aria-hidden', 'true');
    heroImgContainer.innerHTML = `
      <div class="image-fallback" role="img" aria-label="Abstract silhouette of a dancer">
        <svg viewBox="0 0 500 700" aria-hidden="true">
          <path d="M250 87c28 0 48 23 48 51 0 23-14 42-35 49l23 70 108-94 17 18-111 123 67 289H132l75-289L89 197l17-20 113 79 19-70c-20-7-35-25-35-48 0-28 20-51 47-51Z" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="250" cy="130" r="23" fill="currentColor" opacity=".55" />
        </svg>
      </div>`;
  });

  // 4. Scroll Parallax
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  function updateParallax() {
    frame = 0;
    if (reducedMotion.matches) return;
    const viewportCenter = window.innerHeight / 2;
    document.querySelectorAll('[data-parallax]').forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = viewportCenter - (rect.top + rect.height / 2);
      const travel = Math.max(-1, Math.min(1, (distance / (window.innerHeight + rect.height)) * 2));
      section.style.setProperty('--parallax', travel.toFixed(3));
    });
  }

  function requestUpdate() {
    if (!frame) frame = window.requestAnimationFrame(updateParallax);
  }

  updateParallax();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  // 5. Custom Searchable Style Picker
  const stylesList = [
    'Contemporary', 'Classical', 'Cultural', 'Hip-hop', 'Vogue', 'Femme',
    'Dancehall', 'Afro', 'Waack', 'Open Style', 'Jazz Funk', 'Heels',
    'Jazz', 'K-Pop', 'Tutting', 'House', 'Locking', 'Popping',
    'Dancesport', 'Commercial', 'Krump', 'Breaking'
  ];

  const styleSearch = document.getElementById('style-search');
  const styleValue = document.getElementById('style-value');
  const styleDropdown = document.getElementById('style-dropdown');

  function renderStyles(filter = '') {
    const query = filter.trim().toLowerCase();
    const matches = stylesList.filter((s) => s.toLowerCase().includes(query));
    styleDropdown.innerHTML = matches.length
      ? matches
          .map((style) => {
            const idx = String(stylesList.indexOf(style) + 1).padStart(2, '0');
            const isSelected = styleValue.value === style ? 'active' : '';
            return `<button type="button" class="style-option ${isSelected}" data-style="${style}">
              <span>${style}</span><small>${idx}</small>
            </button>`;
          })
          .join('')
      : `<div style="padding:14px 16px;color:#888177;grid-column:1/-1;">No matching style found</div>`;
  }

  styleSearch.addEventListener('focus', () => {
    renderStyles(styleSearch.value === styleValue.value ? '' : styleSearch.value);
    styleDropdown.classList.remove('hidden');
  });

  styleSearch.addEventListener('input', () => {
    styleValue.value = '';
    renderStyles(styleSearch.value);
    styleDropdown.classList.remove('hidden');
  });

  styleDropdown.addEventListener('click', (e) => {
    const btn = e.target.closest('.style-option');
    if (!btn) return;
    styleValue.value = btn.dataset.style;
    styleSearch.value = btn.dataset.style;
    styleDropdown.classList.add('hidden');
  });

  // 6. Custom Experience Dropdown
  const expPicker = document.getElementById('experience-picker');
  const expTrigger = document.getElementById('experience-trigger');
  const expMenu = document.getElementById('experience-menu');
  const expText = document.getElementById('experience-text');
  const expValue = document.getElementById('experience-value');

  function closeExpMenu() {
    expPicker.classList.remove('is-open');
    expMenu.classList.add('hidden');
    expTrigger.setAttribute('aria-expanded', 'false');
  }

  expTrigger.addEventListener('click', () => {
    const isOpening = expMenu.classList.contains('hidden');
    if (isOpening) {
      expPicker.classList.add('is-open');
      expMenu.classList.remove('hidden');
      expTrigger.setAttribute('aria-expanded', 'true');
    } else {
      closeExpMenu();
    }
  });

  expMenu.querySelectorAll('.custom-select-option').forEach((option) => {
    option.addEventListener('click', () => {
      expMenu.querySelectorAll('.custom-select-option').forEach((o) => o.classList.remove('is-selected'));
      option.classList.add('is-selected');
      expValue.value = option.dataset.value;
      expText.textContent = option.dataset.value;
      expText.classList.remove('is-placeholder');
      closeExpMenu();
    });
  });

  // 6b. Audition Music File Picker (Upload-Only: Audio + MP4/MOV cuts)
  const musicFileInput = document.getElementById('music-file-input');
  const musicFileLabel = document.getElementById('music-file-label');
  const musicUploadBtn = document.querySelector('.music-upload-btn');

  if (musicFileInput) {
    musicFileInput.addEventListener('change', () => {
      const file = musicFileInput.files[0];
      if (!file) {
        musicFileLabel.textContent = 'Upload Track File (Max 35MB)';
        musicUploadBtn.classList.remove('has-file');
        return;
      }
      if (file.size > 35 * 1024 * 1024) {
        alert('File exceeds 35MB. Please compress or trim your audio/video cut before uploading.');
        musicFileInput.value = '';
        musicFileLabel.textContent = 'Upload Track File (Max 35MB)';
        musicUploadBtn.classList.remove('has-file');
        return;
      }
      musicFileLabel.textContent = `Selected: ${file.name}`;
      musicUploadBtn.classList.add('has-file');
    });
  }

  // 7. Global Outside Click & Escape Handlers
  document.addEventListener('click', (e) => {
    if (siteNav.classList.contains('open') && !e.target.closest('.site-header')) {
      siteNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    if (!e.target.closest('#style-picker')) {
      styleDropdown.classList.add('hidden');
      if (!styleValue.value) styleSearch.value = '';
    }
    if (!e.target.closest('#experience-picker')) {
      closeExpMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExpMenu();
      styleDropdown.classList.add('hidden');
    }
  });

  // 7b. Field Validation (Email + Philippine mobile number)
  const emailInput = document.getElementById('email-input');
  const phoneInput = document.getElementById('phone-input');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');

  function checkEmail() {
    const v = emailInput.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(v);
    const msg = ok ? '' : 'Enter a complete email, like name@example.com';
    emailInput.setCustomValidity(msg);
    return msg;
  }

  function checkPhone() {
    const v = phoneInput.value;
    let msg = '';
    if (v.length !== 11) msg = `Enter all 11 digits (you typed ${v.length}). Example: 09123456789`;
    else if (!v.startsWith('09')) msg = 'Mobile numbers start with 09';
    phoneInput.setCustomValidity(msg);
    return msg;
  }

  function showError(input, box, msg) {
    box.textContent = msg;
    input.classList.toggle('has-error', Boolean(msg));
  }

  // Phone: digits only, hard stop at 11 (also handles paste)
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    checkPhone();
    if (phoneInput.classList.contains('has-error')) showError(phoneInput, phoneError, checkPhone());
  });

  emailInput.addEventListener('input', () => {
    checkEmail();
    if (emailInput.classList.contains('has-error')) showError(emailInput, emailError, checkEmail());
  });

  // Show our message instead of the browser's default bubble
  emailInput.addEventListener('invalid', (e) => {
    e.preventDefault();
    showError(emailInput, emailError, checkEmail() || 'Enter a valid email');
  });
  phoneInput.addEventListener('invalid', (e) => {
    e.preventDefault();
    showError(phoneInput, phoneError, checkPhone() || 'Enter a valid phone number');
  });

  // Show errors when leaving a field
  emailInput.addEventListener('blur', () => {
    if (emailInput.value) showError(emailInput, emailError, checkEmail());
  });
  phoneInput.addEventListener('blur', () => {
    if (phoneInput.value) showError(phoneInput, phoneError, checkPhone());
  });

  // 8. Form Submission (Supabase Live Insert + Track Upload + Instant Broadcast)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!styleValue.value) {
      styleSearch.focus();
      return;
    }
    if (!expValue.value) {
      expTrigger.focus();
      expTrigger.click();
      return;
    }

    const musicFile = musicFileInput?.files[0];

    if (!musicFile) {
      alert('Please upload your audition music track before submitting.');
      musicUploadBtn?.click();
      return;
    }

    const submitBtn = form.querySelector('.submit-application');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Uploading track & audition...</span>';

    const cleanName = musicFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `batch8/${Date.now()}_${cleanName}`;
    const { error: uploadError } = await sb.storage
      .from('audition-music')
      .upload(filePath, musicFile, { contentType: musicFile.type || 'application/octet-stream' });

    if (uploadError) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      alert('Music upload failed: ' + uploadError.message);
      return;
    }

    const { data: publicUrlData } = sb.storage
      .from('audition-music')
      .getPublicUrl(filePath);
    const finalMusicUrl = publicUrlData.publicUrl;

    const formData = new FormData(form);
    const payload = {
      full_name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      discipline: formData.get('discipline'),
      experience: formData.get('experience'),
      reel_url: formData.get('reel'),
      music_url: finalMusicUrl,
      statement: formData.get('statement'),
    };

    const { error } = await sb.from('auditions').insert([payload]);

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;

    if (error) {
      alert('Submission failed: ' + error.message);
      return;
    }

    // Fire instant broadcast signal to any open admin panels
    const notifyChannel = sb.channel('auditions-live');
    notifyChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        notifyChannel.send({
          type: 'broadcast',
          event: 'new-submission',
          payload: { timestamp: Date.now() }
        }).then(() => sb.removeChannel(notifyChannel));
      }
    });

    // Reset form and custom UI
    form.reset();
    showError(emailInput, emailError, '');
    showError(phoneInput, phoneError, '');
    styleValue.value = '';
    styleSearch.value = '';
    expValue.value = '';
    expText.textContent = 'Select a range';
    expText.classList.add('is-placeholder');
    expMenu.querySelectorAll('.custom-select-option').forEach((o) => o.classList.remove('is-selected'));

    if (musicFileInput) {
      musicFileInput.value = '';
      musicFileLabel.textContent = 'Upload Track File (Max 35MB)';
      musicUploadBtn.classList.remove('has-file');
    }

    form.classList.add('hidden');
    formSuccess.classList.remove('hidden');
  });

  resetBtn.addEventListener('click', () => {
    formSuccess.classList.add('hidden');
    form.classList.remove('hidden');
  });
});