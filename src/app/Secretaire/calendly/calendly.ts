import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CurrentUser } from '../../current-user/current-user';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RdvService } from '../../Services/rdv.service';
import { PatientService } from '../../Services/patient.service';
import { UtilisateursService } from '../../Services/utilisateur.service';
import { forkJoin } from 'rxjs';
import { Rdv } from '../../Interfaces/rdv.interface';

@Component({
  selector: 'app-calendly',
  imports: [CommonModule, RouterLink, CurrentUser, FullCalendarModule],
  templateUrl: './calendly.html',
  styleUrl: './calendly.css'
})
export class Calendly implements OnInit {
   // Exemple d'événements (tu pourras charger depuis ton backend plus tard)
  events: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.events,
    dateClick: (info) => this.handleDateClick(info), // callback au clic
  };

  constructor(
    private rdvService: RdvService,
    private patientService: PatientService,
    private utilisateurService: UtilisateursService
  ){}

  ngOnInit(): void {
      this.loadRdv();
  }

  loadRdv(){
    this.rdvService.getRdv().subscribe((rdvs:Rdv[]) => {
      const request = rdvs.map(rdv => 
        forkJoin({
          patient: this.patientService.getPatientById(rdv.patientId ?? 0),
          utilisateur: this.utilisateurService.findUtilisateurById(rdv.medecinId)
        }).pipe(
          map(({patient, utilisateur}) => ({
            title: `${patient.name} (${patient.prename} - Dr. ${utilisateur.name})`,
            date: rdv.jour,
            extendedProps: {
             ...rdv,
              patient,
              utilisateur
            }
          }))
        )
      );

      forkJoin(request).subscribe(results => {
        this.events = this.events.concat(results);
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.events
        };
      });
    });
  }

  handleDateClick(info: any) {
    const selectedDate = info.dateStr;
    const eventsOfDay = this.events.filter(e => e.date === selectedDate);

    if (eventsOfDay.length > 0) {
      alert(`Rendez-vous du ${selectedDate}:\n\n${eventsOfDay.map(e => e.title).join('\n')}`);
    } else {
      alert(`Aucun rendez-vous le ${selectedDate}`);
    }
  }
}
function map(arg0: ({ patient, utilisateur }: { patient: any; utilisateur: any; }) => { title: string; date: any; extendedProps: any; }): import("rxjs").OperatorFunction<{ patient: import("../../Interfaces/patient.interface").Patient; utilisateur: import("../../Interfaces/user.interface").User; }, unknown> {
  throw new Error('Function not implemented.');
}

