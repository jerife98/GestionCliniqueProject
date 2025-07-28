import { Component, OnInit, signal, computed } from '@angular/core';
import { UtilisateursService } from '../../Services/utilisateur.service';
import { User } from '../../Interfaces/user.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-utilisateurs',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './utilisateurs.html',
  styleUrl: './utilisateurs.css'
})
export class Utilisateurs implements OnInit{
  searchText = signal('');
  pageSize = 10;
  currentPage = 1;
  utilisateurs = signal<User[]> ([]);


  selectedUser: User | null = null;

  constructor(private utilisateurService: UtilisateursService){}

    ngOnInit() {
      this.utilisateurService.getUtilisateurs().subscribe({
        next: users => {
          //  console.log(users);
          this.utilisateurs.set(users);
          console.log(users);
          
        this.goToPage(this.currentPage)},
        
          
        error: err => console.log('erreur lors du chargement des utilisateurs')
      });
    }

  filteredUsers = computed(() => {
    const filter = this.searchText().toLowerCase();
    const allUsers = this.utilisateurs();

    if(!filter){
      return allUsers;
    }
    return allUsers.filter(u =>
      Object.values(u).some(v =>
      (v ?? '').toString().toLowerCase().includes(filter)
      
    )
    );
  });

totalPages = computed(() => {
  return Math.ceil(this.filteredUsers().length / this.pageSize);
});

paginatedUsers = computed(() => {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.filteredUsers().slice(start, start + this.pageSize);
});

goToPage(page: number) {
  if (page < 1 || page > this.totalPages()) return;
  this.currentPage = page;
}

// Fonction appelée au clic sur une ligne
  selectUser(user: User) {
 this.utilisateurService.findUtilisateurByNom(user.nom).subscribe({
    next: (fullUser) => {
      this.selectedUser = { ...fullUser };
    },
    error: (err) => {
      console.error('Erreur lors de la récupération de l’utilisateur : ', err);
      // Fallback: sélectionner l'utilisateur actuel
      this.selectedUser = { ...user };
    },
  });
  }

  // Pour sauvegarder les changements (ajoutez votre propre logique)
  saveUser() {
    if (this.selectedUser) {
      // Ici vous pouvez appeler votre service pour enregistrer les modifications
      console.log('Utilisateur modifié :', this.selectedUser);
      // Exemple :
      // this.utilisateurService.updateUser(this.selectedUser).subscribe(...)
      
      // Puis éventuellement remettre à null ou rafraichir la liste
    }
  }

}