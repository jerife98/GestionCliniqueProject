// Interfaces communes pour tous les composants
export interface Role {
  id: number;
  roleType: string;
}

// Modifier User pour avoir à la fois roleId et role (pour l'affichage)
export interface User {
  id: number;
  nom: string;
  prenom: string;
  adresse?: string;
  genre: string;
  email: string;
  dateNaissance: string;
  telephone?: string;
  password: string;
  serviceMedicalName?: ServiceMedicalType;
  actif: boolean;
  role: Role; // Objet complet avec id et roleType
  photoProfil?: string;
  lastLogin?: string;
  lastLogoutDate?: string;
  statusConnect?: string;
}

export interface UserCreatePayload {
  nom: string;
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
}

export interface UserUpdatePayload {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  genre: string;
  dateNaissance: string;
  telephone?: string;
  adresse?: string;
  password?: string;
  serviceMedicalName?: ServiceMedicalType;
  actif: boolean;
  role: string;
}

export type ServiceMedicalType = 
  | 'MEDECINE_GENERALE'
  | 'PEDIATRIE'
  | 'GYNECOLOGIE'
  | 'CARDIOLOGIE'
  | 'DERMATOLOGIE'
  | 'OPHTALMOLOGIE'
  | 'ORTHOPEDIE'
  | 'RADIOLOGIE'
  | 'LABORATOIRE_ANALYSES'
  | 'URGENCES'
  | 'KINESITHERAPIE'
  | 'DENTISTE'
  | 'PSYCHIATRIE'
  | 'NEUROLOGIE'
  | 'GASTRO_ENTEROLOGIE'
  | 'PNEUMOLOGIE'
  | 'ENDOCRINOLOGIE'
  | 'RHUMATOLOGIE';