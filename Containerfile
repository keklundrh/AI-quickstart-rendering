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
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]