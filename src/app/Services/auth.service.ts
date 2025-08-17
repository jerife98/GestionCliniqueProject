import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081/Api/V1/clinique/login';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    // Vérifie si on est côté client (navigateur)
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // login(credentials: { email: string, password: string }): Observable<any> {
  //   return this.http.post(this.apiUrl, credentials)
  //     .pipe(
  //       tap((response: any) => {
  //         // Ne stocker le token que côté navigateur
  //         if (this.isBrowser && response?.token) {
  //           localStorage.setItem('auth_token', response.token);
  //           console.log('Mon token recu et conservé:', response.token);
  //         }
  //       })
  //     );
  // }

  login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post<any>(this.apiUrl, credentials).pipe(
    tap(response => {
      if (this.isBrowser && response?.token) {
        localStorage.setItem('auth_token', response.token);
      }
      if (this.isBrowser) {
        // Stocker les données d'utilisateur. Ici on suppose que toute la réponse contient
        // username, photoUrl, authorities, etc.
        const userData = {
          username: response.username,
          photoUrl: response.photoUrl,
          authorities: response.authorities
        };
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Infos utilisateur stockées:', userData);
      }
    })
  );
}


  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  getCurrentUser(): any {
  if (this.isBrowser) {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

}
