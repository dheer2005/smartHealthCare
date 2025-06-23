export interface RegisterPatientModel{
    UserName : string,
    Password : string,
    Email : string,
    FirstName : string,
    LastName : string,
    DOB : Date,
    Gender : Gender,
    Address : string,
    ProfilePhotoUrl : string
}

export enum Gender{
    Female,
    Male,
    Others
}