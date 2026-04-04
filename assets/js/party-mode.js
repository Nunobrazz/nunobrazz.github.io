/* Party Mode — Encrypted photo gallery behind a PIN code
   Photos are AES-256-GCM encrypted. The PIN derives the key via PBKDF2.
   File format: [16 bytes salt][12 bytes IV][ciphertext + 16 bytes auth tag]
   ========================================================================= */
(function () {
  var currentPin = null;
  var encryptedFiles = [];
  var decryptedBlobs = []; // cache so we don't re-decrypt

  // --- Load the manifest of .enc files ---
  function loadManifest() {
    fetch('/party-photos.json')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (files) { encryptedFiles = files; })
      .catch(function () { encryptedFiles = []; });
  }

  // --- Crypto helpers ---
  async function deriveKey(pin, salt) {
    var enc = new TextEncoder();
    var keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  }

  async function decryptFile(url, pin) {
    var response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch ' + url);
    var buffer = await response.arrayBuffer();
    var data = new Uint8Array(buffer);

    // Parse: salt(16) + iv(12) + ciphertext+tag(rest)
    var salt = data.slice(0, 16);
    var iv = data.slice(16, 28);
    var ciphertext = data.slice(28);

    var key = await deriveKey(pin, salt);
    var decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    );
    return decrypted;
  }

  // Guess MIME type from the .enc filename (e.g. "photo.jpg.enc" → "image/jpeg")
  function mimeFromEncName(encPath) {
    var name = encPath.replace(/\.enc$/i, '');
    var ext = name.split('.').pop().toLowerCase();
    var map = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
      gif: 'image/gif', webp: 'image/webp',
      mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm'
    };
    return map[ext] || 'application/octet-stream';
  }

  function isVideoMime(mime) {
    return mime.startsWith('video/');
  }

  // --- Gallery rendering with decryption ---
  async function renderGallery(pin) {
    var gallery = document.getElementById('party-gallery');
    if (!gallery) return;

    if (encryptedFiles.length === 0) {
      gallery.innerHTML = '<div class="party-mode__empty">No photos yet</div>';
      return;
    }

    // Show flames decryption screen
    gallery.innerHTML = '';
    var decryptScreen = document.createElement('div');
    decryptScreen.className = 'party-mode__decrypt-screen';
    // Build ember particles
    var flamesHtml = '<div class="party-mode__flames">';
    for (var e = 0; e < 30; e++) { flamesHtml += '<div class="party-mode__ember"></div>'; }
    flamesHtml += '</div>';
    decryptScreen.innerHTML = flamesHtml +
      '<div class="party-mode__decrypt-text">Decrypting ' + encryptedFiles.length + ' files</div>' +
      '<div class="party-mode__decrypt-spinner"></div>';
    gallery.appendChild(decryptScreen);

    // Shuffle
    var shuffled = encryptedFiles.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
    }

    // Decrypt all files
    var results = [];
    // Decrypt in batches of 4 for performance
    for (var b = 0; b < shuffled.length; b += 4) {
      var batch = shuffled.slice(b, b + 4);
      var batchResults = await Promise.allSettled(batch.map(function (src) {
        return decryptFile(src, pin).then(function (data) {
          var mime = mimeFromEncName(src);
          var blob = new Blob([data], { type: mime });
          return { url: URL.createObjectURL(blob), mime: mime, name: src };
        });
      }));
      batchResults.forEach(function (r) {
        if (r.status === 'fulfilled') results.push(r.value);
      });
    }

    // Remove decrypt screen
    if (decryptScreen.parentNode) decryptScreen.remove();

    if (results.length === 0) {
      gallery.innerHTML = '<div class="party-mode__empty">Could not decrypt any files</div>';
      return;
    }

    gallery.innerHTML = '';
    decryptedBlobs = results;

    var sizes = [
      { w: 220, h: 170 }, { w: 260, h: 200 }, { w: 200, h: 260 },
      { w: 280, h: 190 }, { w: 180, h: 240 }, { w: 250, h: 180 },
      { w: 230, h: 300 }, { w: 270, h: 210 }, { w: 190, h: 250 },
      { w: 240, h: 170 }, { w: 210, h: 280 }
    ];

    results.forEach(function (item, idx) {
      var div = document.createElement('div');
      div.className = 'party-mode__photo';

      var rot = (Math.random() * 16 - 8).toFixed(1);
      var mx = Math.floor(Math.random() * 20 - 10);
      var my = Math.floor(Math.random() * 24 - 8);
      var size = sizes[idx % sizes.length];

      div.style.cssText =
        '--party-rotate: rotate(' + rot + 'deg);' +
        '--party-from: translateY(' + (40 + Math.random() * 60) + 'px) rotate(' + (rot * 3) + 'deg) scale(0.6);' +
        'width:' + size.w + 'px;' +
        'height:' + (size.h + 28) + 'px;' +
        'margin:' + my + 'px ' + mx + 'px;';

      if (isVideoMime(item.mime)) {
        var vid = document.createElement('video');
        vid.src = item.url;
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.preload = 'metadata';
        vid.style.height = size.h + 'px';
        div.appendChild(vid);
        div.classList.add('party-mode__photo--video');
        div.addEventListener('mouseenter', function () { vid.play(); });
        div.addEventListener('mouseleave', function () { vid.pause(); });
      } else {
        var img = document.createElement('img');
        img.src = item.url;
        img.alt = 'Party photo';
        img.style.height = size.h + 'px';
        div.appendChild(img);
      }

      div.addEventListener('click', (function (it) {
        return function () {
          if (isVideoMime(it.mime)) {
            openVideoLightbox(it.url);
          } else {
            openLightbox(it.url);
          }
        };
      })(item));

      gallery.appendChild(div);
    });
  }

  // --- Lightbox ---
  function openLightbox(src) {
    var overlay = document.createElement('div');
    overlay.className = 'avatar-lightbox';
    overlay.setAttribute('role', 'dialog');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'avatar-lightbox__close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00D7';
    overlay.appendChild(closeBtn);

    var bigImg = document.createElement('img');
    bigImg.src = src;
    bigImg.alt = 'Party photo';
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

  function openVideoLightbox(src) {
    var overlay = document.createElement('div');
    overlay.className = 'avatar-lightbox';
    overlay.setAttribute('role', 'dialog');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'avatar-lightbox__close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00D7';
    overlay.appendChild(closeBtn);

    var vid = document.createElement('video');
    vid.src = src;
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    vid.style.maxWidth = '90vw';
    vid.style.maxHeight = '85vh';
    vid.style.borderRadius = '6px';
    overlay.appendChild(vid);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('is-visible'); });

    var close = function () {
      vid.pause();
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

  // --- PIN overlay ---
  function showPinOverlay() {
    var overlay = document.getElementById('pin-overlay');
    if (!overlay) return;
    overlay.classList.add('is-visible');
    var inputs = overlay.querySelectorAll('.pin-overlay__digit');
    inputs.forEach(function (inp) { inp.value = ''; });
    document.getElementById('pin-error').textContent = '';
    setTimeout(function () { inputs[0].focus(); }, 100);
  }

  function hidePinOverlay() {
    var overlay = document.getElementById('pin-overlay');
    if (overlay) overlay.classList.remove('is-visible');
  }

  async function activatePartyMode(pin) {
    hidePinOverlay();
    currentPin = pin;

    // Flash transition
    var flash = document.createElement('div');
    flash.className = 'party-flash';
    document.body.appendChild(flash);
    flash.addEventListener('animationend', function () { flash.remove(); });

    var party = document.getElementById('party-mode');
    if (party) {
      setTimeout(function () {
        party.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        // Start decrypting and rendering
        renderGallery(pin);
      }, 150);
    }
  }

  function deactivatePartyMode() {
    var party = document.getElementById('party-mode');
    if (party) {
      party.classList.remove('is-active');
      document.body.style.overflow = '';
    }
    // Revoke blob URLs to free memory
    decryptedBlobs.forEach(function (item) {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    decryptedBlobs = [];
  }

  // --- Try decrypting one file to verify the PIN ---
  async function verifyPin(code) {
    if (encryptedFiles.length === 0) return false;
    try {
      await decryptFile(encryptedFiles[0], code);
      return true;
    } catch (e) {
      return false;
    }
  }

  function initPinInputs() {
    var overlay = document.getElementById('pin-overlay');
    if (!overlay) return;

    var inputs = overlay.querySelectorAll('.pin-overlay__digit');
    var errorEl = document.getElementById('pin-error');

    inputs.forEach(function (input, idx) {
      input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length === 1 && idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }

        var code = '';
        inputs.forEach(function (inp) { code += inp.value; });
        if (code.length === 4) {
          // Disable inputs while verifying
          inputs.forEach(function (inp) { inp.disabled = true; });
          errorEl.textContent = '';

          verifyPin(code).then(function (valid) {
            inputs.forEach(function (inp) { inp.disabled = false; });
            if (valid) {
              activatePartyMode(code);
            } else {
              errorEl.textContent = 'ACCESS DENIED';
              errorEl.style.animation = 'none';
              void errorEl.offsetHeight;
              errorEl.style.animation = '';
              inputs.forEach(function (inp) { inp.value = ''; });
              setTimeout(function () { inputs[0].focus(); }, 300);
            }
          });
        }
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value === '' && idx > 0) {
          inputs[idx - 1].focus();
          inputs[idx - 1].value = '';
          e.preventDefault();
        }
        if (e.key === 'Escape') { hidePinOverlay(); }
      });

      input.addEventListener('paste', function (e) {
        e.preventDefault();
        var paste = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        for (var i = 0; i < Math.min(paste.length, 4); i++) {
          inputs[i].value = paste[i];
        }
        if (paste.length >= 4) {
          inputs[3].focus();
          inputs[3].dispatchEvent(new Event('input'));
        } else if (paste.length > 0) {
          inputs[Math.min(paste.length, 3)].focus();
        }
      });
    });
  }

  // --- Event delegation ---
  document.addEventListener('click', function (e) {
    if (e.target.closest('#party-toggle')) { showPinOverlay(); return; }
    if (e.target.closest('.pin-overlay__close')) { hidePinOverlay(); return; }
    if (e.target.classList && e.target.classList.contains('pin-overlay') && e.target.classList.contains('is-visible')) { hidePinOverlay(); return; }
    if (e.target.closest('.party-mode__close')) { deactivatePartyMode(); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var party = document.getElementById('party-mode');
      if (party && party.classList.contains('is-active')) { deactivatePartyMode(); }
    }
  });

  // --- Init ---
  function init() {
    loadManifest();
    initPinInputs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('turbo:load', init);
})();
