import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RdvService } from '../../../Services/rdv.service';
import { PatientService } from '../../../Services/patient.service';
import { UtilisateursService } from '../../../Services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { Rdv, RdvCreatePayload } from '../../../Interfaces/rdv.interface';
import { Patient } from '../../../Interfaces/patient.interface';
import { User } from '../../../Interfaces/user.interface';
import { ServiceMedical } from '../../../Enums/service-medical.enum';

interface SelectOption {
  value : string;
  label : string;
}

@Component({
  selector: 'app-create-rdv',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './create-rdv.html',
  styleUrl: './create-rdv.css'
})


export class CreateRdv implements OnInit {
  rdvForm!: FormGroup;
  patients: any[] = [];
  medecins: any[] = [];
  services = Object.values(ServiceMedical);


  constructor(private fb: FormBuilder,
    private createrdv: RdvService,
    private patientService: PatientService,
    private utlisateurService: UtilisateursService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rdvForm = new FormGroup({
      patientId: new FormControl('', Validators.required),
      medecinId: new FormControl('', Validators.required),
      jour: new FormControl('', Validators.required),
      heure: new FormControl('', Validators.required),
      notes: new FormControl(''),
      serviceMedical: new FormControl('', [Validators.required, Validators.email]),
    });

       // 🔁 Charger les médecins depuis le service utilisateur
    this.utlisateurService.getUsers().subscribe(data => {
      this.medecins = data;
    });

           // 🔁 Charger les patients depuis le service patient
    this.patientService.getPatients().subscribe(data => {
      this.patients = data;
    });

      // 🔁 Détection du changement de patientId
    this.rdvForm.get('patientId')?.valueChanges.subscribe((patientId: number) => {
      if (patientId) {
      this.patientService.getPatientById(patientId).subscribe((patient: Patient) => {
          this.rdvForm.patchValue({
            patientNomComplet: `${patient.nom} ${patient.prenom}`
          });
        });
      }else{
        this.rdvForm.patchValue({
          patientNomComplet: ''
        });
      }
    });

    // 🔁 Détection du changement de serviceMedical
    this.rdvForm.get('serviceMedical')?.valueChanges.subscribe((serviceMedical: string) => {
      if (serviceMedical) {
        this.utlisateurService.findUtilisateurByService(serviceMedical).subscribe((medecins: User[]) => {
          this.medecins = medecins;
        });
      } else {
        this.medecins = [];
      }
    });
  }

  onSubmit() {
    if (this.rdvForm.valid) {
      const formValue = this.rdvForm.value;

      // Structurer les données selon l'interface RdvCreatePayload
      // const rdvPayload: RdvCreatePayload = {
      //   nom: formValue.nom,
      //   prenom: formValue.prenom,
      //   telephone: formValue.telephone,
      //   adresse: formValue.adresse,
      //   email: formValue.email,
      //   genre: formValue.genre,
      //   dateNaissance: formValue.dateNaissance,
      //   actif: formValue.actif,
      //   password: formValue.password,
      //   dossierMedical: {
      //     groupeSanguin: formValue.dossierMedical.groupeSanguin,
      //     antecedentsMedicaux: formValue.dossierMedical.antecedentsMedicaux,
      //     allergies: formValue.dossierMedical.allergies,
      //     traitementsEnCours: formValue.dossierMedical.traitementsEnCours,
      //     observations: formValue.dossierMedical.observations
      //   }
      // };

      this.createrdv.createRdv(formValue).subscribe({
        next: (result) => {
          alert('Rendez-vous créé avec succès !');
          this.resetForm();
          this.router.navigate(['/rendez-vous']);
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

  resetForm(): void {
    this.rdvForm.reset();
    this.rdvForm.markAsPristine();
    this.rdvForm.markAsUntouched();
  }
}