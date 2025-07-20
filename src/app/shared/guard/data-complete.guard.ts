import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SweetalertService } from '../service/sweetalert.service';
import { Participant } from '../model/participant.model';

export const DataCompleteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sweetalertService = inject(SweetalertService);

  // Ambil role user dan ID participant dari localStorage
  const cachedUserProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  if(cachedUserProfile && cachedUserProfile.role) {
    const cachedUserRole = cachedUserProfile.role.name;
    
    // Hanya periksa kelengkapan data untuk role 'user'
    if(cachedUserRole === 'user' && cachedUserProfile.participant) {
      const participant = cachedUserProfile.participant as Participant;
      
      // Cek kelengkapan data berdasarkan field wajib
      const isDataComplete = Boolean(
        participant && 
        participant.dateOfBirth && 
        participant.placeOfBirth && 
        participant.phoneNumber &&
        participant.nationality
      );
      
      if(!isDataComplete) {
        const alertState = sweetalertService.alert(
          'Peringatan!', 
          'Anda tidak dapat melanjutkan ke halaman berikutnya karena data Anda belum lengkap. Silakan lengkapi data terlebih dahulu untuk melanjutkan.', 
          'warning'
        );
        
        // Jangan redirect ke edit jika kita sudah berada di halaman edit
        if (!state.url.includes(`/participants/${participant.id}/edit`)) {
          router.navigateByUrl(`/participants/${participant.id}/edit`, {
            state: { alert: alertState }
          });
          return false;
        }
      }
    }
  }
  return true;
};
