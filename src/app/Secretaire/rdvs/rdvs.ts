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
import { Rdv, RdvCreatePayload, RdvUpdatePayload } from '../../Interfaces/rdv.interface';
import { CurrentUser } from '../../current-user/current-user';
import { StatutRdv } from '../../Enums/statut-rdv.enum';


@Component({
  selector: 'app-rdvs',
  imports: [RouterLink, CommonModule, FormsModule, CurrentUser, RouterModule],
  templateUrl: './rdvs.html',
  styleUrl: './rdvs.css'
})
export class Rdvs  implements OnInit {
  isToggled = false;
  searchText = signal('');
  pageSize = 10;
  currentPage = 1;
  rendezVous = signal<Rdv[]>([]);

  selectedUser: Rdv | null = null;

  constructor(private rdvService: RdvService, private router: Router) {}

  ngOnInit() {
    this.loadRendezVous();
  }

  private loadRendezVous() {
    this.rdvService.getRdv().subscribe({
      next: rdvs => {
        this.rendezVous.set(rdvs);
        this.goToPage(this.currentPage);
      },
      error: err => console.error('Erreur lors du chargement des rendez-vous', err)
    });
  }

  filteredRendezVous = computed(() => {
    const filter = this.searchText().toLowerCase();
    const allRdv = this.rendezVous();

    if (!filter) return allRdv;

    return allRdv.filter(u =>
      Object.values(u).some(v =>
        (v ?? '').toString().toLowerCase().includes(filter)
      )
    );
  });

  totalPages = computed(() => Math.ceil(this.filteredRendezVous().length / this.pageSize) || 0);

  paginatedRendezVous = computed(() => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRendezVous().slice(start, start + this.pageSize);
  });

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
  }

  logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/login-page']);
  }

  /** 🔹 Voir les détails d’un rendez-vous */
  viewRendezVous(rdv: Rdv) {
    if (rdv.statut === StatutRdv.ANNULE) {
      alert("Ce rendez-vous est annulé et ne peut pas être consulté."); 
      return;
    }
    this.router.navigate(['/secretaire/rendezvous/viewrendezvous', rdv.id]);
  }

  /** 🔹 Annuler un rendez-vous */
  annulerRdv(rdv: Rdv, event: Event) {
    event.stopPropagation();

    if (rdv.statut === StatutRdv.CONFIRME) {
      alert("Impossible d'annuler un rendez-vous confirmé.");
      return;
    }

    if (confirm("Voulez-vous annuler ce rendez-vous ?")) {
      this.rdvService.cancelRdv(rdv.id!).subscribe({
        next: updatedRdv => {
          this.rendezVous.set(this.rendezVous().map(r =>
            r.id === updatedRdv.id ? updatedRdv : r
          ));
          alert("Rendez-vous annulé avec succès");
        },
        error: () => alert("Erreur lors de l'annulation du rendez-vous")
      });
    }
  }

  /** 🔹 Supprimer un rendez-vous */
  supprimerRdv(rdv: Rdv, event: Event) {
    event.stopPropagation();

    if (rdv.statut === StatutRdv.TERMINE) {
      alert("Impossible de supprimer un rendez-vous terminé.");
      return;
    }

    if (confirm("Voulez-vous supprimer ce rendez-vous ?")) {
      this.rdvService.deleteRdv(rdv.id!).subscribe({
        next: () => {
          this.rendezVous.set(this.rendezVous().filter(r => r.id !== rdv.id));
          alert("Rendez-vous supprimé avec succès");
        },
        error: () => alert("Erreur lors de la suppression du rendez-vous")
      });
    }
  }

  /** 🔹 Sauvegarde locale des modifications (optionnel) */
  saveRendezVous() {
    if (this.selectedUser) {
      console.log('Rendez-vous modifié :', this.selectedUser);
    }
  }
}
