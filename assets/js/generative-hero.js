/* ==========================================================================
   GENERATIVE HERO — Lightweight Canvas Particle Waves
   A tech-futuristic ocean-inspired background using only Canvas 2D.
   No external libraries. Draws a flowing particle grid that reacts to mouse.
   Called from init() in _main.js on every Turbo navigation.
   ========================================================================== */

/* --- Original WebGL Fluid Simulation (commented out — too heavy) ---
(function () {
  var _initialized = false;
  ... [webgl-fluid-enhanced v0.5.2 code removed for performance] ...
})();
--- End original --- */

(function () {
  var _initialized = false;
  var _animFrame = null;
  var _observer = null;

  window.initGenerativeHero = function () {
    var container = document.getElementById('fluid-bg-canvas');
    if (!container) return;
    if (_initialized && container.querySelector('canvas')) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    container.innerHTML = '';

    var canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Config ---
    var COLS = 30;
    var ROWS = 18;
    var PARTICLE_SIZE = 2.2;
    var WAVE_SPEED = 0.0006;
    var WAVE_AMP = 22;
    var MOUSE_RADIUS = 150;
    var MOUSE_STRENGTH = 40;
    var LINE_ALPHA = 0.28;
    var CONNECT_DIST = 60;

    var mouse = { x: -9999, y: -9999 };
    var particles = [];
    var time = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function isDark() {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    function getColors() {
      if (isDark()) {
        return {
          bg: '#111118',              // dark background
          particle: [40, 200, 120],   // vivid green
          particle2: [100, 230, 150], // bright green
          line: [50, 210, 130],       // green
        };
      } else {
        return {
          bg: '#d4e8f0',              // light background
          particle: [20, 160, 80],    // rich green
          particle2: [50, 190, 110],  // bright green
          line: [30, 170, 90],        // green
        };
      }
    }

    function resize() {
      var w = container.clientWidth;
      var h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(w, h);
    }

    function initParticles(w, h) {
      particles = [];
      var spacingX = w / (COLS - 1);
      var spacingY = h / (ROWS - 1);
      for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {
          particles.push({
            baseX: col * spacingX,
            baseY: row * spacingY,
            x: col * spacingX,
            y: row * spacingY,
            // Random per-particle values for organic motion
            phaseX1: Math.random() * Math.PI * 2,
            phaseY1: Math.random() * Math.PI * 2,
            phaseX2: Math.random() * Math.PI * 2,
            phaseY2: Math.random() * Math.PI * 2,
            speedX1: 0.4 + Math.random() * 0.6,
            speedY1: 0.4 + Math.random() * 0.6,
            speedX2: 0.2 + Math.random() * 0.4,
            speedY2: 0.2 + Math.random() * 0.4,
            ampX: 0.6 + Math.random() * 0.8,
            ampY: 0.6 + Math.random() * 0.8,
          });
        }
      }
    }

    function draw(ts) {
      time = ts * WAVE_SPEED;
      var w = container.clientWidth;
      var h = container.clientHeight;
      var colors = getColors();

      // Clear
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);

      // Update particles — each drifts with its own random organic motion
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Two layered sine waves per axis, each with random phase and speed
        var dx1 = Math.sin(time * p.speedX1 + p.phaseX1) * WAVE_AMP * p.ampX;
        var dx2 = Math.cos(time * p.speedX2 + p.phaseX2) * WAVE_AMP * p.ampX * 0.5;
        var dy1 = Math.cos(time * p.speedY1 + p.phaseY1) * WAVE_AMP * p.ampY;
        var dy2 = Math.sin(time * p.speedY2 + p.phaseY2) * WAVE_AMP * p.ampY * 0.5;

        p.x = p.baseX + dx1 + dx2;
        p.y = p.baseY + dy1 + dy2;

        // Mouse repulsion
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          var force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Draw connecting lines (only to neighbors)
      ctx.lineWidth = 0.8;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var col = i % COLS;
        var row = Math.floor(i / COLS);

        // Right neighbor
        if (col < COLS - 1) {
          var right = particles[i + 1];
          var d = Math.abs(p.x - right.x) + Math.abs(p.y - right.y);
          if (d < CONNECT_DIST * 2) {
            var alpha = LINE_ALPHA * (1 - d / (CONNECT_DIST * 2));
            ctx.strokeStyle = 'rgba(' + colors.line[0] + ',' + colors.line[1] + ',' + colors.line[2] + ',' + alpha + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }
        }

        // Bottom neighbor
        if (row < ROWS - 1) {
          var below = particles[i + COLS];
          var d = Math.abs(p.x - below.x) + Math.abs(p.y - below.y);
          if (d < CONNECT_DIST * 2) {
            var alpha = LINE_ALPHA * (1 - d / (CONNECT_DIST * 2));
            ctx.strokeStyle = 'rgba(' + colors.line[0] + ',' + colors.line[1] + ',' + colors.line[2] + ',' + alpha + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(below.x, below.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var t = (Math.sin(time + p.phase) + 1) * 0.5;
        var r = Math.floor(colors.particle[0] + (colors.particle2[0] - colors.particle[0]) * t);
        var g = Math.floor(colors.particle[1] + (colors.particle2[1] - colors.particle[1]) * t);
        var b = Math.floor(colors.particle[2] + (colors.particle2[2] - colors.particle[2]) * t);

        // Glow
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var size = PARTICLE_SIZE;
        var alpha = 0.85;
        if (dist < MOUSE_RADIUS) {
          var proximity = 1 - dist / MOUSE_RADIUS;
          size += proximity * 2;
          alpha = 0.6 + proximity * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
        ctx.fill();
      }

      _animFrame = requestAnimationFrame(draw);
    }

    // Events
    document.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    document.addEventListener('touchmove', function (e) {
      var t = e.touches[0];
      var rect = canvas.getBoundingClientRect();
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener('resize', resize);
    resize();
    _animFrame = requestAnimationFrame(draw);
    _initialized = true;

    // Theme changes
    _observer = new MutationObserver(function (mutations) {
      for (var m of mutations) {
        if (m.attributeName === 'data-theme' || m.attributeName === 'style') break;
      }
    });
    _observer.observe(document.documentElement, { attributes: true });
  };

  // Cleanup on Turbo navigation
  document.addEventListener('turbo:before-render', function () {
    _initialized = false;
    if (_animFrame) { cancelAnimationFrame(_animFrame); _animFrame = null; }
    if (_observer) { _observer.disconnect(); _observer = null; }
  });
})();
