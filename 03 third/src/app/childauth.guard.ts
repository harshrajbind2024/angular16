import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const childauthGuard: CanActivateFn = (route, state) => {

  let _route = inject(Router);  
  let isloggedId=localStorage.getItem('isloggedIn');
  if(isloggedId=='false'){
    alert("due to access rights ,redirecting to login page ");
    _route.navigate(['login'])
    return false;
  }
  return true;
};
