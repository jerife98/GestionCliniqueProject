import { Component, OnInit, signal, computed } from '@angular/core';
import { UtilisateursService } from '../../Services/utilisateur.service';
import {
  User,
  UserCreatePayload,
  UserUpdatePayload,
} from '../../Interfaces/user.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { UserDetails } from './user-details/user-details';

@Component({
  selector: 'app-utilisateurs',
  imports: [RouterLink, CommonModule, FormsModule, UserDetails],
  templateUrl: './utilisateurs.html',
  styleUrl: './utilisateurs.css',
})
export class Utilisateurs implements OnInit {
  searchText = signal('');
  pageSize = 10;
  currentPage = 1;
  utilisateurs = signal<User[]>([]);

  // selectedUser: UserCreatePayload | null = null;
  selectedUser: UserUpdatePayload | null = null;

  showUserModal = false;

  constructor(private utilisateurService: UtilisateursService) {}

  ngOnInit() {
    this.utilisateurService.getUtilisateurs().subscribe({
      next: (users) => {
        //  console.log(users);
        this.utilisateurs.set(users);
        console.log(users);

        this.goToPage(this.currentPage);
      },

      error: (err) => console.log('erreur lors du chargement des utilisateurs'),
    });
  }

  filteredUsers = computed(() => {
    const filter = this.searchText().toLowerCase();
    const allUsers = this.utilisateurs();

    if (!filter) {
      return allUsers;
    }
    return allUsers.filter((u) =>
      Object.values(u).some((v) =>
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
    this.utilisateurService.findUtilisateurById(user.id).subscribe({
      next: (fullUser) => {
        this.selectedUser = {
          ...fullUser,
          role: fullUser.role.roleType
        };
      },
      error: (err) => {
        console.error(
          'Erreur lors de la récupération de l’utilisateur : ',
          err
        );
        // Fallback: sélectionner l'utilisateur actuel
        this.selectedUser = {
          ...user,
          role: user.role.roleType  // Stocker le type de rôle
        };
      },
    });
  }

  openUserModal(user: User) {
    this.selectedUser = {
      ...user,
      role:  user.role.roleType  // Assurez-vous que le rôle est au format attendu
    };
    this.showUserModal = true;
  }

  closeUserModal() {
    this.selectedUser = null;
    this.showUserModal = false;
  }

  onUserUpdated(updatedUser: User) {
    // Mets à jour la liste locale si besoin
    const users = this.utilisateurs();
    const idx = users.findIndex((u) => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      this.utilisateurs.set([...users]);
    }
    this.closeUserModal();
  }

  // Pour sauvegarder les changements (ajoutez votre propre logique)
  // saveUser() {
  //   if (this.selectedUser) {
  //     // Récupère l'id de l'utilisateur sélectionné (par exemple, stocké dans une variable temporaire)
  //     const userId = this.utilisateurs().find(u => u.email === this.selectedUser!.email)?.id;
  //     if (!userId) {
  //       alert('ID utilisateur introuvable.');
  //       return;
  //     }
  //     this.utilisateurService.updateUser(userId, this.selectedUser).subscribe({
  //       next: (updated) => {
  //         // Mets à jour la liste locale
  //         const users = this.utilisateurs();
  //         const idx = users.findIndex(u => u.id === userId);
  //         if (idx !== -1) {
  //           users[idx] = { ...users[idx], ...this.selectedUser, role: { roleType: this.selectedUser.role } };
  //           this.utilisateurs.set([...users]);
  //         }
  //         this.closeUserModal();
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors de la mise à jour :', err);
  //         alert('Erreur lors de la mise à jour.');
  //       }
  //     });
  //   }
  // }

  getRoleName(roleId: number): string {
  switch(roleId) {
    case 1: return 'Admin';
    case 2: return 'Médecin';
    case 3: return 'Secrétaire';
    default: return 'Inconnu';
  }
}

  //pour supprimer un utilisateur
  deleteUser(user: User) {
    console.log('suppression demandée pour :', user);

    if (!user.id) {
      alert('Impossible de supprimer : ID utilisateur manquant.');
      return;
    }
    if (
      confirm(
        `Voulez-vous vraiment supprimer l'utilisateur ${user.nom} ${user.prenom} ?`
      )
    ) {
      this.utilisateurService.deleteUser(user.id).subscribe({
        next: () => {
          // Mise à jour locale de la liste
          this.utilisateurs.set(
            this.utilisateurs().filter((u) => u.id !== user.id)
          );
          alert('Utilisateur supprimé avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert("Erreur lors de la suppression de l'utilisateur.");
        },
      });
    }
  }
}
