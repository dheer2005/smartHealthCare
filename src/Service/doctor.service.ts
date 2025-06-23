import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  DoctorsList: any[]=[];
  constructor(private http:HttpClient) {}

  baseUrl: any = `https://localhost:7084/Doctor/`

  getAllDoctors(){
    return this.http.get(this.baseUrl+"doctors");
  }

  getConfirmedAppointments(doctorId:number){
    return this.http.get(`${this.baseUrl}appointments/myconfirmedappointments/${doctorId}`);
  }

  getTopConsultedDoctors(){
    return this.http.get(`${this.baseUrl}top-consulted-doctors`);
  }

  updateDoctorDepartment(doctorId: number, data:any){
    return this.http.post(`${this.baseUrl}UpdateDepartment/${doctorId}`, data);
  }

  getAllDepartmentCounts(){
    return this.http.get(`${this.baseUrl}department-counts`);
  }

  deleteDoctor(doctorId: number){
    return this.http.delete(`${this.baseUrl}deleteDoctor/${doctorId}`);
  }

  getAppointmentsForDoctor(doctorId:number){
    return this.http.get<any[]>(`${this.baseUrl}appointments/myappointments/${doctorId}`);
  }

  updateAppointmentStatus(appointmentId: number, data:any){
    return this.http.put(`${this.baseUrl}updateAppointmentStatus/${appointmentId}`,data);
  }

  createPrescription(data:any){
    return this.http.post(`${this.baseUrl}prescription`, data);
  }

  getPrescriptionsForCurrentDoctor(doctorId: number){
    return this.http.get(`${this.baseUrl}prescriptions/${doctorId}`);
  }

  updatePrescription(id: number, data: any) {
    return this.http.put(`${this.baseUrl}updatePrescription/${id}`, data);
  }

  deletePrescription(id: number) {
    return this.http.delete(`${this.baseUrl}prescription/${id}`);
  }

  PatientListForChat(doctorId: number){
    return this.http.get(`${this.baseUrl}PatientListForChat/${doctorId}`);
  }

  getAppointmentsForToday(doctorId: number) {
    const today = new Date().toISOString().split('T')[0]; 
    return this.http.get<any[]>(`${this.baseUrl}todayappointments/${doctorId}/${today}`);
  }

  getStatusCount(doctorId:number){
    return this.http.get(`${this.baseUrl}status-counts/${doctorId}`);
  }

}
