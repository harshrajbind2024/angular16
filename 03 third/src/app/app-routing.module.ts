import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { LoginComponent } from './login/login.component';
import { Student65Component } from './student65/student65.component';
import { combineLatest } from 'rxjs';
import { StudentdetailComponent } from './studentdetail/studentdetail.component';
import { RegisterComponent } from './register/register.component';
import { childauthGuard } from './childauth.guard';

const routes: Routes = [
 {path:' ' , redirectTo:'home' ,pathMatch:'full' },
 { path: 'home',component:DashboardComponent },
 {path:'aboutus',component:AboutusComponent,canActivate:['authGuard']},
 {path: 'contactus', component:ContactusComponent },
 {path:'login',component:LoginComponent},
 // // narmaly single page
//  {path:'student65',component:Student65Component}, 
//  {path:'studentdetail',component:StudentdetailComponent},
//  {path:'register',component:RegisterComponent}

// //  if studentdetail , register make chile of student65 but define path or change path
// // it's right but  good way, but good way aplye guard route and canactivechild guard
// {path:'student65/studentdetail',component:StudentdetailComponent},
// {path:'student65/register',component:RegisterComponent}

// // good way create child
// // if i'm apply guard canActivate:['authGuard'] then apply all child it's not good way
// // i'm apply child route guard
//  {path:'student65',
//   children:[
//     {path:'',component:Student65Component},
//     {path:'studentdetail',component:StudentdetailComponent},
//     {path:'register',component:RegisterComponent}   
//   ]
//  }, 


// canActivateChild:[childauthGuard], to not shor to child element before login
//  {path:'student65',canActivateChild:[childauthGuard],
//   children:[
//     {path:'',component:Student65Component},
//     {path:'studentdetail',component:StudentdetailComponent},
//     {path:'register',component:RegisterComponent}   
//   ]
//  }, 


// // both child not see before login
// {path:'student65',
//   children:[
//     {path:'',component:Student65Component},
//     { 
//       path:'',canActivateChild:[childauthGuard],
//       children:[
//         {path:'studentdetail',component:StudentdetailComponent},
//         {path:'register',component:RegisterComponent} 

//     ] },
  
//   ]
//  }, 


// // only register child not see before login

{path:'student65',
  children:[
    {path:'',component:Student65Component},
    {path:'studentdetail',component:StudentdetailComponent},
    { 
      path:'',canActivateChild:[childauthGuard],
      children:[
       
        {path:'register',component:RegisterComponent} 

    ] },
  
  ]
 }, 





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
