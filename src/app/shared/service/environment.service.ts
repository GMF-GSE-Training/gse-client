import { Injectable } from '@angular/core';
import { Logger } from '../utils/logger.util';

// Type definitions untuk window environment variables
declare global {
  interface Window {
    __env?: {
      API_URL?: string;
      BACKEND_URL?: string;
      HCAPTCHA_SITEKEY?: string;
      DEV_API_URL?: string;
      DEV_PORT?: string;
      DEFAULT_DEV_API_URL?: string;
      DEFAULT_DEV_PORT?: string;
      PRODUCTION_API_URL?: string;
      DEFAULT_HCAPTCHA_SITEKEY?: string;
      [key: string]: string | undefined; // <-- tambahkan index signature
    };
    _env?: {
      BASE_URL?: string;
      HCAPTCHA_SITEKEY?: string;
      DEV_API_URL?: string;
      DEV_PORT?: string;
      [key: string]: string | undefined;
    };
  }
}

export interface Environment {
  apiUrl: string;
  hcaptchaSiteKey: string;
  production: boolean;
  isDevelopment: boolean;
  isSecure: boolean;
  devApiUrl?: string;
  devPort?: string;
}

export interface EnvironmentEndpoints {
  auth: {
    base: string;
    login: string;
    register: string;
    refreshToken: string;
    resetPasswordRequest: string;
    accountVerificationRequest: string;
    resetPassword: string;
    updateEmailRequest: string;
    updatePassword: string;
    verify: string;
  };
  user: {
    base: string;
    list: string;
    search: string;
  };
  role: {
    base: string;
  };
  participant: {
    base: string;
    qrCode: string;
    idCard: string;
    downloadIdCard: string;
    downloadDocument: string;
    list: string;
    isComplete: string;
  };
  capability: {
    base: string;
    list: string;
  };
  curriculumSyllabus: {
    base: string;
    list: string;
  };
  cot: {
    base: string;
    list: string;
  };
  participantCot: {
    base: string;
    getUnregisteredParticipants: string;
    list: string;
  };
  eSign: {
    base: string;
    list: string;
  };
  certificate: {
    base: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly env: Environment;
  private readonly endpointsConfig: EnvironmentEndpoints;

  constructor() {
    this.env = this.loadEnvironment();
    this.endpointsConfig = this.loadEndpoints();
    this.logEnvironment();
  }

  private getEnvVar(key: string, fallback: string = ''): string {
    return window.__env?.[key] ?? fallback;
  }

  private loadEnvironment(): Environment {
    const isDevelopment = this.isDevelopmentEnvironment();
    const isSecure = this.isSecureConnection();
    const apiUrl = this.resolveApiUrl(isDevelopment);
    const devApiUrl = this.resolveDevApiUrl();
    const devPort = this.resolveDevPort();
    return {
      production: !isDevelopment,
      isDevelopment,
      isSecure,
      apiUrl,
      devApiUrl,
      devPort,
      hcaptchaSiteKey: this.resolveHcaptchaSiteKey(),
    };
  }

  private resolveApiUrl(isDevelopment: boolean): string {
    if (isDevelopment) {
      Logger.envInfo('Development mode - using proxy');
      return '';
    }
    
    const candidates = [
      window.__env?.API_URL,
      window._env?.BASE_URL,
      window.__env?.BACKEND_URL,
      window.__env?.PRODUCTION_API_URL
    ];
    for (const candidate of candidates) {
      if (candidate && candidate.trim()) {
        Logger.envInfo(`Using API URL: ${candidate}`);
        return candidate.trim();
      }
    }
    return this.getEnvVar('PRODUCTION_API_URL', '');
  }

  private resolveDevApiUrl(): string {
    return window.__env?.DEV_API_URL ||
           window.__env?.DEFAULT_DEV_API_URL ||
           '';
  }

  private resolveDevPort(): string {
    return window.__env?.DEV_PORT ||
           window.__env?.DEFAULT_DEV_PORT ||
           '';
  }

  private resolveHcaptchaSiteKey(): string {
    return window.__env?.HCAPTCHA_SITEKEY ||
           window.__env?.DEFAULT_HCAPTCHA_SITEKEY ||
           '';
  }

  private loadEndpoints(): EnvironmentEndpoints {
    return {
      auth: {
        base: 'auth/current',
        login: 'auth/login',
        register: 'auth/register',
        refreshToken: 'auth/token',
        resetPasswordRequest: 'auth/request-reset-password',
        accountVerificationRequest: 'auth/resend-verification',
        resetPassword: 'auth/reset-password',
        updateEmailRequest: 'auth/update-email',
        updatePassword: 'auth/update-password',
        verify: 'auth/verify',
      },
      user: {
        base: 'users',
        list: 'users/list/result',
        search: 'users/search/result',
      },
      role: {
        base: 'roles',
      },
      participant: {
        base: 'participants',
        qrCode: 'qr-code',
        idCard: 'id-card',
        downloadIdCard: 'id-card/download',
        downloadDocument: 'download-document',
        list: 'participants/list/result',
        isComplete: 'participants/check-data-complete',
      },
      capability: {
        base: 'capability',
        list: 'capability/list/result',
      },
      curriculumSyllabus: {
        base: 'curriculum-syllabus',
        list: 'curriculum-syllabus/list/result',
      },
      cot: {
        base: 'cot',
        list: 'cot/list',
      },
      participantCot: {
        base: 'participant-cot',
        getUnregisteredParticipants: 'participant-cot/unregistered',
        list: 'list/result',
      },
      eSign: {
        base: 'e-sign',
        list: 'e-sign/list/result',
      },
      certificate: {
        base: 'certificate',
      },
    };
  }

  private isDevelopmentEnvironment(): boolean {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    const DEVELOPMENT_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0'];
    const DEVELOPMENT_PORTS = ['4200', '3000', '8080', '8000', '9000', '4000', '5000'];
    const PRODUCTION_DOMAINS = ['gmf-aeroasia.publicvm.com', 'gmf-aeroasia.com'];
    const isLocalhost = DEVELOPMENT_HOSTNAMES.includes(hostname);
    const isDevPort = DEVELOPMENT_PORTS.includes(port);
    const isHttp = protocol === 'http:';
    const isLocalNetwork = this.isLocalNetworkAddress(hostname);
    const isProductionDomain = PRODUCTION_DOMAINS.some(domain => hostname.includes(domain));
    const isHttps = protocol === 'https:';
    const isDevelopment = isLocalhost || isDevPort || isLocalNetwork || (isHttp && !isProductionDomain);
    Logger.envInfo('Environment Detection:', {
      hostname,
      port,
      protocol,
      isLocalhost,
      isDevPort,
      isHttp,
      isLocalNetwork,
      isProductionDomain,
      isHttps,
      isDevelopment,
      developmentHostnames: DEVELOPMENT_HOSTNAMES,
      developmentPorts: DEVELOPMENT_PORTS,
      productionDomains: PRODUCTION_DOMAINS
    });
    return isDevelopment;
  }

  private isLocalNetworkAddress(hostname: string): boolean {
    const localNetworkPatterns = [
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./
    ];
    return localNetworkPatterns.some(pattern => pattern.test(hostname));
  }

  private isSecureConnection(): boolean {
    const DEVELOPMENT_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0'];
    return window.location.protocol === 'https:' ||
           DEVELOPMENT_HOSTNAMES.includes(window.location.hostname) ||
           this.isLocalNetworkAddress(window.location.hostname);
  }

  private logEnvironment(): void {
    Logger.envInfo('Environment Service Debug:', {
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol,
      isDevelopment: this.env.isDevelopment,
      isSecure: this.env.isSecure,
      apiUrl: this.env.apiUrl,
      devApiUrl: this.env.devApiUrl,
      devPort: this.env.devPort,
      production: this.env.production,
      hcaptchaSiteKey: this.env.hcaptchaSiteKey ? '***' : 'not set',
      productionApiUrl: window.__env?.PRODUCTION_API_URL,
      defaultDevApiUrl: window.__env?.DEFAULT_DEV_API_URL,
      defaultDevPort: window.__env?.DEFAULT_DEV_PORT,
      defaultHcaptchaSiteKey: window.__env?.DEFAULT_HCAPTCHA_SITEKEY,
      windowEnv: {
        __env: window.__env,
        _env: window._env
      }
    });
  }

  // Getters untuk environment
  get apiUrl(): string {
    return this.env.apiUrl;
  }

  get hcaptchaSiteKey(): string {
    return this.env.hcaptchaSiteKey;
  }

  get production(): boolean {
    return this.env.production;
  }

  get isDevelopment(): boolean {
    return this.env.isDevelopment;
  }

  get isSecure(): boolean {
    return this.env.isSecure;
  }

  get devApiUrl(): string {
    return this.env.devApiUrl || '';
  }

  get devPort(): string {
    return this.env.devPort || '';
  }

  // Update 2025: Getter untuk production API URL
  get productionApiUrl(): string {
    return window.__env?.PRODUCTION_API_URL || '';
  }

  get defaultDevApiUrl(): string {
    return window.__env?.DEFAULT_DEV_API_URL || '';
  }

  get defaultDevPort(): string {
    return window.__env?.DEFAULT_DEV_PORT || '';
  }

  get defaultHcaptchaSiteKey(): string {
    return window.__env?.DEFAULT_HCAPTCHA_SITEKEY || '';
  }

  // Getters untuk endpoints
  get endpoints(): EnvironmentEndpoints {
    return this.endpointsConfig;
  }

  // Helper method untuk mendapatkan backend URL
  getBackendUrl(): string {
    // Use /api prefix for development to distinguish API calls from Angular routes
    return this.env.apiUrl || '/api';
  }

  // Helper method untuk membangun URL dengan validation
  buildUrl(endpoint: string): string {
    if (!endpoint) {
      Logger.warn('Empty endpoint provided', undefined, 'Environment');
      return '';
    }
    
    // Use /api prefix for development to distinguish API calls from Angular routes
    const url = this.env.apiUrl ? `${this.env.apiUrl}/${endpoint}` : `/api/${endpoint}`;
    Logger.debug(`Building URL: ${url}`, undefined, 'Environment');
    return url;
  }

  // Helper method untuk mendapatkan endpoint dengan validation
  getEndpoint(category: keyof EnvironmentEndpoints, key: string): string {
    const categoryEndpoints = this.endpointsConfig[category] as any;
    const endpoint = categoryEndpoints?.[key];
    
    if (!endpoint) {
      Logger.warn(`Endpoint not found for ${category}.${key}`, undefined, 'Environment');
      return '';
    }
    
    return endpoint;
  }

  // Update 2025: Method untuk validasi environment
  validateEnvironment(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!this.env.apiUrl && !this.env.isDevelopment) {
      issues.push('API URL tidak ditemukan untuk production environment');
    }
    
    if (!this.env.hcaptchaSiteKey) {
      issues.push('HCAPTCHA_SITEKEY tidak ditemukan');
    }
    
    if (!this.env.isSecure && this.env.production) {
      issues.push('Production environment tidak menggunakan HTTPS');
    }
    
    const isValid = issues.length === 0;
    
    if (!isValid) {
      Logger.warn('Environment Validation Issues:', issues);
    }
    
    return { isValid, issues };
  }

  // Update 2025: Method untuk update production domain
  updateProductionDomain(newDomain: string): void {
    window.__env?.PRODUCTION_API_URL && (window.__env.PRODUCTION_API_URL = newDomain);
    window.__env?.API_URL && (window.__env.API_URL = newDomain);
    window.__env?.BACKEND_URL && (window.__env.BACKEND_URL = newDomain);
    this.env.apiUrl = this.resolveApiUrl(this.env.isDevelopment);
    Logger.info('Production domain updated successfully', undefined, 'Environment');
  }

  // Update 2025: Method untuk update development configuration
  updateDevConfig(devApiUrl?: string, devPort?: string): void {
    if (devApiUrl) {
      window.__env && (window.__env.DEV_API_URL = devApiUrl);
      window.__env && (window.__env.DEFAULT_DEV_API_URL = devApiUrl);
      window.__env && (window.__env.BACKEND_URL = devApiUrl);
    }
    if (devPort) {
      window.__env && (window.__env.DEV_PORT = devPort);
      window.__env && (window.__env.DEFAULT_DEV_PORT = devPort);
    }
    this.env.devApiUrl = this.resolveDevApiUrl();
    this.env.devPort = this.resolveDevPort();
    this.env.apiUrl = this.resolveApiUrl(this.env.isDevelopment);
    Logger.info('Development configuration updated successfully', undefined, 'Environment');
  }
} 