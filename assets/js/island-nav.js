/* ==========================================================================
   island-nav.js — Floating Island navigation behaviors

   1. Sliding highlight: a backdrop pill that slides behind the active chip
   2. Scroll collapse: island shrinks on scroll-down, expands on scroll-up
   ========================================================================== */

(function () {

  /* ---- Sliding Highlight ---- */

  /**
   * moveHighlight()
   * Positions the highlight pill behind the currently active chip.
   * Called on init and on every Turbo navigation.
   */
  window.moveHighlight = function (animate) {
    var highlight = document.getElementById('chip-nav-highlight');
    var track     = document.getElementById('chip-nav-track');
    var nav       = document.getElementById('chip-nav');
    if (!highlight || !track || !nav) return;

    var active = track.querySelector('.chip-nav__chip.is-active');
    if (!active) {
      highlight.style.opacity = '0';
      highlight.style.width   = '0';
      return;
    }

    // If we don't want animation (initial load), disable transition temporarily
    if (animate === false) {
      highlight.style.transition = 'none';
    }

    // Get chip position relative to the chip-nav container
    var navRect    = nav.getBoundingClientRect();
    var chipRect   = active.getBoundingClientRect();

    // Position relative to .chip-nav
    var chipLeft  = chipRect.left - navRect.left;
    var chipWidth = chipRect.width;

    // Dot is narrower than the chip — centered underneath, ~40% of chip width
    var dotWidth = Math.max(12, chipWidth * 0.4);
    var dotLeft  = chipLeft + (chipWidth - dotWidth) / 2;

    highlight.style.left    = dotLeft + 'px';
    highlight.style.width   = dotWidth + 'px';
    highlight.style.opacity = '1';

    // Re-enable transition after a frame
    if (animate === false) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          highlight.style.transition = '';
        });
      });
    }
  };


  /* ---- Scroll Collapse/Expand ---- */

  var SCROLL_THRESHOLD = 60;   // px scrolled before collapsing
  var lastScrollY      = 0;
  var ticking          = false;
  var isCollapsed      = false;

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var masthead = document.querySelector('.masthead');
    if (!masthead) return;

    if (scrollY > SCROLL_THRESHOLD && scrollY > lastScrollY && !isCollapsed) {
      // Scrolling down past threshold — collapse
      masthead.classList.add('is-collapsed');
      isCollapsed = true;
    } else if (scrollY < lastScrollY && isCollapsed) {
      // Scrolling up — expand
      masthead.classList.remove('is-collapsed');
      isCollapsed = false;
    }

    // If at the very top, always expand
    if (scrollY <= 10 && isCollapsed) {
      masthead.classList.remove('is-collapsed');
      isCollapsed = false;
    }

    lastScrollY = scrollY;
  }

  /**
   * initIslandNav()
   * Called from init() in _main.js.
   */
  window.initIslandNav = function () {
    // Position the highlight on the active chip (no animation on first load)
    window.moveHighlight(false);

    // Set up scroll collapse (only bind once)
    if (!window._islandScrollBound) {
      window._islandScrollBound = true;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    // Re-position highlight on resize (debounced)
    if (!window._islandResizeBound) {
      window._islandResizeBound = true;
      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          window.moveHighlight(false);
        }, 100);
      });
    }
  };

})();
