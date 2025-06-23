import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { DoctorService } from '../../Service/doctor.service';
import { PatientService } from '../../Service/patient.service';
import { AuthenticationService } from '../../Service/authentication.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  totalCounts: number = 0;
  maleCount: number = 0;
  femaleCount: number = 0;
  OtherCount: number = 0;
  kidsCount: number = 0;
  teenagersCount: number = 0;
  adultsCounts: number = 0;
  seniorCitizensCounts: number = 0;

  casualtyCount: number = 0;
  intensiveCareUnitCount: number = 0;
  anesthesiologyCount: number = 0;
  cardiologyCount: number = 0;
  entCount: number = 0;
  geriatricCount: number = 0;
  gastroenterologyCount: number = 0;
  generalsurgeryCount: number = 0;
  gynaecologyCount: number = 0;
  haematologyCount: number = 0;
  pediatricsCount: number = 0;
  neurologyCount: number = 0;
  oncologyCount: number = 0;
  opthalmologyCount: number = 0;
  orthopaedicCount: number = 0;
  urologyCount: number = 0;
  psychiatryCount: number = 0;
  inpatientCount: number = 0;
  outpatientCount: number = 0;
  operatingtheatreCount: number = 0;
  othersCount: number = 0;
  
  topConsultedDoctorsList: any[] = [];
  consultedDoctor1: number = 0;
  consultedDoctor2: number = 0;
  consultedDoctor3: number = 0;
  consultedDoctorName1: string | undefined;
  consultedDoctorName2: string | undefined;
  consultedDoctorName3: string | undefined;



  constructor(private doctorSvc:DoctorService, private patientSvc: PatientService, private authSvc: AuthenticationService){
    this.loadGenderCount();
    this.loadAgeCategory();
    this,this.loadDepartmentCount();
    this.loadTopConsultedDoctors();
  }

  public pieChartData!: ChartData<'pie', number[], string | string[]>
  public doughnutChartData!: ChartData<'doughnut', number[], string | string[]>
  public departmentBarChartData!: ChartData<'bar', number[], string | string[]>
  public consultedBarChartData!: ChartData<'bar', number[], string | string[]>
    public pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'left' as const,
          labels: {
            boxWidth: 20,
            padding: 10,
          }
        }
      }
    };

    public consultedBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          },
          title: {
            display: true,
            text: 'Appointments'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Doctor Names'
          }
        }
      },
      plugins: {
        
      }
    };
    


    public barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          },
          title: {
            display: true,
            text: 'Count'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Departments'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    };

    public pieChartType: 'pie' = 'pie';
    public doughnutChartType: 'doughnut' = 'doughnut';
    public departmentBarChartType: 'bar' = 'bar';
    public consultedBarChartType: 'bar' = 'bar';


    loadGenderCount() {
      this.patientSvc.getGenderCounts().subscribe({
        next: (res:any)=>{
          this.maleCount = res.find((x:any)=>x.gender == "Male")?.count || 0;
          this.femaleCount = res.find((x:any)=>x.gender == "Female")?.count || 0;
          this.OtherCount = res.find((x:any)=>x.gender == "Other")?.count || 0;
          
          this.updateChart();
          this.totalCounts = this.maleCount+this.femaleCount+this.OtherCount
        }
      });
    }

    loadDepartmentCount(){
      this.doctorSvc.getAllDepartmentCounts().subscribe({
        next:(res:any)=>{
          // console.log("department res: ", res);
          this.casualtyCount = res.find((x: any) => x.department === "Casualty")?.count || 0;
          this.intensiveCareUnitCount = res.find((x: any) => x.department === "IntensiveCareUnit")?.count || 0;
          this.anesthesiologyCount = res.find((x: any) => x.department === "Anesthesiology")?.count || 0;
          this.cardiologyCount = res.find((x: any) => x.department === "Cardiology")?.count || 0;
          this.entCount = res.find((x: any) => x.department === "ENT")?.count || 0;
          this.geriatricCount = res.find((x: any) => x.department === "Geriatric")?.count || 0;
          this.gastroenterologyCount = res.find((x: any) => x.department === "Gastroenterology")?.count || 0;
          this.generalsurgeryCount = res.find((x: any) => x.department === "Generalsurgery")?.count || 0;
          this.gynaecologyCount = res.find((x: any) => x.department === "Gynaecology")?.count || 0;
          this.haematologyCount = res.find((x: any) => x.department === "Haematology")?.count || 0;
          this.pediatricsCount = res.find((x: any) => x.department === "Pediatrics")?.count || 0;
          this.neurologyCount = res.find((x: any) => x.department === "Neurology")?.count || 0;
          this.oncologyCount = res.find((x: any) => x.department === "Oncology")?.count || 0;
          this.opthalmologyCount = res.find((x: any) => x.department === "Opthalmology")?.count || 0;
          this.orthopaedicCount = res.find((x: any) => x.department === "Orthopaedic")?.count || 0;
          this.urologyCount = res.find((x: any) => x.department === "Urology")?.count || 0;
          this.psychiatryCount = res.find((x: any) => x.department === "Psychiatry")?.count || 0;
          this.inpatientCount = res.find((x: any) => x.department === "Inpatient")?.count || 0;
          this.outpatientCount = res.find((x: any) => x.department === "Outpatient")?.count || 0;
          this.operatingtheatreCount = res.find((x: any) => x.department === "Operatingtheatre")?.count || 0;
          this.othersCount = res.find((x: any) => x.department === "Others")?.count || 0;

          this.updateChart();
        }
      })
    }

    loadAgeCategory() {
      this.patientSvc.AgeCategory().subscribe({
        next: (res:any)=>{
          this.kidsCount = res.kids;
          this.teenagersCount = res.teenagers;
          this.adultsCounts = res.adults;
          this.seniorCitizensCounts = res.seniorCitizens;
          this.updateChart();
          this.totalCounts = this.maleCount+this.femaleCount+this.OtherCount
        }
      });
    }

    loadTopConsultedDoctors(){
      this.doctorSvc.getTopConsultedDoctors().subscribe({
        next: (res:any)=>{
          console.log(res);
          this.topConsultedDoctorsList = res.map((x:any)=>({
            fullName: x.fullName,
            appointmentCount: x.appointmentCount
          }));
          console.log("consultedDoctors:",this.topConsultedDoctorsList);
          this.consultedDoctorName1 = this.topConsultedDoctorsList[0].fullName;
          this.consultedDoctor1 = this.topConsultedDoctorsList[0].appointmentCount;
          this.consultedDoctorName2 = this.topConsultedDoctorsList[1].fullName;
          this.consultedDoctor2 = this.topConsultedDoctorsList[1].appointmentCount;
          this.consultedDoctorName3 = this.topConsultedDoctorsList[2].fullName;
          this.consultedDoctor3 = this.topConsultedDoctorsList[2].appointmentCount;
          this.updateChart();
        },
        error: (err)=>{
          console.log(err);
        }
      })
    }


    updateChart(){
      this.pieChartData = {
        labels: ['Male', 'Female', 'Others'],
        datasets: [
          {
            data: [this.maleCount ?? 0, this.femaleCount??0, this.OtherCount??0],
            backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
          }
        ]
      };

      this.doughnutChartData = {
        labels: ['Kids', 'Teenagers', 'Adults', 'Senior Citizens'],
        datasets: [
          {
            data: [this.kidsCount ?? 0, this.teenagersCount??0, this.adultsCounts??0, this.seniorCitizensCounts??0],
            backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336'],
          }
        ]
      };


      this.consultedBarChartData = {
        labels: [this.consultedDoctorName1!, this.consultedDoctorName2!, this.consultedDoctorName3!],
        datasets: [
          {
            data: [this.consultedDoctor1 ?? 0, this.consultedDoctor2??0, this.consultedDoctor3??0],
            backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
          }
        ]
      }

      const departmentData = [
        { label: 'Casualty', count: this.casualtyCount ?? 0, color: '#4caf50' },
        { label: 'Intensive Care Unit', count: this.intensiveCareUnitCount ?? 0, color: '#2196f3' },
        { label: 'Anesthesiology', count: this.anesthesiologyCount ?? 0, color: '#ff9800' },
        { label: 'Cardiology', count: this.cardiologyCount ?? 0, color: '#9c27b0' },
        { label: 'ENT', count: this.entCount ?? 0, color: '#f44336' },
        { label: 'Geriatric', count: this.geriatricCount ?? 0, color: '#00bcd4' },
        { label: 'Gastroenterology', count: this.gastroenterologyCount ?? 0, color: '#e91e63' },
        { label: 'General Surgery', count: this.generalsurgeryCount ?? 0, color: '#673ab7' },
        { label: 'Gynaecology', count: this.gynaecologyCount ?? 0, color: '#ffc107' },
        { label: 'Haematology', count: this.haematologyCount ?? 0, color: '#795548' },
        { label: 'Pediatrics', count: this.pediatricsCount ?? 0, color: '#3f51b5' },
        { label: 'Neurology', count: this.neurologyCount ?? 0, color: '#607d8b' },
        { label: 'Oncology', count: this.oncologyCount ?? 0, color: '#8bc34a' },
        { label: 'Ophthalmology', count: this.opthalmologyCount ?? 0, color: '#009688' },
        { label: 'Orthopaedic', count: this.orthopaedicCount ?? 0, color: '#ff5722' },
        { label: 'Urology', count: this.urologyCount ?? 0, color: '#cddc39' },
        { label: 'Psychiatry', count: this.psychiatryCount ?? 0, color: '#607d8b' },
        { label: 'Inpatient', count: this.inpatientCount ?? 0, color: '#3f51b5' },
        { label: 'Outpatient', count: this.outpatientCount ?? 0, color: '#e91e63' },
        { label: 'Operating Theatre', count: this.operatingtheatreCount ?? 0, color: '#009688' },
        { label: 'Others', count: this.othersCount ?? 0, color: '#9e9e9e' }
      ];

    const filteredDepartments = departmentData.filter(dep => dep.count >= 0 && dep.label);

    this.departmentBarChartData = {
      labels: filteredDepartments.map(dep => dep.label),
      datasets: [
        {
          data: filteredDepartments.map(dep => dep.count),
          backgroundColor: filteredDepartments.map(dep => dep.color)
        }
      ]
    };
  }
}
