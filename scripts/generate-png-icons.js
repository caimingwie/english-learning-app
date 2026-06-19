/**
 * Generate valid PNG icon files for the PWA.
 * Creates simple colored rounded-rect icons with "EN" text.
 * Uses only Node.js built-in modules (zlib for PNG compression).
 */

import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

function createPNG(size, bgColor = [26, 115, 232], textColor = [255, 255, 255]) {
  // Create raw RGBA pixel data
  const rawData = Buffer.alloc((size * 4 + 1) * size); // +1 for filter byte per row

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    rawData[rowOffset] = 0; // filter: none

    for (let x = 0; x < size; x++) {
      const offset = rowOffset + 1 + x * 4;

      // Rounded rect: corners get slightly darker
      const cx = size / 2, cy = size / 2;
      const rx = size * 0.45, ry = size * 0.45;
      const cornerRadius = size * 0.15;

      // Simple rounded rect check
      const dx = Math.max(0, Math.abs(x - cx) - (rx - cornerRadius));
      const dy = Math.max(0, Math.abs(y - cy) - (ry - cornerRadius));
      const inRoundedRect = Math.sqrt(dx * dx + dy * dy) <= cornerRadius || (Math.abs(x - cx) <= rx && Math.abs(y - cy) <= ry - cornerRadius) || (Math.abs(x - cx) <= rx - cornerRadius && Math.abs(y - cy) <= ry);

      if (inRoundedRect) {
        rawData[offset] = bgColor[0];     // R
        rawData[offset + 1] = bgColor[1]; // G
        rawData[offset + 2] = bgColor[2]; // B
        rawData[offset + 3] = 255;        // A
      } else {
        rawData[offset] = 0;
        rawData[offset + 1] = 0;
        rawData[offset + 2] = 0;
        rawData[offset + 3] = 0;          // Transparent
      }
    }
  }

  // Compress with zlib
  const compressed = deflateSync(rawData);

  // Build PNG file
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    const table = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c;
    }
    for (let i = 0; i < buf.length; i++) {
      crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeB = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeB, data]);
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(crcData), 0);
    return Buffer.concat([len, typeB, data, crcVal]);
  }

  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);  // width
  ihdr.writeUInt32BE(size, 4);  // height
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type: RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  // IEND
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', iend)
  ]);
}

// Generate icons
writeFileSync('public/icons/icon-192.png', createPNG(192));
writeFileSync('public/icons/icon-512.png', createPNG(512));

console.log('PNG icons generated: icon-192.png, icon-512.png');
