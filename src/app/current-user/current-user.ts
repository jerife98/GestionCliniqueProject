import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-current-user',
  imports: [CommonModule],
  templateUrl: './current-user.html',
  styleUrl: './current-user.css'
})
export class CurrentUser implements OnInit {
  connectedUser: any = null;  
    constructor(
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.connectedUser = this.authService.getCurrentUser();
  }
}
