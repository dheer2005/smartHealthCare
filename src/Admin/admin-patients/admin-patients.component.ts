import { Component } from '@angular/core';
import { DoctorService } from '../../Service/doctor.service';
import { AuthenticationService } from '../../Service/authentication.service';
import { PatientService } from '../../Service/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-patients.component.html',
  styleUrl: './admin-patients.component.css'
})
export class AdminPatientsComponent {
  patientList: any[] =[];

  constructor(private patientSvc: PatientService, private authSvc: AuthenticationService) {
      this.getPatientList();
      console.log(this.patientList);
    }

    getPatientList(){
      this.patientSvc.getAllPatients().subscribe({
        next:(res:any)=>{
          this.patientList = res;
          // console.log("response",res);
        },
        error: (err)=>{
          console.log(err);
        }
      })
    }

}
