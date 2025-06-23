import { Component } from '@angular/core';
import { PatientService } from '../../Service/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../Service/authentication.service';
import { DoctorService } from '../../Service/doctor.service';
import { AppointmentStatus } from '../../Models/CreateAppointmentMode.model';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.css'
})
export class PrescriptionsComponent {
    prescriptions: any[] = [];
  doctorId!: number;
  editingPrescription: any = null;

  constructor(private patientService: PatientService, private authSvc: AuthenticationService, private doctorSvc: DoctorService) {
    this.authSvc.getUser(this.authSvc.UserEmail).subscribe({
      next:(res:any)=>{
        this.doctorId = res.id;
        this.getPrescriptions();
      },
      error:(err:any)=>{console.log(err);}
    });
  }

  editPrescription(pres: any) {
    this.editingPrescription = { ...pres }; 
  }

  getPrescriptions() {
    this.doctorSvc.getPrescriptionsForCurrentDoctor(this.doctorId).subscribe({
      next: (res: any) => {
        this.prescriptions = res;
      },
      error: (err:any) => {
        console.error('Failed to load prescriptions', err);
      }
    });
  }
  
  updateEditedPrescription() {
    this.doctorSvc.updatePrescription(this.editingPrescription.id, {
      medications: this.editingPrescription.medications,
      notes: this.editingPrescription.notes
    }).subscribe({
      next: () => {
        alert('Prescription updated!');
        this.editingPrescription = null;
        this.getPrescriptions();
      },
      error: err => console.error(err)
    });
  }

  deletePrescription(id: number) {
    if (confirm("Are you sure you want to delete this prescription?")) {
      this.doctorSvc.deletePrescription(id).subscribe({
        next: () => {
          alert('Prescription deleted!');
          this.getPrescriptions();
        },
        error: err => console.error(err)
      });
    }
  }
  
  
}
