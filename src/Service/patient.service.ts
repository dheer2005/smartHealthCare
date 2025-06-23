import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  // baseUrl:any= `https://localhost:7084/Patient/`;
  baseUrl:any= `https://smartHealth.bsite.net/Patient/`;
  patientId?: number;

  constructor(private http: HttpClient) { }

  getAllPatients(){
    return this.http.get(`${this.baseUrl}getAllPatients`);
  }

  getGenderCounts(){
    return this.http.get(`${this.baseUrl}gender-counts`);
  }

  AgeCategory(){
    return this.http.get(`${this.baseUrl}AgeCategory`);
  }

  createAppointment(data:any){
    return this.http.post(this.baseUrl+"appointments", data);
  }

  allAppointments(patientId: number){
    return this.http.get<any[]>(`${this.baseUrl}appointments/myappointments/${patientId}`);
  }

  cancelAppointment(id: number){
    return this.http.delete(`${this.baseUrl}appointments/cancel/${id}`);
  }

  updateAppointment(id:number, data:any){
    return this.http.put(`${this.baseUrl}updateAppointment/${id}`,data);
  }

  visitHistory(Patientid:number){
    return this.http.get(`${this.baseUrl}VisitHistory/${Patientid}`);
  }

  getPrescriptionsForCurrentPatient(patientId: number){
    return this.http.get(`${this.baseUrl}prescriptions/${patientId}`);
  }

  doctorListForChat(patientId: number){
    return this.http.get(`${this.baseUrl}doctorListForChat/${patientId}`);
  }

}
