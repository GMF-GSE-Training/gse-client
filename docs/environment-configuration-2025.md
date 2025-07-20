# Environment Configuration 2025 - Angular Update

## Overview

Dokumen ini menjelaskan implementasi environment configuration modern untuk Angular 2025 menggunakan Environment Service pattern dengan runtime configuration dan type safety.

## Architecture

### 1. Environment Service Pattern
- **Centralized Configuration**: Semua environment variables dikelola melalui `EnvironmentService`
- **Runtime Detection**: Environment detection berdasarkan hostname dan port
- **Type Safety**: Interface definitions untuk semua environment variables
- **Debug Logging**: Comprehensive logging untuk troubleshooting

### 2. Runtime Configuration
- **env.js**: File konfigurasi runtime yang di-load sebelum aplikasi
- **Fallback Strategy**: Fallback ke build-time environment jika runtime tidak tersedia
- **Dynamic Loading**: Environment variables dapat diubah tanpa rebuild

## Implementation

### Environment Service (`src/app/shared/service/environment.service.ts`)

```typescript
import { Injectable } from '@angular/core';

// Type definitions untuk window environment variables
declare global {
  interface Window {
    __env?: {
      API_URL?: string;
      HCAPTCHA_SITEKEY?: string;
    };
    _env?: {
      BASE_URL?: string;
      HCAPTCHA_SITEKEY?: string;
    };
  }
}

export interface Environment {
  apiUrl: string;
  hcaptchaSiteKey: string;
  production: boolean;
  isDevelopment: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  // Implementation details...
}
```

### Key Features

1. **Type Safety**: Global type definitions untuk `window.__env` dan `window._env`
2. **Environment Detection**: Otomatis mendeteksi development vs production
3. **Endpoint Management**: Centralized endpoint configuration
4. **Debug Logging**: Comprehensive logging untuk troubleshooting
5. **URL Building**: Helper methods untuk membangun URL

## Migration Guide

### Before (Legacy Approach)
```typescript
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  private apiUrl = environment.apiUrl;
}
```

### After (Environment Service Pattern)
```typescript
@Injectable()
export class UserService {
  constructor(private environmentService: EnvironmentService) {}

  getUsers() {
    const url = this.environmentService.buildUrl('users');
    // Implementation...
  }
}
```

## Configuration Files

### 1. env.js (Runtime Configuration)
```javascript
window.__env = {
  API_URL: 'https://api.production.com',
  HCAPTCHA_SITEKEY: 'your-hcaptcha-key'
};
```

### 2. angular.json (Build Configuration)
```json
{
  "configurations": {
    "production": {
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "budgets": [...],
      "baseHref": "/"
    },
    "development": {
      "optimization": false,
      "extractLicenses": false,
      "sourceMap": false
    }
  }
}
```

## Troubleshooting

### Common Errors and Solutions

#### 1. TypeScript Error: Property '__env' does not exist on type 'Window'
**Error:**
```
TS2339: Property '__env' does not exist on type 'Window & typeof globalThis'
```

**Solution:**
Tambahkan type definitions di Environment Service:
```typescript
declare global {
  interface Window {
    __env?: {
      API_URL?: string;
      HCAPTCHA_SITEKEY?: string;
    };
    _env?: {
      BASE_URL?: string;
      HCAPTCHA_SITEKEY?: string;
    };
  }
}
```

#### 2. Angular Build Error: Environment file not found
**Error:**
```
The /path/to/environment.development.ts path in file replacements does not exist
```

**Solution:**
Hapus `fileReplacements` dari `angular.json`:
```json
{
  "configurations": {
    "production": {
      // Remove fileReplacements section
    },
    "development": {
      // Remove fileReplacements section
    }
  }
}
```

#### 3. Missing Start Script Error
**Error:**
```
ERR_PNPM_NO_SCRIPT_OR_SERVER Missing script start or file server.js
```

**Solution:**
Pastikan berada di direktori yang benar:
```bash
cd /path/to/frontend
pnpm start
```

#### 4. Workspace Config Error
**Error:**
```
Workspace config file cannot be loaded: /path/to/angular.json
Unknown format - version specifier not found
```

**Solution:**
Pastikan `angular.json` memiliki format yang benar dan berada di direktori frontend.

## Update

### 1. Environment Detection
```typescript
private isDevelopmentEnvironment(): boolean {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.port === '4200';
}
```

### 2. Debug Logging
```typescript
private logEnvironment(): void {
  console.log('🔍 Environment Service Debug:', {
    hostname: window.location.hostname,
    port: window.location.port,
    isDevelopment: this.env.isDevelopment,
    apiUrl: this.env.apiUrl,
    production: this.env.production,
    hcaptchaSiteKey: this.env.hcaptchaSiteKey ? '***' : 'not set'
  });
}
```

### 3. URL Building
```typescript
buildUrl(endpoint: string): string {
  return this.env.apiUrl ? `${this.env.apiUrl}/${endpoint}` : `/${endpoint}`;
}
```

### 4. Service Integration
```typescript
@Injectable()
export class UserService {
  constructor(private environmentService: EnvironmentService) {}

  getUsers() {
    const url = this.environmentService.buildUrl(
      this.environmentService.getEndpoint('user', 'list')
    );
    console.log('🔍 UserService: Fetching users from:', url);
    return this.http.get(url);
  }
}
```

## Deployment

### Development
```bash
cd frontend
pnpm start
```

### Production
```bash
cd frontend
pnpm build
```

### Docker
```dockerfile
# Copy env.js for runtime configuration
COPY src/assets/env.js /usr/share/nginx/html/assets/
```

## Security Considerations

1. **Environment Variables**: Jangan hardcode sensitive data
2. **API Keys**: Gunakan environment variables untuk API keys
3. **Debug Logging**: Nonaktifkan debug logging di production
4. **HTTPS**: Gunakan HTTPS di production

## Monitoring and Debugging

### Debug Logs
Semua service memiliki debug logging untuk memudahkan troubleshooting:
```typescript
console.log('🔍 ServiceName: Action description', { data });
```

### Environment Detection
Environment Service secara otomatis mendeteksi environment dan menampilkan informasi debug.

### Error Handling
Implement proper error handling untuk environment loading failures.

## Future Improvements

1. **Environment Validation**: Validasi environment variables saat startup
2. **Feature Flags**: Implementasi feature flags berdasarkan environment
3. **Configuration Hot Reload**: Hot reload untuk environment changes
4. **Environment Templates**: Template untuk berbagai environment configurations

## References

- [Angular Environment Configuration](https://angular.dev/tools/cli/environments)
- [Angular Build Configuration](https://angular.dev/reference/configs/workspace-config)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files.html) 