export interface CreateAppointmentModel {
    PatientId: number|undefined,
    DoctorId: number|undefined,
    StartDateTime: Date | string,
    EndDateTime: Date | string,
    Status: AppointmentStatus,
    CreatedAt: Date,
    updated: Date
}

export enum AppointmentStatus{
    Pending,
    Confirmed,
    Cancelled,
    Completed
}