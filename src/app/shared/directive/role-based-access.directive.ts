import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appRoleBasedAccess]',
  standalone: true
})
export class RoleBasedAccessDirective {

  private currentUserRole: string = '';
  private allowedRoles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {
    this.loadRoleFromCache();
  }

  @Input() set appRoleBasedAccess(allowedRoles: string[]) {
    this.allowedRoles = allowedRoles;
    this.updateView();
  }

  // Load role from cache if available
  private loadRoleFromCache(): void {
    const userProfileString = localStorage.getItem('user_profile');
    if (userProfileString) {
      try {
        const userProfile = JSON.parse(userProfileString);
        // Periksa apakah userProfile, role, dan name ada sebelum mengaksesnya
        if (userProfile && userProfile.role && userProfile.role.name) {
          this.currentUserRole = userProfile.role.name;
        } else {
          console.warn('userProfile.role or userProfile.role.name is undefined');
          this.currentUserRole = '';
        }
      } catch (error) {
        console.error('Error parsing user_profile from localStorage:', error);
        this.currentUserRole = '';
      }
    }
  }

  private updateView(): void {
    if (this.allowedRoles.map(role => role.toLowerCase()).includes(this.currentUserRole.toLowerCase())) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
