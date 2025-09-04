import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rdv-details-dialog',
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './rdv-details-dialog.html',
  styleUrl: './rdv-details-dialog.css'
})
export class RdvDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<RdvDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  isPast(jour: string, heure?: string): boolean {
  const rdvDate = new Date(jour + 'T' + (heure ?? '00:00'));
  return rdvDate < new Date();
}


}
