export interface Patient {
    id?: number;
    nom : string;
    prenom: string;
    telephone?: string;
    adresse?: string;
    email?: string;
    serviceMedicalName?: string;
    photoProfil?: string;
    actif: boolean;
    dateNaissance: string;
    password: string;
    lastLogin?: string;
    genre: string;
    dossierMedical: {
    groupeSanguin: string;
    antecedentsMedicaux?: string;
    allergies?: string;
    traitementsEnCours?: string;
    observations: string;
  }
}


export interface PatientCreatePayload extends Omit<Patient, 'id'> {
  // Peut être identique à patient ou avoir des spécificités
}