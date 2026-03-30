/* ==========================================================================
   GENERATIVE HERO — WebGL Fluid Simulation
   GPU-accelerated Navier-Stokes fluid dynamics behind the bio section.
   Uses webgl-fluid-enhanced v0.5.2 (UMD) for real-time interactive liquid flow
   with ocean/beach-inspired blue tones.
   Called from init() in _main.js on every Turbo navigation.
   ========================================================================== */

(function () {
  var _initialized = false;
  var _observer = null;
  var _splatInterval = null;
  // v0.5.2 UMD exports to window["webgl-fluid-enhanced"]
  var _getFluid = function () { return window["webgl-fluid-enhanced"]; };

  window.initGenerativeHero = function () {
    var container = document.getElementById('fluid-bg-canvas');
    if (!container) return;

    // Skip if already initialized for this container
    if (_initialized && container.querySelector('canvas')) return;

    // Respect reduced-motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Load WebGL-Fluid-Enhanced UMD on demand (only once)
    if (!_getFluid()) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/webgl-fluid-enhanced@0.5.2/dist/webgl-fluid-enhanced.umd.min.js';
      script.onload = function () { _startFluid(container); };
      script.onerror = function () {
        console.warn('WebGL Fluid: CDN load failed');
      };
      document.head.appendChild(script);
    } else {
      _startFluid(container);
    }
  };

  function _getColorPalette() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
      return [
        '#0a2540',  // abyss navy
        '#0d3b66',  // deep ocean
        '#1b6fa8',  // mid ocean blue
        '#2d9cba',  // bright cerulean
        '#5db8d4',  // luminous aqua
        '#4dd8c0',  // seafoam
        '#7ee8d6',  // bright foam
        '#1a4a6e',  // teal shadow
      ];
    } else {
      return [
        '#2980b9',  // clear ocean blue
        '#3498db',  // bright sky blue
        '#5dade2',  // light cerulean
        '#48c9b0',  // seafoam teal
        '#76d7c4',  // aquamarine
        '#85c1e9',  // pale blue
        '#aed6f1',  // ice blue
        '#1a7aad',  // deep cerulean
      ];
    }
  }

  function _getBackColor() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? '#0a1e33' : '#d4e8f0';
  }

  function _startFluid(container) {
    var fluid = _getFluid();
    if (!fluid) return;

    if (_observer) {
      _observer.disconnect();
      _observer = null;
    }

    // Clear leftover canvases from previous Turbo page swaps
    container.innerHTML = '';

    // Create a canvas element for the fluid simulation
    var canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    try {
      fluid.simulation(canvas, {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 0.965,
        VELOCITY_DISSIPATION: 0.975,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.35,
        SPLAT_FORCE: 5000,
        INITIAL: true,
        SPLAT_AMOUNT: 5,
        TRANSPARENT: false,
        BACK_COLOR: _getBackColor(),
        BRIGHTNESS: 0.5,
        BLOOM: true,
        BLOOM_INTENSITY: 0.15,
        BLOOM_THRESHOLD: 0.55,
        SUNRAYS: true,
        SUNRAYS_WEIGHT: 0.6,
        HOVER: true,
        COLOR_PALETTE: _getColorPalette(),
        COLOR_UPDATE_SPEED: 8,
      });

      _initialized = true;

      // Fire extra splats to fill the canvas
      setTimeout(function () {
        try { fluid.splats(); } catch (e) {}
      }, 200);

      // Keep the simulation alive with periodic splats
      if (_splatInterval) clearInterval(_splatInterval);
      _splatInterval = setInterval(function () {
        try { fluid.splats(); } catch (e) {}
      }, 3000);

      // Forward mouse/touch events from #main to the fluid as splats.
      // The library only listens on the canvas, but the hero card sits on top.
      var main = document.getElementById('main');
      var dragging = false;
      var lastX = 0, lastY = 0;

      function _splatAt(clientX, clientY, dx, dy) {
        var rect = canvas.getBoundingClientRect();
        var x = (clientX - rect.left) / rect.width;
        var y = 1.0 - (clientY - rect.top) / rect.height;
        // Clamp to canvas bounds
        if (x < 0 || x > 1 || y < 0 || y > 1) return;
        try {
          fluid.splat(
            x * canvas.clientWidth,
            (1.0 - y) * canvas.clientHeight,
            dx * 8,
            dy * 8
          );
        } catch (e) {}
      }

      document.addEventListener('mousedown', function (e) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        _splatAt(e.clientX, e.clientY, 0, 0);
      });

      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        var dx = e.clientX - lastX;
        var dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        _splatAt(e.clientX, e.clientY, dx, dy);
      });

      window.addEventListener('mouseup', function () {
        dragging = false;
      });

      document.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        dragging = true;
        lastX = t.clientX;
        lastY = t.clientY;
        _splatAt(t.clientX, t.clientY, 0, 0);
      }, { passive: true });

      document.addEventListener('touchmove', function (e) {
        if (!dragging) return;
        var t = e.touches[0];
        var dx = t.clientX - lastX;
        var dy = t.clientY - lastY;
        lastX = t.clientX;
        lastY = t.clientY;
        _splatAt(t.clientX, t.clientY, dx, dy);
      }, { passive: true });

      window.addEventListener('touchend', function () {
        dragging = false;
      });

    } catch (e) {
      console.warn('WebGL Fluid: init failed', e);
      return;
    }

    // Re-init colours on theme change
    _observer = new MutationObserver(function (mutations) {
      var f = _getFluid();
      if (!f) return;
      for (var m of mutations) {
        if (m.attributeName === 'data-theme' || m.attributeName === 'style') {
          try {
            f.config({
              COLOR_PALETTE: _getColorPalette(),
              BACK_COLOR: _getBackColor(),
            });
            f.splats();
          } catch (e) {}
          break;
        }
      }
    });
    _observer.observe(document.documentElement, { attributes: true });
  }

  // Cleanup on Turbo before-render to prevent stale instances
  document.addEventListener('turbo:before-render', function () {
    _initialized = false;
    if (_splatInterval) { clearInterval(_splatInterval); _splatInterval = null; }
    if (_observer) {
      _observer.disconnect();
      _observer = null;
    }
  });
})();
