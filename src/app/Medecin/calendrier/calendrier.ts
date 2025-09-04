import { CommonModule } from '@angular/common';
import { Component, computed, input, Input, OnInit, signal } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Patient } from '../../Interfaces/patient.interface';
import { PatientService } from '../../Services/patient.service';
import { CurrentUser } from '../../current-user/current-user';

@Component({
  selector: 'app-calendrier',
  imports: [RouterLink, CommonModule, FormsModule, CurrentUser, RouterModule],
  templateUrl: './calendrier.html',
  styleUrl: './calendrier.css'
})
export class Calendrier implements OnInit{
  searchText = signal('');
  pageSize = 10;
  currentPage = 1;
  patients = signal<Patient[]> ([]);


  selectedUser: Patient | null = null;

  constructor(private patientService: PatientService, private router: Router ){}

    ngOnInit() {
      this.patientService.getPatients().subscribe({
        next: users => {
          //  console.log(users);
          this.patients.set(users);
          console.log(users);
          
        this.goToPage(this.currentPage)},
        
          
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
  const start = (this.currentPage - 1) * this.pageSize;
  return this.filteredUsers().slice(start, start + this.pageSize);
});

goToPage(page: number) {
  if (page < 1 || page > this.totalPages()) return;
  this.currentPage = page;
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
    localStorage.removeItem('token'); 
    this.router.navigate(['/login-page']);
  }

}