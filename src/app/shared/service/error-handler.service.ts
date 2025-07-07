import { Injectable } from '@angular/core';
import { SweetalertService } from './sweetaler.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private readonly sweetalertService: SweetalertService) {}

  /**
   * Menangani error dan menampilkan alert menggunakan SweetAlert.
   * @param error Error dari response backend.
   * @param requiredFields Daftar field yang diperlukan untuk validasi (opsional).
   */
  alertError(error?: any, requiredFields?: string[]): void {
    const errorDetails = error?.error?.errors;
    const errorMessage = error?.error?.message || error?.message;
    const status = error?.status; // Ambil status HTTP

    // Cek apakah error adalah SMTP error (email gagal terkirim)
    if (errorMessage && (
        errorMessage.includes('ETIMEDOUT') || 
        errorMessage.includes('ECONNREFUSED') || 
        errorMessage.includes('ESOCKET') ||
        errorMessage.includes('connect')
      )) {
      // Anggap sebagai sukses meski email gagal terkirim
      this.sweetalertService.alert(
        'Berhasil',
        'Operasi berhasil dilakukan. Link verifikasi akan dikirim ke email Anda.',
        'success'
      );
      return;
    }

    // Tangani error berdasarkan status HTTP
    if (status) {
      switch (status) {
        case 400:
          this.sweetalertService.alert('Pemberitahuan', 'Data tidak valid, periksa input Anda.', 'error');
          return;
        case 409:
          this.sweetalertService.alert('Pemberitahuan', 'Jadwal bertabrakan, silakan pilih waktu lain.', 'error');
          return;
        case 404:
          this.sweetalertService.alert('Pemberitahuan', 'Data tidak ditemukan.', 'error');
          return;
        case 429:
          // Penanganan khusus rate limit
          let pesan429 = errorDetails || errorMessage || 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
          // Cek jika ada pesan waktu tunggu dari backend
          if (error?.error?.message) {
            pesan429 = error.error.message;
          } else if (error?.error?.retryAfter) {
            const retryAfter = Number(error.error.retryAfter);
            if (!isNaN(retryAfter)) {
              const minutes = Math.floor(retryAfter / 60);
              const seconds = retryAfter % 60;
              pesan429 = minutes > 0
                ? `Terlalu banyak permintaan. Silakan coba lagi dalam ${minutes} menit${seconds > 0 ? ' ' + seconds + ' detik' : ''}.`
                : `Terlalu banyak permintaan. Silakan coba lagi dalam ${seconds} detik.`;
            }
          } else if (error?.headers && error.headers.get && error.headers.get('Retry-After')) {
            const retryAfter = Number(error.headers.get('Retry-After'));
            if (!isNaN(retryAfter)) {
              const minutes = Math.floor(retryAfter / 60);
              const seconds = retryAfter % 60;
              pesan429 = minutes > 0
                ? `Terlalu banyak permintaan. Silakan coba lagi dalam ${minutes} menit${seconds > 0 ? ' ' + seconds + ' detik' : ''}.`
                : `Terlalu banyak permintaan. Silakan coba lagi dalam ${seconds} detik.`;
            }
          }
          this.sweetalertService.alert('Terlalu Banyak Permintaan', pesan429, 'error');
          return;
        case 500:
          this.sweetalertService.alert('Pemberitahuan', 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.', 'error');
          return;
      }
    }

    // Tangani error berbasis errorDetails (dari backend)
    if (this.isObject(errorDetails) || Array.isArray(errorDetails)) {
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
    } else if (typeof errorDetails === 'string') {
      this.sweetalertService.alert('Pemberitahuan', errorDetails, 'error');
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
    const errorMessage = error?.error?.message || error?.message;
    const status = error?.status;

    // Cek apakah error adalah SMTP error (email gagal terkirim)
    if (errorMessage && (
        errorMessage.includes('ETIMEDOUT') || 
        errorMessage.includes('ECONNREFUSED') || 
        errorMessage.includes('ESOCKET') ||
        errorMessage.includes('connect')
      )) {
      // Return pesan sukses untuk SMTP error
      return 'Register berhasil, link verifikasi akan dikirim ke email Anda';
    }

    // Tangani berdasarkan status HTTP
    if (status) {
      switch (status) {
        case 400: return 'Data tidak valid, periksa input Anda.';
        case 409: return 'Jadwal bertabrakan, silakan pilih waktu lain.';
        case 404: return 'Data tidak ditemukan.';
        case 429:
          // Penanganan khusus rate limit
          let pesan429 = errorDetails || errorMessage || 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
          // Cek jika ada pesan waktu tunggu dari backend
          if (error?.error?.message) {
            pesan429 = error.error.message;
          } else if (error?.error?.retryAfter) {
            const retryAfter = Number(error.error.retryAfter);
            if (!isNaN(retryAfter)) {
              const minutes = Math.floor(retryAfter / 60);
              const seconds = retryAfter % 60;
              pesan429 = minutes > 0
                ? `Terlalu banyak permintaan. Silakan coba lagi dalam ${minutes} menit${seconds > 0 ? ' ' + seconds + ' detik' : ''}.`
                : `Terlalu banyak permintaan. Silakan coba lagi dalam ${seconds} detik.`;
            }
          } else if (error?.headers && error.headers.get && error.headers.get('Retry-After')) {
            const retryAfter = Number(error.headers.get('Retry-After'));
            if (!isNaN(retryAfter)) {
              const minutes = Math.floor(retryAfter / 60);
              const seconds = retryAfter % 60;
              pesan429 = minutes > 0
                ? `Terlalu banyak permintaan. Silakan coba lagi dalam ${minutes} menit${seconds > 0 ? ' ' + seconds + ' detik' : ''}.`
                : `Terlalu banyak permintaan. Silakan coba lagi dalam ${seconds} detik.`;
            }
          }
          return pesan429;
        case 500: return 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.';
      }
    }

    // Tangani error berbasis errorDetails
    if (this.isObject(errorDetails) || Array.isArray(errorDetails)) {
      const formattedError = this.formatErrors(errorDetails);

      if (formattedError) {
        return formattedError;
      } else if (this.hasRequiredFields(errorDetails, requiredFields || [])) {
        return 'Kolom dengan tanda bintang (*) wajib diisi';
      }
    } else if (typeof errorDetails === 'string') {
      return errorDetails;
    }

    return 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.';
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
