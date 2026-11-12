// Keep in sync with --page-fade in style.css
const PAGE_FADE_MS = 300;

function safeSession(action, key, value) {
  try {
    return action === 'get'
      ? sessionStorage.getItem(key)
      : sessionStorage.setItem(key, value);
  } catch (e) {
    return null; // storage blocked (private mode, etc.)
  }
}

// ===== PRELOADER (home page) =====
(function () {
  const preloader = document.getElementById('preloader');
  const content = document.getElementById('content');
  if (!preloader || !content) return;

  function reveal() {
    preloader.style.display = 'none';
    content.style.display = 'flex';
  }

  if (safeSession('get', 'seenPreloader')) {
    reveal();
    return;
  }

  let done = false;
  function finish() {
    if (done) return;
    done = true;
    safeSession('set', 'seenPreloader', 'true');
    preloader.style.transition = 'opacity 0.8s ease';
    preloader.style.opacity = '0';
    setTimeout(reveal, 800);
  }

  // Show content after the page loads, but never keep visitors waiting
  // more than 4s on a slow connection.
  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
  }
  setTimeout(finish, 4000);
})();

// ===== PAGE TRANSITION =====

// Restore visibility when returning via back/forward cache
window.addEventListener('pageshow', () => {
  document.body.classList.remove('fade-out');
});

document.querySelectorAll('a[href]').forEach(link => {
  const url = link.getAttribute('href');
  const isInternalPage =
    !/^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(url) && !link.hasAttribute('target');
  if (!isInternalPage) return;

  link.addEventListener('click', e => {
    // Let ctrl/cmd/shift/middle-click open new tabs normally
    if (e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    document.body.classList.add('fade-out');
    setTimeout(() => { window.location.href = url; }, PAGE_FADE_MS);
  });
});

// ===== EMAIL LINK (desktop) =====
// Most PCs have no default mail app, so mailto: does nothing there.
// On mouse-driven devices, open Gmail's compose window instead.
(function () {
  const emailLink = document.getElementById('emailLink');
  if (!emailLink) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const address = emailLink.getAttribute('href').replace(/^mailto:/i, '');
  emailLink.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' +
    encodeURIComponent(address);
  emailLink.target = '_blank';
  emailLink.rel = 'noopener noreferrer';
})();

// ===== CONTACT MODAL =====
(function () {
  const modal = document.getElementById('contactModal');
  const phoneLink = document.getElementById('phoneLink');
  const closeBtn = document.getElementById('closeContactModal');
  if (!modal || !phoneLink) return;

  let lastFocused = null;

  function open(e) {
    e.preventDefault();
    lastFocused = document.activeElement;
    modal.hidden = false;
    const first = modal.querySelector('.option');
    if (first) first.focus();
  }

  function close() {
    modal.hidden = true;
    if (lastFocused) lastFocused.focus();
  }

  phoneLink.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Click on the dimmed backdrop closes it
  modal.addEventListener('click', e => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();

// ===== FOOTER YEAR =====
document.querySelectorAll('.year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
