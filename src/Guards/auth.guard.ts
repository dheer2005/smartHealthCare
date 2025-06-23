import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../Service/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSvc = inject(AuthenticationService);
  const loggedInUser = authSvc.getUserName();
  const role = authSvc.getUserRole();
  
  // console.log(route.routeConfig?.path);
  if(role == "Admin" &&
    ( 
      (route.routeConfig?.path === "patient-history") || 
      (route.routeConfig?.path === ("patient-prescription")) || 
      (route.routeConfig?.path === ("appointment")) ||
      (route.routeConfig?.path === ("doctor-dashboard")) || 
      (route.routeConfig?.path === ("prescriptions")) || 
      (route.routeConfig?.path === ("requested-appointments")) || 
      (route.routeConfig?.path === ("messages")) || 
      (route.routeConfig?.path === ("patient-messages")) || 
      (route.routeConfig?.path === ("allChats"))))
      {
        router.navigateByUrl('admin-dashboard');
        return false;
  }else if(role == "Doctor" &&
    (
      (route.routeConfig?.path === ("admin-doctors")) || 
      (route.routeConfig?.path === ("patient-history")) || 
      (route.routeConfig?.path === ("patient-prescription")) || 
      (route.routeConfig?.path === ("appointment")) ||
      (route.routeConfig?.path === ("admin-dashboard")) || 
      (route.routeConfig?.path === ("admin-patients")) || 
      (route.routeConfig?.path === ("patient-messages"))))
      {
        router.navigateByUrl('doctor-dashboard');
        return false;
  }else if(role == "Patient" &&
    ( 
      (route.routeConfig?.path === ("admin-dashboard")) || 
      (route.routeConfig?.path === ("admin-doctors")) || 
      (route.routeConfig?.path === ("admin-patients")) ||
      (route.routeConfig?.path === ("doctor-dashboard")) || 
      (route.routeConfig?.path === ("prescriptions")) || 
      (route.routeConfig?.path === ("requested-appointments")) || 
      (route.routeConfig?.path === ("messages"))))
      {
        router.navigateByUrl('appointment');
        return false;
  }
  if(loggedInUser != null){
    return true;
  }else{
    router.navigateByUrl('login');
    return false;
  }
};
