#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Encrypt party photos for the website
#
# Usage:  ./scripts/encrypt-party.sh
#
# Reads originals from  files/party/photos/
# Writes encrypted to   files/party/encrypted/
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

# Prompt for PIN (hidden input)
read -s -p "Enter party PIN: " PIN
echo

if [ -z "$PIN" ]; then
  echo "Error: PIN cannot be empty."
  exit 1
fi

mkdir -p "$ENC_DIR"

# Use Node.js for encryption (crypto module is built-in)
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

console.log('Encrypting ' + files.length + ' files...');

// Format: [16 bytes salt][12 bytes IV][ciphertext + 16 bytes auth tag]
files.forEach((file, i) => {
  const name = path.basename(file, path.extname(file));
  const ext = path.extname(file).toLowerCase().slice(1);
  const outName = name + '.' + ext + '.enc';

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

console.log('Done! Encrypted files are in ' + encDir);
" "$PIN" "$PHOTOS_DIR" "$ENC_DIR"
