import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { Dashboard } from './Admin/dashboard/dashboard';
import { Utilisateurs } from './Admin/utilisateurs/utilisateurs';
import { CreateUser } from './Admin/utilisateurs/create-user/create-user';
import { Patients } from './Admin/patients/patients';
import { CreatePatient } from './Admin/patients/create-patient/create-patient';
import { RendezVous } from './Medecin/rendez-vous/rendez-vous';
import { Consultations } from './Medecin/consultations/consultations';
import { Calendrier } from './Medecin/calendrier/calendrier';
import { RDV } from './Secretaire/rdv/rdv';
import { create } from 'domain';
import { CreateRdv } from './Medecin/rendez-vous/create-rdv/create-rdv';

export const routes: Routes = [
     {
        path: '',
        redirectTo: 'login-page',
        pathMatch: 'full'
    },
    {
        path:'login-page',
        component: LoginPage
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'utilisateurs',
        component: Utilisateurs
    },
    {
        path: 'create-user',
        component: CreateUser
    },
    {
        path: 'patients',
        component: Patients
    },
    {
        path: 'create-patient',
        component: CreatePatient
    },
    {
        path: 'medecin',
        component: RendezVous
    },
    {
        path: 'create-rdv',
        component: CreateRdv
    },
    {
        path: 'consultations',
        component: Consultations
    },
    {
        path: 'calendrier',
        component: Calendrier
    },
    {
        path: 'secretaire',
        component: RendezVous
    },
        {
        path: 'consultations',
        component: Consultations
    }
];
