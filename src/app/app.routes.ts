import { Routes } from '@angular/router';
import { AuthRoleGuard } from './guards/auth-role.guard';
import { LoginPage } from './login-page/login-page';
import { Dashboard } from './Admin/dashboard/dashboard';
import { Utilisateurs } from './Admin/utilisateurs/utilisateurs';
import { CreateUser } from './Admin/utilisateurs/create-user/create-user';
import { Patients } from './Admin/patients/patients';
import { CreatePatient } from './Admin/patients/create-patient/create-patient';
import { RendezVous } from './Medecin/rendez-vous/rendez-vous';
import { Consultations } from './Medecin/consultations/consultations';
import { Calendrier } from './Medecin/calendrier/calendrier';
import { Rdvs } from './Secretaire/rdvs/rdvs';
import { CreateRdv } from './Medecin/rendez-vous/create-rdv/create-rdv';
import { CreateRdv as SecretaireCreateRdv } from './Secretaire/rdvs/create-rdv/create-rdv';
import { create } from 'domain';
import { Malade } from './Secretaire/malade/malade';
import { CreateMalade } from './Secretaire/malade/create-malade/create-malade';
import { Facture } from './Secretaire/facture/facture';
import { Calendly } from './Secretaire/calendly/calendly';

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
      // ADMIN
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthRoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'utilisateurs',
    component: Utilisateurs,
    canActivate: [AuthRoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'create-user',
    component: CreateUser,
    canActivate: [AuthRoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'patients',
    component: Patients,
    canActivate: [AuthRoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'create-patient',
    component: CreatePatient,
    canActivate: [AuthRoleGuard],
    data: { roles: ['ADMIN'] }
  },

  // MEDECIN
  {
    path: 'medecin',
    component: RendezVous,
    canActivate: [AuthRoleGuard],
    data: { roles: ['MEDECIN'] }
  },
  {
    path: 'Create-rdv',
    component: CreateRdv,
    canActivate: [AuthRoleGuard],
    data: { roles: ['MEDECIN'] }
  },
  {
    path: 'consultations',
    component: Consultations,
    canActivate: [AuthRoleGuard],
    data: { roles: ['MEDECIN'] }
  },
  {
    path: 'calendrier',
    component: Calendrier,
    canActivate: [AuthRoleGuard],
    data: { roles: ['MEDECIN'] }
  },

  // SECRETAIRE
  {
    path: 'secretaire',
    component: Rdvs,
    canActivate: [AuthRoleGuard],
    data: { roles: ['SECRETAIRE'] }
  },
  {
    path: 'rendez-vous',
    component: Rdvs,
    canActivate: [AuthRoleGuard],
    data: { roles: ['SECRETAIRE'] }
  },
  {
    path: 'Malade',
    component: Malade,
    canActivate: [AuthRoleGuard],
    data: { roles: ['SECRETAIRE'] }
  },
  {
    path: 'Create-malade',
    component: CreateMalade,
    canActivate: [AuthRoleGuard],
    data: { roles: ['SECRETAIRE'] }
  },
  {
    path: 'creates-rdv',
    component: SecretaireCreateRdv,
    canActivate: [AuthRoleGuard],
    data: { roles: ['SECRETAIRE'] }
  },
  {
    path: 'rdvs',
    component: Rdvs,
    canActivate: [AuthRoleGuard],
    data: { roles: ['SECRETAIRE'] }
  },
  {
    path: 'calendar',
    component: Calendly,
    canActivate: [AuthRoleGuard],
    data: { roles: ['SECRETAIRE'] }
  },
  {
    path: 'facture',
    component: Facture,
    canActivate: [AuthRoleGuard],
    data: { roles: ['SECRETAIRE'] }
  }

];
