export const avatarImage = (label: string, colors: readonly [string, string]) =>
  svgImage(label.slice(0, 2).toUpperCase(), colors, "avatar");

export const artImage = (label: string, colors: readonly [string, string]) =>
  svgImage(label, colors, "art");

function svgImage(label: string, colors: readonly [string, string], variant: "avatar" | "art") {
  const fontSize = variant === "avatar" ? 96 : 46;
  const safeLabel = escapeXml(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><circle cx="620" cy="180" r="160" fill="rgba(255,255,255,.18)"/><circle cx="170" cy="620" r="220" fill="rgba(0,0,0,.18)"/><text x="400" y="430" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700">${safeLabel}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
