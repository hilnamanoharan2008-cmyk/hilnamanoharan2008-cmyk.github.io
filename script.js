/**
 * Hilna O - Personal Portfolio Interactive Logic
 * Features: Dark/Light Mode, Recruiter 30-second snapshot modal,
 * Copy-to-clipboard toast feedback, mobile navigation, mailto generator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRecruiterModal();
  initCopyEmailButtons();
  initMobileMenu();
  initScrollSpy();
});

/* ===================================================
   1. Theme Toggle (Dark / Light Mode)
   =================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('hilna-portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine initial theme
  if (storedTheme) {
    document.body.setAttribute('data-theme', storedTheme);
  } else if (!prefersDark) {
    document.body.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('hilna-portfolio-theme', nextTheme);
      showToast(`Switched to ${nextTheme} theme`);
    });
  }
}

/* ===================================================
   2. Recruiter 30-Second Snapshot Modal
   =================================================== */
function initRecruiterModal() {
  const modal = document.getElementById('recruiterModal');
  const triggerBtn = document.getElementById('recruiterModeBtn');
  const closeBtn = document.getElementById('closeRecruiterModal');

  if (!modal || !triggerBtn) return;

  const openModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  triggerBtn.addEventListener('click', openModal);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Click outside to dismiss
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ===================================================
   3. Copy Email to Clipboard & Toast
   =================================================== */
function initCopyEmailButtons() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'hilnamanoharan2008@gmail.com';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
          .then(() => showToast('Email copied to clipboard!'))
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  });
}

function fallbackCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast('Email copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy. Email: ' + text);
  }
  document.body.removeChild(tempInput);
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  if (!toast) return;

  if (toastMsg) {
    toastMsg.textContent = message;
  }

  toast.classList.remove('hidden');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2600);
}

/* ===================================================
   4. Mobile Navigation Menu
   =================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    mobileBtn.innerHTML = isOpen 
      ? '<i class="fa-solid fa-xmark"></i>' 
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ===================================================
   5. Active Section Scroll Spy
   =================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-item');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================
   6. Contact Form - Direct Mailto Launcher
   =================================================== */
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('senderName').value.trim();
  const subject = document.getElementById('senderSubject').value.trim();
  const message = document.getElementById('senderMessage').value.trim();

  const fullSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
  const fullBody = encodeURIComponent(`Sender: ${name}\n\nMessage:\n${message}\n\n---\nSent via Hilna's Portfolio Contact form.`);

  const mailtoLink = `mailto:hilnamanoharan2008@gmail.com?subject=${fullSubject}&body=${fullBody}`;

  showToast('Launching your email client...');
  window.location.href = mailtoLink;
}
