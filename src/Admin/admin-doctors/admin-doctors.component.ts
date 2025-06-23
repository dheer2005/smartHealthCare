import { Component } from '@angular/core';
import { DoctorService } from '../../Service/doctor.service';
import { AuthenticationService } from '../../Service/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterDoctorModel } from '../../Models/RegisterDoctorModel.model';
import { Department } from '../../Models/DepartmentsEnum.model';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-doctors.component.html',
  styleUrl: './admin-doctors.component.css'
})
export class AdminDoctorsComponent {
  doctorsList: any[] = [];
  doctorId: number = 0;
  doctorName: string = '';
  editData: any = {};
  editDepartmentId!: number;
  Department = Department;
  editShowDepartment:string =""

  registerDoctor: RegisterDoctorModel = {
    UserName: '',
    Password: '',
    Email: '',
    FirstName: '',
    LastName: '',
    Specialization: '',
    Department: 20,
    ProfilePhotoUrl: ''
  }

  constructor(private doctorSvc: DoctorService, private authSvc: AuthenticationService) {
    this.getAllDoctorsList();
  }

  getAllDoctorsList() {
    this.doctorSvc.getAllDoctors().subscribe({
      next: (res: any) => {
        this.doctorsList = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getDepartmentText(department: number): string {
    switch (department) {
      case 0: return 'Casualty Department';
      case 1: return 'Intensive Care Unit';
      case 2: return 'Anesthesiology';
      case 3: return 'Cardiology';
      case 4: return 'ENT';
      case 5: return 'Geriatric';
      case 6: return 'Gastroenterology';
      case 7: return 'General Surgery';
      case 8: return 'Gynaecology';
      case 9: return 'Haematology';
      case 10:return  'Pediatrics';
      case 11:return  'Neurology';
      case 12:return  'Oncology';
      case 13:return  'Ophthalmology';
      case 14:return  'Orthopaedic';
      case 15:return  'Urology';
      case 16:return  'Psychiatry';
      case 17:return  'Inpatient';
      case 18:return  'Outpatient';
      case 19:return  'Operating Theatre';
      case 20:return  'Others';
      default: return 'Unknown';
    }
  }

  onEditDoctor(id: number) {
    this.editDepartmentId = id;
    const edit = this.doctorsList.find(x => x.id == id);
    if (edit) {
      this.editData = {
        doctorName: edit.firstName + " " + edit.lastName,
        specialization: edit.specialization,
        department: edit.department
      };
    } else {
      console.log("Doctor not found with ID:", id);
    }
    console.log(this.editData)
    this.editShowDepartment = this.getDepartmentText(this.editData.department);
  }

  onDeleteDoctor(id: number) {
    if(confirm("Do you really want to delete?")){
      this.doctorSvc.deleteDoctor(id).subscribe({
        next: (res: any) => {
          alert("Doctor deleted Successfully");
          this.getAllDoctorsList();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  onUpdateDepartment(form: NgForm) {
    const updatedData = {
      ...this.editData
    }

    this.doctorSvc.updateDoctorDepartment(this.editDepartmentId, updatedData).subscribe({
      next: (res: any) => {
        alert("Department Updated Successfully");
        this.getAllDoctorsList();
      },
      error: (err) => {
        console.log(err);
      }
    });
    form.reset();
  }

  resetDoctorForm() {
    this.registerDoctor = {
      UserName: '',
      Password: '',
      Email: '',
      FirstName: '',
      LastName: '',
      Specialization: '',
      Department: 20,
      ProfilePhotoUrl: ''
    }
  }

  onRegister() {
    this.authSvc.registerDoctor(this.registerDoctor).subscribe({
      next: (res: any) => {
        alert("Doctor Registered Successfully");
        this.getAllDoctorsList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    this.resetDoctorForm();
  }

}
