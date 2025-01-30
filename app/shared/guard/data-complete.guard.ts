import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SweetalertService } from '../service/sweetaler.service';

export const DataCompleteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Mengambil instance Router untuk navigasi
  const sweetalertService = inject(SweetalertService);

  // Ambil role user dan ID participant dari session storage
  const cachedUserProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  if(cachedUserProfile && cachedUserProfile.role) {
    const cachedUserRole = cachedUserProfile.role.name;
    if(cachedUserRole === 'user') {
      const cachedParticipantId = cachedUserProfile.participant.id;
      const isDataComplete = cachedUserProfile.isDataComplete
      if(!isDataComplete) {
        const alertState = sweetalertService.alert('Peringatan!', 'Anda tidak dapat melanjutkan ke halaman berikutnya karena data Anda belum lengkap. Silakan lengkapi data terlebih dahulu untuk melanjutkan.', 'warning');
        router.navigateByUrl(`/participants/${cachedParticipantId}/edit`, {
          state: { alert: alertState }
        });
        return false;
      }
    }
  }
  return true;
};
