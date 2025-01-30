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
    const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    if (userProfile && userProfile.role.name) {
      this.currentUserRole = userProfile.role.name;
      this.updateView();
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
