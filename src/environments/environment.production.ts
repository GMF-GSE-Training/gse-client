interface EnvConfigProd {
  BACKEND_URL?: string;
  API_URL?: string;
  HCAPTCHA_SITEKEY?: string;
}

declare global {
  interface Window {
    __env?: EnvConfigProd;
  }
}

export const environment = {
  production: true,
  apiUrl: window.__env?.API_URL || '/',
  hcaptchaSiteKey: window.__env?.HCAPTCHA_SITEKEY || window._env?.HCAPTCHA_SITEKEY || '',
  endpoints: {
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
  },
};
