import { Department } from "./DepartmentsEnum.model";

export interface RegisterDoctorModel{
    UserName : string,
    Password : string,
    Email : string,
    FirstName : string,
    LastName : string,
    Specialization : string,
    Department : number | null,
    ProfilePhotoUrl : string
}