import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RdvService } from '../../../Services/rdv.service';
import { PatientService } from '../../../Services/patient.service';
import { UtilisateursService } from '../../../Services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { RdvCreatePayload } from '../../../Interfaces/rdv.interface';
import { ServiceMedical } from '../../../Enums/service-medical.enum';
import { InfosPatient } from '../../../Formulaires/infos-patient/infos-patient';
import { CurrentUser } from '../../../current-user/current-user';
import { Subject, takeUntil } from 'rxjs';
import { Patient } from '../../../Interfaces/patient.interface';
import { User } from '../../../Interfaces/user.interface';
import { FactureService } from '../../../Services/facture.service';

@Component({
  selector: 'app-create-rdv',
  imports: [InfosPatient, RouterLink, ReactiveFormsModule, CommonModule, CurrentUser, RouterModule],
  templateUrl: './create-rdv.html',
  styleUrl: './create-rdv.css'
})
export class CreateRdv implements OnInit, OnDestroy {

  facture: any = null; // facture récupérée après création du RDV

  private destroy$ = new Subject<void>();

  rdvForm: FormGroup;
  InfosFormGroup: FormGroup;
  patients: Patient[] = [];
  medecins: User[] = [];
  filteredMedecins: User[] = [];
  isLoading = false;
  services = Object.values(ServiceMedical);

  constructor(
    private fb: FormBuilder,
    private createrdv: RdvService,
    private patientService: PatientService,
    private utlisateurService: UtilisateursService,
    private factureService: FactureService,
    private router: Router,
    private cdRef: ChangeDetectorRef
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
    this.loadPatients();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMedecinsByService(service: ServiceMedical): void {
    this.isLoading = true;

    this.utlisateurService.getMedecinsByService(service)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (medecins) => {
          this.filteredMedecins = medecins.filter(m =>
            m.role?.roleType === 'MEDECIN' &&
            (!m.serviceMedicalName || m.serviceMedicalName === service)
          );

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

  private setupFormListeners(): void {
    // Charger les médecins quand le service change
    this.rdvForm.get('serviceMedical')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(service => {
        if (service) {
          this.loadMedecinsByService(service);
        } else {
          this.filteredMedecins = [];
          this.rdvForm.get('medecinId')?.reset();
        }
      });

    // Détection du changement de patient
    this.InfosFormGroup.get('patientId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(patientId => {
        if (patientId) {
          this.loadPatientDetails(patientId);
        } else {
          this.rdvForm.patchValue({ patientNomComplet: '' });
        }
      });
  }

  private loadPatients(): void {
    this.isLoading = true;
    this.patientService.getPatients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    this.patientService.getPatientById(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
          }, { emitEvent: false });
        },
        error: (err) => {
          console.error('Erreur lors du chargement du patient:', err);
        }
      });
  }

  // onSubmit() {
  //   if (!this.rdvForm.valid || !this.InfosFormGroup.valid) {
  //     this.markFormGroupTouched(this.rdvForm);
  //     this.markFormGroupTouched(this.InfosFormGroup);
  //     this.showErrorMessage('Veuillez remplir tous les champs obligatoires');
  //     return;
  //   }

  //   const patientId = this.InfosFormGroup.get('patientId')?.value;
  //   const medecinId = this.rdvForm.get('medecinId')?.value;
  //   const jour = this.rdvForm.get('jour')?.value;
  //   const heure = this.rdvForm.get('heure')?.value;
  //   const notes = this.rdvForm.get('notes')?.value;
  //   const serviceMedical = this.rdvForm.get('serviceMedical')?.value;

  //   if (!patientId || !medecinId) {
  //     this.showErrorMessage('Patient ou médecin non sélectionné');
  //     return;
  //   }

  //   const rdvPayload: RdvCreatePayload = {
  //     patientId,
  //     medecinId,
  //     jour,
  //     heure,
  //     notes,
  //     serviceMedical
  //   };

  //   this.isLoading = true;

  //   // 1️⃣ Création du RDV
  //   this.createrdv.createRdv(rdvPayload)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: async (createdRdv) => {
  //         console.log('RDV créé :', createdRdv);

  //         try {
  //           // 2️⃣ Création de la facture
  //           const factureId = await this.generateFacture(createdRdv);
  //           console.log('Facture générée avec ID :', factureId);

  //           // 3️⃣ Mise à jour du RDV avec l’ID de la facture
  //           this.createrdv.updateRdvFactureId(createdRdv.id!, factureId)
  //             .pipe(takeUntil(this.destroy$))
  //             .subscribe({
  //               next: () => {
  //                 this.isLoading = false;
  //                 this.showSuccessMessage('Rendez-vous et facture créés avec succès !');
  //                 this.resetForm();
  //                 this.router.navigate(['/rendez-vous']);
  //               },
  //               error: (err) => {
  //                 this.isLoading = false;
  //                 console.error('Erreur update RDV avec facture :', err);
  //                 this.showErrorMessage('RDV créé mais impossible d’associer la facture.');
  //               }
  //             });
  //         } catch (err) {
  //           this.isLoading = false;
  //           console.error('Erreur génération facture :', err);
  //           this.showErrorMessage('RDV créé mais facture non générée.');
  //         }
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         console.error('Erreur création RDV :', err);
  //         this.showErrorMessage('Erreur lors de la création du rendez-vous.');
  //       }
  //     });
  // }

  onSubmit() {
    if (!this.rdvForm.valid || !this.InfosFormGroup.valid) {
      this.markFormGroupTouched(this.rdvForm);
      this.markFormGroupTouched(this.InfosFormGroup);
      this.showErrorMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const patientId = this.InfosFormGroup.get('patientId')?.value;
    const medecinId = this.rdvForm.get('medecinId')?.value;
    const jour = this.rdvForm.get('jour')?.value;
    const heure = this.rdvForm.get('heure')?.value;
    const notes = this.rdvForm.get('notes')?.value;
    const serviceMedical = this.rdvForm.get('serviceMedical')?.value;

    if (!patientId || !medecinId) {
      this.showErrorMessage('Patient ou médecin non sélectionné');
      return;
    }

    const rdvPayload: RdvCreatePayload = {
      patientId,
      medecinId,
      jour,
      heure,
      notes,
      serviceMedical
    };

    this.isLoading = true;

    // 1️⃣ Création du RDV
    this.createrdv.createRdv(rdvPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdRdv) => {
          console.log('RDV créé :', createdRdv);

          // 2️⃣ Récupérer la facture associée au RDV
          this.factureService.getFactureByRdvId(createdRdv.id!)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (facture) => {
                this.facture = facture;
                console.log("Facture associée :", facture);

                this.isLoading = false;
                this.showSuccessMessage('Rendez-vous créé avec facture associée !');
              },
              error: (err) => {
                this.isLoading = false;
                console.error('Erreur récupération facture :', err);
                this.showErrorMessage('RDV créé mais facture introuvable.');
              }
            });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur création RDV :', err);
          this.showErrorMessage('Erreur lors de la création du rendez-vous.');
        }
      });
  }

  payerFacture(mode: string) {
    if (!this.facture?.id) {
      this.showErrorMessage('Facture introuvable');
      return;
    }

    this.factureService.payerFacture(this.facture.id, mode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (facture) => {
          this.facture = facture;
          this.showSuccessMessage(`Facture payée par ${mode}`);
        },
        error: (err) => {
          console.error('Erreur paiement facture :', err);
          this.showErrorMessage('Échec du paiement.');
        }
      });
  }



  private async generateFacture(rdv: any): Promise<number> {
    const patientId = rdv.patientId;
    if (!patientId) {
      return Promise.reject('Patient ID manquant pour la facture');
    }

    // Déterminer le montant exact en fonction du service
    const amount = this.calculateAmount(rdv.serviceMedical);

    const facturePayload = {
      patientId: patientId,
      patientNomComplet: `${this.InfosFormGroup.get('nom')?.value} ${this.InfosFormGroup.get('prenom')?.value}`,
      date: new Date().toISOString(),
      serviceMedicalName: rdv.serviceMedical,
      amount: amount,
      paymentMethod: 'ESPECES'
    };

    console.log('Payload facture:', facturePayload); // pour debug

    return new Promise<number>((resolve, reject) => {
      this.createrdv.createFacture(facturePayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (facture: any) => {
            console.log('Réponse backend facture:', facture);
            if (facture?.id != null) resolve(facture.id);
            else reject('ID facture manquant dans la réponse');
          },
          error: (err) => reject(err)
        });
    });
  }

  // Calcul du montant à partir de l’enum backend
  private calculateAmount(service: string): number {
    const tarifs: { [key: string]: number } = {
      MEDECINE_GENERALE: 5000,
      PEDIATRIE: 10000,
      GYNECOLOGIE: 15000,
      CARDIOLOGIE: 15000,
      DERMATOLOGIE: 10000,
      OPHTALMOLOGIE: 5000,
      ORTHOPEDIE: 5000,
      RADIOLOGIE: 10000,
      LABORATOIRE_ANALYSES: 5000,
      URGENCES: 25000,
      KINESITHERAPIE: 5000,
      DENTISTE: 10000,
      PSYCHIATRIE: 5000,
      NEUROLOGIE: 15000,
      GASTRO_ENTEROLOGIE: 10000,
      PNEUMOLOGIE: 15000,
      ENDOCRINOLOGIE: 15000,
      RHUMATOLOGIE: 15000
    };

    return tarifs[service] || 10000; // fallback
  }



  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (confirm('Annuler la création de ce rendez-vous ?')) {
      this.resetForm();
      this.router.navigate(['/rendez-vous']);
    }
  }

  resetForm(): void {
    this.rdvForm.reset();
    this.InfosFormGroup.reset();
    this.isLoading = false;
  }

  private showSuccessMessage(message: string): void {
    // Remplacer par un système de notification plus élégant
    alert(message);
  }

  private showErrorMessage(message: string): void {
    // Remplacer par un système de notification plus élégant
    alert(message);
  }

  private getErrorMessage(err: any): string {
    if (err.status === 409) {
      return 'Un rendez-vous existe déjà à cette date et heure.';
    } else if (err.status === 400) {
      return 'Données invalides. Veuillez vérifier vos informations.';
    } else if (err.status === 401) {
      return 'Session expirée. Veuillez vous reconnecter.';
    } else {
      return 'Erreur lors de la création. Veuillez réessayer.';
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login-page']);
  }
}