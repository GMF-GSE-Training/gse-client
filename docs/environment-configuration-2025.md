# Environment Configuration 2025 - Angular Update

## Overview

Dokumen ini menjelaskan implementasi environment configuration modern untuk Angular 2025 menggunakan Environment Service pattern dengan runtime configuration, type safety, dan dukungan penuh untuk berbagai skenario development maupun production (termasuk domain, IP address, dan port).

## Architecture

### 1. Environment Service Pattern
- **Centralized Configuration**: Semua environment variables dikelola melalui `EnvironmentService`.
- **Runtime Detection**: Environment detection berdasarkan hostname, port, dan IP (termasuk IP internal/LAN).
- **Type Safety**: Interface definitions untuk semua environment variables.
- **Debug Logging**: Comprehensive logging untuk troubleshooting.
- **Flexible Fallback**: Mendukung domain, IP address, dan custom port.

### 2. Runtime Configuration
- **env.js**: File konfigurasi runtime yang di-load sebelum aplikasi.
- **Fallback Strategy**: Fallback ke build-time environment jika runtime tidak tersedia.
- **Dynamic Loading**: Environment variables dapat diubah tanpa rebuild.
- **Runtime Update**: Mendukung update konfigurasi saat aplikasi sudah jalan (tanpa rebuild) via `window.updateDevConfig` dan `window.updateProductionDomain`.

## Implementation

### Environment Service (`src/app/shared/service/environment.service.ts`)

- Mendukung deteksi otomatis development/production berdasarkan:
  - Hostname: `localhost`, `127.0.0.1`, `0.0.0.0`, dan IP LAN (misal `192.168.x.x`, `10.x.x.x`, `172.16.x.x`)
  - Port: `4200`, `3000`, `8080`, `8000`, `9000`, `4000`, `5000` (dan bisa ditambah)
  - Protocol: `http:` (untuk dev), `https:` (untuk production)
- Mendukung custom API URL dan port via env.js
- Mendukung fallback ke default jika tidak ada config
- Mendukung runtime update config

### env.js (Runtime Configuration)

- Bisa diatur untuk development (localhost, IP LAN, custom port) maupun production (domain atau IP internal)
- Mendukung runtime update dengan fungsi:
  - `window.updateDevConfig(devApiUrl, devPort)`
  - `window.updateProductionDomain(newDomain)`

## Cara Setting untuk Developer

### 1. Development dengan Localhost/127.0.0.1/0.0.0.0

```javascript
// src/assets/env.js
window.__env = {
  DEV_API_URL: 'http://localhost:3000', // atau http://127.0.0.1:3000
  DEV_PORT: '4200' // atau custom port
};
```

### 2. Development dengan IP LAN (misal untuk sharing ke device lain di jaringan)

```javascript
window.__env = {
  DEV_API_URL: 'http://192.168.1.100:3000', // IP backend
  DEV_PORT: '8080' // port frontend
};
```

### 3. Production dengan Domain

```javascript
window.__env = {
  API_URL: 'https://api.production.com',
  HCAPTCHA_SITEKEY: 'your-hcaptcha-key'
};
```

### 4. Production dengan IP Internal (server perusahaan)

```javascript
window.__env = {
  API_URL: 'http://10.10.10.10:3000', // IP internal backend
  HCAPTCHA_SITEKEY: 'your-hcaptcha-key'
};
```

### 5. Runtime Update (Tanpa Rebuild)

```javascript
// Ganti API URL development saat aplikasi sudah jalan
devApiUrl = 'http://192.168.1.101:3000';
window.updateDevConfig(devApiUrl, '8080');

// Ganti API URL production saat aplikasi sudah jalan
window.updateProductionDomain('http://10.10.10.20:3000');
```

## Tabel Ringkasan Skenario & Setting

| Skenario                | env.js Setting Example                                 | Keterangan |
|-------------------------|-------------------------------------------------------|------------|
| Dev - localhost:4200    | DEV_API_URL: 'http://localhost:3000', DEV_PORT: '4200'| Default Angular |
| Dev - 127.0.0.1:8080    | DEV_API_URL: 'http://127.0.0.1:3000', DEV_PORT: '8080'| Custom port |
| Dev - IP LAN            | DEV_API_URL: 'http://192.168.1.100:3000', DEV_PORT: '8080'| Untuk sharing ke device lain |
| Prod - domain           | API_URL: 'https://api.production.com'                 | Domain publik |
| Prod - IP internal      | API_URL: 'http://10.10.10.10:3000'                    | Server internal perusahaan |

## Bagaimana Sistem Memilih API URL?

1. **Priority Chain** (di EnvironmentService):
   - `window.__env.API_URL` (runtime, production)
   - `window._env.BASE_URL` (runtime, alternatif)
   - `window.__env.BACKEND_URL` (runtime, backup)
   - **Development**: `window.__env.DEV_API_URL` atau default (`http://localhost:3000`)
   - **Fallback**: Hardcoded default (untuk production)
2. **Development Detection**: Otomatis berdasarkan hostname, port, dan IP (termasuk IP LAN)
3. **Runtime Update**: Bisa diubah saat aplikasi sudah jalan tanpa rebuild

## Keamanan Penggunaan IP Internal di Production

- **Pastikan** IP internal hanya diakses dari jaringan internal perusahaan (gunakan firewall/VPN)
- **Jangan expose** IP internal ke internet publik
- **Gunakan HTTPS** jika memungkinkan, walaupun di internal
- **Audit** akses dan log API untuk keamanan

## Contoh Debug Logging

Saat aplikasi jalan, akan muncul log seperti:
```text
🔍 Environment Service Debug: {
  hostname: '192.168.1.100',
  port: '8080',
  isDevelopment: true,
  apiUrl: 'http://192.168.1.100:3000',
  devApiUrl: 'http://192.168.1.100:3000',
  devPort: '8080',
  production: false,
  ...
}
```

## Troubleshooting

- **API tidak bisa diakses?**
  - Cek log debug di browser console
  - Pastikan env.js sudah di-load sebelum main.js
  - Pastikan IP/port backend benar dan bisa diakses dari frontend
- **Ganti domain/IP/port?**
  - Update env.js lalu refresh, atau gunakan runtime update

## Summary

- **EnvironmentService** dan **env.js** sekarang mendukung semua skenario modern: domain, IP address (termasuk IP internal/LAN), custom port, dan runtime update.
- Developer cukup atur env.js sesuai kebutuhan, tanpa perlu rebuild.
- Semua logic pemilihan environment sudah otomatis dan fleksibel.
- Aman untuk digunakan di production, termasuk untuk server internal perusahaan.

---

## References

- [Angular Environment Configuration](https://angular.dev/tools/cli/environments)
- [Angular Build Configuration](https://angular.dev/reference/configs/workspace-config)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files.html) 