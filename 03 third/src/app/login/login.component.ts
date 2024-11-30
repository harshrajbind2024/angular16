import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // userid:any[]=[];
  // password:any[]=[];

  // userid:any;
  // password:any;


  login(userid:any,password:any){
     if(userid==='harsh' && password=='123' ){
      localStorage.setItem("isloggedIn","true");
     }else{
      localStorage.setItem("isloggedIn","false");

     }
  }

}
