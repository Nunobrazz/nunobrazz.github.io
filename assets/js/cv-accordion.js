/* CV Accordion — toggle logic for collapsible sections
   Works with both initial page load and Turbo navigation. */
(function () {
  // Guard: only bind document-level listeners once (Turbo re-activates body
  // scripts on every navigation, which would add duplicate handlers and cause
  // the toggle to fire twice — cancelling itself out).
  if (window.__cvAccordionBound) return;
  window.__cvAccordionBound = true;

  function initAccordion() {
    // Only run if accordion sections exist on the page
    if (!document.querySelector('.cv-section__header')) return;
  }

  // Use event delegation on document so it works regardless of when elements appear
  document.addEventListener('click', function (e) {
    // Section toggle
    var header = e.target.closest('.cv-section__header');
    if (header) {
      var section = header.closest('.cv-section');
      var isOpen = section.classList.contains('is-open');
      section.classList.toggle('is-open');
      header.setAttribute('aria-expanded', !isOpen);
      return;
    }

    // Expand / Collapse all
    var toggleAll = e.target.closest('.cv-accordion__toggle-all');
    if (toggleAll) {
      var action = toggleAll.getAttribute('data-action');
      var sections = document.querySelectorAll('.cv-section');
      if (action === 'expand') {
        sections.forEach(function (s) {
          s.classList.add('is-open');
          var h = s.querySelector('.cv-section__header');
          if (h) h.setAttribute('aria-expanded', 'true');
        });
        toggleAll.textContent = 'Collapse all';
        toggleAll.setAttribute('data-action', 'collapse');
      } else {
        sections.forEach(function (s) {
          s.classList.remove('is-open');
          var h = s.querySelector('.cv-section__header');
          if (h) h.setAttribute('aria-expanded', 'false');
        });
        toggleAll.textContent = 'Expand all';
        toggleAll.setAttribute('data-action', 'expand');
      }
      return;
    }

    // Surf gallery toggle
    var surfToggle = e.target.closest('.surf-gallery-toggle');
    if (surfToggle) {
      e.preventDefault();
      var gallery = surfToggle.closest('.timeline-content').querySelector('.surf-gallery');
      if (gallery) {
        gallery.style.display = gallery.style.display === 'none' ? 'flex' : 'none';
      }
      return;
    }

    // Lightbox for gallery photos
    var img = e.target.closest('.surf-gallery img');
    if (img) {
      var overlay = document.createElement('div');
      overlay.className = 'avatar-lightbox';
      overlay.setAttribute('role', 'dialog');

      var closeBtn = document.createElement('button');
      closeBtn.className = 'avatar-lightbox__close';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.textContent = '\u00D7';
      overlay.appendChild(closeBtn);

      var bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.alt = img.alt;
      overlay.appendChild(bigImg);
      document.body.appendChild(overlay);

      requestAnimationFrame(function () { overlay.classList.add('is-visible'); });

      var close = function () {
        overlay.classList.remove('is-visible');
        overlay.addEventListener('transitionend', function () { overlay.remove(); });
      };
      overlay.addEventListener('click', function (ev) {
        if (ev.target === overlay || ev.target === closeBtn) close();
      });
      document.addEventListener('keydown', function onKey(ev) {
        if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
      });
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var header = e.target.closest('.cv-section__header');
      if (header) {
        e.preventDefault();
        header.click();
      }
    }
  });

  // Init on both DOMContentLoaded and Turbo navigation
  document.addEventListener('DOMContentLoaded', initAccordion);
  document.addEventListener('turbo:load', initAccordion);
})();
