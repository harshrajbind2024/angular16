import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FilterConstants } from '@lib/umwelt-lib';
import { EngagementInsightsService } from '@lib/umwelt-lib';
import { AuthService } from '@lib/umwelt-lib';

@Component({
  selector: 'app-engagement-insights',
  templateUrl: './engagement-insights.component.html',
  styleUrls: ['./engagement-insights.component.scss']
})
export class EngagementInsightsComponent implements OnInit {
  quarters = FilterConstants.getQuarters();
  months = FilterConstants.getMonths();
  selectedFilters=[];

  empType:any;
  constructor(public insight:EngagementInsightsService,public auth:AuthService) {
  } 
  getfilterList:any=[]

  cap1:any = ''
  cap2:any = ''
  insightsData:any = {}
  insightsDataCopy:any = {}
  async ngOnInit() {
    this.auth.setCurrentPage('engagement-insights')
    this.empType = this.auth.getEmpType()
    this.insight.displaySubCaption = this.getSubCaption('filter');
    this.insight.displaySubCaption2 = this.getSubCaption('filter2');
    this.cap1 = this.getTitle('filter');
    this.cap2 = this.getTitle('filter2');
    this.auth.getSelectedFilter().subscribe(filter => {
      this.selectedFilters = filter;
      if (this.auth.currentPage === 'engagement-insights' && this.auth.isFilterSet){
        this.sendSelectedFilters()
      }
    });

    this.auth.getDateFilter().subscribe(filter => {
      if (this.auth.currentPage === 'engagement-insights' && this.auth.isDateFilterSet){
        this.cap1 = this.getTitle('filter');
        this.cap2 = this.getTitle('filter2');
        this.sendSelectedFilters()
      }
    });
    let details = JSON.parse(atob(sessionStorage.getItem('details')));
    this.insightsData = await this.insight.getInsights({empType:this.empType,empCode:details.empcode});
    this.insightsDataCopy = JSON.parse(JSON.stringify(this.insightsData))
  }

  getSubCaption(filter:any){
    let subCaption = "";
    if(this.insight[filter].type == "1"){
      subCaption = this.getMonthNameForId(this.insight[filter].monthStart)+" "+this.insight[filter].yearStart;
    }
    else if(this.insight[filter].type == "2"){
      subCaption = this.getQuarterNameForId(this.insight[filter].quarterStart)+" "+this.insight[filter].yearStart;
    }
    else if (this.insight[filter].type == "4"){
      if (this.insight[filter].pickfrom && this.insight[filter].pickto){
        let from = new Date(this.insight[filter].pickfrom)
        let to = new Date(this.insight[filter].pickto)
        subCaption = from.getDate() + "/" + (from.getMonth() + 1)  + "/" + from.getFullYear() + " - " + to.getDate() + "/" + (to.getMonth() + 1)  + "/" + to.getFullYear()
      }
      else{
        subCaption = ''
      }
    }
    else{
      subCaption = this.insight[filter].yearStart;
    }
    return subCaption;
  }
  getTitle(filter:any){
    let subCaption = "";
    if(this.auth[filter].type == "1"){
      subCaption = this.getMonthNameForId(this.auth[filter].monthStart)+" "+this.auth[filter].yearStart.substring(2,4);
    }
    else if(this.auth[filter].type == "2"){
      subCaption = this.getQuarterNameForId(this.auth[filter].quarterStart)+" "+this.auth[filter].yearStart;
    }
    else if (this.auth[filter].type == "4"){
      if (this.auth[filter].pickfrom && this.auth[filter].pickto){
        let from = new Date(this.auth[filter].pickfrom)
        let to = new Date(this.auth[filter].pickto)
        subCaption = ("0" + from.getDate()).slice(-2) + "/" + ("0" + (from.getMonth() + 1)).slice(-2)  + "/" + from.getFullYear().toString().substring(2,4) + " - " + ("0" + to.getDate()).slice(-2) + "/" + ("0" + (to.getMonth() + 1)).slice(-2)  + "/" + to.getFullYear().toString().substring(2,4)
      }
      else{
        subCaption = ''
      }
    }
    else{
      subCaption = this.auth[filter].yearStart;
    }
    return subCaption;
  }

  getQuarterNameForId(quarter) {
    let selectedQuarter = this.quarters.filter(x => x.id === quarter.toString());
    return selectedQuarter[0].name;
  }

  getMonthNameForId(month) {
    let selectedMonth = this.months.filter(x => x.id === month.toString());
    return selectedMonth[0].name;
  }

  async sendSelectedFilters(){
      this.insight.respondentFilter['flag'] = '0'
      let details = JSON.parse(atob(sessionStorage.getItem('details')));
      this.insightsData = await this.insight.getInsights({empType:this.empType,empCode:details.empcode,range_filter_1:this.auth.filter,range_filter_2:this.auth.filter2,engagementParams:this.selectedFilters});
      this.insightsDataCopy = JSON.parse(JSON.stringify(this.insightsData))
      await this.insight.getHeatList(this.insight.typeHeatlist, this.insight.selectedFactor, this.insight.selectedDriver)
    }
}