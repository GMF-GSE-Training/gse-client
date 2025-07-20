declare const window: any;
export const environment = {
  production: false,
  apiUrl: '', // gunakan path relatif agar lewat proxy saat development
  hcaptchaSiteKey: window._env?.HCAPTCHA_SITEKEY || window.__env?.HCAPTCHA_SITEKEY || '',
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