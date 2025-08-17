import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { User, UserUpdatePayload, ServiceMedicalType } from '../../../Interfaces/user.interface';
import { UtilisateursService } from '../../../Services/utilisateur.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-details',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.css'],
})
export class UserDetails implements OnInit, OnChanges {
  @Input() user: UserUpdatePayload | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<User>();

  userForm!: FormGroup;
  isEditing = false;
  isLoading = false;

  genre = [
    { value: 'F', label: 'Femme' },
    { value: 'M', label: 'Homme' },
  ];

  roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MEDECIN', label: 'Médecin' },
    { value: 'SECRETAIRE', label: 'Secrétaire' },
  ];

  services = [
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
    if (this.user) this.fillForm(this.user);
    
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['user'] && this.userForm && this.user) {
    this.fillForm(this.user);
    this.userForm.disable();
    this.isEditing = false;
  } 
}

  private initForm() {
    this.userForm = new FormGroup({
      nom: new FormControl({ value: '', disabled: true }, Validators.required),
      prenom: new FormControl({ value: '', disabled: true }, Validators.required),
      adresse: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      genre: new FormControl({ value: '', disabled: true }, Validators.required),
      dateNaissance: new FormControl({ value: '', disabled: true }, Validators.required),
      telephone: new FormControl({ value: '', disabled: true }, Validators.required),
      password: new FormControl({ value: '', disabled: true }, [Validators.minLength(6)]),
      serviceMedicalName: new FormControl({ value: '', disabled: true }),
      actif: new FormControl({ value: false, disabled: true }),
      role: new FormControl({ value: '', disabled: true }, Validators.required),
    });
  }

  private fillForm(user: UserUpdatePayload) {
    this.userForm.patchValue({
      ...user,
      role: typeof user.role === 'string' ? user.role : user.role,
    });
    this.userForm.disable();
    this.isEditing = false;
  }

 startEdit() {
  this.isEditing = true;
  this.userForm.enable();
}


cancelEdit() {
  if (this.user) this.fillForm(this.user);
}

saveEdit() {
  if (!this.userForm.valid || !this.user?.id) {
    console.error('Formulaire invalide ou utilisateur non défini');
    return;
  }

  this.isLoading = true;
  const formValues = this.userForm.getRawValue();

  const userToUpdate: UserUpdatePayload = {
    id: this.user.id,
    nom: formValues.nom || '',
    prenom: formValues.prenom || '',
    email: formValues.email || '',
    genre: formValues.genre as 'F' | 'M',
    dateNaissance: formValues.dateNaissance || '',
    telephone: formValues.telephone || '',
    adresse: formValues.adresse || '',
    serviceMedicalName: formValues.serviceMedicalName as ServiceMedicalType,
    actif: formValues.actif ?? true,
    role: typeof formValues.role === 'object' ? formValues.role.roleType : formValues.role,
    password: formValues.password?.trim()|| '',
  };

  if(formValues.password) delete (userToUpdate as any).password; // Ne pas envoyer le mot de passe si vide

  console.log('Payload final envoyé au backend :', userToUpdate);

  this.utilisateurService.updateUser(userToUpdate).subscribe({
    next: (updated) => {
      console.log('Utilisateur mis à jour avec succès', updated);
      
      this.isEditing = false;
      this.userForm.disable();
      this.userUpdated.emit(updated); // on renvoie un User complet
    },
    error: (err) => {
      console.error('Erreur mise à jour:', err);
    },
  });
}

}
