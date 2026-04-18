#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Encrypt party photos for the website
#
# Usage:  ./scripts/encrypt-party.sh
#
# Reads originals from  files/party/photos/
# Writes encrypted to   files/party/encrypted/
#
# Before encrypting:
#   - Converts HEIC files to JPEG via sips (macOS)
#   - Replaces spaces with hyphens in filenames
#   - Removes stale .enc files with no matching original
#
# The PIN is read interactively so it never appears in
# shell history or process lists.
# ─────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PHOTOS_DIR="$ROOT_DIR/files/party/photos"
ENC_DIR="$ROOT_DIR/files/party/encrypted"

if [ ! -d "$PHOTOS_DIR" ]; then
  echo "Error: $PHOTOS_DIR does not exist. Put your photos there first."
  exit 1
fi

# ── Step 1: Sanitise filenames (spaces → hyphens) ──
echo "Sanitising filenames..."
cd "$PHOTOS_DIR"
for f in *; do
  new=$(echo "$f" | tr ' ' '-')
  if [ "$f" != "$new" ]; then
    mv "$f" "$new"
    echo "  Renamed: $f -> $new"
  fi
done

# ── Step 2: Convert HEIC to JPEG ──
echo "Checking for HEIC files..."
for f in *.HEIC *.heic; do
  [ -f "$f" ] || continue
  out="${f%.*}.jpg"
  echo "  Converting: $f -> $out"
  sips -s format jpeg "$f" --out "$out" >/dev/null 2>&1
  rm "$f"
done
# Also check .jpg/.JPG files that are secretly HEIC
for f in *.jpg *.JPG *.jpeg; do
  [ -f "$f" ] || continue
  mime=$(file -b --mime-type "$f")
  if [ "$mime" = "image/heic" ]; then
    echo "  Converting (misnamed HEIC): $f"
    tmp="${f}.tmp.jpg"
    sips -s format jpeg "$f" --out "$tmp" >/dev/null 2>&1
    mv "$tmp" "$f"
  fi
done

# ── Step 3: Prompt for PIN ──
read -s -p "Enter party PIN: " PIN
echo

if [ -z "$PIN" ]; then
  echo "Error: PIN cannot be empty."
  exit 1
fi

mkdir -p "$ENC_DIR"

# ── Step 4: Encrypt & clean up stale files ──
node -e "
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const pin = process.argv[1];
const photosDir = process.argv[2];
const encDir = process.argv[3];

const exts = new Set(['.jpg','.jpeg','.png','.gif','.webp','.mp4','.mov','.webm']);

const files = fs.readdirSync(photosDir).filter(f => {
  const ext = path.extname(f).toLowerCase();
  return exts.has(ext) && fs.statSync(path.join(photosDir, f)).isFile();
});

if (files.length === 0) {
  console.log('No photos/videos found in ' + photosDir);
  process.exit(0);
}

// Build set of expected .enc filenames
const expectedEnc = new Set();

console.log('Encrypting ' + files.length + ' files...');

// Format: [16 bytes salt][12 bytes IV][ciphertext + 16 bytes auth tag]
files.forEach((file, i) => {
  const name = path.basename(file, path.extname(file));
  const ext = path.extname(file).toLowerCase().slice(1);
  const outName = name + '.' + ext + '.enc';
  expectedEnc.add(outName);

  console.log('  [' + (i+1) + '/' + files.length + '] ' + file + ' -> ' + outName);

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);

  // PBKDF2 to derive 256-bit key from PIN
  const key = crypto.pbkdf2Sync(pin, salt, 100000, 32, 'sha256');

  const plaintext = fs.readFileSync(path.join(photosDir, file));

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag(); // 16 bytes

  // Write: salt (16) + iv (12) + ciphertext + authTag (16)
  const output = Buffer.concat([salt, iv, encrypted, authTag]);
  fs.writeFileSync(path.join(encDir, outName), output);
});

// Remove stale .enc files that no longer have a matching original
const encFiles = fs.readdirSync(encDir).filter(f => f.endsWith('.enc'));
let removed = 0;
encFiles.forEach(f => {
  if (!expectedEnc.has(f)) {
    fs.unlinkSync(path.join(encDir, f));
    console.log('  Removed stale: ' + f);
    removed++;
  }
});

if (removed > 0) {
  console.log('Cleaned up ' + removed + ' stale encrypted file(s).');
}

console.log('Done! ' + files.length + ' encrypted files in ' + encDir);
" "$PIN" "$PHOTOS_DIR" "$ENC_DIR"
