import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http:HttpClient, private jwtHelper: JwtHelperService, private router: Router, @Inject(PLATFORM_ID) private platformId: any) { }

  public UserName: any;
  public UserRole: any;
  public UserEmail: any;

  baseUrl:any= `https://localhost:7084/`;
  httpOptions:any = {
    header: new Headers({
      'content-type': 'application/json'
    })
  };


  loginUser(data:any){
    return this.http.post(this.baseUrl+"Auth/Login",data, this.httpOptions);
  }

  registerPatient(data:any){
    return this.http.post(this.baseUrl+"Auth/register-patient",data,this.httpOptions);
  }

  registerDoctor(data:any){
    return this.http.post(this.baseUrl+"Auth/register-doctor",data, this.httpOptions);
  }

  registerAdmin(data:any){
    return this.http.post(this.baseUrl+"Auth/register-admin",data,this.httpOptions);
  }

  getUser(email:string){
    return this.http.get(`${this.baseUrl}Patient/patient/${email}`,this.httpOptions);
  }

  checkAuthentication(){
    if(isPlatformBrowser(this.platformId)){
      const token = localStorage.getItem('jwt');
      if(token && !this.jwtHelper.isTokenExpired(token)){
        return true;
      }else{
        if(token){
          alert("Token is expired");
          localStorage.removeItem('jwt');
          this.router.navigateByUrl('/login');
        }
      }
    }
    return false;
  }

  getUserName(){
    if(isPlatformBrowser(this.platformId)){
      const token = localStorage.getItem('jwt');
      if(token !=null){
        const decodeToken: any = jwtDecode(token);
        this.UserName = decodeToken.UserName;
        this.UserRole = decodeToken.Role;
        // console.log(`UserName: ${this.UserName}`);
        return this.UserName;
      }
    }
  }

  getUserRole(){
    if(isPlatformBrowser(this.platformId)){
      const token = localStorage.getItem('jwt');
      if(token !=null){
        const decodeToken: any = jwtDecode(token);
        this.UserRole = decodeToken.Role;
        // console.log(`Role:${this.UserRole}`);
        return this.UserRole;
      }
    }
  }

  getUserEmail(){
    if(isPlatformBrowser(this.platformId)){
      const token = localStorage.getItem('jwt');
      if(token !=null){
        const decodeToken: any = jwtDecode(token);
        this.UserEmail = decodeToken.Email;
        // console.log(`Email:${this.UserEmail}`);
        return this.UserEmail;
      }
    }
  }

  getToken(): string | null{
    if(isPlatformBrowser(this.platformId)){
      return localStorage.getItem('jwt');
    }
    return null;
  }

}
