import { Component } from '@angular/core';
import { AuthenticationService } from '../../Service/authentication.service';
import { Router } from '@angular/router';
import { PatientService } from '../../Service/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-messages.component.html',
  styleUrl: './patient-messages.component.css'
})
export class PatientMessagesComponent {
  patientId!: number;
  doctorList: any[] = [];

  constructor(
    private authSvc: AuthenticationService,
    private router: Router,
    private patientSvc: PatientService
  ) {
    this.authSvc.getUser(this.authSvc.UserEmail).subscribe({
      next: (res: any) => {
        this.patientId = res.id;
        this.loadPatientList();
      },
      error: (err:any) => console.error(err)
    });
  }

  loadPatientList() {
    this.patientSvc.doctorListForChat(this.patientId).subscribe({
      next: (res: any) => {
        this.doctorList = res;
      },
      error: (err:any) => console.log(err)
    });
  }

  goToChat(doctor: any) {
    this.router.navigate(['/allChats'], {
      queryParams: {
        partnerName: doctor.doctorName,
        partnerEmail: doctor.doctorEmail,
        userEmail: this.authSvc.UserEmail,
        userRole: 'patient'
      }
    });
  }
}
