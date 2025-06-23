import { Component } from '@angular/core';
import { DoctorService } from '../../Service/doctor.service';
import { AuthenticationService } from '../../Service/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentStatus } from '../../Models/CreateAppointmentMode.model';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  doctorId!: number;
  doctorName?: string;
  todaysAppointments: any[] = [];
  AppointmentStatus = AppointmentStatus;
  statusKeys = Object.keys(AppointmentStatus).filter(key => isNaN(Number(key)));
  public pendingCount: number = 0;
  public confirmedCounts: number = 0;
  public completedCounts: number = 0;
  public cancelledCounts: number = 0; 
  public totalCounts: number = 0;
  patientHistory: any[] = [];
  selectedAppointment: any = null;

  prescription = {
    appointmentId: 0,
    doctorId: 0,
    patientId: 0,
    medications: '',
    notes: ''
  };


  public pieChartData!: ChartData<'pie', number[], string | string[]>
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
  public pieChartType: 'doughnut' = 'doughnut';

  constructor(private authSvc: AuthenticationService, private doctorSvc: DoctorService) {
    this.authSvc.getUser(this.authSvc.UserEmail).subscribe({
      next: (res: any) => {
        this.doctorId = res.id;
        this.loadTodaysAppointments();
        this.loadstatusCount();
        this.updatePatientHistory();
        this.doctorName = this.authSvc.getUserName();
      },
      error: err => console.error(err)
    });
  }

  getStatusName(value: number): string {
    return this.statusKeys[value];
  }

  selectAppointment(appt: any) {
    this.selectedAppointment = appt;
    this.prescription.appointmentId = appt.id ?? 0;
    this.prescription.doctorId = this.doctorId ?? 0;
    this.prescription.patientId = appt.patientId ?? 0;
  }

  submitPrescription() {
    if(this.prescription.medications.trim() && this.prescription.notes.trim()){
      this.doctorSvc.createPrescription(this.prescription).subscribe({
        next: () => {
          alert('Prescription submitted!');
          this.selectedAppointment = null;
          this.prescription = {
            appointmentId: 0,
            doctorId: this.doctorId ?? 0,
            patientId: 0,
            medications: '',
            notes: ''
          };
        },
        error: err => console.error(err)
      });
    }else{
      alert("Input correct format of data");
    }
  }


  loadTodaysAppointments() {
    this.doctorSvc.getAppointmentsForToday(this.doctorId).subscribe(data => {
      this.todaysAppointments = data;
    });
  }

  loadstatusCount() {
    this.doctorSvc.getStatusCount(this.doctorId).subscribe({
      next: (res:any)=>{
        this.pendingCount = res.find((x:any)=>x.status == "Pending")?.count || 0;
        this.confirmedCounts = res.find((x:any)=>x.status == "Confirmed")?.count || 0;
        this.cancelledCounts = res.find((x:any)=>x.status == "Cancelled")?.count || 0;
        this.completedCounts = res.find((x:any)=>x.status == "Completed")?.count || 0;
        this.updateChart();
        this.totalCounts = this.pendingCount+this.confirmedCounts+this.cancelledCounts+this.completedCounts
      }
    })
  }

  updateChart(){
    this.pieChartData = {
      labels: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      datasets: [
        {
          data: [this.confirmedCounts ?? 0, this.pendingCount??0, this.cancelledCounts??0, this.completedCounts??0],
          backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3'],
        }
      ]
    };
  }

  updatePatientHistory(){
    this.doctorSvc.getAppointmentsForDoctor(this.doctorId).subscribe({
      next: (res:any)=>{
        this.patientHistory = res.sort((a:any, b:any) => {
          const dateA = new Date(a.startDateTime).getTime();
          const dateB = new Date(b.startDateTime).getTime();
          return dateB - dateA; 
        });
      }
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Cancelled';
      case 3: return 'Completed';
      default: return 'Unknown';
    }
  }

}
