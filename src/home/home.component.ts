import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from '../Service/authentication.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userName?: string;
  userEmail?: string;
  constructor(private routes: Router, @Inject(PLATFORM_ID) private platformId: any, public authSvc: AuthenticationService){
    this.userName = this.authSvc.getUserName();
    this.userEmail = this.authSvc.getUserEmail();
  }

  logout(){
    if(isPlatformBrowser(this.platformId)){
      localStorage.removeItem('jwt');
      this.authSvc.UserName = null;
      this.authSvc.UserRole = null;
      this.routes.navigateByUrl('login');
    }
  }
}
