import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { filter, map } from "rxjs";

export const RoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const redirect = () => {
    router.navigateByUrl('/not-found');
    return false;
  };

  const cachedUserProfile = localStorage.getItem('user_profile');
  if(cachedUserProfile) {
    const userProfile = JSON.parse(cachedUserProfile);
    const userRole = userProfile.role?.name?.toLowerCase();
    const allowedRoles = (route.data['roles'] as string[]).map(role => role.toLowerCase());

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    return redirect();
  }

  return authService.userProfile$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map((currentUser) => {
      const allowedRoles = (route.data['roles'] as string[]).map(role => role.toLowerCase());
      if(allowedRoles.includes(currentUser?.role!.name!)) {
        return true;
      }
      return redirect();
    })
  );
};
