import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081/Api/V1/clinique/login';
  
  constructor(private http: HttpClient) { }



  login(credentials: { email: string, password: string }): Observable<any> {
  return this.http.post(this.apiUrl, credentials)
    .pipe(
      tap((response: any) => {
        // Stocke le token reçu côté frontend
        localStorage.setItem('auth_token', response.token); 
        console.log('Mon token recu et conservé:', response.token); 
        
      })
    );
}
getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}