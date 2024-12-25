export const BRANCH_ADDRESS = "94 Hamlets WayBow, London E3 4SY, UK";
export const SITE_ADDRESS = "www.citysparke3.co.uk";

const generatePlaceholderSVG = () => `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc" />
      <stop offset="100%" style="stop-color:#f1f5f9" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  
  <!-- Product box icon -->
  <path d="M160 140 L240 140 L260 170 L140 170 Z" fill="#cbd5e1"/>
  <path d="M150 170 L250 170 L240 280 L160 280 Z" fill="#cbd5e1"/>
  
  <!-- Camera icon -->
  <circle cx="200" cy="200" r="30" fill="#94a3b8" fill-opacity="0.6"/>
  <circle cx="200" cy="200" r="20" fill="none" stroke="#94a3b8" stroke-width="4"/>
  <circle cx="215" cy="185" r="5" fill="#94a3b8"/>
  
  <!-- "No Image" text -->
  <text 
    x="200" 
    y="320" 
    font-family="system-ui, sans-serif" 
    font-size="14" 
    fill="#64748b"
    text-anchor="middle"
  >No image available</text>
</svg>
`;

// Convert SVG to base64
export const BLUR_DATA_URL = `data:image/svg+xml;base64,${Buffer.from(
  generatePlaceholderSVG()
).toString("base64")}`;
