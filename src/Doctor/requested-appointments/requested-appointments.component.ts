import { Component } from '@angular/core';
import { AppointmentStatus } from '../../Models/CreateAppointmentMode.model';
import { DoctorService } from '../../Service/doctor.service';
import { AuthenticationService } from '../../Service/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requested-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requested-appointments.component.html',
  styleUrl: './requested-appointments.component.css'
})
export class RequestedAppointmentsComponent {

  appointmentsList: any[] = [];
  confirmedAppointmentList: any[] = [];
  selectedAppointment: any = null;
  doctorId!: number;
  AppointmentStatus = AppointmentStatus;
  statusKeys = Object.keys(AppointmentStatus).filter(key => isNaN(Number(key)));

  prescription: {
    appointmentId: number,
    doctorId: number,
    patientId: number,
    medications: string,
    notes: string
  } = {
    appointmentId: 0,
    doctorId: 0,
    patientId: 0,
    medications: '',
    notes: ''
  };

  constructor(private doctorSvc: DoctorService, private authSvc: AuthenticationService) {
    this.authSvc.getUser(this.authSvc.UserEmail).subscribe({
      next: (res: any) => {
        this.doctorId = res.id;
        this.loadAppointments();
        this.loadConfirmedAppointment();
      },
      error: err => console.error(err)
    });
  }

  getStatusName(value: number): string {
    return this.statusKeys[value];
  }

  loadAppointments() {
    if (this.doctorId !== undefined) {
      this.doctorSvc.getAppointmentsForDoctor(this.doctorId).subscribe({
        next: (res: any[]) => {
          this.appointmentsList = res.filter(a => a.status === 0);
          console.log("refresh list:", res);
        },
        error: err => console.error(err)
      });
    } else {
      console.error("Doctor ID is undefined");
    }
  }

  loadConfirmedAppointment(){
    this.doctorSvc.getConfirmedAppointments(this.doctorId).subscribe({
      next: (res:any)=>{
        this.confirmedAppointmentList = res;
      },
      error: (err:any)=>{
        console.log(err);
      }
    })
  }

  updateStatus(appt: any, status1: AppointmentStatus) {
    console.log("appointment status:" , appt);
    console.log("appointment status:" , status1);
    const confirmedAppt = this.confirmedAppointmentList.find(x=>{
      let apptStart = new Date(appt.startDateTime).getTime();
      let Start = new Date(x.startDateTime).getTime();
      let end = new Date(x.endDateTime).getTime();

      return apptStart >= Start && apptStart <= end
    });

    const updatedAppointment = {
      id: appt.id,
      patientId: appt.patientId,
      patientName: appt.patientName,
      startDateTime: appt.startDateTime,
      endDateTime: appt.endDateTime,
      status: status1
    }
    console.log(updatedAppointment)

    if(confirmedAppt){
      if(confirm("You have an appointment at that time! Do you really want to confirm this appointment")){
        this.doctorSvc.updateAppointmentStatus(appt.id, updatedAppointment).subscribe({
          next: () => {
            alert('Status updated');
            this.loadAppointments();
          },
          error: (err) => console.error(err)
        });
      }
    }
    else{
      if(confirm("Do you really want to confirm this Appointment ")){
        this.doctorSvc.updateAppointmentStatus(appt.id, updatedAppointment).subscribe({
          next: () => {
            alert('Status updated');
            this.loadAppointments();
          },
          error: (err) => console.error(err)
        });
      } 
    }
  }

  selectAppointment(appt: any) {
    this.selectedAppointment = appt;
    this.prescription.appointmentId = appt.id ?? 0;
    this.prescription.doctorId = this.doctorId ?? 0;
    this.prescription.patientId = appt.patientId ?? 0;
  }

  submitPrescription() {
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
  }
}
