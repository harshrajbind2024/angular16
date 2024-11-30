import { Component,OnInit } from '@angular/core';
import { AuthService } from '@lib/umwelt-lib';
import { SessionTimeoutComponent } from '@lib/umwelt-lib';
import { MatLegacyDialog, MatLegacyDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  public interval;
  public interval2;
  public count = 0;

  constructor(private auth: AuthService, private dialog: MatLegacyDialog) {}

  ngOnInit(){
    localStorage.setItem("flag",String(0));
    this.interval = setInterval(() => {
      this.checkIdleState(this.interval);
  }, 1 * 60 * 1000)

  // this.interval2 = setInterval(() => {
  //   this.sessionExistCheck();
  // },   5 * 60000)
  }

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation
  }

  checkIdleState(interval){
    let time = Number(localStorage.getItem("flag"))+1;
    if(time>=10){  
      this.count++;
      if(this.count>1){
        return
      }
      else{
        const timeoutDialogRef = this.dialog.open(SessionTimeoutComponent,{
          disableClose: true,
          height: '200px',
          width: '600px'
        });
      }
      // this.auth.setToken('');
    }
    else{
      this.count = 0;
      localStorage.setItem("flag",String(time))
    }
  }

  sessionExistCheck(){
    this.auth.checkSession().subscribe(
      res => {
        if (res['result']){
          this.auth.logout()
        }
      })
  }
}