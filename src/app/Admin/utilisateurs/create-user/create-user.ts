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
  isLoading = false;

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
    { value: 'DENTISTE', label: 'Dentiste' },
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
      dateNaissance: ['', Validators.required],
      telephone: [''],
      adresse: [''],
      genre: ['M', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]], // Ajouter minLength
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
      const token = localStorage.getItem('auth_token');
      if (!token) {
        this.showErrorMessage('Session expirée. Veuillez vous reconnecter.');
        this.router.navigate(['/login']);
        return;
      }

      this.isLoading = true;
      const formValues = this.userForm.value;

      console.log('Données du formulaire:', formValues);

      // Version alternative si le backend attend un objet role
      const userPayload = {
  ...formValues,
  role: formValues.role
  
};

      // Ajouter serviceMedicalName seulement si c'est un médecin
      if (this.userForm.value.role === '2') {
        userPayload.serviceMedicalName = this.userForm.value.serviceMedicalName;
      }

      console.log('Payload envoyé:', userPayload);

      this.createUser.createUser(userPayload).subscribe({
        next: (result) => {
          this.isLoading = false;
          console.log('Utilisateur créé avec succès:', result);
          this.showSuccessMessage('Utilisateur créé avec succès !');
          this.resetForm();
          this.router.navigate(['/utilisateurs']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur détaillée:', err);
          console.error('Status:', err.status);
          console.error('Message:', err.error);
          
          if (err.status === 400) {
            this.showErrorMessage('Format de données incorrect. Vérifiez les informations.');
          } else if (err.status === 403) {
            this.showErrorMessage('Accès refusé. Vérifiez vos permissions.');
          } else {
            const errorMessage = this.getErrorMessage(err);
            this.showErrorMessage(errorMessage);
          }
        }
      });
    } else {
      console.log('Formulaire invalide:', this.userForm.errors);
      this.markFormGroupTouched();
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



  private markFormGroupTouched(): void {
    Object.values(this.userForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private showSuccessMessage(message: string): void {
    // Implement a notification service here
    alert(message);
  }

  private showErrorMessage(message: string): void {
    // Implement a notification service here
    alert(message);
  }

  private getErrorMessage(err: any): string {
    if (err.status === 409) {
      return 'Un utilisateur avec cet email existe déjà.';
    } else if (err.status === 400) {
      return 'Données invalides. Veuillez vérifier vos informations.';
    } else if (err.status === 401) {
      return 'Session expirée. Veuillez vous reconnecter.';
    } else {
      return 'Erreur lors de la création. Veuillez réessayer.';
    }
  }
}