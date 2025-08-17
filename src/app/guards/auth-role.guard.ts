import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.authorities) {
      this.router.navigate(['/login-page']);
      return false;
    }

    const userRoles = currentUser.authorities.map((a: any) =>
      a.authority.replace('ROLE_', '').toLowerCase()
    );

    const hasAccess = expectedRoles.some(role =>
      userRoles.includes(role.toLowerCase())
    );

    if (!hasAccess) {
      this.router.navigate(['/login-page']);
    }

    return hasAccess;
  }
}
