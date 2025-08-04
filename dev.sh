#!/bin/bash

# Red Hat AI Kickstarts - Development Script
# This script helps run the application using Podman

set -e

VOLUME_NAME="red-hat-kickstarts-node-modules"
IMAGE_NAME="red-hat-kickstarts-dev"
CONTAINER_NAME="red-hat-kickstarts-dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if podman is installed
check_podman() {
    if ! command -v podman &> /dev/null; then
        print_error "Podman is not installed. Please install Podman first."
        exit 1
    fi
    print_success "Podman is available"
}

# Function to check if Containerfile.dev exists
check_containerfile() {
    if [ ! -f "Containerfile.dev" ]; then
        print_error "Containerfile.dev not found. Please ensure you're in the project root."
        exit 1
    fi
}

# Function to create volume if it doesn't exist
create_volume() {
    if ! podman volume exists $VOLUME_NAME 2>/dev/null; then
        print_status "Creating volume: $VOLUME_NAME"
        podman volume create $VOLUME_NAME
        print_success "Volume created"
    else
        print_status "Volume already exists: $VOLUME_NAME"
    fi
}

# Function to build image
build_image() {
    print_status "Building development image..."
    podman build --no-cache -t $IMAGE_NAME -f Containerfile.dev .
    print_success "Image built successfully"
}

# Function to install dependencies
install_deps() {
    print_status "Installing dependencies..."
    podman run --rm \
        -v "$(pwd)/src:/app/src:Z" \
        -v "$(pwd)/public:/app/public:Z" \
        -v "$(pwd)/package.json:/app/package.json:Z" \
        -v "$(pwd)/package-lock.json:/app/package-lock.json:Z" \
        -v $VOLUME_NAME:/app/node_modules \
        -w /app \
        $IMAGE_NAME \
        npm install
    print_success "Dependencies installed"
}

# Function to start development server
start_dev() {
    print_status "Starting development server..."
    print_status "The application will be available at: http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    echo ""

    podman run -it --rm \
        -p 3000:3000 \
        -v "$(pwd)/src:/app/src:Z" \
        -v "$(pwd)/public:/app/public:Z" \
        -v "$(pwd)/package.json:/app/package.json:Z" \
        -v "$(pwd)/package-lock.json:/app/package-lock.json:Z" \
        -v $VOLUME_NAME:/app/node_modules \
        -w /app \
        $IMAGE_NAME \
        npm start
}

# Function to build for production
build_prod() {
    print_status "Building for production..."
    podman run --rm \
        -v "$(pwd)/src:/app/src:Z" \
        -v "$(pwd)/public:/app/public:Z" \
        -v "$(pwd)/package.json:/app/package.json:Z" \
        -v "$(pwd)/package-lock.json:/app/package-lock.json:Z" \
        -v "$(pwd)/.env:/app/.env:Z" \
        -v $VOLUME_NAME:/app/node_modules \
        -w /app \
        $IMAGE_NAME \
        npm run build
    print_success "Production build completed"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    podman volume rm $VOLUME_NAME 2>/dev/null || true
    podman rmi $IMAGE_NAME 2>/dev/null || true
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "Red Hat AI Kickstarts - Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Initial setup (create volume, build image, install deps)"
    echo "  start     - Start development server"
    echo "  build     - Build for production"
    echo "  install   - Install dependencies only"
    echo "  cleanup   - Remove volumes and images"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup   # First time setup"
    echo "  $0 start   # Start development server"
    echo "  $0 build   # Build for production"
}

# Main script logic
main() {
    case "${1:-start}" in
        "setup")
            check_podman
            check_containerfile
            create_volume
            build_image
            install_deps
            print_success "Setup completed! Run '$0 start' to start the development server."
            ;;
        "start")
            check_podman
            check_containerfile
            create_volume
            start_dev
            ;;
        "build")
            check_podman
            check_containerfile
            create_volume
            build_prod
            ;;
        "install")
            check_podman
            check_containerfile
            create_volume
            install_deps
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"