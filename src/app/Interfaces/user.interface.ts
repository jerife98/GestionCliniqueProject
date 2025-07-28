export interface Role {
  id: number;
  roleType: string;
}

export interface User {
    id?: number;
    genre: string;
    telephone?: string;
    serviceMedicalName?: string;
    prenom: string;
    nom : string;
    photoProfil?: string;
    adresse?: string;
    actif: boolean;
    role: Role;
    dateNaissance: string;
    password: string;
    email: string;
    lastLogin?: string;
}

export interface UserCreatePayload extends Omit<User, 'id'> {
  // Peut être identique à User ou avoir des spécificités
}