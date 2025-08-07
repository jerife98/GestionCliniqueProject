import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { UserCreatePayload, User, UserUpdatePayload, ServiceMedicalType } from '../../../Interfaces/user.interface';
import { UtilisateursService } from '../../../Services/utilisateur.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Role } from '../../../Interfaces/user.interface';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-user-details',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.css'],
})
export class UserDetails implements OnInit, OnChanges {
  // @Output() close = new EventEmitter<void>();
  // @Output() userUpdated = new EventEmitter<UserCreatePayload>();
  // @Input() user: UserUpdatePayload | null = null;
  @Input() user!: UserUpdatePayload | null;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<User>();




  userForm!: FormGroup;
  isEditing = false;
  isLoading = false;

  genre: SelectOption[] = [
    { value: 'F', label: 'Femme' },
    { value: 'M', label: 'Homme' },
  ];

  roles: SelectOption[] = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MEDECIN', label: 'Médecin' },
    { value: 'SECRETAIRE', label: 'Secrétaire' },
  ];

  services: SelectOption[] = [
    { value: 'MEDECINE_GENERALE', label: 'Médecin généraliste' },
    { value: 'PEDIATRIE', label: 'Pédiatre' },
    { value: 'GYNECOLOGIE', label: 'Gynécologue' },
    { value: 'CARDIOLOGIE', label: 'Cardiologue' },
    { value: 'DERMATOLOGIE', label: 'Dermatologue' },
    { value: 'OPHTALMOLOGIE', label: 'Ophtalmologue' },
    { value: 'ORTHOPEDIE', label: 'Othopédiste' },
    { value: 'RADIOLOGIE', label: 'Radiologue' },
    { value: 'LABORATOIRE_ANALYSES', label: 'Laborantin' },
    { value: 'URGENCES', label: 'Urgentiste' },
    { value: 'KINESITHERAPIE', label: 'Kiné' },
    { value: 'DENTISTE', label: 'Dentiste' },
    { value: 'PSYCHIATRIE', label: 'Pasychiatre' },
    { value: 'NEUROLOGIE', label: 'Neurologue' },
    { value: 'GASTRO_ENTEROLOGIE', label: 'Gastro-entérologue' },
    { value: 'PNEUMOLOGIE', label: 'Pneumologue' },
    { value: 'ENDOCRINOLOGIE', label: 'Endocrinologue' },
    { value: 'RHUMATOLOGIE', label: 'Rhumatologue' },
  ];
  constructor(private utilisateurService: UtilisateursService) {}

  ngOnInit() {
    this.initForm();      
    if (this.user) {
      this.userForm.patchValue({
        ...this.user,
        role: this.user.role // Utiliser directement le type de rôle
      });
      this.userForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['user'] && this.userForm && this.user) {
      this.userForm.patchValue({
        ...this.user,
        role: this.user.role // Utiliser directement le type de rôle
      });
      this.userForm.disable();
      this.isEditing = false;
    }
  }

  initForm() {
this.userForm = new FormGroup({
  nom: new FormControl({ value: '', disabled: true }, Validators.required),
  prenom: new FormControl({ value: '', disabled: true }, Validators.required),
  adresse: new FormControl({ value: '', disabled: true }),
  email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
  genre: new FormControl({ value: '', disabled: true }, Validators.required),
  dateNaissance: new FormControl({ value: '', disabled: true }, Validators.required),
  telephone: new FormControl({ value: '', disabled: true }, Validators.required),
  password: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]),
  serviceMedicalName: new FormControl({ value: '', disabled: true }),
  actif: new FormControl({ value: false, disabled: true }),
  role: new FormControl({ value: '', disabled: true }, Validators.required),
});

  }

 startEdit() {
  this.isEditing = true;
  this.userForm.enable();
}


cancelEdit() {
  this.isEditing = false;
  this.userForm.disable();
  if (this.user) {
    // S'assurer que le roleType est toujours un string lors de l'annulation
  
    // Réinitialiser le formulaire avec les valeurs de l'utilisateur
    this.userForm.patchValue({
      ...this.user,
      role: this.user.role
    });
  }
}

// saveEdit() {
//   if (!this.userForm.valid || !this.user) return;

//   this.isLoading = true;

//   const formValues = this.userForm.value;

//     // Conversion propre du rôle
//   const roleValue = typeof formValues.role === 'string' 
//     ? formValues.role 
//     : formValues.role.roleType;

//     if (!this.user?.id || this.user.id <= 0) {
//   console.error('ID utilisateur invalide ou manquant');
//   // Soit retourner une erreur, soit rediriger vers la création
//   return;
// }
//   const userToUpdate: UserUpdatePayload = {
//     id: this.user.id,
//     ...formValues,
//     role: roleValue // Maintenant c'est toujours un string
//   };

//   this.utilisateurService.updateUser(userToUpdate).subscribe({
//     next: (updated: User) => {
//       this.isLoading = false;
//       this.userUpdated.emit({
//         ...updated,
//         role: typeof updated.role === 'string' ? updated.role : updated.role.roleType,
//       });
//       this.isEditing = false;
//       this.userForm.disable();
//     },
//     error: (err) => {
//       this.isLoading = false;
//       console.error('Erreur mise à jour:', err);
//     },
//   });
// }

saveEdit() {
  if (!this.userForm.valid || !this.user) {
    console.error('Formulaire invalide ou utilisateur non défini');
    return;
  }

  // if (!this.user.id || this.user.id <= 0) {
  //   console.error('ID utilisateur invalide:', this.user.id);
  //   return;
  // }

  this.isLoading = true;
  const formValues = this.userForm.value;
  

  const userToUpdate: UserUpdatePayload = {
    id: this.user.id,
    nom: formValues.nom,
    prenom: formValues.prenom,
    email: formValues.email,
    genre: formValues.genre,
    dateNaissance: formValues.dateNaissance,
    telephone: formValues.telephone,
    adresse: formValues.adresse,
    password: formValues.password,
    serviceMedicalName: formValues.serviceMedicalName as ServiceMedicalType,
    actif: formValues.actif,
    role: formValues.role // Envoyer le type de rôle directement
    
  };

  // const userToUpdate: UserUpdatePayload = {
  //   id: this.user.id,
  //   nom: formValues.nom,
  //   prenom: formValues.prenom,
  //   email: formValues.email,
  //   genre: formValues.genre,
  //   dateNaissance: formValues.dateNaissance,
  //   actif: formValues.actif,
  //    role: typeof formValues.role === 'string' 
  //         ? formValues.role 
  //         : (formValues.role as Role)?.roleType ?? '', // <-- rôle sous forme de string ici ✅

  //   ...(formValues.adresse && { adresse: formValues.adresse }),
  //   ...(formValues.telephone && { telephone: formValues.telephone }),
  //   ...(formValues.serviceMedicalName && { serviceMedicalName: formValues.serviceMedicalName }),
  //   ...(formValues.password && { password: formValues.password }),
  // };
  console.log('Payload final envoyé au backend :', userToUpdate);

  this.utilisateurService.updateUser(userToUpdate).subscribe({
    next: (updated: User) => {
      this.isLoading = false;
      this.userUpdated.emit(updated); // on renvoie un User complet
      this.isEditing = false;
      this.userForm.disable();
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Erreur mise à jour:', err);
    },
  });
}



}
