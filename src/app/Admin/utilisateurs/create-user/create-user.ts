import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UtilisateursService } from '../../../Services/utilisateur.service';
import { UserCreatePayload } from '../../../Interfaces/user.interface';
  
interface SelectOption {
  value : string;
  label : string;
}

@Component({
  selector: 'app-create-user',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {
  userForm: FormGroup;
  isVisible = false;

  genre: SelectOption[] = [
    { value: 'F', label: 'Femme' },
    { value: 'M', label: 'Homme' }
  ];

  roles: SelectOption[] = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MEDECIN', label: 'Médecin' },
    { value: 'SECRETAIRE', label: 'Secrétaire' }
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
    { value: 'DENTISTERIE', label: 'Dentiste' },
    { value: 'PSYCHIATRIE', label: 'Pasychiatre' },
    { value: 'NEUROLOGIE', label: 'Neurologue' },
    { value: 'GASTRO_ENTEROLOGIE', label: 'Gastro-entérologue' },
    { value: 'PNEUMOLOGIE', label: 'Pneumologue' },
    { value: 'ENDOCRINOLOGIE', label: 'Endocrinologue' },
    { value: 'RHUMATOLOGIE', label: 'Rhumatologue' }
  ];


  constructor(private fb: FormBuilder,
    private createUser: UtilisateursService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      photoProfil:[''],
      dateNaissance: ['', Validators.required],
      adresse: [''],
      genre: ['M', Validators.required],
      password: ['', Validators.required], 
      serviceMedicalName: [''],           
      actif: [true],
      role: ['', Validators.required]
    });

        // Ecouter le changement du rôle pour afficher des champs conditionnels
    this.userForm.get('role')?.valueChanges.subscribe((role: string) => {
      // Ici, 'Medecin' est la valeur assignée dans ton select (MAJUSCULE)
      this.isVisible = role.toLowerCase() === 'medecin'; // ou simplement (role === 'Medecin')
      if (!this.isVisible) {
        this.userForm.get('serviceMedicalName')?.reset();
      }
    });
  }


  onSubmit(): void {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      const userPayload = {...user, role:{roleType: user.role}};

      // Supprimer le champ serviceMedicalName si l'utilisateur n'est pas médecin
      if (user.role !== 'MEDECIN') {
        delete userPayload.serviceMedicalName;
      }

      this.createUser.createUser(userPayload).subscribe({
        next: (result) => {
          // Affiche un message de succès, reset du formulaire, etc.
          alert('Utilisateur créé avec succès !');
          this.resetForm();
          this.router.navigate(['/Utilisateurs']);
        },
        error: (err) => {
          // Gestion d'erreur
          console.error('Erreur création utilisateur:', err);
          alert(`Erreur lors de la création: ${err.error?.message || err.message}`);
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
  }

    private resetForm(): void {
    this.userForm.reset({
      genre: 'M',
      actif: true,
      role: ''
    });
    this.isVisible = false;
  }
}