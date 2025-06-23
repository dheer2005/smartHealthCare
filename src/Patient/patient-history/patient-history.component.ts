import { Component } from '@angular/core';
import { PatientService } from '../../Service/patient.service';
import { AuthenticationService } from '../../Service/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentStatus } from '../../Models/CreateAppointmentMode.model';

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-history.component.html',
  styleUrl: './patient-history.component.css'
})
export class PatientHistoryComponent {
  visitHistory: any[] = [];
  AppointmentStatus?: AppointmentStatus;
  statusKeys = Object.keys(AppointmentStatus).filter(key => isNaN(Number(key)));
  patientId!: number;
  constructor(private patientSvc: PatientService, private authSvc: AuthenticationService){
    this.authSvc.getUser(this.authSvc.UserEmail).subscribe({
      next:(res:any)=>{
        this.patientId = res.id;
        this.patientSvc.visitHistory(this.patientId).subscribe({
          next: (res:any)=>{
            this.visitHistory = res
          },
          error: (err)=>{
            console.log(err);
          }
        })
      },
      error:(err:any)=>{console.log(err);}
    });
  }

  getStatusName(value: number): string {
    return this.statusKeys[value];
  }
}
