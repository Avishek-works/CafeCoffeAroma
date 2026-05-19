function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}

function srgbToLinear(c) {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(hexA, hexB) {
  const L1 = luminance(hexA);
  const L2 = luminance(hexB);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

const palette = {
  'bg-primary': '#2B2014',
  'bg-surface': '#1E160D',
  'bg-elevated': '#21180F',
  'text-primary': '#FFFFFF',
  'text-secondary': '#D9C9A6',
  'text-tertiary': '#B8A68A',
  'accent-gold': '#FCB03A',
};

const pairs = [
  ['text-primary', 'bg-primary'],
  ['text-primary', 'bg-surface'],
  ['text-secondary', 'bg-primary'],
  ['text-secondary', 'bg-surface'],
  ['text-tertiary', 'bg-elevated'],
  ['accent-gold', 'bg-surface'],
];

function check(c) {
  return {
    'contrast': Math.round(c*100)/100,
    'AA_normal': c >= 4.5,
    'AA_large': c >= 3.0,
    'AAA_normal': c >= 7.0
  };
}

const results = pairs.map(([fg,bg]) => {
  const ratio = contrastRatio(palette[fg], palette[bg]);
  const res = check(ratio);
  return { fg, bg, fg_hex: palette[fg], bg_hex: palette[bg], ...res };
});

console.log(JSON.stringify(results, null, 2));
