import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Rdv, RdvCreatePayload, RdvUpdatePayload } from '../Interfaces/rdv.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RdvService {
  private apiUrl = 'http://localhost:8081/Api/V1/clinique/rendezvous'; // Change to your actual backend URL

  // Inject AuthService into the constructor
  constructor(private http: HttpClient, private authService: AuthService) {} // Inject AuthService

  getRdv(): Observable<Rdv[]> {
    const token = this.authService.getToken(); 

    // return this.http.get<User[]>(this.apiUrl);

    if (token) {
      
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      return this.http.get<Rdv[]>(this.apiUrl, { headers });
    } else {
      
      console.warn('No authentication token found. Cannot fetch users.');
 
      return new Observable<Rdv[]>(); 
    }
  }

   // Méthode POST pour créer un rendez-vous

createRdv(rdv: RdvCreatePayload): Observable<Rdv> {
    const token = this.authService.getToken();
    
    if (!token) {
      console.warn('No authentication token found. Cannot perform operation.');
      return throwError(() => new Error('No authentication token found.'));
    }

    // Création des headers avec le token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Nettoyer le payload avant envoi
    const payload = { ...rdv };
    

    // Envoyer la requête avec les headers
    return this.http.post<Rdv>(`${this.apiUrl}/createRendezVous`, payload, { headers });
  }

}