// import { Component, Input, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Patient } from '../../Interfaces/patient.interface';
// import { ServiceMedical } from '../../Enums/service-medical.enum';
// import { PatientService } from '../../Services/patient.service';

// interface SelectOption {
//   value : string;
//   label : string;
// }

// @Component({
//   selector: 'app-infos-patient',
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './infos-patient.html',
//   styleUrl: './infos-patient.css'
// })
// export class InfosPatient implements OnInit {
//   @Input() formGroup!: FormGroup; // Injecté depuis create-rdv ou create-malade
//   @Input() isVisible: boolean = false;

//   patients: Patient[] = [];
//   services = Object.values(ServiceMedical);

//   genre: SelectOption[] = [
//     { value: 'F', label: 'Femme' },
//     { value: 'M', label: 'Homme' }
//   ];

//   groupeSanguin: SelectOption[] = [
//     { value: 'A+', label: 'A +' },
//     { value: 'A-', label: 'A -' },
//     { value: 'B+', label: 'B +' },
//     { value: 'B-', label: 'B -' },
//     { value: 'AB+', label: 'AB +' },
//     { value: 'AB-', label: 'AB -' },
//     { value: 'O+', label: 'O +' },
//     { value: 'O-', label: 'O -' }
//   ];

//   constructor(
//     private patientService: PatientService,
//     private fb: FormBuilder
//   ) {}

//   ngOnInit(): void {

//     if (!this.formGroup) {
//     console.error('A FormGroup instance is required');
//     return;
//   }
//     // Désactive le formulaire en mode lecture seule
//     if (this.isVisible) {
//       this.formGroup.disable();
//     }

//     // Charger la liste des patients pour le <select>
//     this.patientService.getPatients().subscribe({
//       next: (patients: Patient[]) => {
//         this.patients = patients;
//       },
//       error: (err) => {
//         console.error('Erreur lors de la récupération des patients :', err);
//       }
//     });

//     // Préremplir les champs quand on sélectionne un patient
//     this.formGroup.get('patientId')?.valueChanges.subscribe((id: number) => {
//       if (id) {
//         this.patientService.getPatientById(id).subscribe({
//           next: (patient: Patient) => {
//             const { id: _, ...rest } = patient; // Exclure l'ID
//             this.formGroup.patchValue(rest);
//           },
//           error: (err) => {
//             console.error('Erreur lors du chargement du patient :', err);
//           }
//         });
//       } else {
//         // Si aucun patient sélectionné, vider les champs
//         this.formGroup.reset({
//   patientId: null,
//   nom: '',
//   prenom: '',
//   adresse: '',
//   email: '',
//   genre: '',
//   dateNaissance: '',
//   telephone: ''
// });
//         this.formGroup.patchValue({ patientId: null });
//       }
//     });
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient } from '../../Interfaces/patient.interface';
import { ServiceMedical } from '../../Enums/service-medical.enum';
import { PatientService } from '../../Services/patient.service';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-infos-patient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './infos-patient.html',
  styleUrl: './infos-patient.css'
})
export class InfosPatient implements OnInit {
  @Input() formGroup!: FormGroup; // Injecté depuis create-rdv ou create-malade
  @Input() isVisible: boolean = false;

  patients: Patient[] = [];
  services = Object.values(ServiceMedical);

  genre: SelectOption[] = [
    { value: 'F', label: 'Femme' },
    { value: 'M', label: 'Homme' }
  ];

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (!this.formGroup) {
      console.error('A FormGroup instance is required');
      return;
    }

    // Désactive le formulaire en mode lecture seule
    if (this.isVisible) {
      this.formGroup.disable();
    }

    // Charger la liste des patients pour le <select>
    this.patientService.getPatients().subscribe({
      next: (patients: Patient[]) => {
        this.patients = patients;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des patients :', err);
      }
    });

    // Préremplir les champs quand on sélectionne un patient
    this.formGroup.get('patientId')?.valueChanges.subscribe((id: number) => {
      if (id) {
        this.patientService.getPatientById(id).subscribe({
          next: (patient: Patient) => {
            const { id: _, ...rest } = patient; // Exclure l'ID
            this.formGroup.patchValue(rest, { emitEvent: false });          },
          error: (err) => {
            console.error('Erreur lors du chargement du patient :', err);
          }
        });
      } else {
        // Si aucun patient sélectionné, vider les champs
        this.formGroup.reset();
        this.formGroup.patchValue({ patientId: null });
      }
    });
  }
}