import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
   
  // create a object  second 
  let _route = inject(Router);  
  let isloggedId=localStorage.getItem('isloggedIn');
  if(isloggedId=='false'){
    alert("not authentication user !! ");
    _route.navigate(['login'])
    return false;
  }
  



  // first 
    
  // let isloggedId=localStorage.getItem('isloggedIn');
  // if(isloggedId=='false'){
  //   alert("not authentication user !! ");
  //   return false;
  // }


  return true;
};

// authGuard -- use to before login
// canactive:[authGuard]