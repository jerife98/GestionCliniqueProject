import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CurrentUser } from '../../current-user/current-user';
import { Rdv } from '../../Interfaces/rdv.interface';
import { RdvService } from '../../Services/rdv.service';
import { FormFacture } from '../../Formulaires/form-facture/form-facture';

@Component({
  selector: 'app-facture',
  imports: [RouterLink, CommonModule, FormsModule, CurrentUser, RouterModule, FormFacture],
  templateUrl: './facture.html',
  styleUrl: './facture.css'
})
export class Facture implements OnInit {

  @Input() id!: number;
  @Input() rdv!: Rdv; // On reçoit directement le RDV complet
  isToggled = false;
  searchText = signal('');
  pageSize = 10;
  currentPage = 1;
  rendezVous = signal<Rdv[]>([]);
  erreur = signal<string>('');
  isLoading = signal<boolean>(false);
  showModal = false;

  selectedUser: Rdv | null = null;
  selectedRdv: Rdv | null = null;

  constructor(private rdvService: RdvService, private router: Router) { }

  ngOnInit() {
    console.log(this.rdv);

    this.fetchRendezVous();
  }



  fetchRendezVous() {
    this.isLoading.set(true);
    this.erreur.set('');

    this.rdvService.getRdv().subscribe({
      next: (rdvList) => {
        // Trier par ID décroissant 
        this.rendezVous.set(rdvList.sort((a, b) => b.id! - a.id!));
      },
      error: (err) => {
        console.error(err);
        this.erreur.set('Erreur lors du chargement des factures');
      },
      complete: () => this.isLoading.set(false)
    });
  }

  // Filtrage
  filteredRendezVous = computed(() => {
    const filter = this.searchText().toLowerCase();
    if (!filter) return this.rendezVous();
    return this.rendezVous().filter(rdv =>
      (rdv.jour ?? '').toLowerCase().includes(filter) ||
      (rdv.patientNomComplet ?? '').toLowerCase().includes(filter) ||
      (rdv.serviceMedical ?? '').toLowerCase().includes(filter)
    );
  });

  // Pagination
  totalPages = computed(() => Math.ceil(this.filteredRendezVous().length / this.pageSize) || 0);

  paginatedRendezVous = computed(() => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRendezVous().slice(start, start + this.pageSize);
  });

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
  }

  // Modal
  openModal(rdv: Rdv) {
    this.selectedRdv = rdv;

  }

  closeModal() {
    this.selectedRdv = null;

  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login-page']);
  }
}
