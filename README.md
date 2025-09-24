# Red Hat AI Quickstarts Showcase

A showcase of AI kickstart examples for Red Hat OpenShift AI, featuring beautiful AI-generated illustrations and detailed documentation for each quickstart project.

## 🌐 Live Demo

**Production**: [https://keklundrh.github.io/AI-quickstart-rendering](https://keklundrh.github.io/AI-quickstart-rendering)

**Development**: `http://localhost:3000/quickstart`

## 📋 Features

- **Interactive Gallery**: Browse AI quickstarts with visual cards
- **AI-Generated Illustrations**: Custom SVG images for each quickstart
- **Detailed Views**: Rich markdown documentation with images
- **Search & Filter**: Find quickstarts by categories, topics, and keywords
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Red Hat Branding**: Consistent with Red Hat design standards
- **GitHub Integration**: Live repository stats and direct GitHub links

## 🚀 Quick Start

### Development

```bash
# Clone the repository
git clone https://github.com/keklundrh/AI-quickstart-rendering.git
cd AI-quickstart-rendering

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:3000/quickstart` to view the app.

### Production Build

```bash
# Build for production
npm run build

# The build folder contains the production-ready files
```

## 📦 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using the `gh-pages` package.

### Prerequisites

- Repository with GitHub Pages enabled
- `gh-pages` branch configured as the source in repository settings
- Write permissions to the repository

### One-Command Deployment

```bash
npm run deploy
```

This command will:
1. Build the React application (`npm run build`)
2. Deploy the `build` folder to the `gh-pages` branch
3. Push to GitHub, triggering GitHub Pages to update

### Deployment Configuration

The deployment is configured in `package.json`:

```json
{
  "homepage": "https://keklundrh.github.io/AI-quickstart-rendering",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Environment-Specific Paths

The app automatically adjusts paths based on the environment:

- **Development**: Uses `/quickstart` base path
- **Production**: Uses `/AI-quickstart-rendering` base path (repository name)

This is handled in `src/api/kickstarts.js`:

```javascript
export const BASE_PATH = process.env.NODE_ENV === 'production' 
  ? '/AI-quickstart-rendering' 
  : '/quickstart';
```

### GitHub Pages Settings

Ensure your repository settings are configured correctly:

1. Go to **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages`
4. **Folder**: `/ (root)`

## 🛠️ Available Scripts

### Development Scripts

- `npm start` - Start development server
- `npm run dev` - Complete development setup (clean + install + start)
- `npm test` - Run test suite
- `npm run lint` - Check code quality

### Build Scripts

- `npm run build` - Build for production
- `npm run build:local` - Clean build with fresh dependencies
- `npm run predeploy` - Pre-deployment build (runs automatically)

### Deployment Scripts

- `npm run deploy` - Deploy to GitHub Pages
- `npm run generate-static` - Generate static content and images

### Utility Scripts

- `npm run clean` - Clean build artifacts
- `npm run setup` - Complete project setup (clean + fresh install)

## 📁 Project Structure

```
AI-quickstart-rendering/
├── public/
│   ├── data/
│   │   └── kickstarts.json          # Quickstart data
│   ├── images/
│   │   └── quickstarts/             # AI-generated SVG images
│   └── index.html
├── src/
│   ├── api/
│   │   └── kickstarts.js            # Data fetching and API
│   ├── components/
│   │   ├── Details.js               # Quickstart detail pages
│   │   ├── KickstartCard.js         # Gallery cards
│   │   ├── MainView.js              # Main gallery view
│   │   └── SearchToolbar.js         # Search and filter UI
│   ├── styles/
│   │   └── patternfly-custom.css    # Custom PatternFly styles
│   └── App.js                       # Main application component
├── scripts/
│   └── generate-quickstart-images.js # Image generation script
└── package.json
```

## 🎨 Design System

The application uses:
- **PatternFly 5**: Red Hat's design system
- **Red Hat Brand Colors**: Official Red Hat red (`#EE0000`)
- **Custom Typography**: Red Hat Display and Red Hat Text fonts
- **Responsive Grid**: CSS Grid and Flexbox layouts

## 🔧 Configuration

### Base Path Configuration

The application supports different base paths for development and production:

```javascript
// Development: /quickstart
// Production: /AI-quickstart-rendering
```

### Data Source

Quickstart data is loaded from `public/data/kickstarts.json` and includes:
- Project metadata (title, description, categories)
- GitHub repository information
- Generated image paths
- README content for detail views

### Image Assets

AI-generated SVG illustrations are stored in `public/images/quickstarts/` and automatically linked to their respective quickstarts.

## 🚀 Deployment Workflow

1. **Develop Locally**: Make changes and test at `localhost:3000/quickstart`
2. **Build**: Run `npm run build` to create production build
3. **Deploy**: Run `npm run deploy` to publish to GitHub Pages
4. **Verify**: Check the live site at the GitHub Pages URL

## 🔄 Updating Content

To update quickstarts:

1. Modify `public/data/kickstarts.json`
2. Add/update images in `public/images/quickstarts/`
3. Deploy changes with `npm run deploy`

## 🐛 Troubleshooting

### Deployment Issues

- **Build Fails**: Check for linting errors with `npm run lint`
- **Paths Not Working**: Verify `BASE_PATH` configuration
- **Images Missing**: Ensure images exist in `public/images/quickstarts/`

### Development Issues

- **Port In Use**: The development server uses port 3000 by default
- **Cache Issues**: Clear browser cache or use incognito mode
- **API Errors**: Check browser console for fetch errors

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- **Red Hat**: For the design system and branding guidelines
- **PatternFly**: For the comprehensive UI component library
- **React**: For the powerful frontend framework
- **GitHub Pages**: For free and reliable hosting

---

**Made with ❤️ for the Red Hat AI community**