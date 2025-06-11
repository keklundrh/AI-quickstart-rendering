FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Pass the GH_TOKEN from build arg to environment variable
ARG GH_TOKEN
ENV GH_TOKEN=${GH_TOKEN}

RUN npm run build

FROM nginx:alpine

# Create nginx user and group with specific UID/GID
RUN addgroup -g 1002000000 nginx && \
    adduser -u 1002000000 -G nginx -h /home/nginx -D nginx

# Create necessary directories with correct permissions
RUN mkdir -p /tmp/nginx && \
    chown -R nginx:nginx /tmp/nginx && \
    chmod 755 /tmp/nginx

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# Set correct permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]