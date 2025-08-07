

export interface EditedUser {
  id: number;
  nom : string;
  prenom: string;
  adresse?: string;
  genre: string;
  email: string;
  dateNaissance: string;
  telephone?: string;
  password: string;
  serviceMedicalName?: string;
  actif: boolean;
  role: string;
  lastLogin?: string;
  photoProfil?: string;
}