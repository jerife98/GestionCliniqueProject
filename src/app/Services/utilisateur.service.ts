import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User, UserCreatePayload } from '../Interfaces/user.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UtilisateursService {
  private apiUrl = 'http://localhost:8081/Api/V1/clinique/utilisateurs'; // Change to your actual backend URL

  // Inject AuthService into the constructor
  constructor(private http: HttpClient, private authService: AuthService) {} // Inject AuthService

  getUtilisateurs(): Observable<User[]> {
    const token = this.authService.getToken(); 

    // return this.http.get<User[]>(this.apiUrl);

    if (token) {
      
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
    
      return this.http.get<User[]>(this.apiUrl, { headers });
    } else {
      
      console.warn('No authentication token found. Cannot fetch users.');
 
      return new Observable<User[]>(); 
    }
  }

  // Alias pour getUtilisateurs pour une meilleure cohérence
  getUsers(): Observable<User[]> {
    return this.getUtilisateurs();
  }

   // Méthode POST pour créer un utilisateur
  // createUser(user: any): Observable<any> {
  //   const token = this.authService.getToken(); 
  //   if (!token) {
  //     console.warn('No authentication token found. Cannot perform operation.');
  //     return throwError(() => new Error('No authentication token found.')); // Retourne un Observable qui émet une erreur
  //   }

  //   if(token){
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //     return this.http.post(this.apiUrl, user);
  //   }else{
  //     console.warn('No authentication token found. Cannot fetch users.');
 
  //     return new Observable<any>(); 
  //   }

  // }
    createUser(user: UserCreatePayload): Observable<User> {
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
    const payload = { ...user };
    
    // Supprimer serviceMedicalName si l'utilisateur n'est pas médecin
    if (payload.role.roleType !== 'MEDECIN') {
      delete payload.serviceMedicalName;
    }

    // Envoyer la requête avec les headers
    return this.http.post<User>(this.apiUrl, payload, { headers });
  }


  findUtilisateurByNom(nomUtilisateur: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/nom/${encodeURIComponent(nomUtilisateur)}`);
  }

    //Méthode PUT pour éditer un utilisateur
  updateUser(user: User): Observable<any> {
    // const token = this.authService.getToken();
    // if(token){
    //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const url = `http://localhost:8081/Api/V1/clinique/utilisateurs/${user.id}`; // ou autre endpoint
      return this.http.put(url, user);
    // }else{
    //   console.warn('Cannot update user')
    //   return new Observable<any>();
    // }
  }

  // Méthode DELETE pour supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    const token = this.authService.getToken();
    
    if (!token) {
      console.warn('No authentication token found. Cannot perform operation.');
      return throwError(() => new Error('No authentication token found.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete(url, { headers });
  }


}