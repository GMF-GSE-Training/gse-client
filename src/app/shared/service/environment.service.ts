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
    
    // Debug logging
    this.logEnvironment();
  }

  private loadEnvironment(): Environment {
    const isDevelopment = this.isDevelopmentEnvironment();
    
    return {
      production: !isDevelopment,
      isDevelopment,
      apiUrl: isDevelopment ? '' : (window.__env?.API_URL || window._env?.BASE_URL || ''),
      hcaptchaSiteKey: window.__env?.HCAPTCHA_SITEKEY || window._env?.HCAPTCHA_SITEKEY || '',
    };
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
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' || 
           window.location.port === '4200';
  }

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

  // Getters untuk endpoints
  get endpoints(): EnvironmentEndpoints {
    return this.endpointsConfig;
  }

  // Helper method untuk membangun URL
  buildUrl(endpoint: string): string {
    return this.env.apiUrl ? `${this.env.apiUrl}/${endpoint}` : `/${endpoint}`;
  }

  // Helper method untuk mendapatkan endpoint
  getEndpoint(category: keyof EnvironmentEndpoints, key: string): string {
    const categoryEndpoints = this.endpointsConfig[category] as any;
    return categoryEndpoints?.[key] || '';
  }
} 