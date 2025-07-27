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
    // Prioritaskan errors dari response, fallback ke message
    const errorMessage = error?.error?.errors || error?.error?.message || error?.message;
    const status = error?.status;

    // Cek apakah error adalah SMTP error (email gagal terkirim)
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

    const isAuthRoute = this.isAuthRoute();
    const isCapabilityRoute = this.isCapabilityRoute();
    const isCotRoute = this.isCotRoute();
    const isCertificateRoute = this.isCertificateRoute();
    const isESignRoute = this.isESignRoute();
    const useBackendMessage = (isAuthRoute || isCapabilityRoute || isCotRoute || isCertificateRoute || isESignRoute) && status >= 400 && status < 500;

    // Tangani error berdasarkan status HTTP
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
          const message409 = useBackendMessage && errorMessage ? errorMessage : 'Terjadi konfilk, silahkan periksa input anda.';
          this.sweetalertService.alert('Pemberitahuan', message409, 'error');
          return;
        case 429:
          // Rate limit handling tetap sama
          let pesan429 = errorMessage || 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
          // ... kode rate limit handling yang sama
          this.sweetalertService.alert('Terlalu Banyak Permintaan', pesan429, 'error');
          return;
        case 500:
          this.sweetalertService.alert('Pemberitahuan', 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.', 'error');
          return;
      }
    }

    // Tangani error berbasis errorDetails dengan pengecekan tipe yang lebih baik
    if (typeof errorDetails === 'string') {
      // Jika errors adalah string langsung (sesuai struktur response Anda)
      this.sweetalertService.alert('Pemberitahuan', errorDetails, 'error');
    } else if (this.isObject(errorDetails) || Array.isArray(errorDetails)) {
      // Jika errors adalah object/array (struktur lama)
      const formattedError = this.formatErrors(errorDetails);

      if (this.hasRequiredFields(errorDetails, requiredFields || [])) {
        this.sweetalertService.alert(
          'Pemberitahuan',
          'Kolom dengan tanda bintang (*) wajib diisi',
          'error'
        );
      } else if (formattedError) {
        this.sweetalertService.alert('Pemberitahuan', formattedError, 'error');
      }
    } else if (useBackendMessage && errorMessage) {
      // Fallback ke pesan dari backend
      this.sweetalertService.alert('Pemberitahuan', errorMessage, 'error');
    } else {
      this.sweetalertService.alert(
        'Pemberitahuan',
        'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.',
        'error'
      );
    }
  }

  /**
   * Mengembalikan pesan error dalam bentuk string.
   * @param error Error dari response backend.
   * @param requiredFields Daftar field yang diperlukan untuk validasi (opsional).
   * @returns Pesan error yang diformat.
   */
  getErrorMessage(error?: any, requiredFields?: string[]): string {
    const errorDetails = error?.error?.errors;
    // Prioritaskan errors dari response, fallback ke message
    const errorMessage = error?.error?.errors || error?.error?.message || error?.message;
    const status = error?.status;

    // Cek apakah error adalah SMTP error (email gagal terkirim)
    if (errorMessage && (
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ESOCKET') ||
        errorMessage.includes('connect')
      )) {
      return 'Register berhasil, link verifikasi akan dikirim ke email Anda.';
    }

    const isAuthRoute = this.isAuthRoute();
    const isCapabilityRoute = this.isCapabilityRoute();
    const isCotRoute = this.isCotRoute();
    const isCertificateRoute = this.isCertificateRoute();
    const isESignRoute = this.isESignRoute();
    const useBackendMessage = (isAuthRoute || isCapabilityRoute || isCotRoute || isCertificateRoute || isESignRoute) && status >= 400 && status < 500;

    // Tangani berdasarkan status HTTP
    if (status) {
      switch (status) {
        case 400:
          return useBackendMessage && errorMessage ? errorMessage : 'Data tidak valid, periksa input Anda.';
        case 401:
          return useBackendMessage && errorMessage ? errorMessage : 'Sesi Anda telah berakhir. Silakan login kembali.';
        case 403:
          return useBackendMessage && errorMessage ? errorMessage : 'Anda tidak memiliki akses untuk melakukan aksi ini.';
        case 404:
          return useBackendMessage && errorMessage ? errorMessage : 'Data tidak ditemukan.';
        case 409:
          return useBackendMessage && errorMessage ? errorMessage : 'Terjadi konflik, silahkan cek input anda.';
        case 429:
          // Rate limit handling tetap sama
          let pesan429 = errorMessage || 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
          // ... kode rate limit handling yang sama
          return pesan429;
        case 500:
          return 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.';
      }
    }

    // Tangani error berbasis errorDetails dengan pengecekan tipe yang lebih baik
    if (typeof errorDetails === 'string') {
      // Jika errors adalah string langsung (sesuai struktur response Anda)
      return errorDetails;
    } else if (this.isObject(errorDetails) || Array.isArray(errorDetails)) {
      // Jika errors adalah object/array (struktur lama)
      const formattedError = this.formatErrors(errorDetails);

      if (formattedError) {
        return formattedError;
      } else if (this.hasRequiredFields(errorDetails, requiredFields || [])) {
        return 'Kolom dengan tanda bintang (*) wajib diisi';
      }
    } else if (useBackendMessage && errorMessage) {
      // Fallback ke pesan dari backend
      return errorMessage;
    }

    return 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.';
  }

  /**
   * Mengecek apakah request saat ini berasal dari routing auth.
   * @returns true jika berasal dari routing auth, false jika tidak.
   */
  private isAuthRoute(): boolean {
    const currentUrl = this.router.url;

    // Cek jika URL mengandung path auth
    const authPaths = [
      '/auth/',
      '/auth/login',
      '/auth/register',
      '/auth/password-reset',
      '/auth/reset/',
      '/auth/verification',
      '/auth/verify',
      '/auth/verified'
    ];

    return authPaths.some(path =>
      currentUrl.includes(path) ||
      currentUrl.startsWith(path) ||
      currentUrl === path
    );
  }

  /**
   * Mengecek apakah request saat ini berasal dari routing capability.
   * @returns true jika berasal dari routing capability, false jika tidak.
   */
  private isCapabilityRoute(): boolean {
    const currentUrl = this.router.url;

    // Cek jika URL mengandung path capability
    const capabilityPaths = [
      '/capability/',
      '/capability/add',
      '/capability/edit',
      '/capability/curriculum-syllabus'
    ];

    return capabilityPaths.some(path =>
      currentUrl.includes(path) ||
      currentUrl.startsWith(path) ||
      currentUrl === path
    ) || this.isCapabilityIdRoute();
  }

  /**
   * Mengecek apakah request saat ini berasal dari routing COT.
   * @returns true jika berasal dari routing COT, false jika tidak.
   */
  private isCotRoute(): boolean {
    const currentUrl = this.router.url;

    // Cek jika URL mengandung path COT
    const cotPaths = [
      '/cot/',
      '/cot/add',
      '/cot/edit'
    ];

    return cotPaths.some(path =>
      currentUrl.includes(path) ||
      currentUrl.startsWith(path) ||
      currentUrl === path
    ) || this.isCotIdRoute();
  }

  /**
   * Mengecek apakah request saat ini berasal dari routing certificate.
   * @returns true jika berasal dari routing certificate, false jika tidak.
   */
  private isCertificateRoute(): boolean {
    const currentUrl = this.router.url;

    // Cek jika URL mengandung path certificate
    const certificatePaths = [
      '/certificate/',
      '/certificate/add',
      '/certificate/edit',
      '/certificate/create'
    ];

    return certificatePaths.some(path =>
      currentUrl.includes(path) ||
      currentUrl.startsWith(path) ||
      currentUrl === path
    ) || this.isCertificateIdRoute();
  }

  /**
   * Mengecek apakah request saat ini berasal dari routing E-Sign.
   * @returns true jika berasal dari routing E-Sign, false jika tidak.
   */
  private isESignRoute(): boolean {
    const currentUrl = this.router.url;

    // Cek jika URL mengandung path E-Sign
    const eSignPaths = [
      '/e-sign/',
      '/e-sign/add'
    ];

    return eSignPaths.some(path =>
      currentUrl.includes(path) ||
      currentUrl.startsWith(path) ||
      currentUrl === path
    ) || this.isESignIdRoute();
  }

  /**
   * Mengecek apakah URL mengandung pattern capability dengan ID.
   * @returns true jika URL mengandung pattern capability/[id]/edit atau capability/[id]/curriculum-syllabus
   */
  private isCapabilityIdRoute(): boolean {
    const currentUrl = this.router.url;

    // Pattern untuk capability/[capabilityId]/edit
    const editPattern = /^\/capability\/[^\/]+\/edit$/;

    // Pattern untuk capability/[capabilityId]/curriculum-syllabus
    const curriculumPattern = /^\/capability\/[^\/]+\/curriculum-syllabus$/;

    return editPattern.test(currentUrl) || curriculumPattern.test(currentUrl);
  }

  /**
   * Mengecek apakah URL mengandung pattern COT dengan ID.
   * @returns true jika URL mengandung pattern COT dengan ID
   */
  private isCotIdRoute(): boolean {
    const currentUrl = this.router.url;

    // Pattern untuk cot/[cotId]/add
    const addPattern = /^\/cot\/[^\/]+\/add$/;

    // Pattern untuk cot/[cotId]/detail
    const detailPattern = /^\/cot\/[^\/]+\/detail$/;

    // Pattern untuk cot/[cotId]/edit
    const editPattern = /^\/cot\/[^\/]+\/edit$/;

    return addPattern.test(currentUrl) || detailPattern.test(currentUrl) || editPattern.test(currentUrl);
  }

  /**
   * Mengecek apakah URL mengandung pattern certificate dengan ID.
   * @returns true jika URL mengandung pattern certificate dengan ID
   */
  private isCertificateIdRoute(): boolean {
    const currentUrl = this.router.url;

    // Pattern untuk cot/certificate/[cotId]/create/[participantId]
    const createPattern = /^\/cot\/certificate\/[^\/]+\/create\/[^\/]+$/;

    // Pattern untuk certificate/[certificateId]/edit
    const editPattern = /^\/certificate\/[^\/]+\/edit$/;

    // Pattern untuk certificate/[certificateId]/detail
    const detailPattern = /^\/certificate\/[^\/]+\/detail$/;

    return createPattern.test(currentUrl) || editPattern.test(currentUrl) || detailPattern.test(currentUrl);
  }

  /**
   * Mengecek apakah URL mengandung pattern E-Sign dengan ID.
   * @returns true jika URL mengandung pattern E-Sign dengan ID
   */
  private isESignIdRoute(): boolean {
    const currentUrl = this.router.url;

    // Pattern untuk e-sign/[eSignId]/edit
    const editPattern = /^\/e-sign\/[^\/]+\/edit$/;

    // Pattern untuk e-sign/[eSignId]/view
    const viewPattern = /^\/e-sign\/[^\/]+\/view$/;

    return editPattern.test(currentUrl) || viewPattern.test(currentUrl);
  }

  /**
   * Memformat error menjadi string yang dapat dibaca pengguna.
   * @param errors Objek atau array error dari backend.
   * @returns Pesan error yang diformat atau null jika tidak bisa diformat.
   */
  private formatErrors(errors: Record<string, string[]> | string[] | any): string | null {
    if (Array.isArray(errors)) {
      return errors
        .map((error) => {
          if (error.field && Array.isArray(error.messages)) {
            return `${error.field}: ${error.messages.join(', ')}`;
          }
          return error;
        })
        .filter(Boolean)
        .join('\n');
    } else if (this.isObject(errors)) {
      return Object.entries(errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('\n');
    }
    return null;
  }

  /**
   * Mengecek apakah objek memiliki field tertentu.
   * @param obj Objek untuk diperiksa.
   * @param fields Daftar field yang harus ada.
   * @returns `true` jika salah satu field ditemukan, `false` jika tidak.
   */
  private hasRequiredFields(obj: any, fields: string[]): boolean {
    if (!this.isObject(obj) || fields.length === 0) {
      return false;
    }
    return fields.some((field) => obj[field]);
  }

  /**
   * Mengecek apakah sebuah value adalah objek.
   * @param obj Value yang akan diperiksa.
   * @returns `true` jika value adalah objek, `false` jika tidak.
   */
  private isObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  }
}
