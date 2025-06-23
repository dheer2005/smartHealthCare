import { AppointmentStatus } from "./CreateAppointmentMode.model";

export interface UpdateAppointmentModel {
    PatientId: number|undefined,
    DoctorId: number|undefined,
    StartDateTime: Date,
    EndDatetime: Date,
    Status: AppointmentStatus,
    CreatedAt: Date,
    updated: Date
}