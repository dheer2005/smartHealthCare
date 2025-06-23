import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../Service/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../Service/authentication.service';

@Component({
  selector: 'app-patient-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-prescription.component.html',
  styleUrl: './patient-prescription.component.css'
})
export class PatientPrescriptionComponent{
  prescriptions: any[] = [];
  patientId!: number;

  constructor(private patientService: PatientService, private authSvc: AuthenticationService) {
    this.authSvc.getUser(this.authSvc.UserEmail).subscribe({
      next:(res:any)=>{
        this.patientId = res.id;
        this.getPrescriptions();
      },
      error:(err:any)=>{console.log(err);}
    });
  }

  getPrescriptions() {
    this.patientService.getPrescriptionsForCurrentPatient(this.patientId).subscribe({
      next: (res: any) => {
        this.prescriptions = res;
      },
      error: (err:any) => {
        console.error('Failed to load prescriptions', err);
      }
    });
  }
}
