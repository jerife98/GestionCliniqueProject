import { ModePaiement } from "../Enums/mode-paiement.enum";
import { ServiceMedical } from "../Enums/service-medical.enum";
import { StatutPaiement } from "../Enums/statut-paiement.enum";
import { StatutRdv } from "../Enums/statut-rdv.enum";

export interface Rdv {
    id?: number;
    patientId?: number;
    patientNomComplet: string;
    jour: string;
    heure: string;
    notes?: string;
    serviceMedical: ServiceMedical;
    medecinId: number;
    medecinNomComplet: string;
    statut: StatutRdv;
    salleId: number;
    nomSalle: string;
    factureId?: number;           // <-- ajouté pour relier la facture
    creationDate?: string;        // <-- optionnel
    modificationDate?: string;    // <-- optionnel
    montant : number;
    statutPaiement : StatutPaiement;
    modePaiement: ModePaiement
}

export interface RdvCreatePayload {
    patientId: number;
    jour: string;
    heure: string;
    notes?: string;
    serviceMedical: ServiceMedical;
    medecinId: number;
    factureId?: number;           // <-- ajouté pour créer directement avec facture
    // salleId?: number;           // facultatif si backend attribue une salle automatiquement
}
export interface RdvUpdatePayload {
    id: number;
    patientId?: number;
    patientNomComplet?: string;
    jour: string;
    heure: string;
    notes?: string;
    serviceMedical: ServiceMedical;
    medecinId: number;
    medecinNomComplet?: string;
    nomSalle?: string;
    salleId: number;
    factureId?: number;           // <-- ajouté pour mettre à jour la facture
}