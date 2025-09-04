import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FullCalendarModule, 
    MatDialogModule,
    MatButtonModule
  ],
  bootstrap: []
})
export class AppModule { }
