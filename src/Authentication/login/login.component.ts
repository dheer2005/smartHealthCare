import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthenticationService } from '../../Service/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { LoginModel } from '../../Models/LoginModel.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private http:HttpClient, private authSvc: AuthenticationService,private router: Router, @Inject(PLATFORM_ID) private platformId: any){}

  login:LoginModel={
    UserName: '',
    Password: ''
  }


  ngOnInit(): void {
      if(isPlatformBrowser(this.platformId)){
        if(localStorage.getItem('jwt') && this.authSvc.checkAuthentication()){
          if(this.authSvc.getUserRole() == 'patient'){
            this.router.navigateByUrl('/appointment');
          }else if(this.authSvc.getUserRole() == 'Doctor'){
          this.router.navigateByUrl('/doctor-dashboard');
        }else {
          this.router.navigateByUrl('/admin-dashboard');
        }
      }
    }
  }

  onLogin(){
    this.authSvc.loginUser(this.login).subscribe({
      next: (res:any)=>{
        localStorage.setItem('jwt',res.token);
        this.authSvc.getUserName();
        const role = this.authSvc.getUserRole();
        this.authSvc.getUserEmail();
        if(this.authSvc.getUserRole() == 'Patient'){
          this.router.navigateByUrl('/appointment');
        }else if(this.authSvc.getUserRole() == 'Doctor'){
          this.router.navigateByUrl('/doctor-dashboard');
        }else {
          this.router.navigateByUrl('/admin-dashboard');
        }
      },
      error: (err:any)=>{
        if(err.status==0){
          console.log(`Error at server side please try again later: ${err}`);
        }else{
          console.log("wrong username and password");
        }
      }
    });
    
  }
}
