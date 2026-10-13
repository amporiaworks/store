// ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const content = document.getElementById('content');

  if (!preloader || !content) return;

  const hasSeenPreloader = sessionStorage.getItem('seenPreloader');

  if (hasSeenPreloader) {
    // Skip preloader
    preloader.style.display = 'none';
    content.style.display = 'block';
  } else {
    // First visit – show preloader
    let opacity = 1;

    const fadeOut = setInterval(() => {
      if (opacity > 0) {
        opacity -= 0.05;
        preloader.style.opacity = opacity;
      } else {
        clearInterval(fadeOut);
        preloader.style.display = 'none';
        content.style.display = 'block';
        sessionStorage.setItem('seenPreloader', 'true');
      }
    }, 50);
  }
});


// ===== PAGE TRANSITION =====

// Fade IN when page loads (handles back/forward cache too)
window.addEventListener("pageshow", () => {
  document.body.classList.remove("fade-out");
});


// Fade OUT on internal navigation
document.querySelectorAll("a").forEach(link => {
  const url = link.getAttribute("href");

  // Apply only to internal links
  if (
    url &&
    !url.startsWith("#") &&
    !url.startsWith("http") &&
    !url.startsWith("mailto:") &&
    !url.startsWith("tel:") &&
    !link.hasAttribute("target")
  ) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = url;
      }, 400); // match CSS duration
    });
  }
});


// ===== CONTACT MODAL =====

function openContactOptions() {
  const modal = document.getElementById("contactModal");
  if (modal) modal.style.display = "flex";
}

function closeContactOptions() {
  const modal = document.getElementById("contactModal");
  if (modal) modal.style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  const modal = document.getElementById("contactModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});