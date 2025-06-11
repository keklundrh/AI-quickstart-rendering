# Red Hat AI Kickstarts Application

A React-based web application for managing and viewing Red Hat AI Kickstarts.

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

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub
   - A preview deployment will be automatically created
   - The preview URL will be commented on your PR

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.