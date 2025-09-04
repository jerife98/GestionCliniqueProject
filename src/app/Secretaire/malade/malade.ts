import { CommonModule } from '@angular/common';
import { Component, computed, input, Input, OnInit, signal } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Patient } from '../../Interfaces/patient.interface';
import { PatientService } from '../../Services/patient.service';
import { CurrentUser } from '../../current-user/current-user';
import { Rdv } from '../../Interfaces/rdv.interface';

interface SelectOption {
  value : string;
  label : string;
}

@Component({
  selector: 'app-malade',
  imports: [RouterLink, CommonModule, FormsModule, CurrentUser, RouterModule],
  templateUrl: './malade.html',
  styleUrl: './malade.css'
})
export class Malade implements OnInit{
  searchText = signal('');
  pageSize = 10;
  currentPage = signal(1);
  patients = signal<Patient[]> ([]);


  selectedUser: Patient | null = null;

  constructor(private patientService: PatientService, private router: Router ){}

    ngOnInit() {
      this.patientService.getPatients().subscribe({
        next: users => {
          //  console.log(users);
          this.patients.set(users);
          console.log(users);
          
        this.goToPage(this.currentPage())},
        
          
        error: err => console.log('erreur lors du chargement des utilisateurs')
      });
    }

  filteredUsers = computed(() => {
    const filter = this.searchText().toLowerCase();
    const allUsers = this.patients();

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
  const start = (this.currentPage() - 1) * this.pageSize;
  return this.filteredUsers().slice(start, start + this.pageSize);
});

goToPage(page: number) {
  if (page < 1 || page > this.totalPages()) return;
  this.currentPage.set(page);
}

// Fonction appelée au clic sur une ligne
//   selectUser(user: Patient) {
//  this.patientService.findUtilisateurByNom(user.nom).subscribe({
//     next: (fullUser) => {
//       this.selectedUser = { ...fullUser };
//     },
//     error: (err) => {
//       console.error('Erreur lors de la récupération de l’utilisateur : ', err);
//       // Fallback: sélectionner l'utilisateur actuel
//       this.selectedUser = { ...user };
//     },
//   });
//   }

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

      logout() {
    // si tu stockes un token/localStorage :
    localStorage.removeItem('token'); 
    // navigation vers la page de login
    this.router.navigate(['/login-page']);
  }

    //pour supprimer un patient
    deletePatient(patient: Patient) {
      console.log('suppression demandée pour :', patient);
  
      if (!patient.id) {
        alert('Impossible de supprimer : ID patient manquant.');
        return;
      }
      if (
        confirm(
          `Voulez-vous vraiment supprimer l'utilisateur ${patient.nom} ${patient.prenom} ?`
        )
      ) {
        this.patientService.deletePatient(patient.id).subscribe({
          next: () => {
            // Mise à jour locale de la liste
            this.patients.set(
              this.patients().filter((u) => u.id !== patient.id)
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
