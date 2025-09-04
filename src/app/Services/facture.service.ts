import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl = 'http://localhost:8081/Api/V1/clinique/factures';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Génère les headers avec JWT
  private getAuthHeaders(): HttpHeaders | undefined {
    const token = this.authService.getToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
  }

  // Récupérer la facture d’un RDV
  getFactureByRdvId(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/recherche/${id}`, { headers });
  }

  // Payer une facture
  payerFacture(factureId: number, modePaiement: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(
      `${this.apiUrl}/payer/${factureId}/${modePaiement}`,
      {}, // corps vide
      { headers }
    );
  }

  // Générer le PDF côté backend et récupérer le Blob
  genererPDF(factureId: number): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/pdf/${factureId}`, {
      headers,
      responseType: 'blob' // obligatoire pour récupérer un fichier
    });
  }
}
