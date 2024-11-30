import { Component, OnInit ,Input, ViewChild} from '@angular/core';
import { AuthService } from '@lib/umwelt-lib';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit{
  @ViewChild('PerfectScrollbarComponent', {static: false}) componentRef?: any;
  @Input() isVisible : boolean = true;
  visibility = 'shown';

  sideNavOpened: boolean = false;
  matDrawerOpened: boolean = false;
  matDrawerShow: boolean = true;
  sideNavMode: string = 'side';
  logoUrl = "";
  ngOnChanges() {
   this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

	constructor(
    public auth: AuthService,
    private media: MediaObserver,
    ) {}

	ngOnInit() {
		this.media.asObservable().subscribe((change) => {
            this.toggleView();
        });
    this.logoUrl = JSON.parse(localStorage.getItem('List')).UmweltLogoURL;
	}

    ngAfterViewInit(){
        // this.componentRef.directiveRef.psScrollDown = (e) => {
        //     if(this.componentRef.directiveRef.position(true).y > 50){
        //         document.getElementById('enagagementFilterHeader').classList.add('active')
        //     }else{
        //         document.getElementById('enagagementFilterHeader').classList.remove('active')
        //     }
        // }
        // this.componentRef.directiveRef.psScrollUp = (e) => {
        //     if(this.componentRef.directiveRef.position(true).y > 50){
        //         document.getElementById('enagagementFilterHeader').classList.add('active')
        //     }else{
        //         document.getElementById('enagagementFilterHeader').classList.remove('active')
        //     }
        // }
    }

  getRouteAnimation(outlet:any) {

      return outlet.activatedRouteData.animation;
      //return outlet.isActivated ? outlet.activatedRoute : ''
  }

  toggleView() {
    if (this.media.isActive('gt-md')) {
            this.sideNavMode = 'over';
            this.sideNavOpened = false;
            this.matDrawerOpened = false;
            this.matDrawerShow = false;
        } else if(this.media.isActive('gt-xs')) {
            this.sideNavMode = 'over';
            this.sideNavOpened = false;
            this.matDrawerOpened = true;
            this.matDrawerShow = false;
        } else if (this.media.isActive('lt-sm')) {
            this.sideNavMode = 'over';
            this.sideNavOpened = false;
            this.matDrawerOpened = false;
            this.matDrawerShow = false;
        }
  }
}