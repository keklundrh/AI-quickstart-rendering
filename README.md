# Red Hat AI Kickstarts Application

A React-based web application for managing and viewing Red Hat AI Kickstarts.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Podman](https://podman.io/) (for containerized development)
- [Git](https://git-scm.com/)

### Option 1: Local Development (Direct)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/red-hat-kickstarts-app.git
   cd red-hat-kickstarts-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

### Option 2: Containerized Development (Podman)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/red-hat-kickstarts-app.git
   cd red-hat-kickstarts-app
   ```

2. Build the development container:
   ```bash
   podman build -t red-hat-kickstarts-dev -f Containerfile.dev .
   ```

3. Create a named volume for development:
   ```bash
   podman volume create red-hat-kickstarts-dev
   ```

4. Copy your project files to the volume:
   ```bash
   podman run --rm \
     -v red-hat-kickstarts-dev:/app \
     -v $(pwd):/source:ro \
     red-hat-kickstarts-dev \
     sh -c "cp -r /source/* /app/"
   ```

5. Run the development container:
   ```bash
   podman run -it --rm \
     -p 3000:3000 \
     -v red-hat-kickstarts-dev:/app \
     -w /app \
     red-hat-kickstarts-dev \
     npm start
   ```

The application will be available at `http://localhost:3000`

Note: If you make changes to your local files and want to update the container, you'll need to repeat step 4 to copy the changes to the volume.

### Containerfile.dev

Create a `Containerfile.dev` in your project root with the following content:

```dockerfile
FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the development server port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
```

## Building for Production

### Local Build

1. Build the application:
   ```bash
   npm run build
   ```

2. The production build will be available in the `build` directory.

### Containerized Build

1. Build the production container:
   ```bash
   podman build -t red-hat-kickstarts-prod -f Containerfile .
   ```

2. Run the production container:
   ```bash
   podman run -it --rm -p 8080:80 red-hat-kickstarts-prod
   ```

The application will be available at `http://localhost:8080`

### Containerfile

Create a `Containerfile` in your project root with the following content:

```dockerfile
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

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