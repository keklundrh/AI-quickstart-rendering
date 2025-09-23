# Red Hat AI Kickstarts Application

A React-based web application for managing and viewing Red Hat AI Kickstarts.

## Features

- **Search**: Search kickstarts by title, description, categories, or topics
- **Category Filtering**: Filter kickstarts by multiple categories
- **Topic Filtering**: Filter kickstarts by GitHub repository topics
- **Real-time Updates**: Automatic background refresh of data
- **Responsive Design**: Works on desktop and mobile devices

## Local Development

### Prerequisites

- [Podman](https://podman.io/) (for containerized development)
- [Git](https://git-scm.com/)

### Development with Podman (Recommended)

This approach uses Podman to provide a Node.js environment without installing Node.js locally. Your local files are mounted directly into the container, with node_modules in a separate volume for better performance.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/red-hat-kickstarts-app.git
   cd red-hat-kickstarts-app
   ```

2. Create a volume for node_modules:
   ```bash
   podman volume create red-hat-kickstarts-node-modules
   ```

3. Build the development container (with no cache):
   ```bash
   podman build --no-cache -t red-hat-kickstarts-dev -f Containerfile.dev .
   ```

4. Run the development container with your local directory mounted and node_modules in a volume:
   ```bash
   # First, install dependencies
   podman run --rm \
     -v "$(pwd)/src:/app/src:Z" \
     -v "$(pwd)/public:/app/public:Z" \
     -v "$(pwd)/package.json:/app/package.json:Z" \
     -v red-hat-kickstarts-node-modules:/app/node_modules \
     -w /app \
     red-hat-kickstarts-dev \
     npm install

   # Then start the development server
   podman run -it --rm \
     -p 3000:3000 \
     -v "$(pwd)/src:/app/src:Z" \
     -v "$(pwd)/public:/app/public:Z" \
     -v "$(pwd)/package.json:/app/package.json:Z" \
     -v red-hat-kickstarts-node-modules:/app/node_modules \
     -w /app \
     red-hat-kickstarts-dev \
     npm start
   ```

The application will be available at `http://localhost:3000`. Any changes you make to your local files will be immediately reflected in the container, and the development server will automatically reload.

If you need to clean up and start fresh:
```bash
# Remove the node_modules volume
podman volume rm red-hat-kickstarts-node-modules

# Remove the development image
podman rmi red-hat-kickstarts-dev

# Then repeat steps 2-4 above
```

### Containerfile.dev

Create a `Containerfile.dev` in your project root with the following content:

```dockerfile
FROM node:18

WORKDIR /app

# Create a volume for node_modules
VOLUME /app/node_modules

# Install dependencies
COPY package*.json ./
RUN npm install

# Expose the development server port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
```

## Building for Production

If you need to build the application for production, you can use the same container:

```bash
podman run --rm \
  -v "$(pwd)/src:/app/src:Z" \
  -v "$(pwd)/public:/app/public:Z" \
  -v "$(pwd)/package.json:/app/package.json:Z" \
  -v "$(pwd)/.env:/app/.env:Z" \
  -v red-hat-kickstarts-node-modules:/app/node_modules \
  -w /app \
  red-hat-kickstarts-dev \
  npm run build
```

The production build will be available in the `build` directory on your local machine.

## Deployment

This application is automatically deployed to GitHub Pages using GitHub Actions. The deployment process:

1. Main branch (`main`): Deploys to the root URL
2. Feature branches: Deploys to preview URLs under `/previews/<branch-name>`

### Deployment URLs

- Main branch: `https://<username>.github.io/red-hat-kickstarts-app/`
- Preview branches: `https://<username>.github.io/red-hat-kickstarts-app/previews/<branch-name>/`

## Development Setup

This project uses Node.js 20.x. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.

### Prerequisites

1. Install nvm (Node Version Manager):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. Install the correct Node.js version:
   ```bash
   nvm install
   nvm use
   ```

### Development Workflow

1. Initial setup:
   ```bash
   npm run setup
   ```
   This will:
   - Clean up any empty directories
   - Remove existing node_modules
   - Clear npm cache
   - Install dependencies using `npm ci` (same as CI)

2. Start development server:
   ```bash
   npm run dev
   ```
   This runs the setup and starts the development server.

3. Build locally (same as CI):
   ```bash
   npm run build:local
   ```
   This runs the same build process as CI, including:
   - Clean setup
   - Generate static data
   - Production build with verbose logging

### Available Scripts

- `npm run setup` - Clean install of dependencies (same as CI)
- `npm run dev` - Start development server
- `npm run build:local` - Build locally (same as CI)
- `npm run generate-static` - Generate static data
- `npm run clean` - Clean up empty directories
- `npm start` - Start development server (without setup)
- `npm run build` - Build without setup
- `npm test` - Run tests
- `npm run eject` - Eject from create-react-app

## 🎨 AI-Generated Quickstart Card Images

This application features AI-generated images for each quickstart card to enhance visual appeal and user experience. Each quickstart displays a professional, contextual illustration below the title.

### Current Status

✅ **All 17 quickstart cards have images** (currently using attractive placeholder graphics)  
✅ **Custom AI prompts generated** for each quickstart based on content analysis  
✅ **Production-ready system** for managing and updating images  

### Generating Real AI Images

#### 1. Review Generated Prompts
```bash
# View all AI prompts tailored for each quickstart
cat generated-image-prompts.json

# Or view them formatted
node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync('generated-image-prompts.json', 'utf8')), null, 2))"
```

#### 2. Customize Individual Prompts (Optional)
```bash
# Interactive review mode - edit prompts before generating images
node scripts/generate-quickstart-images.js --review
```

This allows you to:
- Review each generated prompt
- Edit prompts for specific quickstarts
- Skip quickstarts that don't need custom images
- Save customized prompts for generation

#### 3. Generate Images with AI Tools
Use the prompts with your preferred AI image generator:

**Recommended Tools:**
- **DALL-E 3** (via ChatGPT Plus) - Best for technical illustrations
- **Midjourney** - High quality, artistic results  
- **Stable Diffusion** - Free, customizable
- **Adobe Firefly** - Commercial-safe, integrated

**Recommended Settings:**
- **Aspect Ratio:** 16:9 
- **Resolution:** 1024x576px or higher
- **Style:** Professional/Technical illustration
- **Format:** PNG with transparency support

**Example Prompt (RAG quickstart):**
> Create a modern, minimalist technical illustration for "RAG". Use blue and yellow tech colors with a clean, professional design suitable for a tech card. Include visual elements representing: large language model, neural network, document retrieval, knowledge base, vector database. Style: flat design, geometric shapes, subtle gradients, enterprise software aesthetic. Avoid text, people, or complex details. 16:9 aspect ratio, card-friendly composition.

#### 4. Save Images and Update System
```bash
# Place generated images in the correct directory
# File naming: {quickstart-id}.png
ls public/images/quickstarts/
# Should contain files like: RAG.png, spending-transaction-monitor.png, etc.

# Update the data structure with new images
node scripts/generate-quickstart-images.js --save
```

### Image Specifications

- **Display Size:** 240x135 pixels (left-aligned below title)
- **Source Resolution:** 1024x576px+ recommended  
- **Aspect Ratio:** 16:9 (maintained automatically)
- **Format:** PNG preferred, SVG supported
- **Style:** Professional technical illustrations with category-based color schemes

### File Structure
```
public/images/quickstarts/
├── spending-transaction-monitor.png
├── ai-architecture-charts.png  
├── RAG.png
└── ...

generated-image-prompts.json          # AI prompts for each quickstart
generated-image-prompts-reviewed.json # Customized prompts (if using --review)
scripts/generate-quickstart-images.js # Main generation tool
docs/AI_IMAGE_GENERATION.md          # Detailed technical documentation
```

### Adding Images for New Quickstarts

When new quickstarts are added to the system:

1. **Generate prompts:**
   ```bash
   node scripts/generate-quickstart-images.js
   ```

2. **Create images using the generated prompts**

3. **Update system:**
   ```bash
   node scripts/generate-quickstart-images.js --save
   ```

### Troubleshooting

**Images not displaying:**
- Check file paths in `public/data/kickstarts.json`
- Verify images exist in `public/images/quickstarts/`
- Check browser console for loading errors

**Need to regenerate prompts:**
```bash
# Delete existing prompts and regenerate
rm generated-image-prompts.json
node scripts/generate-quickstart-images.js
```

For detailed technical documentation, see `docs/AI_IMAGE_GENERATION.md`.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.