import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../Services/patient.service';
import { CommonModule } from '@angular/common';
import { Patient, PatientCreatePayload } from '../../../Interfaces/patient.interface';

interface SelectOption {
  value : string;
  label : string;
}

@Component({
  selector: 'app-create-patient',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './create-patient.html',
  styleUrl: './create-patient.css'
})
export class CreatePatient {
  patientForm: FormGroup;
  isVisible = false;

  genre: SelectOption[] = [
    { value: 'F', label: 'Femme' },
    { value: 'M', label: 'Homme' }
  ];

  groupeSanguin: SelectOption[] = [
    { value: 'A+', label: 'A +' },
    { value: 'A-', label: 'A -' },
    { value: 'B+', label: 'B +' },
    { value: 'B-', label: 'B -' },    
    { value: 'AB+', label: 'AB +' },
    { value: 'AB-', label: 'AB -' },
    { value: 'O+', label: 'O +' },
    { value: 'O-', label: 'O -' },
  ];

  constructor(private fb: FormBuilder,
    private createPatient: PatientService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: [''],
      adresse: [''],
      email: ['', [Validators.required, Validators.email]],
      genre: ['M', Validators.required],
      dateNaissance: ['', Validators.required],
      actif: [true],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dossierMedical: this.fb.group({
        groupeSanguin: [''],
        antecedentsMedicaux: [''],
        allergies: [''],
        traitementsEnCours: [''],
        observations: ['']
      })
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      const formValue = this.patientForm.value;
      
      // Structurer les données selon l'interface PatientCreatePayload
      const patientPayload: PatientCreatePayload = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        telephone: formValue.telephone,
        adresse: formValue.adresse,
        email: formValue.email,
        genre: formValue.genre,
        dateNaissance: formValue.dateNaissance,
        actif: formValue.actif,
        password: formValue.password,
        dossierMedical: {
          groupeSanguin: formValue.dossierMedical.groupeSanguin,
          antecedentsMedicaux: formValue.dossierMedical.antecedentsMedicaux,
          allergies: formValue.dossierMedical.allergies,
          traitementsEnCours: formValue.dossierMedical.traitementsEnCours,
          observations: formValue.dossierMedical.observations
        }
      };

      this.createPatient.createPatient(patientPayload).subscribe({
        next: (result) => {
          alert('Patient créé avec succès !');
          this.resetForm();
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          console.error('Erreur création patient:', err);
          alert(`Erreur lors de la création: ${err.error?.message || err.message}`);
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.patientForm.reset({
      genre: 'M',
      actif: true,
      dossierMedical: {
        groupeSanguin: '',
        antecedentsMedicaux: '',
        allergies: '',
        traitementsEnCours: '',
        observations: ''
      }
    });
    this.isVisible = false;
  }
}