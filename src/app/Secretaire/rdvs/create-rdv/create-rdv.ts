import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { InfosPatient } from '../../../Formulaires/infos-patient/infos-patient';
import { CurrentUser } from '../../../current-user/current-user';

interface SelectOption {
  value : string;
  label : string;
}

@Component({
  selector: 'app-create-rdv',
  imports: [InfosPatient, RouterLink, ReactiveFormsModule, CommonModule, CurrentUser],
  templateUrl: './create-rdv.html',
  styleUrl: './create-rdv.css'
})


export class CreateRdv implements OnInit {
  rdvForm: FormGroup;
  InfosFormGroup: FormGroup; // Formulaire pour les informations du patient
  patients: Patient[] = [];
  medecins: User[] = [];
  filteredMedecins: User[] = [];
  isLoading = false;
  services = Object.values(ServiceMedical);


  constructor(private fb: FormBuilder,
    private createrdv: RdvService,
    private patientService: PatientService,
    private utlisateurService: UtilisateursService,
    private router: Router,
    private cdRef: ChangeDetectorRef // Ajout de ChangeDetectorRef

  ) {

    this.InfosFormGroup = this.fb.group({
      patientId: [null, Validators.required],
      nom: [''],
      prenom: [''],
      adresse: [''],
      email: [''],
      genre: [''],
      dateNaissance: [''],
      telephone: ['']
    });
    
    this.rdvForm = this.fb.group({
      serviceMedical: ['', Validators.required],
      medecinId: ['', Validators.required],
      jour: ['', Validators.required],
      heure: ['', Validators.required],
      notes: [''],
      patientNomComplet: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {

    // Chargement des patients
    this.loadPatients();

    // Chargement des médecins
    this.setupFormListeners();
    

    this.loadServicesEtMedecins();
    // ... reste de l'initialisation
}

       // 🔁 Charger les médecins depuis le service utilisateur
 private loadServicesEtMedecins(): void {
    // 1. Chargez d'abord les services disponibles
    this.services = Object.values(ServiceMedical);

    // 2. Chargez les médecins pour le service par défaut
    this.loadMedecinsByService(ServiceMedical.MEDECINE_GENERALE);
  }

  private loadMedecinsByService(service: ServiceMedical): void {
    this.isLoading = true;
    
    this.utlisateurService.getMedecinsByService(service).subscribe({
      next: (medecins) => {
        // Inclure les médecins même si serviceMedicalName est null
        console.log('Médecins reçus: ', medecins);
        
        this.filteredMedecins = medecins.filter(m => 
          m.role?.roleType === 'MEDECIN' &&
          (!m.serviceMedicalName || m.serviceMedicalName === service)
        );
        console.log('Médecins filtrés: ', this.filteredMedecins);
        
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.filteredMedecins = [];
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }
       // Exemple : charger tous les médecins (à adapter selon votre logique)
private setupFormListeners(): void {
      // Charger les médecins quand le service change
    this.rdvForm.get('serviceMedical')?.valueChanges.subscribe(service => {
      if (service) {
        this.loadMedecinsByService(service);
      } else {
        this.filteredMedecins = [];
        this.rdvForm.get('medecinId')?.reset();
      }
    });

        // Détection du changement de patient
    this.InfosFormGroup.get('patientId')?.valueChanges.subscribe(patientId => {
      if (patientId) {
        this.loadPatientDetails(patientId);
      } else {
        this.rdvForm.patchValue({ patientNomComplet: '' });
      }
    });

}

  private loadPatients(): void {
    this.isLoading = true;
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des patients:', err);
        this.isLoading = false;
      }
    });
  }

  private loadPatientDetails(patientId: number): void {
    this.patientService.getPatientById(patientId).subscribe({
      next: (patient) => {
        this.rdvForm.patchValue({
          patientNomComplet: `${patient.nom} ${patient.prenom}`
        });
        this.InfosFormGroup.patchValue({
          nom: patient.nom,
          prenom: patient.prenom,
          adresse: patient.adresse,
          email: patient.email,
          genre: patient.genre,
          dateNaissance: patient.dateNaissance,
          telephone: patient.telephone
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement du patient:', err);
      }
    });
  }


  onSubmit() {
    if (this.rdvForm.valid && this.InfosFormGroup.valid) {
      const formValue = this.rdvForm.getRawValue();

      // Structurer les données selon l'interface RdvCreatePayload
      const rdvPayload: RdvCreatePayload = {
        patientId: this.InfosFormGroup.get('patientId')?.value,
        medecinId: this.rdvForm.get('medecinId')?.value,
        jour: this.rdvForm.get('jour')?.value,
        heure: this.rdvForm.get('heure')?.value,
        notes: this.rdvForm.get('notes')?.value,
        serviceMedical: this.rdvForm.get('serviceMedical')?.value
        // statut: 'EN_ATTENTE', // valeur par défaut ou à adapter
        // salleId: null // ou une valeur appropriée
      };
      this.isLoading = true;

      this.createrdv.createRdv(rdvPayload).subscribe({
        next: (result) => {
          alert('Rendez-vous créé avec succès !');
          this.resetForm();
              setTimeout(() => {
                this.router.navigate(['/calendar']);  // 👉 redirection directe au calendrier
              }, 200);
        },
        error: (err) => {
          console.error('Erreur création patient:', err);
          alert(`Erreur lors de la création: ${err.error?.message || err.message}`);
          this.isLoading = false;
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  }

  onCancel(): void {
    if (confirm('Annuler la création de ce rendez-vous ?')) {
      this.resetForm();
    }
  }

    // Ajoutez cette méthode pour gérer le changement de service
  onServiceChange(service: ServiceMedical): void {
    this.loadMedecinsByService(service);
  }

  resetForm(): void {
    this.rdvForm.reset();
    this.InfosFormGroup.reset();
    // this.rdvForm.markAsPristine();
    // this.rdvForm.markAsUntouched();
    // this.InfosFormGroup.markAsPristine();
    // this.InfosFormGroup.markAsUntouched();
    this.isLoading = false;
  }
}