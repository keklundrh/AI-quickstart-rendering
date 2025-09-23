#!/usr/bin/env node

/**
 * AI Image Generation Script for Quickstart Cards
 * 
 * This script generates AI images for each quickstart based on their content,
 * allows for audit/review, and saves approved images to the codebase.
 * 
 * Usage:
 *   node scripts/generate-quickstart-images.js [--review] [--save]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const KICKSTARTS_DATA_PATH = path.join(__dirname, '../public/data/kickstarts.json');
const IMAGES_OUTPUT_DIR = path.join(__dirname, '../public/images/quickstarts');
const PROMPTS_OUTPUT_FILE = path.join(__dirname, '../generated-image-prompts.json');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_OUTPUT_DIR)) {
  fs.mkdirSync(IMAGES_OUTPUT_DIR, { recursive: true });
}

// Load quickstarts data
function loadKickstartsData() {
  try {
    const data = JSON.parse(fs.readFileSync(KICKSTARTS_DATA_PATH, 'utf8'));
    return data.kickstarts;
  } catch (error) {
    console.error('Error loading quickstarts data:', error);
    process.exit(1);
  }
}

// Generate AI image prompt based on quickstart content
function generateImagePrompt(quickstart) {
  const { title, description, categories, readmePreview } = quickstart;
  
  // Extract key technical concepts
  const content = `${title} ${description} ${readmePreview || ''}`.toLowerCase();
  const techKeywords = [];
  
  // AI/ML related terms
  if (content.includes('llm') || content.includes('language model') || content.includes('llama')) {
    techKeywords.push('large language model', 'neural network');
  }
  if (content.includes('rag') || content.includes('retrieval')) {
    techKeywords.push('document retrieval', 'knowledge base');
  }
  if (content.includes('vector') || content.includes('embedding')) {
    techKeywords.push('vector database', 'embeddings');
  }
  if (content.includes('chat') || content.includes('conversation')) {
    techKeywords.push('chatbot interface', 'conversation');
  }
  if (content.includes('agent') || content.includes('virtual agent')) {
    techKeywords.push('AI agent', 'automation');
  }
  if (content.includes('observability') || content.includes('monitoring')) {
    techKeywords.push('data analytics', 'monitoring dashboard');
  }
  if (content.includes('architecture') || content.includes('helm') || content.includes('chart')) {
    techKeywords.push('system architecture', 'cloud infrastructure');
  }
  if (content.includes('pipeline') || content.includes('workflow')) {
    techKeywords.push('data pipeline', 'workflow automation');
  }
  if (content.includes('serving') || content.includes('deployment')) {
    techKeywords.push('model serving', 'cloud deployment');
  }
  if (content.includes('tool') || content.includes('mcp')) {
    techKeywords.push('development tools', 'API integration');
  }
  
  // Platform specific
  if (content.includes('openshift') || content.includes('kubernetes')) {
    techKeywords.push('container orchestration', 'cloud platform');
  }
  if (content.includes('jupyter') || content.includes('notebook')) {
    techKeywords.push('data science notebook', 'analytics');
  }
  
  // Color scheme based on category
  const colorSchemes = {
    'Python': 'blue and yellow tech colors',
    'AI': 'purple and cyan futuristic colors',
    'TypeScript': 'blue and white modern colors',
    'JavaScript': 'yellow and black tech colors',
    'OpenShift': 'red and white enterprise colors',
    'RHOAI': 'red and blue gradient colors'
  };
  
  const primaryCategory = categories?.[0] || 'AI';
  const colorScheme = colorSchemes[primaryCategory] || 'blue and purple tech gradient';
  
  // Build comprehensive prompt
  const basePrompt = `Create a modern, minimalist technical illustration for "${title}". `;
  const stylePrompt = `Use ${colorScheme} with a clean, professional design suitable for a tech card. `;
  const contentPrompt = techKeywords.length > 0 
    ? `Include visual elements representing: ${techKeywords.slice(0, 3).join(', ')}. `
    : `Focus on AI and technology themes. `;
  const technicalPrompt = `Style: flat design, geometric shapes, subtle gradients, enterprise software aesthetic. `;
  const constraintsPrompt = `Avoid text, people, or complex details. 16:9 aspect ratio, card-friendly composition.`;
  
  return {
    prompt: basePrompt + stylePrompt + contentPrompt + technicalPrompt + constraintsPrompt,
    title: title,
    id: quickstart.id,
    categories: categories || [],
    keywords: techKeywords.slice(0, 5),
    colorScheme: primaryCategory
  };
}

// Generate all prompts
function generateAllPrompts(quickstarts) {
  console.log('🎨 Generating AI image prompts for all quickstarts...\n');
  
  const prompts = quickstarts.map((quickstart, index) => {
    const promptData = generateImagePrompt(quickstart);
    console.log(`${index + 1}. ${promptData.title}`);
    console.log(`   Keywords: ${promptData.keywords.join(', ')}`);
    console.log(`   Color scheme: ${promptData.colorScheme}`);
    console.log(`   Prompt: ${promptData.prompt.substring(0, 100)}...`);
    console.log('');
    return promptData;
  });
  
  // Save prompts to file for review
  fs.writeFileSync(PROMPTS_OUTPUT_FILE, JSON.stringify(prompts, null, 2));
  console.log(`📝 Prompts saved to: ${PROMPTS_OUTPUT_FILE}`);
  
  return prompts;
}

// Interactive prompt review
async function reviewPrompts(prompts) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('\n🔍 PROMPT REVIEW MODE');
  console.log('Review each generated prompt. You can edit them before generating images.\n');
  
  const reviewedPrompts = [];
  
  for (let i = 0; i < prompts.length; i++) {
    const promptData = prompts[i];
    console.log(`\n--- QUICKSTART ${i + 1}/${prompts.length} ---`);
    console.log(`Title: ${promptData.title}`);
    console.log(`Categories: ${promptData.categories.join(', ')}`);
    console.log(`\nGenerated Prompt:`);
    console.log(promptData.prompt);
    
    const response = await new Promise((resolve) => {
      rl.question('\n[E]dit, [A]ccept, or [S]kip? (e/a/s): ', resolve);
    });
    
    if (response.toLowerCase() === 'e') {
      const customPrompt = await new Promise((resolve) => {
        rl.question('\nEnter your custom prompt: ', resolve);
      });
      reviewedPrompts.push({
        ...promptData,
        prompt: customPrompt,
        reviewed: true,
        customized: true
      });
    } else if (response.toLowerCase() === 'a') {
      reviewedPrompts.push({
        ...promptData,
        reviewed: true,
        customized: false
      });
    } else {
      console.log('Skipped.');
      reviewedPrompts.push({
        ...promptData,
        reviewed: false,
        skipped: true
      });
    }
  }
  
  rl.close();
  
  // Save reviewed prompts
  fs.writeFileSync(PROMPTS_OUTPUT_FILE.replace('.json', '-reviewed.json'), 
    JSON.stringify(reviewedPrompts, null, 2));
  
  return reviewedPrompts;
}

// Generate instructions for AI image creation
function generateImageInstructions(prompts) {
  console.log('\n🖼️  IMAGE GENERATION INSTRUCTIONS');
  console.log('=====================================');
  console.log('\nUse these prompts with your preferred AI image generator:');
  console.log('- DALL-E 3 (via ChatGPT Plus)');
  console.log('- Midjourney');
  console.log('- Stable Diffusion');
  console.log('- Adobe Firefly');
  console.log('\nRecommended settings:');
  console.log('- Aspect ratio: 16:9 or 4:3');
  console.log('- Resolution: 1024x576 or higher');
  console.log('- Style: Professional/Technical illustration\n');
  
  const approvedPrompts = prompts.filter(p => p.reviewed && !p.skipped);
  
  console.log(`\n📋 PROMPTS TO GENERATE (${approvedPrompts.length} images):`);
  console.log('=' .repeat(60));
  
  approvedPrompts.forEach((promptData, index) => {
    console.log(`\n${index + 1}. FILE: ${promptData.id}.png`);
    console.log(`   TITLE: ${promptData.title}`);
    console.log(`   PROMPT: ${promptData.prompt}`);
    console.log('   ' + '-'.repeat(50));
  });
  
  console.log('\n📁 Save generated images as:');
  approvedPrompts.forEach(p => {
    console.log(`   ${p.id}.png`);
  });
  
  console.log(`\n📂 Place images in: ${IMAGES_OUTPUT_DIR}`);
  console.log('\nAfter generating images, run with --save flag to update the data structure.');
}

// Save generated images and update data structure
function saveImagesToData(quickstarts) {
  console.log('\n💾 Scanning for generated images...');
  
  let updatedCount = 0;
  const updatedQuickstarts = quickstarts.map(quickstart => {
    // Check for both PNG and SVG files
    const pngPath = `images/quickstarts/${quickstart.id}.png`;
    const svgPath = `images/quickstarts/${quickstart.id}.svg`;
    const fullPngPath = path.join(__dirname, '../public', pngPath);
    const fullSvgPath = path.join(__dirname, '../public', svgPath);
    
    let imagePath = null;
    let imageType = null;
    
    if (fs.existsSync(fullPngPath)) {
      imagePath = pngPath;
      imageType = 'png';
    } else if (fs.existsSync(fullSvgPath)) {
      imagePath = svgPath;
      imageType = 'svg';
    }
    
    if (imagePath) {
      console.log(`✅ Found ${imageType.toUpperCase()} image for: ${quickstart.title}`);
      updatedCount++;
      return {
        ...quickstart,
        generatedImage: imagePath,
        imageGenerated: true,
        imageType: imageType
      };
    } else {
      console.log(`⏳ No image found for: ${quickstart.title} (looking for ${quickstart.id}.png or ${quickstart.id}.svg)`);
      return quickstart;
    }
  });
  
  if (updatedCount > 0) {
    // Update the main data file
    const originalData = JSON.parse(fs.readFileSync(KICKSTARTS_DATA_PATH, 'utf8'));
    const updatedData = {
      ...originalData,
      lastUpdated: new Date().toISOString(),
      stats: {
        ...originalData.stats,
        generatedImages: updatedCount
      },
      kickstarts: updatedQuickstarts
    };
    
    // Backup original
    fs.writeFileSync(KICKSTARTS_DATA_PATH + '.backup', JSON.stringify(originalData, null, 2));
    
    // Save updated data
    fs.writeFileSync(KICKSTARTS_DATA_PATH, JSON.stringify(updatedData, null, 2));
    
    console.log(`\n🎉 Updated ${updatedCount} quickstart records with generated images!`);
    console.log(`📄 Backup saved to: ${KICKSTARTS_DATA_PATH}.backup`);
  } else {
    console.log('\n⚠️  No generated images found. Generate images first, then run with --save flag.');
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const isReviewMode = args.includes('--review');
  const isSaveMode = args.includes('--save');
  
  console.log('🚀 AI Quickstart Image Generation Tool');
  console.log('=====================================\n');
  
  const quickstarts = loadKickstartsData();
  console.log(`📊 Loaded ${quickstarts.length} quickstarts\n`);
  
  if (isSaveMode) {
    saveImagesToData(quickstarts);
    return;
  }
  
  // Generate prompts
  const prompts = generateAllPrompts(quickstarts);
  
  if (isReviewMode) {
    reviewPrompts(prompts).then(reviewedPrompts => {
      generateImageInstructions(reviewedPrompts);
    });
  } else {
    generateImageInstructions(prompts);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateImagePrompt,
  loadKickstartsData,
  generateAllPrompts
};
