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

    if (this.isObject(errorDetails) || Array.isArray(errorDetails)) {
      const formattedError = this.formatErrors(errorDetails);

      if (this.hasRequiredFields(errorDetails, requiredFields!)) {
        this.sweetalertService.alert(
          'Gagal!',
          'Kolom dengan tanda bintang (*) wajib diisi',
          'error'
        );
      } else if (formattedError) {
        this.sweetalertService.alert('Gagal!', formattedError, 'error');
      }
    } else if (typeof errorDetails === 'string') {
      this.sweetalertService.alert('Gagal!', errorDetails, 'error');
    } else {
      this.sweetalertService.alert(
        'Gagal!',
        'Terjadi kesalahan, silakan coba lagi nanti.',
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

    if (this.isObject(errorDetails) || Array.isArray(errorDetails)) {
      const formattedError = this.formatErrors(errorDetails);

      if (formattedError) {
        return formattedError;
      } else if (this.hasRequiredFields(errorDetails, requiredFields!)) {
        return 'Kolom dengan tanda bintang (*) wajib diisi';
      }
    } else if (typeof errorDetails === 'string') {
      return errorDetails;
    }

    return 'Terjadi kesalahan, silakan coba lagi nanti.';
  }

  /**
   * Memformat error menjadi string yang dapat dibaca pengguna.
   * @param errors Objek atau array error dari backend.
   * @returns Pesan error yang diformat.
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
    if (!this.isObject(obj)) {
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
