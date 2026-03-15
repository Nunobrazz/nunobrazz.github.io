/* ==========================================================================
   chip-nav.js — Elastic horizontal pill navigation

   Implements a swipable row of navigation "chips" (pills) with:
   - Drag-to-scroll (mouse + touch)
   - Momentum / inertia on release (FRICTION controls decay)
   - Rubber-band overshoot at boundaries (ELASTIC_FACTOR)
   - Spring-back animation to snap within bounds (SPRING_BACK)
   - Gradient fade masks on left/right edges (CSS classes toggled by JS)
   - Mouse-wheel horizontal scroll support

   The chip-nav element uses data-turbo-permanent, so the DOM is kept
   across Turbo navigations. initChipNav() guards against double-init.
   ========================================================================== */

(function () {

  /* ---- Physics constants ---- */
  var FRICTION       = 0.92;   // Momentum decay per animation frame (0–1, lower = more drag)
  var ELASTIC_FACTOR = 0.35;   // How much the track stretches past boundaries (0–1, lower = stiffer)
  var SPRING_BACK    = 0.15;   // Speed of bounce-back from overshoot (0–1, higher = snappier)
  var MIN_VELOCITY   = 0.5;    // Velocity below this stops the animation loop (px/frame)

  /**
   * initChipNav()
   * Called from init() in _main.js on every page load / Turbo navigation.
   * Sets up pointer events, wheel handler, and the animation loop.
   */
  window.initChipNav = function () {
    var nav   = document.getElementById('chip-nav');    // Outer container (overflow: hidden, has fade masks)
    var track = document.getElementById('chip-nav-track'); // Inner flex row of chips (translated via transform)
    if (!nav || !track) return;

    // Guard: only bind events once (element is turbo-permanent)
    if (track._chipNavInit) return;
    track._chipNavInit = true;

    /* ---- State variables ---- */
    var offset      = 0;       // Current translateX value (negative = scrolled right)
    var velocity    = 0;       // Current horizontal velocity (px/frame)
    var isDragging  = false;   // True while the pointer is down AND has moved past threshold
    var didDrag     = false;   // True after a drag ends — reset on click to prevent navigation
    var startX      = 0;       // Pointer X at drag start
    var startOffset = 0;       // Offset at drag start
    var lastX       = 0;       // Previous pointer X (for velocity calculation)
    var lastTime    = 0;       // Previous timestamp (for velocity calculation)
    var rafId       = null;    // requestAnimationFrame ID (for cancellation)


    /* ---- Helper: maximum scroll distance ---- */
    function maxScroll() {
      // How many pixels the track overflows the container
      return Math.max(0, track.scrollWidth - nav.clientWidth);
    }

    /* ---- Helper: clamp offset within valid range ---- */
    function clamp(val) {
      return Math.max(-maxScroll(), Math.min(0, val));
    }

    /* ---- Helper: apply translateX to the track (GPU-accelerated) ---- */
    function applyTransform(x) {
      track.style.transform = 'translate3d(' + x + 'px, 0, 0)';
    }

    /* ---- Helper: toggle gradient fade masks on edges ----
       Adds CSS classes to .chip-nav so the ::before / ::after pseudo-elements
       show a gradient indicating hidden content off-screen. */
    function updateFadeMasks() {
      var max = maxScroll();
      if (max <= 0) {
        // Everything fits — no fades needed
        nav.classList.remove('fade-left', 'fade-right');
        return;
      }
      // Left fade: show when scrolled away from the start
      if (offset < -4) {
        nav.classList.add('fade-left');
      } else {
        nav.classList.remove('fade-left');
      }
      // Right fade: show when not yet scrolled to the end
      if (offset > -(max - 4)) {
        nav.classList.add('fade-right');
      } else {
        nav.classList.remove('fade-right');
      }
    }


    /* ---- Animation loop: momentum + spring-back ----
       Runs via requestAnimationFrame after the user releases the drag.
       Two modes:
         1. Out-of-bounds → spring back to nearest boundary
         2. In-bounds → apply momentum with friction until stopped */
    function animationLoop() {
      if (isDragging) return; // Don't animate while user is still dragging

      var max = maxScroll();
      var outOfBounds = offset > 0 || offset < -max;

      if (outOfBounds) {
        // SPRING-BACK: interpolate towards the boundary
        var target = offset > 0 ? 0 : -max;
        offset += (target - offset) * SPRING_BACK;
        if (Math.abs(target - offset) < 0.5) offset = target;
        velocity = 0;
      } else {
        // MOMENTUM: coast with friction
        offset += velocity;
        velocity *= FRICTION;
        // Stop at boundaries (no bounce on momentum)
        if (offset > 0)     { offset = 0;    velocity = 0; }
        if (offset < -max)  { offset = -max; velocity = 0; }
      }

      applyTransform(offset);
      updateFadeMasks();

      // Keep animating if there's significant motion or we're still out of bounds
      if (Math.abs(velocity) > MIN_VELOCITY || outOfBounds) {
        rafId = requestAnimationFrame(animationLoop);
      } else {
        // Final snap
        velocity = 0;
        offset = clamp(offset);
        applyTransform(offset);
        updateFadeMasks();
      }
    }


    /* ---- Pointer events: mousedown / touchstart ----
       Begins tracking the drag. On move, applies elastic overshoot if
       pulling past boundaries. On release, kicks off the animation loop. */
    function onPointerDown(e) {
      isDragging = false;
      if (rafId) cancelAnimationFrame(rafId);
      velocity = 0;

      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      startX      = clientX;
      lastX       = clientX;
      startOffset = offset;
      lastTime    = Date.now();

      /* ---- Move handler (mousemove / touchmove) ---- */
      var onMove = function (e2) {
        var cx    = e2.touches ? e2.touches[0].clientX : e2.clientX;
        var delta = cx - startX;

        // 3px dead zone: prevents accidental drags when clicking chips
        if (!isDragging && Math.abs(delta) > 3) {
          isDragging = true;
        }
        if (!isDragging) return;
        if (e2.cancelable) e2.preventDefault();

        var raw = startOffset + delta;
        var max = maxScroll();

        // ELASTIC OVERSHOOT: stretch at reduced rate past boundaries
        if (raw > 0) {
          offset = raw * ELASTIC_FACTOR;
        } else if (raw < -max) {
          var over = raw + max;
          offset = -max + over * ELASTIC_FACTOR;
        } else {
          offset = raw;
        }

        // Velocity tracking for momentum on release
        var now = Date.now();
        var dt  = now - lastTime;
        if (dt > 0) {
          velocity = (cx - lastX) / dt * 16; // Normalize to ~60fps frame time
        }
        lastX    = cx;
        lastTime = now;

        applyTransform(offset);
        updateFadeMasks();
      };

      /* ---- Release handler (mouseup / touchend) ---- */
      var onUp = function () {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);

        if (isDragging) {
          isDragging = false;
          didDrag = true;   // Flag for click handler — prevent navigation after drag
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      document.addEventListener('mousemove', onMove, { passive: false });
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }


    /* ---- Click guard ----
       After a drag, the browser fires a click event on the chip under
       the pointer. We intercept it to prevent accidental navigation. */
    track.addEventListener('click', function (e) {
      if (didDrag) {
        didDrag = false;
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);


    /* ---- Bind pointer events ---- */
    track.addEventListener('mousedown', onPointerDown);
    track.addEventListener('touchstart', onPointerDown, { passive: true });


    /* ---- Mouse wheel: horizontal scroll ----
       Converts vertical or horizontal wheel deltas into track movement.
       No momentum — just direct offset adjustment. */
    nav.addEventListener('wheel', function (e) {
      if (maxScroll() <= 0) return;
      e.preventDefault();
      var delta = e.deltaX || e.deltaY;
      offset -= delta;
      offset = clamp(offset);
      applyTransform(offset);
      updateFadeMasks();
    }, { passive: false });


    /* ---- Initial state & resize ---- */
    updateFadeMasks();

    window.addEventListener('resize', function () {
      offset = clamp(offset);
      applyTransform(offset);
      updateFadeMasks();
    });
  };

})();
