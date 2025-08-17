import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient } from '../../Interfaces/patient.interface';

interface SelectOption {
  value : string;
  label : string;
}

@Component({
  selector: 'app-patient-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css'
})
export class PatientForm implements OnInit {
  @Input() formGroup!: FormGroup;  // Injecté depuis create-rdv ou create-malade
  @Input() disabled: boolean = false;

  genre: SelectOption[] = [
    { value: 'F', label: 'Femme' },
    { value: 'M', label: 'Homme' }
  ];

  groupeSanguin: SelectOption[] = [
    { value: 'A+', label: 'A +' },
    { value: 'A-', label: 'A -' },
    { value: 'B+', label: 'B +' },
    { value: 'B-', label: 'B -' },    
    { value: 'AB+', label: 'AB +' },
    { value: 'AB-', label: 'AB -' },
    { value: 'O+', label: 'O +' },
    { value: 'O-', label: 'O -' },
  ];
  constructor() {}

  ngOnInit(): void {
    if (this.disabled) {
      this.formGroup.disable();  // Si affichage en lecture seule
    }
  }
}
