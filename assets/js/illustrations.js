/* NORDHEM - clean line-art SVG illustrations per product, IKEA assembly-manual style.
   Reliable (no network), always on-topic, supports multiple gallery views per product. */
(function () {
  const STROKE = '#1f2630';
  const FILL   = 'rgba(255,255,255,0.78)';
  const SOFT   = 'rgba(0,0,0,0.08)';

  /* Each shape function returns the inner <g> markup of a 200x200 viewBox. */
  const SHAPES = {
    /* 1 - Fjord Sofa */
    1: () => `
      <rect x="20" y="90" width="160" height="55" rx="10" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="20" y="65" width="160" height="40" rx="10" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="73" y1="70" x2="73" y2="100" stroke="${STROKE}" stroke-width="2"/>
      <line x1="127" y1="70" x2="127" y2="100" stroke="${STROKE}" stroke-width="2"/>
      <rect x="14" y="80" width="14" height="60" rx="6" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="172" y="80" width="14" height="60" rx="6" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="40" y1="145" x2="40" y2="165" stroke="${STROKE}" stroke-width="3"/>
      <line x1="160" y1="145" x2="160" y2="165" stroke="${STROKE}" stroke-width="3"/>`,

    /* 2 - Lagom Coffee Table */
    2: () => `
      <rect x="25" y="85" width="150" height="20" rx="3" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="35" y="105" width="130" height="25" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="100" y1="105" x2="100" y2="130" stroke="${STROKE}" stroke-width="2"/>
      <line x1="40" y1="130" x2="40" y2="160" stroke="${STROKE}" stroke-width="3"/>
      <line x1="160" y1="130" x2="160" y2="160" stroke="${STROKE}" stroke-width="3"/>`,

    /* 3 - Bjork Bookshelf */
    3: () => `
      <rect x="50" y="30" width="100" height="150" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="50" y1="60"  x2="150" y2="60"  stroke="${STROKE}" stroke-width="2"/>
      <line x1="50" y1="90"  x2="150" y2="90"  stroke="${STROKE}" stroke-width="2"/>
      <line x1="50" y1="120" x2="150" y2="120" stroke="${STROKE}" stroke-width="2"/>
      <line x1="50" y1="150" x2="150" y2="150" stroke="${STROKE}" stroke-width="2"/>
      <rect x="58" y="40" width="8"  height="18" fill="${SOFT}"/>
      <rect x="70" y="38" width="6"  height="20" fill="${SOFT}"/>
      <rect x="80" y="42" width="10" height="16" fill="${SOFT}"/>
      <rect x="120" y="98" width="20" height="20" fill="${SOFT}"/>`,

    /* 4 - Drom Bed Frame */
    4: () => `
      <rect x="20" y="100" width="160" height="55" rx="4" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="20" y="55"  width="160" height="50" rx="4" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="40" y="115" width="55" height="22" rx="4" fill="${SOFT}"/>
      <rect x="105" y="115" width="55" height="22" rx="4" fill="${SOFT}"/>
      <line x1="25" y1="155" x2="25" y2="170" stroke="${STROKE}" stroke-width="3"/>
      <line x1="175" y1="155" x2="175" y2="170" stroke="${STROKE}" stroke-width="3"/>`,

    /* 5 - Natt Nightstand */
    5: () => `
      <rect x="55" y="55" width="90" height="110" rx="3" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="55" y1="95"  x2="145" y2="95"  stroke="${STROKE}" stroke-width="2"/>
      <line x1="55" y1="130" x2="145" y2="130" stroke="${STROKE}" stroke-width="2"/>
      <circle cx="100" cy="80"  r="3" fill="${STROKE}"/>
      <circle cx="100" cy="112" r="3" fill="${STROKE}"/>
      <line x1="60" y1="165" x2="60" y2="172" stroke="${STROKE}" stroke-width="3"/>
      <line x1="140" y1="165" x2="140" y2="172" stroke="${STROKE}" stroke-width="3"/>`,

    /* 6 - Linne Wardrobe */
    6: () => `
      <rect x="40" y="30" width="120" height="150" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="80"  y1="30" x2="80"  y2="180" stroke="${STROKE}" stroke-width="2"/>
      <line x1="120" y1="30" x2="120" y2="180" stroke="${STROKE}" stroke-width="2"/>
      <circle cx="75"  cy="105" r="3" fill="${STROKE}"/>
      <circle cx="85"  cy="105" r="3" fill="${STROKE}"/>
      <circle cx="115" cy="105" r="3" fill="${STROKE}"/>
      <circle cx="125" cy="105" r="3" fill="${STROKE}"/>`,

    /* 7 - Koka Cookware Set */
    7: () => `
      <ellipse cx="100" cy="80" rx="55" ry="12" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <path d="M45 80 L55 150 Q100 165 145 150 L155 80" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="155" y1="85" x2="185" y2="78" stroke="${STROKE}" stroke-width="4" stroke-linecap="round"/>
      <line x1="45"  y1="85" x2="15"  y2="78" stroke="${STROKE}" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="100" cy="80" rx="40" ry="6" fill="${SOFT}"/>`,

    /* 8 - Bord Dining Table */
    8: () => `
      <rect x="20" y="80" width="160" height="18" rx="3" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="35"  y1="98" x2="35"  y2="160" stroke="${STROKE}" stroke-width="3"/>
      <line x1="165" y1="98" x2="165" y2="160" stroke="${STROKE}" stroke-width="3"/>
      <line x1="35"  y1="160" x2="165" y2="160" stroke="${STROKE}" stroke-width="3"/>
      <line x1="100" y1="98" x2="100" y2="155" stroke="${STROKE}" stroke-width="2" stroke-dasharray="4 3"/>`,

    /* 9 - Glas Tumbler Set */
    9: () => `
      <path d="M50 60 L60 150 L90 150 L100 60 Z" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <path d="M105 60 L115 150 L145 150 L155 60 Z" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <ellipse cx="75"  cy="62" rx="25" ry="6" fill="${SOFT}" stroke="${STROKE}" stroke-width="2"/>
      <ellipse cx="130" cy="62" rx="25" ry="6" fill="${SOFT}" stroke="${STROKE}" stroke-width="2"/>`,

    /* 10 - Skriva Desk */
    10: () => `
      <rect x="20" y="75" width="160" height="14" rx="2" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="30"  y1="89" x2="30"  y2="160" stroke="${STROKE}" stroke-width="3"/>
      <line x1="170" y1="89" x2="170" y2="160" stroke="${STROKE}" stroke-width="3"/>
      <rect x="30" y="89" width="140" height="20" fill="${SOFT}"/>
      <rect x="120" y="55" width="40" height="22" rx="2" fill="${FILL}" stroke="${STROKE}" stroke-width="2"/>`,

    /* 11 - Sitta Office Chair */
    11: () => `
      <rect x="65" y="55" width="70" height="60" rx="6" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="60" y="115" width="80" height="14" rx="3" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="100" y1="129" x2="100" y2="160" stroke="${STROKE}" stroke-width="3"/>
      <line x1="70"  y1="170" x2="130" y2="170" stroke="${STROKE}" stroke-width="3"/>
      <line x1="70"  y1="170" x2="100" y2="160" stroke="${STROKE}" stroke-width="3"/>
      <line x1="130" y1="170" x2="100" y2="160" stroke="${STROKE}" stroke-width="3"/>`,

    /* 12 - Ordna Organiser */
    12: () => `
      <rect x="35" y="80" width="130" height="60" rx="6" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="80"  y1="80" x2="80"  y2="140" stroke="${STROKE}" stroke-width="2"/>
      <line x1="120" y1="80" x2="120" y2="140" stroke="${STROKE}" stroke-width="2"/>
      <rect x="45" y="90" width="25" height="22" fill="${SOFT}"/>
      <rect x="90" y="90" width="20" height="40" fill="${SOFT}"/>
      <rect x="128" y="92" width="30" height="14" fill="${SOFT}"/>`,

    /* 13 - Bada Towel Set */
    13: () => `
      <rect x="40" y="60"  width="120" height="22" rx="3" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="40" y="86"  width="120" height="22" rx="3" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="40" y="112" width="120" height="22" rx="3" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="40" y="138" width="120" height="22" rx="3" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="46" y1="71" x2="56" y2="71" stroke="${STROKE}" stroke-width="2"/>
      <line x1="46" y1="97" x2="56" y2="97" stroke="${STROKE}" stroke-width="2"/>
      <line x1="46" y1="123" x2="56" y2="123" stroke="${STROKE}" stroke-width="2"/>
      <line x1="46" y1="149" x2="56" y2="149" stroke="${STROKE}" stroke-width="2"/>`,

    /* 14 - Spegel Mirror */
    14: () => `
      <circle cx="100" cy="100" r="65" fill="${FILL}" stroke="${STROKE}" stroke-width="4"/>
      <circle cx="100" cy="100" r="55" fill="${SOFT}"/>
      <path d="M75 85 Q90 75 110 80" stroke="rgba(255,255,255,0.9)" stroke-width="3" fill="none" stroke-linecap="round"/>`,

    /* 15 - Tval Soap Dispenser */
    15: () => `
      <rect x="75" y="75" width="50" height="80" rx="6" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="90" y="50" width="20" height="25" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="85" y="40" width="30" height="10" rx="2" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="100" y1="40" x2="100" y2="25" stroke="${STROKE}" stroke-width="3"/>
      <rect x="85" y="135" width="30" height="6" fill="${SOFT}"/>`,

    /* 16 - Mane Floor Lamp */
    16: () => `
      <line x1="55" y1="170" x2="55" y2="80"  stroke="${STROKE}" stroke-width="3"/>
      <path d="M55 80 Q75 30 130 35" stroke="${STROKE}" stroke-width="3" fill="none"/>
      <path d="M115 30 L155 40 L145 70 L105 60 Z" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <ellipse cx="55" cy="172" rx="22" ry="5" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>`,

    /* 17 - Stjarna Pendant */
    17: () => `
      <line x1="100" y1="20" x2="100" y2="60" stroke="${STROKE}" stroke-width="2"/>
      <path d="M60 60 L140 60 L120 130 L80 130 Z" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="60"  y1="60" x2="80"  y2="130" stroke="${STROKE}" stroke-width="2"/>
      <line x1="140" y1="60" x2="120" y2="130" stroke="${STROKE}" stroke-width="2"/>
      <line x1="100" y1="60" x2="100" y2="130" stroke="${STROKE}" stroke-width="2" stroke-dasharray="3 3"/>`,

    /* 18 - Ljus Table Lamp */
    18: () => `
      <path d="M65 90 L135 90 L120 150 L80 150 Z" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="92" y="150" width="16" height="10" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <ellipse cx="100" cy="165" rx="30" ry="6" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="80" y1="90" x2="120" y2="90" stroke="${STROKE}" stroke-width="2"/>`,

    /* 19 - Mys Armchair */
    19: () => `
      <rect x="50" y="55" width="100" height="80" rx="10" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="55" y="100" width="90" height="40" rx="6" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="40" y="95" width="14" height="48" rx="4" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <rect x="146" y="95" width="14" height="48" rx="4" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="55"  y1="143" x2="55"  y2="160" stroke="${STROKE}" stroke-width="3"/>
      <line x1="145" y1="143" x2="145" y2="160" stroke="${STROKE}" stroke-width="3"/>`,

    /* 20 - Kniv Knife Block */
    20: () => `
      <path d="M50 70 L150 70 L160 160 L40 160 Z" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
      <line x1="70"  y1="70" x2="70"  y2="20" stroke="${STROKE}" stroke-width="3"/>
      <line x1="90"  y1="70" x2="90"  y2="30" stroke="${STROKE}" stroke-width="3"/>
      <line x1="110" y1="70" x2="110" y2="25" stroke="${STROKE}" stroke-width="3"/>
      <line x1="130" y1="70" x2="130" y2="35" stroke="${STROKE}" stroke-width="3"/>
      <rect x="64" y="18" width="12" height="10" fill="${STROKE}"/>
      <rect x="84" y="28" width="12" height="10" fill="${STROKE}"/>
      <rect x="104" y="23" width="12" height="10" fill="${STROKE}"/>
      <rect x="124" y="33" width="12" height="10" fill="${STROKE}"/>`,
  };

  const VIEW_LABELS = ['Front view', 'Side angle', 'Detail'];

  /* Build SVG markup for a product + view (0/1/2). */
  function svgFor(product, view = 0) {
    const draw = SHAPES[product.id] || SHAPES[1];
    let viewBox = '0 0 200 200';
    let transform = '';
    if (view === 1) {
      // mirror + slight scale = believable other-side angle
      transform = 'translate(200,0) scale(-1,1) rotate(-4 100 100)';
    } else if (view === 2) {
      // crop in for a detail view
      viewBox = '50 50 100 100';
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g transform="${transform}">${draw()}</g>
    </svg>`;
  }

  function viewLabel(i) { return VIEW_LABELS[i] || `View ${i + 1}`; }

  window.NORDHEM = window.NORDHEM || {};
  NORDHEM.Illustrations = { svgFor, viewLabel, VIEW_COUNT: 3 };
})();
