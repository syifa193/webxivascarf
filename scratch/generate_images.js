const fs = require('fs');
const path = require('path');

function encodeSVG(svgString) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

// 1. Pashmina SVG
function makePashminaSVG(title, color1, color2, accent, subtitle) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
      <linearGradient id="silk" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4"/>
        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.15"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.2"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <!-- Decorative background patterns -->
    <circle cx="300" cy="250" r="190" fill="#FFFFFF" fill-opacity="0.12"/>
    <circle cx="300" cy="250" r="150" fill="#FFFFFF" fill-opacity="0.15"/>
    <path d="M 120 500 Q 300 420 480 500" stroke="${accent}" stroke-width="2" fill="none" opacity="0.4"/>

    <!-- Pashmina Hijab Drape Illustration -->
    <g filter="url(#shadow)">
      <!-- Face Oval / Inner Ciput -->
      <path d="M 245 160 C 245 120, 355 120, 355 160 C 355 210, 245 210, 245 160 Z" fill="#F8EDEB" opacity="0.95"/>
      <!-- Ciput Band -->
      <path d="M 252 145 Q 300 135 348 145 Q 350 158 300 162 Q 250 158 252 145 Z" fill="${accent}"/>
      
      <!-- Main Scarf Wrap Around Head -->
      <path d="M 230 170 C 220 110, 380 110, 370 170 C 375 220, 380 280, 370 330 C 340 370, 260 370, 230 330 C 220 280, 225 220, 230 170 Z" fill="${color1}"/>
      
      <!-- Pashmina Left Flowing Tail -->
      <path d="M 235 240 C 180 270, 150 350, 160 440 C 190 450, 230 430, 245 340 Z" fill="${color1}"/>
      <path d="M 235 240 C 180 270, 150 350, 160 440 C 190 450, 230 430, 245 340 Z" fill="url(#silk)"/>

      <!-- Pashmina Right Wrapped Layer -->
      <path d="M 365 240 C 410 270, 430 340, 400 420 C 360 430, 340 380, 345 320 Z" fill="${color1}" opacity="0.9"/>
      
      <!-- Fold Lines / Folds -->
      <path d="M 250 200 Q 300 220 350 200" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M 240 230 Q 300 255 360 230" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 245 260 Q 300 285 355 260" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/>
    </g>

    <!-- Bottom Title Banner -->
    <rect x="40" y="475" width="520" height="85" rx="18" fill="#FFFFFF" fill-opacity="0.92" filter="url(#shadow)"/>
    <text x="300" y="515" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="bold" fill="#333333" text-anchor="middle">${title}</text>
    <text x="300" y="542" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${color1}" text-anchor="middle">✨ ${subtitle} • PASHMINA COLLECTION ✨</text>
  </svg>`;
  return encodeSVG(svg);
}

// 2. Segiempat SVG
function makeSegiempatSVG(title, color1, color2, accent, subtitle) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.2"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <circle cx="300" cy="240" r="180" fill="#FFFFFF" fill-opacity="0.15"/>
    <path d="M 300 70 L 480 250 L 300 430 L 120 250 Z" fill="#FFFFFF" fill-opacity="0.08"/>

    <!-- Segiempat Hijab Triangle Fold Illustration -->
    <g filter="url(#shadow)">
      <!-- Face Silhouette -->
      <path d="M 250 160 C 250 120, 350 120, 350 160 C 350 205, 250 205, 250 160 Z" fill="#FFF0ED"/>
      
      <!-- Crisp Forehead Point & Triangle Scarf Top -->
      <path d="M 300 100 L 385 180 C 410 260, 420 350, 390 420 L 300 370 L 210 420 C 180 350, 190 260, 215 180 Z" fill="${color1}"/>
      
      <!-- Fold Over Lapels (Segiempat Cross Drape) -->
      <path d="M 215 180 Q 300 240 385 180 L 360 320 Q 300 360 240 320 Z" fill="${accent}" opacity="0.85"/>
      
      <!-- Forehead Peak Line -->
      <path d="M 300 100 L 250 160 Q 300 150 350 160 Z" fill="${color1}"/>
      <path d="M 300 100 L 300 150" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>

      <!-- Texture / Draping lines -->
      <path d="M 230 220 Q 300 270 370 220" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="0.6"/>
      <path d="M 240 260 Q 300 305 360 260" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.5"/>
    </g>

    <!-- Bottom Title Banner -->
    <rect x="40" y="475" width="520" height="85" rx="18" fill="#FFFFFF" fill-opacity="0.92" filter="url(#shadow)"/>
    <text x="300" y="515" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="bold" fill="#333333" text-anchor="middle">${title}</text>
    <text x="300" y="542" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${color1}" text-anchor="middle">📐 ${subtitle} • SEGIEMPAT VOAL 📐</text>
  </svg>`;
  return encodeSVG(svg);
}

// 3. Bergo SVG
function makeBergoSVG(title, color1, color2, accent, subtitle) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.2"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <circle cx="300" cy="240" r="180" fill="#FFFFFF" fill-opacity="0.12"/>

    <!-- Bergo Instant Hijab Illustration -->
    <g filter="url(#shadow)">
      <!-- Face Oval -->
      <path d="M 250 165 C 250 125, 350 125, 350 165 C 350 210, 250 210, 250 165 Z" fill="#FFF0ED"/>
      
      <!-- Bergo Pet / Visor Headband -->
      <path d="M 248 145 C 270 120, 330 120, 352 145 C 355 160, 245 160, 248 145 Z" fill="${accent}"/>
      <path d="M 248 145 Q 300 132 352 145" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.6"/>

      <!-- Main Bergo Body Draping over shoulders and chest -->
      <path d="M 235 165 C 210 220, 160 300, 170 410 C 230 445, 370 445, 430 410 C 440 300, 390 220, 365 165 C 330 195, 270 195, 235 165 Z" fill="${color1}"/>
      
      <!-- Chin Seam & Stitching -->
      <path d="M 300 200 L 300 425" stroke="${accent}" stroke-width="3" stroke-dasharray="6,4" fill="none" opacity="0.7"/>

      <!-- Smooth Curved Hemline Accent -->
      <path d="M 180 395 Q 300 435 420 395" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.5"/>
    </g>

    <!-- Bottom Title Banner -->
    <rect x="40" y="475" width="520" height="85" rx="18" fill="#FFFFFF" fill-opacity="0.92" filter="url(#shadow)"/>
    <text x="300" y="515" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="bold" fill="#333333" text-anchor="middle">${title}</text>
    <text x="300" y="542" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${color1}" text-anchor="middle">🌸 ${subtitle} • BERGO INSTANT 🌸</text>
  </svg>`;
  return encodeSVG(svg);
}

// 4. Syar'i SVG
function makeSyariSVG(title, color1, color2, accent, subtitle) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.2"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <circle cx="300" cy="220" r="190" fill="#FFFFFF" fill-opacity="0.12"/>

    <!-- Syar'i Long 2-Layer Hijab Illustration -->
    <g filter="url(#shadow)">
      <!-- Face Oval -->
      <path d="M 252 145 C 252 110, 348 110, 348 145 C 348 185, 252 185, 252 145 Z" fill="#FFF0ED"/>
      <path d="M 254 135 Q 300 125 346 135 Q 348 146 300 150 Q 252 146 254 135 Z" fill="${accent}"/>

      <!-- Layer 2 (Back / Outer Long Layer) -->
      <path d="M 225 150 C 180 220, 120 320, 130 450 C 210 475, 390 475, 470 450 C 480 320, 420 220, 375 150 Z" fill="${color1}" opacity="0.75"/>
      
      <!-- Layer 1 (Front / Top Layer) -->
      <path d="M 235 150 C 200 210, 150 290, 160 390 C 220 420, 380 420, 440 390 C 450 290, 400 210, 365 150 Z" fill="${color1}"/>

      <!-- Chiffon Ruffle Wave Hemlines -->
      <path d="M 160 390 Q 230 425 300 395 Q 370 425 440 390" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M 130 450 Q 220 480 300 455 Q 380 480 470 450" stroke="${accent}" stroke-width="3" fill="none" opacity="0.8"/>
    </g>

    <!-- Bottom Title Banner -->
    <rect x="40" y="475" width="520" height="85" rx="18" fill="#FFFFFF" fill-opacity="0.92" filter="url(#shadow)"/>
    <text x="300" y="515" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="bold" fill="#333333" text-anchor="middle">${title}</text>
    <text x="300" y="542" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${color1}" text-anchor="middle">👑 ${subtitle} • JILBAB SYAR'I 👑</text>
  </svg>`;
  return encodeSVG(svg);
}

// 5. Instant Jersey SVG
function makeInstantSVG(title, color1, color2, accent, subtitle) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.2"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <circle cx="300" cy="240" r="180" fill="#FFFFFF" fill-opacity="0.15"/>

    <!-- Instant Jersey Flowy Hijab Illustration -->
    <g filter="url(#shadow)">
      <!-- Face Oval -->
      <path d="M 248 160 C 248 120, 352 120, 352 160 C 352 205, 248 205, 248 160 Z" fill="#FFF0ED"/>
      
      <!-- Soft Jersey Elastic Face Band -->
      <path d="M 248 150 C 270 135, 330 135, 352 150 C 354 165, 246 165, 248 150 Z" fill="${accent}"/>

      <!-- Flowy Jersey Main Body -->
      <path d="M 230 160 C 190 220, 160 310, 180 420 C 240 440, 360 440, 420 420 C 440 310, 410 220, 370 160 C 330 200, 270 200, 230 160 Z" fill="${color1}"/>

      <!-- Soft Natural Wave Folds -->
      <path d="M 250 230 Q 300 280 350 230" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M 235 280 Q 300 335 365 280" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 220 330 Q 300 385 380 330" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/>
    </g>

    <!-- Bottom Title Banner -->
    <rect x="40" y="475" width="520" height="85" rx="18" fill="#FFFFFF" fill-opacity="0.92" filter="url(#shadow)"/>
    <text x="300" y="515" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="bold" fill="#333333" text-anchor="middle">${title}</text>
    <text x="300" y="542" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${color1}" text-anchor="middle">⚡ ${subtitle} • HIJAB INSTANT ⚡</text>
  </svg>`;
  return encodeSVG(svg);
}

// Generate the 8 product image Data URIs
const img1 = makePashminaSVG('Pashmina Silk Rose', '#8B5E83', '#D4A373', '#F8EDEB', 'Rose Gold & Mauve');
const img2 = makeSegiempatSVG('Segiempat Voal Dust Pink', '#D88A9A', '#F8EDEB', '#8B5E83', 'Dusty Pink Grade A');
const img3 = makeBergoSVG('Bergo Instant Comfort', '#4A4A5A', '#8B5E83', '#D4A373', 'Hitam & Daily Grey');
const img4 = makeSyariSVG('Jilbab Syar\'i Layers', '#8E7599', '#7A9A8B', '#D4A373', 'Soft Lavender Chiffon');
const img5 = makeInstantSVG('Instant Jersey Plum', '#6E3B66', '#D4A373', '#F8EDEB', 'Deep Plum Flowy');
const img6 = makePashminaSVG('Pashmina Inner 2in1', '#C49261', '#8B5E83', '#F8EDEB', 'Sand & Ciput Taupe');
const img7 = makeSegiempatSVG('Segiempat Paris Polos', '#6B7A59', '#D4A373', '#FAF3E0', 'Olive & Broken White');
const img8 = makeBergoSVG('Bergo Maryam Diamond', '#C86D51', '#D4A373', '#F8EDEB', 'Terracotta & Mustard');

const heroBannerImg = makePashminaSVG('XivaScarf Boutique', '#8B5E83', '#D4A373', '#FFFFFF', 'Koleksi Jilbab Hijab Elegance 2026');

console.log('SVG images created successfully!');

// Export helper to update files
module.exports = {
  img1, img2, img3, img4, img5, img6, img7, img8, heroBannerImg
};
