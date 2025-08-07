import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Role, User, UserCreatePayload, UserUpdatePayload } from '../Interfaces/user.interface';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UtilisateursService {
  private apiUrl = 'http://localhost:8081/Api/V1/clinique/utilisateurs'; // Change to your actual backend URL
  private apiUrlById = 'http://localhost:8081/Api/V1/clinique/utilisateurs/{idUtilisateur}';

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
  createUser(user: UserCreatePayload): Observable<UserCreatePayload> {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('No authentication token found. Cannot perform operation.');
      return throwError(() => new Error('No authentication token found.')); // Retourne un Observable qui émet une erreur
    }

  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.post<UserCreatePayload>(this.apiUrl, user, { headers });
   
  }


  findUtilisateurById(id: number): Observable<User> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.get<User>(
      `${this.apiUrl}/${id}`, { headers }
    );
  }

  findUtilisateurByService(serviceMedical: string): Observable<User[]> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.get<User[]>(`${this.apiUrl}/by-service/${serviceMedical}`, { headers });
  }

  //   // Méthode PUT pour mettre à jour un utilisateur
  // updateUser(user: User): Observable<User> {
  //   const token = this.authService.getToken();
  //   if (!token) {
  //     return throwError(() => new Error('No authentication token found.'));
  //   }
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   // On suppose que le backend attend un PUT sur /utilisateurs/{id}
  //   return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, { headers });
  // }

// updateUser(user: UserUpdatePayload): Observable<User> {
//   const token = this.authService.getToken();
//   if (!token) {
//     return throwError(() => new Error('No authentication token found.'));
//   }
//   //préparation du payload pour le backend
//   const payload = { ...user, role: user.role }; // Assurez-vous que le rôle est au format attendu par le backend

//   const headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   });
//   return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, { headers }).pipe(
//     tap(response => console.log('Réponse updateUser:', response)),
//     catchError(error => {
//       console.error('Erreur updateUser:', error);
//       return throwError(() => error);
//     })
//   );
// }


  updateUser(user: UserUpdatePayload): Observable<User> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found.'));
    }

    if (typeof user.id === 'undefined' || user.id <= 0) {
      return throwError(() => new Error('Invalid user ID'));
    }

    // Supprimer l'ancienne validation de rôle
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    console.log('Payload envoyé au backend:', user);

    return this.http.put<User>(
      `${this.apiUrl}/${user.id}`,
      user,
      { headers }
    ).pipe(
      tap(response => console.log('Réponse updateUser:', response)),
      catchError(error => {
        console.error('Erreur updateUser:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode DELETE pour supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found.'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // L’URL correspond bien à ce que tu as donné
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete(url, { headers, responseType: 'text' });
  }
}
