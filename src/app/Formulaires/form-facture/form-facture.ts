import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FactureService } from '../../Services/facture.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Rdv } from '../../Interfaces/rdv.interface';

interface Facture {
  id: number;
  patientNomComplet: string;
  dateEmission: string;
  serviceMedicalNom: string;
  montant: number;
  modePaiement: string;
  statut?: string; // PAID ou UNPAID
}

@Component({
  selector: 'app-form-facture',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-facture.html',
  styleUrl: './form-facture.css'
})
export class FormFacture implements OnInit {
  @Input() rdv!: Rdv; // <-- c’est obligatoire pour le binding
  @Output() close = new EventEmitter<void>();
  @Input() id!: number;
  facture!: Facture;

  loading = false;
  showValidationPopup = false;
  showLoader = false;

  factureForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private factureService: FactureService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.id) this.fetchFacture(this.id);
    console.log('Facture RDV:', this.rdv);

  }

  fetchFacture(id: number) {
    this.loading = true;
    this.factureService.getFactureByRdvId(id).subscribe({
      next: (res: Facture) => {
        this.facture = res;
        this.initForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement facture', err);
        this.loading = false;
      }
    });
  }

  initForm() {
    this.factureForm = this.fb.group({
      patientNomComplet: [{ value: this.facture.patientNomComplet, disabled: true }],
      dateEmission: [{ value: this.facture.dateEmission?.split('T')[0], disabled: true }],
      heureEmission: [{ value: this.facture.dateEmission?.split('T')[1]?.split('.')[0], disabled: true }],
      serviceMedicalNom: [{ value: this.facture.serviceMedicalNom, disabled: true }],
      montant: [{ value: this.facture.montant ? `${this.facture.montant} FCFA` : '', disabled: true }],
      modePaiement: [this.facture.modePaiement]
    });
  }

  handleAnnuler() {
    this.router.navigate(['/facture']);
  }

  handleGenererFacture() {
    this.showValidationPopup = true;
  }

  // async handleValidationConfirm() {
  //   this.showValidationPopup = false;
  //   this.showLoader = true;

  //   try {
  //     const modePaiement = this.factureForm.get('modePaiement')?.value;

  //     // ✅ Ne payer que si la facture n'est pas déjà payée
  //     if (this.facture.statut !== 'PAID') {
  //       await lastValueFrom(this.factureService.payerFacture(this.id, modePaiement));
  //       this.facture.statut = 'PAID';
  //     }

  //     // ✅ Génération PDF
  //     const doc = new jsPDF();

  //     // Logo (vérifie bien le chemin)
  //     const img = new Image();
  //     img.src = '/logo_clinic.png';
  //     img.onload = () => {
  //       doc.addImage(img, 'PNG', 14, 10, 30, 30);

  //       // Texte
  //       doc.setFontSize(18);
  //       doc.text('🏥 Clinique XYZ', 50, 20);
  //       doc.setFontSize(12);
  //       doc.text(`Facture n°: ${this.facture.id}`, 14, 50);
  //       doc.text(`Date: ${this.facture.dateEmission?.split('T')[0]}`, 14, 60);
  //       doc.text(`Heure: ${this.facture.dateEmission?.split('T')[1]?.split('.')[0]}`, 14, 70);

  //       // Tableau
  //       autoTable(doc, {
  //         startY: 80,
  //         head: [['Patient', 'Service Médical', 'Montant (XAF)', 'Mode Paiement']],
  //         body: [[
  //           this.facture.patientNomComplet,
  //           this.facture.serviceMedicalNom,
  //           `${this.facture.montant} FCFA`,
  //           modePaiement
  //         ]],
  //         styles: { halign: 'center' }
  //       });

  //       // Footer
  //       doc.setFontSize(10);
  //       const finalY = (doc as any).lastAutoTable?.finalY || 100;
  //       doc.text('Merci pour votre confiance !', 14, finalY + 20);


  //       // Télécharger
  //       const safeName = this.facture.patientNomComplet.replace(/\s+/g, '_');
  //       doc.save(`facture_${safeName}.pdf`);

  //       alert("Facture générée avec succès");
  //       this.router.navigate(['/secretaire/rendezvous']);
  //     };

  //     // Si le logo ne charge pas, on peut quand même générer le PDF sans image
  //     img.onerror = () => {
  //       console.warn('Logo non trouvé, génération PDF sans logo.');
  //       const docNoLogo = new jsPDF();
  //       docNoLogo.text(`Facture n°: ${this.facture.id}`, 14, 20);
  //       docNoLogo.save(`facture_${this.facture.patientNomComplet.replace(/\s+/g, '_')}.pdf`);
  //     };

  //   } catch (error) {
  //     console.error('Erreur lors de la génération de la facture:', error);
  //     alert("Erreur lors de la génération de la facture");
  //   } finally {
  //     this.showLoader = false;
  //   }
  // }

// ---------------------
// Méthode pour générer la facture PDF avec logo
// ---------------------
async handleValidationConfirm() {
  this.showValidationPopup = false;
  this.showLoader = true;

  try {
    const modePaiement = this.factureForm.get('modePaiement')?.value;

    // Ne payer que si la facture n'est pas déjà payée
    if (this.facture.statut !== 'PAID') {
      await lastValueFrom(this.factureService.payerFacture(this.id, modePaiement));
      this.facture.statut = 'PAID';
    }

    const img = new Image();
    img.src = '/logo_clinic.png';
    img.onload = () => {
      const doc = new jsPDF();

      // Insérer le logo en haut à gauche
      doc.addImage(img, 'PNG', 14, 10, 40, 20);

      // Titre facture
      doc.setFontSize(16);
      doc.setTextColor(100, 100, 255);
      doc.text("Facture de consultation", 105, 45, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Numéro #${this.facture.id || 'N/A'}`, 105, 52, { align: 'center' });

      // Infos patient et facture
      let y = 65;
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text("Nom et Prénom du patient", 14, y);
      doc.setFont("helvetica", 'bold');
      doc.text(this.facture.patientNomComplet, 130, y);
      doc.setFont("helvetica", 'normal');

      y += 10;
      doc.setFont("helvetica", 'bold');
      doc.text(`MONTANT:`, 14, y);
      doc.setFont("helvetica", 'normal');
      doc.text(`XAF ${this.facture.montant.toFixed(2)}`, 60, y);

      doc.setFont("helvetica", 'bold');
      doc.text(`DATE EMISSION:`, 105, y);
      doc.setFont("helvetica", 'normal');
      doc.text(`${this.facture.dateEmission?.split('T')[0]}`, 155, y);

      doc.setFont("helvetica", 'bold');
      doc.text(`METHODE DE PAIEMENT:`, 14, y + 10);
      doc.setFont("helvetica", 'normal');
      doc.text(modePaiement.replace('_', ' '), 60, y + 10);

      y += 20;
      doc.setFont("helvetica", 'bold');
      doc.text("SERVICE MEDICAL", 14, y);
      doc.setFont("helvetica", 'normal');
      doc.text(this.facture.serviceMedicalNom.replace('_', ' '), 60, y);

      // Footer contact
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        "Si vous avez des questions, contactez-nous à sommetdefo2@gmail.com ou appelez le +237 6 57 05 04 56.",
        105,
        280,
        { align: 'center' }
      );

      // Télécharger le PDF
      const safeName = this.facture.patientNomComplet.replace(/\s+/g,'_');
      doc.save(`facture_${safeName}.pdf`);

      alert("Facture payée et générée avec succès");
      this.router.navigate(['/secretaire/rendezvous']);
    };

    img.onerror = () => {
      console.warn('Logo non trouvé, génération PDF sans logo.');
      const docNoLogo = new jsPDF();
      docNoLogo.text(`Facture n°: ${this.facture.id}`, 14, 20);
      docNoLogo.save(`facture_${this.facture.patientNomComplet.replace(/\s+/g, '_')}.pdf`);
    };

  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error);
    alert("Erreur lors de la génération de la facture");
  } finally {
    this.showLoader = false;
  }
}



  handleValidationCancel() {
    this.showValidationPopup = false;
    this.router.navigate(['/facture']);
  }
}