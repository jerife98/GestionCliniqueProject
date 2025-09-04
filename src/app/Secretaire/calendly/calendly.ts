import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CurrentUser } from '../../current-user/current-user';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RdvService } from '../../Services/rdv.service';
import { PatientService } from '../../Services/patient.service';
import { UtilisateursService } from '../../Services/utilisateur.service';
import { forkJoin, Observable } from 'rxjs';
import { Rdv } from '../../Interfaces/rdv.interface';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RdvDetailsDialog } from '../../components/rdv-details-dialog/rdv-details-dialog';

@Component({
  selector: 'app-calendly',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrentUser, FullCalendarModule, RouterModule],
  templateUrl: './calendly.html',
  styleUrls: ['./calendly.css']
})
export class Calendly implements OnInit {
  events: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.loadEvents.bind(this), // ✅ lazy loading
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventContent: this.renderEventContent.bind(this)
  };

  constructor(
    private rdvService: RdvService,
    private patientService: PatientService,
    private utilisateurService: UtilisateursService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login-page']);
  }

  /**
   * ✅ Lazy loading : appelé automatiquement par FullCalendar
   */
  loadEvents(fetchInfo: any, successCallback: any, failureCallback: any) {
    this.rdvService.getRdv().subscribe({
      next: (rdvs: Rdv[]) => {
        const requests = rdvs.map(rdv =>
          forkJoin({
            patient: this.patientService.getPatientById(rdv.patientId ?? 0),
            utilisateur: this.utilisateurService.findUtilisateurById(rdv.medecinId)
          }).pipe(
            map(({ patient, utilisateur }) => {
              const rdvDate = new Date(rdv.jour + 'T' + (rdv.heure ?? '00:00'));
              const now = new Date();

              return {
                title: `${patient.prenom} ${patient.nom}`,
                start: rdv.jour + (rdv.heure ? 'T' + rdv.heure : ''),
                color: rdvDate < now ? 'red' : '#3788d8',
                backgroundColor: rdvDate < now ? 'red' : '#3788d8',
                borderColor: rdvDate < now ? 'red' : '#3788d8',
                textColor: '#000',
                extendedProps: {
                  ...rdv,
                  patient,
                  utilisateur
                }
              };
            })
          )
        );

        forkJoin(requests).subscribe(results => {
          this.events = results;
          successCallback(results); // ✅ envoi direct à FullCalendar
        });
      },
      error: err => {
        console.error('Erreur de chargement des RDVs', err);
        failureCallback(err);
      }
    });
  }

  handleDateClick(info: any) {
    const selectedDate = info.dateStr;

    const eventsOfDay = this.events.filter(
      e => (e.start as string).split('T')[0] === selectedDate
    );

    this.dialog.open(RdvDetailsDialog, {
      width: '500px',
      data: {
        date: selectedDate,
        rdvs: eventsOfDay.map(e => e.extendedProps)
      }
    });
  }

  handleEventClick(info: any) {
    const rdv = info.event.extendedProps;

    this.dialog.open(RdvDetailsDialog, {
      width: '500px',
      data: {
        date: (info.event.start as Date).toISOString().split('T')[0],
        rdvs: [rdv]
      }
    });
  }

  renderEventContent(arg: any) {
    const rdv = arg.event.extendedProps;
    const heure = rdv.heure ? rdv.heure.substring(0, 5) : 'N/A';
    const medecin = rdv.utilisateur?.nom ? `Dr. ${rdv.utilisateur.nom}` : '';
    const isPast = new Date(arg.event.start) < new Date();
    const color = isPast ? 'red' : '#3788d8';

    return {
      html: `
      <div style="font-size:0.8rem;line-height:1.2;color:white;background:${color};padding:2px;border-radius:4px">
        <div><b>${rdv.patient?.prenom || ''} ${rdv.patient?.nom || ''}</b></div>
        <div>${heure}</div>
        <div>${medecin}</div>
      </div>
    `
    };
  }
}
