import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Patient, PatientCreatePayload } from '../Interfaces/patient.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = 'http://localhost:8081/Api/V1/clinique/patients'; // Change to your actual backend URL

  // Inject AuthService into the constructor
  constructor(private http: HttpClient, private authService: AuthService) {} // Inject AuthService

  getPatients(): Observable<Patient[]> {
    const token = this.authService.getToken(); 

    // return this.http.get<User[]>(this.apiUrl);

    if (token) {
      
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
    
      return this.http.get<Patient[]>(this.apiUrl, { headers });
    } else {
      
      console.warn('No authentication token found. Cannot fetch users.');
 
      return new Observable<Patient[]>(); 
    }
  }

   // Méthode POST pour créer un utilisateur
//   createPatient(patient: any): Observable<any> {
//     const token = this.authService.getToken(); 
//     if (!token) {
//       console.warn('No authentication token found. Cannot perform operation.');
//       return throwError(() => new Error('No authentication token found.')); // Retourne un Observable qui émet une erreur
//     }

//     if(token){
//       const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//       return this.http.post(this.apiUrl, patient);
//     }else{
//       console.warn('No authentication token found. Cannot fetch patients.');
 
//       return new Observable<any>(); 
//     }

//   }

createPatient(patient: PatientCreatePayload): Observable<Patient> {
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
    const payload = { ...patient };
    

    // Envoyer la requête avec les headers
    return this.http.post<Patient>(this.apiUrl, payload, { headers });
  }




}