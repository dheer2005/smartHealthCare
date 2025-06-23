import { Component } from '@angular/core';
import { AuthenticationService } from '../../Service/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { Gender, RegisterPatientModel } from '../../Models/RegisterPatientModel.model';
import { RegisterDoctorModel } from '../../Models/RegisterDoctorModel.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterAdminModel } from '../../Models/RegisterAdminModel.model';
import { Department } from '../../Models/DepartmentsEnum.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  Gender = Gender;
  // Department = Department;
  selectedRole?: string;

  constructor(private authSvc: AuthenticationService, private router: Router){}

  registerDoctor:RegisterDoctorModel={
    UserName : '',
    Password : '',
    Email : '',
    FirstName : '',
    LastName : '',
    Specialization : '',
    Department : null,
    ProfilePhotoUrl : ''
  }

  registerPatient:RegisterPatientModel={
    UserName : '',
    Password : '',
    Email : '',
    FirstName : '',
    LastName : '',
    DOB: new Date(),
    Gender : Gender.Others,
    Address : '',
    ProfilePhotoUrl : ''
  }

  registerAdmin: RegisterAdminModel = {
    UserName : '',
    Password : '',
    Email : '',
    FirstName : '',
    LastName : '',
    ProfilePhotoUrl : ''
  }

  onRegister(){
    console.log("RegisterPatient payload:", this.registerPatient);
    if(this.selectedRole == "Patient"){
      this.authSvc.registerPatient(this.registerPatient).subscribe({
        next: ()=>{
          alert("Patient Registered Successfully");
          this.router.navigateByUrl('/login');
        },
        error: (err:any)=>{
          console.log(err);
        }
      });
    }
    // console.log("RegisterDoctor payload:", this.registerDoctor);
    if(this.selectedRole == "Doctor"){
      this.authSvc.registerDoctor(this.registerDoctor).subscribe({
        next:(res:any)=>{
          alert("Doctor Registered Successfully");
          this.router.navigateByUrl("/login");
        },
        error:(err:any)=>{
          console.log(err);
        }
      });
    }

    if(this.selectedRole == "Admin"){
      this.authSvc.registerAdmin(this.registerAdmin).subscribe({
        next:(res:any)=>{
          alert("Admin Registered Successfully");
          this.router.navigateByUrl("/login");
        },
        error: (err)=>{
          console.log(err);
        }
      });
    }
  }

  patientClicked(role:string){
    this.selectedRole = role;
    console.log(this.selectedRole);
  }

  doctorClicked(role:string){
    this.selectedRole = role;
    console.log(this.selectedRole);
  }

  adminClicked(role:string){
    this.selectedRole = role;
    console.log(this.selectedRole);
  }
}
