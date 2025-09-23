#!/usr/bin/env node

/**
 * Create sample/placeholder images for ALL quickstarts
 * This creates simple colored rectangles as placeholders until real AI images are generated
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public/images/quickstarts');
const PROMPTS_FILE = path.join(__dirname, 'generated-image-prompts.json');

// Read the generated prompts to get the quickstart IDs
const prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));

// Color schemes for different categories
const colorSchemes = {
  'Python': ['#3776ab', '#ffd343'], // Python blue and yellow
  'AI': ['#8a2be2', '#00ffff'], // Purple and cyan
  'JavaScript': ['#f7df1e', '#323330'], // Yellow and black
  'TypeScript': ['#007acc', '#ffffff'], // Blue and white
  'OpenShift': ['#ee0000', '#ffffff'], // Red and white
  'RHOAI': ['#ee0000', '#007acc'], // Red and blue
  'Jupyter Notebook': ['#f37626', '#4e4e4e'], // Orange and gray
  'Smarty': ['#ffd700', '#4169e1'] // Gold and blue
};

// Create SVG placeholder for each quickstart
console.log(`🎨 Creating placeholder images for all ${prompts.length} quickstarts...\n`);

prompts.forEach((prompt, index) => {
  const category = prompt.categories?.[0] || 'AI';
  const colors = colorSchemes[category] || colorSchemes['AI'];
  const primaryColor = colors[0];
  const secondaryColor = colors[1];
  
  // Generate different patterns for visual variety
  const patterns = [
    // Geometric shapes pattern
    `<rect width="60" height="60" x="50" y="50" fill="${primaryColor}" rx="8"/>
     <rect width="120" height="20" x="130" y="60" fill="${primaryColor}" opacity="0.7" rx="4"/>
     <rect width="80" height="15" x="130" y="90" fill="${primaryColor}" opacity="0.5" rx="3"/>
     <circle cx="300" cy="80" r="30" fill="${primaryColor}" opacity="0.4"/>
     <rect width="40" height="40" x="280" y="130" fill="${primaryColor}" opacity="0.6" rx="6"/>`,
    
    // Neural network pattern
    `<circle cx="80" cy="70" r="15" fill="${primaryColor}" opacity="0.8"/>
     <circle cx="180" cy="50" r="12" fill="${primaryColor}" opacity="0.6"/>
     <circle cx="180" cy="90" r="12" fill="${primaryColor}" opacity="0.6"/>
     <circle cx="280" cy="70" r="15" fill="${primaryColor}" opacity="0.8"/>
     <line x1="95" y1="70" x2="165" y2="50" stroke="${primaryColor}" stroke-width="2" opacity="0.4"/>
     <line x1="95" y1="70" x2="165" y2="90" stroke="${primaryColor}" stroke-width="2" opacity="0.4"/>
     <line x1="192" y1="50" x2="265" y2="70" stroke="${primaryColor}" stroke-width="2" opacity="0.4"/>
     <line x1="192" y1="90" x2="265" y2="70" stroke="${primaryColor}" stroke-width="2" opacity="0.4"/>`,
    
    // Data flow pattern
    `<rect width="80" height="40" x="50" y="50" fill="${primaryColor}" opacity="0.7" rx="6"/>
     <polygon points="150,70 170,60 170,80" fill="${primaryColor}" opacity="0.8"/>
     <rect width="80" height="40" x="190" y="50" fill="${primaryColor}" opacity="0.7" rx="6"/>
     <polygon points="290,70 310,60 310,80" fill="${primaryColor}" opacity="0.8"/>
     <rect width="60" height="60" x="150" y="120" fill="${primaryColor}" opacity="0.5" rx="8"/>`,
    
    // Architecture pattern
    `<rect width="100" height="30" x="50" y="50" fill="${primaryColor}" opacity="0.8" rx="4"/>
     <rect width="100" height="30" x="180" y="50" fill="${primaryColor}" opacity="0.6" rx="4"/>
     <rect width="100" height="30" x="50" y="100" fill="${primaryColor}" opacity="0.6" rx="4"/>
     <rect width="100" height="30" x="180" y="100" fill="${primaryColor}" opacity="0.8" rx="4"/>
     <rect width="120" height="20" x="140" y="150" fill="${primaryColor}" opacity="0.4" rx="4"/>`
  ];
  
  const patternIndex = index % patterns.length;
  const selectedPattern = patterns[patternIndex];
  
  const svgContent = `<svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <rect width="400" height="225" fill="url(#grad${index})"/>
  <rect width="380" height="205" x="10" y="10" fill="${primaryColor}" opacity="0.1" rx="8"/>
  ${selectedPattern}
  <text x="50" y="190" font-family="Arial, sans-serif" font-size="12" fill="${primaryColor}" opacity="0.6" font-weight="bold">${category}</text>
</svg>`;
  
  const fileName = `${prompt.id}.svg`;
  const filePath = path.join(IMAGES_DIR, fileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created ${String(index + 1).padStart(2, ' ')}/17: ${fileName} (${category})`);
});

console.log(`\n🎉 Created placeholder images for all ${prompts.length} quickstarts!`);
console.log('🔄 Now run: node scripts/generate-quickstart-images.js --save');
