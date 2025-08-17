import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { CurrentUser } from '../../current-user/current-user';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, CurrentUser],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard{
  constructor(
    private router: Router
  ) {}
  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login-page']);
  }
}
