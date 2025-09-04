import { CommonModule } from '@angular/common';
import {
  Component,
  computed,

  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RdvService } from '../../Services/rdv.service';
import { Rdv, RdvUpdatePayload } from '../../Interfaces/rdv.interface';
import { CurrentUser } from '../../current-user/current-user';
import { UtilisateursService } from '../../Services/utilisateur.service';
import { StatutRdv } from '../../Enums/statut-rdv.enum';
import { AuthService } from '../../Services/auth.service';
@Component({
  selector: 'app-rendez-vous',
  imports: [RouterLink, CommonModule, FormsModule, CurrentUser, RouterModule],
  templateUrl: './rendez-vous.html',
  styleUrl: './rendez-vous.css',
})
export class RendezVous implements OnInit {
  searchText = signal('');
  pageSize = 10;
  currentPage = 1;
  rendezVous = signal<Rdv[]>([]);
  rdvList: Rdv[] = [];
  selectedRdv: Rdv | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilisateurService: UtilisateursService
  ) { }

  ngOnInit() {
    const idMedecin = localStorage.getItem('id'); // comme en React
    const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD

    if (!idMedecin) {
      console.error('Aucun id trouvé pour le médecin connecté');
      return;
    }

    this.utilisateurService
      .getRendezVousConfirmeDuMedecin(+idMedecin, today)
      .subscribe({
        next: (rendezVous: Rdv[]) => {
          // Trier comme en React (par date décroissante puis heure)
          const sorted = rendezVous.sort((a, b) => {
            const dateA = new Date(a.jour);
            const dateB = new Date(b.jour);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateB.getTime() - dateA.getTime();
            }
            return a.heure.localeCompare(b.heure);
          });

          this.rendezVous.set(sorted);
          this.goToPage(this.currentPage);
        },
        error: (err) =>
          console.error('Erreur lors du chargement des rendez-vous', err),
      });
  }

  filteredRendezVous = computed(() => {
    const filter = this.searchText().toLowerCase();
    const allRdv = this.rendezVous();

    if (!filter) return allRdv;

    return allRdv.filter((u) =>
      [u.jour, u.heure, u.patientNomComplet, u.medecinNomComplet, u.statut]
        .filter(Boolean)
        .some((v) => v.toString().toLowerCase().includes(filter))
    );
  });

  totalPages = computed(() =>
    this.filteredRendezVous
      ? Math.ceil(this.filteredRendezVous().length / this.pageSize)
      : 0
  );

  paginatedRendezVous = computed(() => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRendezVous().slice(start, start + this.pageSize);
  });

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
  }

  saveRendezVous() {
    if (this.selectedRdv) {
      console.log('Rendez-vous modifié :', this.selectedRdv);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login-page']);
  }

  openModal(rdv: Rdv) {
    this.selectedRdv = rdv;
  }

  closeModal() {
    this.selectedRdv = null;
  }

  goToDossierMedical() {
    if (!this.selectedRdv) return;
    const id = this.selectedRdv.patientId || this.selectedRdv.id;
    this.closeModal();
    this.router.navigate(['/dossier-medical', id]);
  }

  goToConsultation() {
    if (!this.selectedRdv) return;
    if (confirm("Voulez-vous passer en mode consultation ?")) {
      this.closeModal();
      this.router.navigate(['/consultation', this.selectedRdv.id]);
    }
  }

  cancelRendezVous() {
    if (!this.selectedRdv) return;
    if (confirm("Voulez-vous annuler ce rendez-vous ?")) {
      console.log("Rendez-vous annulé :", this.selectedRdv);
      // TODO: appel service backend pour annuler
      this.closeModal();
    }
  }

  isUrgences(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.authorities?.includes("URGENCES");
  }

  goToConsultationUrgence() {
    if (confirm("Voulez-vous passer en mode consultation d’urgence ?")) {
      this.router.navigate(['/consultation-urgence']);
    }
  }


}
