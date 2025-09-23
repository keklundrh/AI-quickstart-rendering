# AI Image Generation for Quickstart Cards

This document describes the process for generating AI-powered images for quickstart cards to enhance the visual appeal and user experience of the AI Quickstarts application.

## Overview

The image generation system creates contextual, technical illustrations for each quickstart based on:
- Quickstart title and description
- Technical categories and keywords
- Content analysis from README previews
- Color schemes matching the technology stack

## Process Flow

### 1. Generate Prompts
```bash
# Generate AI image prompts for all quickstarts
node scripts/generate-quickstart-images.js

# Review and customize prompts interactively
node scripts/generate-quickstart-images.js --review
```

### 2. Create Images with AI Tools
Use the generated prompts with your preferred AI image generator:

**Recommended Tools:**
- **DALL-E 3** (via ChatGPT Plus) - Best for technical illustrations
- **Midjourney** - High quality, artistic results
- **Stable Diffusion** - Free, customizable
- **Adobe Firefly** - Commercial-safe, integrated

**Recommended Settings:**
- **Aspect Ratio:** 16:9 (120x68px displayed size)
- **Resolution:** 1024x576 or higher
- **Style:** Professional/Technical illustration
- **Format:** PNG with transparency support

### 3. Save and Update Data
```bash
# After generating images, update the data structure
node scripts/generate-quickstart-images.js --save
```

## File Structure

```
public/images/quickstarts/
├── spending-transaction-monitor.png
├── ai-architecture-charts.png
├── RAG.png
└── ...

generated-image-prompts.json          # Generated prompts
generated-image-prompts-reviewed.json # Reviewed prompts (if using --review)
```

## Generated Prompts

The script automatically analyzes each quickstart and generates contextual prompts:

### Example: RAG Quickstart
```
Create a modern, minimalist technical illustration for "RAG". 
Use blue and yellow tech colors with a clean, professional design suitable for a tech card. 
Include visual elements representing: large language model, neural network, document retrieval, knowledge base, vector database. 
Style: flat design, geometric shapes, subtle gradients, enterprise software aesthetic. 
Avoid text, people, or complex details. 16:9 aspect ratio, card-friendly composition.
```

### Prompt Generation Logic

1. **Content Analysis:**
   - Extracts keywords from title, description, and README preview
   - Identifies AI/ML concepts (LLM, RAG, embeddings, agents, etc.)
   - Detects technical patterns (architecture, pipelines, monitoring, etc.)

2. **Color Scheme Selection:**
   - Python: Blue and yellow tech colors
   - AI: Purple and cyan futuristic colors
   - TypeScript: Blue and white modern colors
   - JavaScript: Yellow and black tech colors
   - OpenShift: Red and white enterprise colors
   - RHOAI: Red and blue gradient colors

3. **Visual Elements:**
   - Geometric shapes and clean lines
   - Technology-specific iconography
   - Enterprise-appropriate aesthetics
   - Card-friendly compositions

## UI Integration

Images are displayed in the KickstartCard component:
- **Position:** Right side between title and description
- **Size:** 120x68 pixels (16:9 aspect ratio)
- **Styling:** Rounded corners, subtle shadow, bordered
- **Fallback:** Hidden if image fails to load

### Data Structure
Each quickstart record includes:
```json
{
  "id": "rag",
  "title": "RAG",
  "description": "...",
  "generatedImage": "images/quickstarts/rag.png",
  "imageGenerated": true,
  ...
}
```

## Quality Guidelines

### Image Requirements
- **Professional:** Clean, enterprise-appropriate design
- **Contextual:** Visually represents the quickstart's purpose
- **Consistent:** Follows established color schemes and styles
- **Accessible:** Clear visual hierarchy, good contrast
- **Scalable:** Looks good at small card sizes

### Content Guidelines
- **No Text:** Images should be purely visual
- **No People:** Focus on concepts and technology
- **Abstract:** Use geometric shapes, not literal representations
- **Modern:** Contemporary design aesthetic
- **Branded:** Consistent with Red Hat/AI theme

## Review Process

### 1. Generated Prompts Review
```bash
node scripts/generate-quickstart-images.js --review
```
- Review each generated prompt
- Edit prompts for better results
- Skip quickstarts that don't need images
- Save customized prompts for generation

### 2. Image Quality Review
- Verify images match quickstart content
- Ensure consistent visual style
- Check image quality and resolution
- Validate accessibility and contrast

### 3. Production Deployment
- Test images in development environment
- Verify all images load correctly
- Check responsive behavior
- Deploy to production

## Maintenance

### Adding New Quickstarts
1. New quickstarts are automatically detected
2. Run prompt generation script
3. Generate images for new quickstarts
4. Update data structure with `--save` flag

### Updating Existing Images
1. Delete existing image files
2. Regenerate prompts if content changed
3. Create new images with updated prompts
4. Re-run `--save` to update data structure

### Batch Operations
```bash
# Generate all prompts
node scripts/generate-quickstart-images.js

# Review specific quickstarts
node scripts/generate-quickstart-images.js --review

# Update data after generating images
node scripts/generate-quickstart-images.js --save
```

## Technical Details

### Image Processing
- Images are served directly from `/public/images/quickstarts/`
- No runtime image processing required
- Automatic fallback for missing images
- Optimized for web delivery

### Performance
- Small image sizes (120x68px displayed)
- Lazy loading not implemented (small images load quickly)
- Cached by browser after first load
- No impact on initial page load time

### Browser Support
- Modern browsers with CSS flexbox support
- Graceful degradation for older browsers
- Images hidden if loading fails

## Troubleshooting

### Common Issues

**Images not displaying:**
1. Check file paths in `kickstarts.json`
2. Verify images exist in `/public/images/quickstarts/`
3. Check browser console for loading errors

**Prompt generation fails:**
1. Verify `kickstarts.json` is valid JSON
2. Check Node.js version compatibility
3. Ensure script has read/write permissions

**Image quality issues:**
1. Use higher resolution source images
2. Verify 16:9 aspect ratio maintained
3. Check compression settings in AI tool

### Support

For technical issues or questions about the image generation system:
1. Check the generated prompt files for debugging
2. Review browser console for JavaScript errors
3. Verify file permissions and paths
4. Test with a single quickstart first

---

*This system enhances the visual appeal of quickstart cards while maintaining consistency and professional appearance across all AI quickstarts.*
