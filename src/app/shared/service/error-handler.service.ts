import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SweetalertService } from './sweetalert.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(
    private readonly sweetalertService: SweetalertService,
    private readonly router: Router
  ) {}

  /**
   * Menangani error dan menampilkan alert menggunakan SweetAlert.
   * @param error Error dari response backend.
   * @param requiredFields Daftar field yang diperlukan untuk validasi (opsional).
   */
  alertError(error?: any, requiredFields?: string[]): void {
    const errorDetails = error?.error?.errors;
    const errorMessage = error?.error?.errors || error?.error?.message || error?.message;
    const status = error?.status;

    // Cek SMTP error
    if (errorMessage && (
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ESOCKET') ||
        errorMessage.includes('connect')
      )) {
      this.sweetalertService.alert(
        'Berhasil',
        'Operasi berhasil dilakukan. Link verifikasi akan dikirim ke email Anda.',
        'success'
      );
      return;
    }

    // Mendeteksi semua route backend yang relevan
    const isAuthRoute = this.isAuthRoute();
    const isCapabilityRoute = this.isCapabilityRoute();
    const isCotRoute = this.isCotRoute();
    const isCertificateRoute = this.isCertificateRoute();
    const isESignRoute = this.isESignRoute();
    const isParticipantRoute = this.isParticipantRoute();
    const isUserRoute = this.isUserRoute();
    const isRoleRoute = this.isRoleRoute();
    const isParticipantCotRoute = this.isParticipantCotRoute();
    const isCurriculumSyllabusRoute = this.isCurriculumSyllabusRoute();
    const isFileUploadRoute = this.isFileUploadRoute();

    // Gabungkan semua route untuk menentukan penggunaan pesan backend
    const useBackendMessage = (
      isAuthRoute || 
      isCapabilityRoute || 
      isCotRoute || 
      isCertificateRoute || 
      isESignRoute ||
      isParticipantRoute ||
      isUserRoute ||
      isRoleRoute ||
      isParticipantCotRoute ||
      isCurriculumSyllabusRoute ||
      isFileUploadRoute
    ) && status >= 400 && status < 500;

    if (status) {
      switch (status) {
        case 400:
          const message400 = useBackendMessage && errorMessage ? errorMessage : 'Data tidak valid, periksa input Anda.';
          this.sweetalertService.alert('Pemberitahuan', message400, 'error');
          return;
        case 401:
          const message401 = useBackendMessage && errorMessage ? errorMessage : 'Sesi Anda telah berakhir. Silakan login kembali.';
          this.sweetalertService.alert('Pemberitahuan', message401, 'error');
          return;
        case 403:
          const message403 = useBackendMessage && errorMessage ? errorMessage : 'Anda tidak memiliki akses untuk melakukan aksi ini.';
          this.sweetalertService.alert('Pemberitahuan', message403, 'error');
          return;
        case 404:
          const message404 = useBackendMessage && errorMessage ? errorMessage : 'Data tidak ditemukan.';
          this.sweetalertService.alert('Pemberitahuan', message404, 'error');
          return;
        case 409:
          const message409 = useBackendMessage && errorMessage ? errorMessage : 'Terjadi konflik, silahkan periksa input anda.';
          this.sweetalertService.alert('Pemberitahuan', message409, 'error');
          return;
        case 429:
          let pesan429 = errorMessage || 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
          this.sweetalertService.alert('Terlalu Banyak Permintaan', pesan429, 'error');
          return;
        case 500:
          this.sweetalertService.alert('Pemberitahuan', 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.', 'error');
          return;
      }
    }

    // Tangani error berbasis errorDetails (string/object/array)
    if (typeof errorDetails === 'string') {
      this.sweetalertService.alert('Pemberitahuan', errorDetails, 'error');
    } else if (this.isObject(errorDetails) || Array.isArray(errorDetails)) {
      const formattedError = this.formatErrors(errorDetails);
      if (this.hasRequiredFields(errorDetails, requiredFields || [])) {
        this.sweetalertService.alert('Pemberitahuan', 'Kolom dengan tanda bintang (*) wajib diisi', 'error');
      } else if (formattedError) {
        this.sweetalertService.alert('Pemberitahuan', formattedError, 'error');
      }
    } else if (useBackendMessage && errorMessage) {
      this.sweetalertService.alert('Pemberitahuan', errorMessage, 'error');
    } else {
      this.sweetalertService.alert('Pemberitahuan', 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.', 'error');
    }
  }

  /**
   * Mengembalikan pesan error dalam bentuk string.
   */
  getErrorMessage(error?: any, requiredFields?: string[]): string {
    const errorDetails = error?.error?.errors;
    const errorMessage = error?.error?.errors || error?.error?.message || error?.message;
    const status = error?.status;

    if (errorMessage && (
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ESOCKET') ||
        errorMessage.includes('connect')
      )) {
      return 'Register berhasil, link verifikasi akan dikirim ke email Anda.';
    }

    const useBackendMessage = (
      this.isAuthRoute() || 
      this.isCapabilityRoute() || 
      this.isCotRoute() || 
      this.isCertificateRoute() || 
      this.isESignRoute() ||
      this.isParticipantRoute() ||
      this.isUserRoute() ||
      this.isRoleRoute() ||
      this.isParticipantCotRoute() ||
      this.isCurriculumSyllabusRoute() ||
      this.isFileUploadRoute()
    ) && status >= 400 && status < 500;

    if (status) {
      switch (status) {
        case 400: return useBackendMessage && errorMessage ? errorMessage : 'Data tidak valid, periksa input Anda.';
        case 401: return useBackendMessage && errorMessage ? errorMessage : 'Sesi Anda telah berakhir. Silakan login kembali.';
        case 403: return useBackendMessage && errorMessage ? errorMessage : 'Anda tidak memiliki akses untuk melakukan aksi ini.';
        case 404: return useBackendMessage && errorMessage ? errorMessage : 'Data tidak ditemukan.';
        case 409: return useBackendMessage && errorMessage ? errorMessage : 'Terjadi konflik, silahkan cek input anda.';
        case 429: return errorMessage || 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
        case 500: return 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.';
      }
    }

    if (typeof errorDetails === 'string') return errorDetails;
    if (this.isObject(errorDetails) || Array.isArray(errorDetails)) {
      const formattedError = this.formatErrors(errorDetails);
      if (formattedError) return formattedError;
      if (this.hasRequiredFields(errorDetails, requiredFields || [])) return 'Kolom dengan tanda bintang (*) wajib diisi';
    } else if (useBackendMessage && errorMessage) {
      return errorMessage;
    }

    return 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.';
  }

  // --- PRIVATE ROUTE CHECKERS (FIXED WITH REGEX) ---

  private isAuthRoute(): boolean {
    return /\/auth(\/|$)/.test(this.router.url);
  }

  private isCapabilityRoute(): boolean {
    return /\/capability(\/|$)/.test(this.router.url) || this.isCapabilityIdRoute();
  }

  private isCotRoute(): boolean {
    return /\/cot(\/|$)/.test(this.router.url) || this.isCotIdRoute();
  }

  private isCertificateRoute(): boolean {
    return /\/certificate(\/|$)/.test(this.router.url) || this.isCertificateIdRoute();
  }

  private isESignRoute(): boolean {
    return /\/e-sign(\/|$)/.test(this.router.url) || this.isESignIdRoute();
  }

  private isParticipantRoute(): boolean {
    return /\/participants(\/|$)/.test(this.router.url) || this.isParticipantIdRoute();
  }

  private isUserRoute(): boolean {
    return /\/users(\/|$)/.test(this.router.url) || this.isUserIdRoute();
  }

  private isRoleRoute(): boolean {
    return /\/roles(\/|$)/.test(this.router.url);
  }

  private isParticipantCotRoute(): boolean {
    return /\/participant-cot(\/|$)/.test(this.router.url);
  }

  private isCurriculumSyllabusRoute(): boolean {
    return /\/curriculum-syllabus(\/|$)/.test(this.router.url);
  }

  private isFileUploadRoute(): boolean {
    return /\/file-upload(\/|$)/.test(this.router.url);
  }

  // --- ID PATTERN CHECKERS ---

  private isCapabilityIdRoute(): boolean {
    const currentUrl = this.router.url;
    return /^\/capability\/[^\/]+\/(edit|curriculum-syllabus)$/.test(currentUrl);
  }

  private isCotIdRoute(): boolean {
    const currentUrl = this.router.url;
    return /^\/cot\/[^\/]+\/(add|detail|edit)$/.test(currentUrl);
  }

  private isCertificateIdRoute(): boolean {
    const currentUrl = this.router.url;
    const createPattern = /^\/cot\/certificate\/[^\/]+\/create\/[^\/]+$/;
    const editPattern = /^\/certificate\/[^\/]+\/(edit|detail)$/;
    return createPattern.test(currentUrl) || editPattern.test(currentUrl);
  }

  private isESignIdRoute(): boolean {
    const currentUrl = this.router.url;
    return /^\/e-sign\/[^\/]+\/(edit|view)$/.test(currentUrl);
  }

  private isParticipantIdRoute(): boolean {
    const currentUrl = this.router.url;
    // Mencakup /participants/[id] dengan sub-path seperti /profile/account
    return /^\/participants\/[^\/]+(\/.*)?$/.test(currentUrl);
  }

  private isUserIdRoute(): boolean {
    const currentUrl = this.router.url;
    return /^\/users\/[^\/]+(\/.*)?$/.test(currentUrl);
  }

  // --- HELPERS ---

  private formatErrors(errors: any): string | null {
    if (Array.isArray(errors)) {
      return errors.map(err => err.field ? `${err.field}: ${err.messages.join(', ')}` : err).join('\n');
    } else if (this.isObject(errors)) {
      return Object.entries(errors).map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(', ') : m}`).join('\n');
    }
    return null;
  }

  private hasRequiredFields(obj: any, fields: string[]): boolean {
    return this.isObject(obj) && fields.length > 0 && fields.some(f => obj[f]);
  }

  private isObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  }
}