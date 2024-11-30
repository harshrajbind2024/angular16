import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@lib/umwelt-lib';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
// import { SubscriberModalComponent } from '../shared/subscriber-modal/subscriber-modal.component';
import { AuthService } from '@lib/umwelt-lib';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public isEmpEngClicked = true;
  public isEnpsClicked = false;
  public isHappinessClicked = false;
  public isHRClicked = false;
  public activeId = 'hr';  // Track which item is active
  public carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 2, lg: 4, all: 0 },
        slide: 2,
        speed: 400,
        loop: false,
        animation: 'lazy',
        point: {
          visible: false
        },
        load: 2,
        touch: true,
        easing: 'ease'
  };

  public carouselItems = [
    {
      id: 'hr',
      title: 'Employee Engagement',
      buttonClass: 'hr-button',
    },
    {
      id: 'enps',
      title: 'eNPS-Trend',
      buttonClass: 'enps-button',
    },
    {
      id: 'happiness',
      title: 'Happiness Index',
      buttonClass: 'happiness-button',
    },
    {
      id: 'flight',
      title: 'HR Overview',
      buttonClass: 'flight-button',
    }
  ];

  public dashCard = [
      {colorDark: '#5C6BC0',colorLight: '#7986CB', number: 1221, title: 'SALES',icon:'local_grocery_store'},
      {colorDark: '#42A5F5',colorLight: '#64B5F6', number: 1221, title: 'LEADS',icon:'new_releases'},
      {colorDark: '#26A69A',colorLight: '#4DB6AC', number: 1221, title: 'ASSETS',icon:'assignments'},
      {colorDark: '#66BB6A',colorLight: '#81C784', number: 1221, title: 'BANKING',icon:'account_balance'}
  ]

  public widgetFilters = [];
  public list:any;
  public chartvisible: any = "hr";
  constructor(private _trend:DashboardService, private auth:AuthService,
    private dialog:MatLegacyDialog){
    let isEmpExp = this.auth.getEmpExp()
    if(!isEmpExp){
      // this.dialog.open(SubscriberModalComponent,{
      //   disableClose: true,
      //   data:{
      //     'moduleName':'Employee Experience'
      //   }
      // });
    }
  }

  ngOnInit() {
      this._trend.change.subscribe( action => {
        this.chartvisible=action;
      })
      // this.carouselTile = {
      //   grid: {xs: 1, sm: 2, md: 3, lg: 4, all: 0},
      //   slide: 2,
      //   speed: 400,
      //   loop: false,
      //   animation: 'lazy',
      //   point: {
      //     visible: false
      //   },
      //   load: 2,
      //   touch: true,
      //   easing: 'ease'
      // }

      this._trend.getColorScales().subscribe(
        data => {
          localStorage.setItem('colorscale',JSON.stringify(data));
        }
      )
  }

  updateWidgetFilter(filters){
    this.widgetFilters = filters;
  }
  onClickingTrend(action){
    this.activeId = action;
    this._trend.trendClicked(action);
  }

  isActive(id) {
    return this.activeId === id;
  }
}