# Tahap 1: Build Aplikasi Angular
FROM node:20-alpine AS builder

# Instal build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Salin package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependensi dengan npm ci
RUN npm ci --legacy-peer-deps

# Salin seluruh kode sumber
COPY . .

# Build konfigurasi
RUN npm run build

# Tahap 2: Menyajikan aplikasi dengan Nginx
FROM nginx:1.25-alpine

# Hapus konfigurasi default Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Salin konfigurasi Nginx yang disederhanakan
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build dari tahap builder
COPY --from=builder /app/dist/frontend-projek-sertifikat-berbasis-web/browser /usr/share/nginx/html/server

# Salin entrypoint.sh untuk menginject API_URL
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Ekspos port 8080
EXPOSE 8080

# Gunakan entrypoint.sh sebagai command
CMD ["./entrypoint.sh"]