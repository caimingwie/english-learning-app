// Simple SVG icon generator — creates minimal placeholder icons
// Run: node scripts/generate-icons.js

import { writeFileSync } from 'fs';

function createIconSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#1a73e8"/>
  <text x="${size/2}" y="${size*0.55}" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="${size*0.35}" font-weight="bold" fill="white">EN</text>
  <text x="${size/2}" y="${size*0.78}" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="${size*0.12}" fill="rgba(255,255,255,0.8)">学</text>
</svg>`;
}

writeFileSync('public/icons/icon-192.svg', createIconSVG(192));
writeFileSync('public/icons/icon-512.svg', createIconSVG(512));

console.log('Icons generated!');
