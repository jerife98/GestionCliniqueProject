import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Rdv, RdvCreatePayload } from '../Interfaces/rdv.interface';
import { AuthService } from './auth.service';
import { StatutRdv } from '../Enums/statut-rdv.enum';

@Injectable({ providedIn: 'root' })
export class RdvService {
  private apiUrl = 'http://localhost:8081/Api/V1/clinique/rendezvous';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** 🔹 Récupérer tous les rendez-vous */
  getRdv(): Observable<Rdv[]> {
    const token = this.authService.getToken();
    if (!token) return new Observable<Rdv[]>();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Rdv[]>(this.apiUrl, { headers }).pipe(
      map(rdvs => rdvs.map(r => this.normalizeRdv(r))),
      catchError(err => {
        console.error('Erreur lors du chargement des rendez-vous', err);
        return throwError(() => err);
      })
    );
  }

  /** 🔹 Récupérer les rendez-vous par nom (médecin/statut) */
  getRdvByname(): Observable<Rdv[]> {
    const token = this.authService.getToken();
    if (!token) return new Observable<Rdv[]>();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Rdv[]>(
      `${this.apiUrl}/utilisateurs/rendezvous/medecin/status`, 
      { headers }
    ).pipe(
      map(rdvs => rdvs.map(r => this.normalizeRdv(r))),
      catchError(err => throwError(() => err))
    );
  }

  /** 🔹 Créer un rendez-vous */
  createRdv(rdv: RdvCreatePayload): Observable<Rdv> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('No authentication token found.'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Rdv>(`${this.apiUrl}/createRendezVous`, rdv, { headers }).pipe(
      map(r => this.normalizeRdv(r)),
      catchError(err => throwError(() => err))
    );
  }

  /** 🔹 Créer une facture */
  createFacture(facturePayload: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('No authentication token found.'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/facture/create`, facturePayload, { headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  /** 🔹 Mettre à jour le RDV avec l’ID de la facture */
  updateRdvFactureId(rdvId: number, factureId: number): Observable<Rdv> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('No authentication token found.'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<Rdv>(`${this.apiUrl}/updateFacture/${rdvId}`, { factureId }, { headers })
      .pipe(map(r => this.normalizeRdv(r)));
  }

  /** 🔹 Annuler un rendez-vous */
  cancelRdv(id: number): Observable<Rdv> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('No authentication token found.'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.put<Rdv>(`${this.apiUrl}/${id}/cancel`, {}, { headers }).pipe(
      map(r => this.normalizeRdv(r)),
      catchError(err => throwError(() => err))
    );
  }

  /** 🔹 Supprimer un rendez-vous */
  deleteRdv(id: number): Observable<void> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('No authentication token found.'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  /** 🔹 Normalisation pour forcer le type StatutRdv */
  private normalizeRdv(rdv: any): Rdv {
    return {
      ...rdv,
      statut: this.mapStatut(rdv.statut)
    };
  }

  /** 🔹 Conversion sécurisée string → StatutRdv */
  private mapStatut(value: string): StatutRdv {
    switch (value) {
      case 'CONFIRME': return StatutRdv.CONFIRME;
      case 'ANNULE': return StatutRdv.ANNULE;
      case 'TERMINE': return StatutRdv.TERMINE;
      case 'EN_ATTENTE': return StatutRdv.EN_ATTENTE;
      default:
        console.warn(`Statut inconnu reçu: ${value}, fallback EN_ATTENTE`);
        return StatutRdv.EN_ATTENTE;
    }
  }
}
