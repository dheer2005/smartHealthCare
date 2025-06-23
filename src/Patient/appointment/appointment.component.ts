import { Component } from '@angular/core';
import { AppointmentStatus, CreateAppointmentModel } from '../../Models/CreateAppointmentMode.model';
import { AuthenticationService } from '../../Service/authentication.service';
import { DoctorService } from '../../Service/doctor.service';
import { last } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PatientService } from '../../Service/patient.service';
import { UpdateAppointmentModel } from '../../Models/UpdateAppointmentModel.model';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  AppointmentStatus?: AppointmentStatus;
  patientId!:number;
  doctorId?: number;
  AppointmentsList: any[] = [];
  availableSlots: string[] = [];
  notAvailableSlots: boolean = false;
  availableSlotsForUpdate: string[] = [];
  selectedAppointmentDate?: Date | string;
  updateAppointmentDate?: string;
  clickedSlot?: number;
  editData:any = {};
  statusKeys = Object.keys(AppointmentStatus).filter(key => isNaN(Number(key)));
  minDate: string = new Date().toISOString().split('T')[0];

  createAppointment: CreateAppointmentModel={
    PatientId: this.patientId,
    DoctorId: this.doctorId,
    StartDateTime: '',
    EndDateTime: '',
    Status: AppointmentStatus.Pending,
    CreatedAt: new Date(new Date().getTime() + 19800000),
    updated: new Date(new Date().getTime() + 19800000)
  }

  constructor(private authSvc: AuthenticationService, public doctorSvc: DoctorService, private patientSvc: PatientService){
    this.authSvc.getUser(this.authSvc.UserEmail).subscribe({
      next:(res:any)=>{
        this.patientId = res.id;
        this.updateAppointmentList();
      },
      error:(err:any)=>{console.log(err);}
    });
    this.doctorSvc.getAllDoctors().subscribe({
      next:(res:any)=>{
        this.doctorSvc.DoctorsList = res.map((doc:any)=> ({
          id: doc.id,
          fullName: doc.firstName+doc.lastName,
          specialization: doc.specialization
        }));
      },
      error:(err:any)=>{
        console.log(err.error.message);
      }
    });
  }


 

  onDoctorChange() {
    if (this.doctorId && this.selectedAppointmentDate) {
      this.doctorSvc.getConfirmedAppointments(this.doctorId).subscribe({
        next: (res: any) => {
          const selectedDate = this.selectedAppointmentDate;
          if (selectedDate) {
            const selectedDay = new Date(selectedDate).toDateString();
            const sameDayAppointments = res.filter((appt:any) =>
              new Date(appt.startDateTime).toDateString() === selectedDay
            );
            const bookedTimes = sameDayAppointments.map((appt:any) => {
              const time = new Date(appt.startDateTime);
              return time.toLocaleTimeString([], { hour12:false, hour: '2-digit', minute: '2-digit',second: '2-digit' });
            });

            const allPossibleSlots = this.generateSlotTimes(selectedDate);
            this.availableSlots = allPossibleSlots.filter(slot => !bookedTimes.includes(slot));
            if(this.availableSlots.length == 0){
              this.notAvailableSlots = true;
            }
          }
        },
        error: (err:any) => {
          console.error(err);
          this.availableSlots = [];
        }
      });
    }
  }


  generateSlotTimes(selectedDate: any): string[] {
    const slots: string[] = [];
    const now = new Date(new Date().getTime()+3600000);
    const selected = new Date(selectedDate);
    const startSlot = new Date();
    startSlot.setHours(9, 0, 0, 0);

    const endSlot = new Date();
    endSlot.setHours(17,0,0,0);

    while(startSlot < endSlot){
      if(selected.toDateString() !== now.toDateString() || startSlot > now){
        const timeStr = startSlot.toLocaleTimeString([], { hour12:false, hour: '2-digit', minute: '2-digit',second: '2-digit' });
        slots.push(timeStr);
      }
      startSlot.setMinutes(startSlot.getMinutes() + 30);
    }
    return slots;
  }

  selectedSlot(index: number,slot:any){
    console.log("slots",slot)
    this.clickedSlot = index;
    this.createAppointment.StartDateTime = `${this.selectedAppointmentDate}T${slot}`;
    var end = new Date(new Date(`${this.selectedAppointmentDate}T${slot}`).getTime()+1800000).toTimeString().split(" ")[0];
    // console.log(slot);
    this.createAppointment.EndDateTime = `${this.selectedAppointmentDate}T${end}`
    // console.log("end:", end);
  }

  getStatusName(value: number): string {
    return this.statusKeys[value];
  }

  updateAppointmentList(){
    // this.onDoctorChange();
    this.patientSvc.allAppointments(this.patientId).subscribe({
      next: (data:any[])=>{
        this.AppointmentsList = data;
      },
      error: (err)=>{
        console.log(err);
      }
    });
  }

  

  onCreateAppointment(form:NgForm) {
    this.createAppointment.PatientId = this.patientId;
    this.createAppointment.DoctorId = this.doctorId;

    this.patientSvc.createAppointment(this.createAppointment).subscribe({
      next: (res) => {
        alert("Appointment Booked Successfully!");
        this.updateAppointmentList();
        form.reset();
        this.clickedSlot = undefined;
        this.availableSlots = [];
      },
      error: (err) => {
        alert(err.error.message);
        form.reset();
      }
    });
  }

  onUpdateAppointmentDateChange(){
    if (this.editData.doctorId && this.updateAppointmentDate) {
      this.doctorSvc.getConfirmedAppointments(this.editData.doctorId!).subscribe({
        next: (res: any) => {
          const selectedDate = this.updateAppointmentDate;
          if (selectedDate) {
            const selectedDay = new Date(selectedDate).toDateString();
            const sameDayAppointments = res.filter((appt:any) =>
              new Date(appt.startDateTime).toDateString() === selectedDay
            );
            const bookedTimes = sameDayAppointments.map((appt:any) => {
              const time = new Date(appt.startDateTime);
              return time.toLocaleTimeString([], { hour12:false, hour: '2-digit', minute: '2-digit',second: '2-digit' });
            });

            const allPossibleSlots = this.generateSlotTimes(selectedDate);
            this.availableSlotsForUpdate = allPossibleSlots.filter(slot => !bookedTimes.includes(slot));
          }
        },
        error: (err:any) => {
          console.error(err);
          this.availableSlotsForUpdate = [];
        }
      });
    }
  }

  selectedSlotForUpdate(index: number,slot:any){
    console.log("slots",slot)
    this.clickedSlot = index;
    this.editData.startDateTime = `${this.updateAppointmentDate}T${slot}`;
    var end = new Date(new Date(`${this.updateAppointmentDate}T${slot}`).getTime()+1800000).toTimeString().split(" ")[0];
    this.editData.endDateTime = `${this.updateAppointmentDate}T${end}`
    console.log("end:", end);
  }

  onEditAppointment(apptId:any){
    this.editData = this.AppointmentsList.find(x=>x.id == apptId);
    console.log(this.editData);
    this.updateAppointmentDate = new Date(this.editData.startDateTime).toLocaleDateString('en-CA');
    this.onUpdateAppointmentDateChange();
  }

  onUpdateAppointment(){
    const updatedData = {
      ...this.editData,
      patientId: this.patientId,
      status: 0,
    };
    
    this.patientSvc.updateAppointment(updatedData.id,updatedData).subscribe({
      next: (res:any)=>{
        alert("Appointment updated successfully");
        this.updateAppointmentList();
        this.resetUpdateForm();
      },
      error: (err)=>{
        alert(err.error.message);
      }
    });
  }

  resetUpdateForm(){
    this.clickedSlot = undefined;
    this.availableSlots = [];
  }

  onCancelAppointment(id:number){
    if(confirm("Do you really want to cancel this appointment")){
      this.patientSvc.cancelAppointment(id).subscribe({
        next: (res)=>{
          alert("Appointment Cancelled successfully");
          this.updateAppointmentList();
          this.clickedSlot = undefined;
          this.availableSlots = [];
        },
        error: (err)=>{
          alert(err.error.message);
        }
      });
    }
  }

  resetForm(appointmentForm:NgForm){
    appointmentForm.reset();
    this.clickedSlot = undefined;
    this.availableSlots = [];
    this.notAvailableSlots = false;
  }

}
