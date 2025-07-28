import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { User } from '../Interfaces/user.interface';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  providers: [AuthService]
})
export class LoginPage {
 email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {}

  // onSubmit() {
  //   const credentials = {
  //     email: this.email,
  //     password: this.password
  //   };

  //   this.authService.login(credentials)
    
  //     .subscribe({
  //       next: (user: User) => {
  //         this.http.get('http://localhost:8081/Api/V1/clinique/utilisateurs').subscribe(console.log);

  //       switch (user.role.roleType.toLowerCase()) {
  //         case 'admin':
  //           this.router.navigate(['dashboard']);
  //           break;
  //         case 'medecin':
  //           this.router.navigate(['medecin']);
  //           break;
  //         case 'secretaire':
  //           this.router.navigate(['secretaire']);
  //           break;
  //         default:
  //           // Rôle inconnu ou non géré, on redirige vers page d'accueil ou erreur
  //           this.router.navigate(['/']);
  //           break;
  //       }
  //         console.log('Connexion réussie', this.email, this.password);

  //       },
  //       error: (err) => {
  //         console.error('Erreur de connexion', err);
  //         alert('Identifiants incorrects');
  //       }
  //     });
  // }
  onSubmit() {
  const credentials = {
    email: this.email,
    password: this.password
  };

  this.authService.login(credentials)
    .subscribe({
      next: (response: any) => {
        // Stockage du token
        localStorage.setItem('auth_token', response.token);

        // Extraction du rôle principal
        let roleType = '';
        if (response.authorities && response.authorities.length > 0) {
          // Par exemple on prend le premier rôle
          const authority = response.authorities[0].authority;  // ex: 'ROLE_ADMIN'

          // On enlève le préfixe 'ROLE_' si présent (optionnel)
          if (authority.startsWith('ROLE_')) {
            roleType = authority.substring(5).toLowerCase(); // 'admin'
          } else {
            roleType = authority.toLowerCase();
          }
        }

        // Redirection en fonction du rôle
        switch (roleType) {
          case 'admin':
            this.router.navigate(['dashboard']);
            break;
          case 'medecin':
            this.router.navigate(['medecin']);
            break;
          case 'secretaire':
            this.router.navigate(['secretaire']);
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
      },
      error: (err) => {
        alert('Erreur de connexion');
      }
    });
}

}