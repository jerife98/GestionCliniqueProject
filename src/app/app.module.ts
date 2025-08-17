import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { App } from './app';
import { Calendly } from './Secretaire/calendly/calendly';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FullCalendarModule
  ],
  bootstrap: []
})
export class AppModule { }
