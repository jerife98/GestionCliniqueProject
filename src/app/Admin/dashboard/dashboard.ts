import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
     constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login-page']);
  }
}
