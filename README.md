# Red Hat AI Kickstarts Application

A React-based web application for managing and viewing Red Hat AI Kickstarts.

## Local Development

### Prerequisites

- [Podman](https://podman.io/) (for containerized development)
- [Git](https://git-scm.com/)
- A GitHub Personal Access Token (Classic) with the following permissions:
  - `read:org` - to read organization repositories
  - `repo` - to read repository contents
  - `read:user` - to read user information

To create a token:
1. Go to GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "AI Kickstarts App"
4. Select the permissions listed above
5. Click "Generate token"
6. Copy the token immediately (you won't be able to see it again)

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

4. Set up your GitHub token:
   ```bash
   # Create a .env file in the project root with your token
   echo "REACT_APP_GH_TOKEN=ghp_your_token_here" > .env
   ```

5. Run the development container with your local directory mounted and node_modules in a volume:
   ```bash
   # First, install dependencies
   podman run --rm \
     -v "$(pwd)/src:/app/src:Z" \
     -v "$(pwd)/public:/app/public:Z" \
     -v "$(pwd)/package.json:/app/package.json:Z" \
     -v "$(pwd)/.env:/app/.env:Z" \
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
     -v "$(pwd)/.env:/app/.env:Z" \
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

# Then repeat steps 2-5 above
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

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.