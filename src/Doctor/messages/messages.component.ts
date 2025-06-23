import { Component } from '@angular/core';
import { DoctorService } from '../../Service/doctor.service';
import { AuthenticationService } from '../../Service/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  doctorId!: number;
  patientList: any[] = [];

  constructor(
    private doctorSvc: DoctorService,
    private authSvc: AuthenticationService,
    private router: Router
  ) {
    this.authSvc.getUser(this.authSvc.UserEmail).subscribe({
      next: (res: any) => {
        this.doctorId = res.id;
        this.loadPatientList();
      },
      error: err => console.error(err)
    });
  }

  loadPatientList() {
    this.doctorSvc.PatientListForChat(this.doctorId).subscribe({
      next: (res: any) => {
        this.patientList = res;
      },
      error: (err) => console.log(err)
    });
  }

  goToChat(patient: any) {
    
    this.router.navigate(['/allChats'], {
      queryParams: {
        partnerName: patient.patientName,
        partnerEmail: patient.patientEmail,
        userEmail: this.authSvc.UserEmail,
        userRole: 'doctor'
      }
    });
  }
}
