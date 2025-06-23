import { Routes } from '@angular/router';
import { RegisterComponent } from '../Authentication/register/register.component';
import { LoginComponent } from '../Authentication/login/login.component';
import { PatientHistoryComponent } from '../Patient/patient-history/patient-history.component';
import { PatientPrescriptionComponent } from '../Patient/patient-prescription/patient-prescription.component';
import { LabResultsComponent } from '../Patient/lab-results/lab-results.component';
import { AppointmentComponent } from '../Patient/appointment/appointment.component';
import { DashboardComponent } from '../Doctor/dashboard/dashboard.component';
import { PrescriptionsComponent } from '../Doctor/prescriptions/prescriptions.component';
import { RequestedAppointmentsComponent } from '../Doctor/requested-appointments/requested-appointments.component';
import { MessagesComponent } from '../Doctor/messages/messages.component';
import { PatientMessagesComponent } from '../Patient/patient-messages/patient-messages.component';
import { AllChatsComponent } from '../all-chats/all-chats.component';
import { AdminDashboardComponent } from '../Admin/admin-dashboard/admin-dashboard.component';
import { AdminDoctorsComponent } from '../Admin/admin-doctors/admin-doctors.component';
import { AdminPatientsComponent } from '../Admin/admin-patients/admin-patients.component';
import { authGuard } from '../Guards/auth.guard';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'patient-history', component: PatientHistoryComponent, canActivate: [authGuard]},
    { path: 'patient-prescription', component: PatientPrescriptionComponent, canActivate: [authGuard]},
    { path: 'lab-result', component: LabResultsComponent, canActivate: [authGuard]},
    { path: 'patient-messages', component: PatientMessagesComponent, canActivate: [authGuard]},
    { path: 'appointment', component: AppointmentComponent, canActivate: [authGuard]},
    { path: 'doctor-dashboard', component: DashboardComponent, canActivate: [authGuard]},
    { path: 'prescriptions', component: PrescriptionsComponent, canActivate: [authGuard]},
    { path: 'requested-appointments', component: RequestedAppointmentsComponent, canActivate: [authGuard]},
    { path: 'messages', component: MessagesComponent, canActivate: [authGuard]},
    { path: 'allChats', component: AllChatsComponent, canActivate: [authGuard]},
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard]},
    { path: 'admin-doctors', component: AdminDoctorsComponent, canActivate: [authGuard]},
    { path: 'admin-patients', component: AdminPatientsComponent, canActivate: [authGuard]},
    { path: '', redirectTo: 'login', pathMatch: 'full'}
];
