import { CommonModule } from '@angular/common';
import {
  Component,
  computed,

  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RdvService } from '../../Services/rdv.service';
import { Rdv, RdvCreatePayload, RdvUpdatePayload } from '../../Interfaces/rdv.interface';
import { CurrentUser } from '../../current-user/current-user';

@Component({
  selector: 'app-rdvs',
  imports: [RouterLink, CommonModule, FormsModule, CurrentUser],
  templateUrl: './rdvs.html',
  styleUrl: './rdvs.css'
})
export class Rdvs  implements OnInit {
  searchText = signal('');
  pageSize = 10;
  currentPage = 1;
  rendezVous = signal<Rdv[]>([]);

  selectedUser: Rdv | null = null;

  constructor(private rdvService: RdvService) {}

  ngOnInit() {
    this.rdvService.getRdv().subscribe({
      next: (rendezVous) => {
        //  console.log(users);
        this.rendezVous.set(rendezVous);
        console.log(rendezVous);

        this.goToPage(this.currentPage);
      },

      error: (err) => console.log('erreur lors du chargement des utilisateurs'),
    });
  }

  filteredRendezVous = computed(() => {
    const filter = this.searchText().toLowerCase();
    const allRdv = this.rendezVous();

    if (!filter) {
      return allRdv;
    }
    return allRdv.filter((u) =>
      Object.values(u).some((v) =>
        (v ?? '').toString().toLowerCase().includes(filter)
      )
    );
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredRendezVous().length / this.pageSize) || 0;
  });

  paginatedRendezVous = computed(() => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRendezVous().slice(start, start + this.pageSize);
  });

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
  }
  // Pour sauvegarder les changements (ajoutez votre propre logique)
  saveRendezVous() {
    if (this.selectedUser) {
      console.log('Rendez-vous modifié :', this.selectedUser);
    }
  }
}
