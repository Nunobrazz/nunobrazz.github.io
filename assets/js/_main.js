/* ==========================================================================
   _main.js — Central initialization script

   This file is bundled (via uglify) with jQuery, FitVids, and
   jQuery Smooth Scroll into main.min.js. It runs on every page load
   and on every Turbo navigation (SPA-style page swap).
   ========================================================================== */


/* ==========================================================================
   1. THEME MANAGEMENT
   Handles dark/light theme switching. Persists choice in localStorage.
   Falls back to OS preference when no explicit choice is stored.
   ========================================================================== */

// Read the stored theme preference ("dark", "light", or "system")
let determineThemeSetting = () => {
  let themeSetting = localStorage.getItem("theme");
  return (themeSetting != "dark" && themeSetting != "light" && themeSetting != "system") ? "system" : themeSetting;
};

// Resolve "system" into an actual "dark" or "light" value
let determineComputedTheme = () => {
  let themeSetting = determineThemeSetting();
  if (themeSetting != "system") {
    return themeSetting;
  }
  return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
};

// Detect OS/browser dark-mode preference at load time
const browserPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

// Apply a theme to the page. Updates the data-theme attribute on <html>
// and swaps the sun/moon icon in the masthead toggle button.
let setTheme = (theme) => {
  const use_theme =
    theme ||
    localStorage.getItem("theme") ||
    $("html").attr("data-theme") ||
    browserPref;

  if (use_theme === "dark") {
    $("html").attr("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
    $("#theme-icon").removeClass("fa-sun").addClass("fa-moon");
    document.querySelectorAll('meta[name="theme-color"]').forEach(function(tc) {
      tc.setAttribute('content', '#0a1e33');
    });
  } else if (use_theme === "light") {
    $("html").removeAttr("data-theme");
    document.documentElement.style.colorScheme = "light";
    $("#theme-icon").removeClass("fa-moon").addClass("fa-sun");
    document.querySelectorAll('meta[name="theme-color"]').forEach(function(tc) {
      tc.setAttribute('content', '#d4e8f0');
    });
  }
};

// Toggle between dark and light — called by the masthead button
var toggleTheme = () => {
  const current_theme = $("html").attr("data-theme");
  const new_theme = current_theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", new_theme);
  setTheme(new_theme);
};


/* ==========================================================================
   2. PLOTLY CHART INTEGRATION
   Finds ```plotly code blocks in Markdown, hides the raw JSON, and renders
   interactive Plotly charts in their place. Theme-aware.
   ========================================================================== */

import { plotlyDarkLayout, plotlyLightLayout } from './theme.js';
let plotlyElements = document.querySelectorAll("pre>code.language-plotly");
if (plotlyElements.length > 0) {
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
      plotlyElements.forEach((elem) => {
        var jsonData = JSON.parse(elem.textContent);
        elem.parentElement.classList.add("hidden");

        let chartElement = document.createElement("div");
        elem.parentElement.after(chartElement);

        const theme = (determineComputedTheme() === "dark") ? plotlyDarkLayout : plotlyLightLayout;
        if (jsonData.layout) {
          jsonData.layout.template = (jsonData.layout.template) ? { ...theme, ...jsonData.layout.template } : theme;
        } else {
          jsonData.layout = { template: theme };
        }
        Plotly.react(chartElement, jsonData.data, jsonData.layout);
      });
    }
  });
}


/* ==========================================================================
   3. MAIN INIT FUNCTION
   Called on DOMContentLoaded AND on every Turbo navigation (turbo:load).
   Sets up theme, sticky footer, FitVids, smooth scroll, chip nav,
   world map, and the author profile dropdown.
   ========================================================================== */

function init() {
  // ---- Constants that must match SCSS variables ----
  const scssLarge = 925;          // breakpoint in px (/_sass/_themes.scss)
  const scssMastheadHeight = 70;  // masthead height in px

  // ---- Theme: apply saved preference or follow OS ----
  setTheme();
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  // ---- Theme toggle button in the masthead ----
  // The button has id="theme-toggle" — bind click to toggleTheme()
  $('#theme-toggle').off('click').on('click', toggleTheme);

  // ---- Sticky footer ----
  // Adjusts body bottom margin so the absolutely-positioned footer
  // doesn't overlap content. Recalculates on window resize.
  var bumpIt = function () {
    $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
  }
  var didResize = false;
  $(window).resize(function () { didResize = true; });
  if (!window.bumpItInterval) {
    window.bumpItInterval = setInterval(function () {
      if (didResize) { didResize = false; bumpIt(); }
    }, 250);
  }
  bumpIt();

  // ---- FitVids: responsive video embeds ----
  fitvids();

  // ---- Author profile dropdown (mobile) ----
  // On small screens the author sidebar collapses behind a "Connect" button.
  // Reset inline display styles that may persist across Turbo navigations
  // (the sidebar has data-turbo-permanent, so jQuery's fadeToggle inline
  // styles survive page swaps).
  $(".author__urls").css('display', '');
  $(".author__urls-wrapper button").removeClass("open").attr("aria-expanded", "false");

  $(".author__urls-wrapper button").off("click").on("click", function () {
    $(".author__urls").fadeToggle("fast", function () { });
    var btn = $(".author__urls-wrapper button");
    btn.toggleClass("open");
    btn.attr("aria-expanded", btn.hasClass("open") ? "true" : "false");
  });
  // Re-show the menu if the user resizes past the breakpoint
  jQuery(window).on('resize', function () {
    if ($('.author__urls.social-icons').css('display') == 'none' && $(window).width() >= scssLarge) {
      $(".author__urls").css('display', 'block');
    }
  });

  // ---- Smooth scroll for anchor links ----
  $("a[href*='#']").smoothScroll({
    offset: -scssMastheadHeight,
    preventDefault: false,
  });

  // ---- Avatar lightbox ----
  // Click on the sidebar or hero avatar to open a full-screen lightbox dialog.
  // Click anywhere on the overlay (or press Escape) to close it.
  var avatarImg = document.querySelector('.author__avatar img') || document.querySelector('.hero-bio__avatar img');
  if (avatarImg && !avatarImg._lightboxBound) {
    avatarImg._lightboxBound = true;
    avatarImg.style.cursor = 'zoom-in';
    avatarImg.addEventListener('click', function () {
      // Create dialog overlay
      var overlay = document.createElement('div');
      overlay.className = 'avatar-lightbox';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Enlarged avatar image');

      var closeBtn = document.createElement('button');
      closeBtn.className = 'avatar-lightbox__close';
      closeBtn.setAttribute('aria-label', 'Close lightbox');
      closeBtn.textContent = '\u00D7';
      overlay.appendChild(closeBtn);

      var img = document.createElement('img');
      img.src = avatarImg.src;
      img.alt = avatarImg.alt;
      img.width = avatarImg.naturalWidth || 600;
      img.height = avatarImg.naturalHeight || 600;
      overlay.appendChild(img);
      document.body.appendChild(overlay);

      // Focus the close button for keyboard users
      closeBtn.focus();

      // Trigger entrance animation on next frame
      requestAnimationFrame(function () {
        overlay.classList.add('is-visible');
      });

      var closeLightbox = function () {
        overlay.classList.remove('is-visible');
        overlay.addEventListener('transitionend', function () {
          overlay.remove();
        });
        // Return focus to the avatar image
        avatarImg.focus();
        document.removeEventListener('keydown', onKey);
      };

      // Close on click outside image
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target === closeBtn) {
          closeLightbox();
        }
      });

      // Close on Escape key
      var onKey = function (e) {
        if (e.key === 'Escape') {
          closeLightbox();
        }
      };
      document.addEventListener('keydown', onKey);
    });
  }

  // ---- World map (Footprints page) ----
  // initWorldMap() is defined in /assets/js/world-map.js.
  // It dynamically loads d3 + topojson, then renders the SVG map.
  if (document.getElementById('world-map') && typeof window.initWorldMap === 'function') {
    window.initWorldMap();
  }

  // ---- Generative hero (p5.js particle canvas) ----
  // initGenerativeHero() is defined in /assets/js/generative-hero.js.
  // Loads p5.js on demand and starts the sketch if #gen-hero-canvas exists.
  if (typeof window.initGenerativeHero === 'function') {
    window.initGenerativeHero();
  }

  // ---- Chip nav (horizontal scrolling pill bar) ----
  // initChipNav() is defined in /assets/js/chip-nav.js.
  // Sets up elastic drag-scroll with momentum and rubber-band physics.
  if (typeof window.initChipNav === 'function') {
    window.initChipNav();
  }

  // ---- Chip nav: highlight active page ----
  // Since the chip-nav has data-turbo-permanent, the Liquid-rendered
  // is-active class only applies on the first load. On Turbo navigations
  // we need to update the active chip based on the current URL.
  var chips = document.querySelectorAll('.chip-nav__chip');
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  var activeName = '';
  chips.forEach(function (chip) {
    var href = chip.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === currentPath) {
      chip.classList.add('is-active');
      activeName = chip.textContent.trim();
    } else {
      chip.classList.remove('is-active');
    }
  });

  // ---- Masthead section title ----
  // Update the top-left label to show the current section name.
  // On the home page we show the site title instead.
  var sectionTitle = document.getElementById('masthead-section-title');
  if (sectionTitle) {
    sectionTitle.textContent = activeName || document.title.split(' ')[0];
  }
}


/* ==========================================================================
   4. BOOTSTRAP — Run init() at the right time
   ========================================================================== */

// Run immediately if DOM is already ready, otherwise wait for DOMContentLoaded
if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

// Re-run on every Turbo navigation (SPA page swap)
document.addEventListener("turbo:load", init);

// Scroll to top when Turbo renders a new page
document.addEventListener("turbo:render", () => {
  window.scrollTo({ top: 0 });
});
