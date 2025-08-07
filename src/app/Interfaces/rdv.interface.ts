export interface Rdv {
    patientId?: number;
    patientNomComplet : string;
    jour: string;
    heure: string;
    statut: 'CONFIRME' | 'EN_ATTENTE' | 'ANNULÉ';
    notes?: string;
    serviceMedical: 'MEDECINE_GENERALE' | 'PEDIATRIE' | 'GYNECOLOGIE' | 'CARDIOLOGIE' | 'DERMATOLOGIE' | 'OPHTALMOLOGIE' | 'ORTHOPEDIE' | 'RADIOLOGIE' | 'LABORATOIRE_ANALYSES' | 'URGENCES' | 'KINESITHERAPIE'     |  'DENTISTE' | 'PSYCHIATRIE' | 'NEUROLOGIE' | 'GASTRO_ENTEROLOGIE'| 'PNEUMOLOGIE'| 'ENDOCRINOLOGIE'| 'RHUMATOLOGIE';
    medecinId: number;
    medecinNomComplet: string;
    salleId: number;
    nomSalle: string;
}

export interface RdvCreatePayload {
    patientId: number;
    jour: string;
    heure: string;
    statut: 'CONFIRME' | 'EN_ATTENTE' | 'ANNULÉ';
    notes?: string;
    serviceMedical: 'MEDECINE_GENERALE' | 'PEDIATRIE' | 'GYNECOLOGIE' | 'CARDIOLOGIE' | 'DERMATOLOGIE' | 'OPHTALMOLOGIE' | 'ORTHOPEDIE' | 'RADIOLOGIE' | 'LABORATOIRE_ANALYSES' | 'URGENCES' | 'KINESITHERAPIE'     |  'DENTISTE' | 'PSYCHIATRIE' | 'NEUROLOGIE' | 'GASTRO_ENTEROLOGIE'| 'PNEUMOLOGIE'| 'ENDOCRINOLOGIE'| 'RHUMATOLOGIE';
    medecinId: number;
    salleId: number;
}

export interface RdvUpdatePayload {
    id: number;
    patientId?: number;
    patientNomComplet?: string;
    jour: string;
    heure: string;
    statut: 'CONFIRME' | 'EN_ATTENTE' | 'ANNULÉ';
    notes?: string;
    serviceMedical: 'MEDECINE_GENERALE' | 'PEDIATRIE' | 'GYNECOLOGIE' | 'CARDIOLOGIE' | 'DERMATOLOGIE' | 'OPHTALMOLOGIE' | 'ORTHOPEDIE' | 'RADIOLOGIE' | 'LABORATOIRE_ANALYSES' | 'URGENCES' | 'KINESITHERAPIE'     |  'DENTISTE' | 'PSYCHIATRIE' | 'NEUROLOGIE' | 'GASTRO_ENTEROLOGIE'| 'PNEUMOLOGIE'| 'ENDOCRINOLOGIE'| 'RHUMATOLOGIE';
    medecinId: number;
    medecinNomComplet?: string;
    nomSalle?: string;
    salleId: number;
}