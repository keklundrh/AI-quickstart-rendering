#!/usr/bin/env node

/**
 * Create sample/placeholder images for testing the image display system
 * This creates simple colored rectangles as placeholders until real AI images are generated
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public/images/quickstarts');
const PROMPTS_FILE = path.join(__dirname, 'generated-image-prompts.json');

// Read the generated prompts to get the quickstart IDs
const prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));

// Create simple SVG placeholder for each quickstart
prompts.slice(0, 3).forEach((prompt, index) => { // Just create 3 samples for demo
  const colors = ['#4285f4', '#34a853', '#fbbc04']; // Google colors for variety
  const color = colors[index % colors.length];
  
  const svgContent = `<svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="225" fill="${color}" opacity="0.1"/>
  <rect width="380" height="205" x="10" y="10" fill="${color}" opacity="0.3" rx="8"/>
  <rect width="60" height="60" x="50" y="50" fill="${color}" rx="8"/>
  <rect width="120" height="20" x="130" y="60" fill="${color}" opacity="0.7" rx="4"/>
  <rect width="80" height="15" x="130" y="90" fill="${color}" opacity="0.5" rx="3"/>
  <circle cx="300" cy="80" r="30" fill="${color}" opacity="0.4"/>
  <rect width="40" height="40" x="280" y="130" fill="${color}" opacity="0.6" rx="6"/>
  <text x="50" y="180" font-family="Arial, sans-serif" font-size="14" fill="${color}" opacity="0.8">AI Quickstart</text>
</svg>`;
  
  const fileName = `${prompt.id}.svg`;
  const filePath = path.join(IMAGES_DIR, fileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created sample image: ${fileName}`);
});

console.log('\n🎯 Sample images created! Run the save command to update data structure.');
