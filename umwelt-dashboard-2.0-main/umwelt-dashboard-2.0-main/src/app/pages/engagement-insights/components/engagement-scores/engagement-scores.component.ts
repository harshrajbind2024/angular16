import { Component, OnInit, Input } from '@angular/core';
import { EngagementInsightsService } from '@lib/umwelt-lib';
import { Router } from '@angular/router'
@Component({
  selector: 'app-engagement-scores',
  templateUrl: './engagement-scores.component.html',
  styleUrls: ['./engagement-scores.component.scss']
})
export class EngagementScoresComponent implements OnInit {
  @Input() insightsData : any = {};
  @Input() cap1 : any = '';
  @Input() cap2 : any = '';
  constructor(public insights:EngagementInsightsService,public router:Router) {
    
  }
  ngOnInit() {
  }
  navigateToSentiment(){
    let url = '/auth/employee-experience/sentiments'
    let from,to ;
    if(this.insights.filter.type == '1'){
      from = `${this.insights.filter.yearStart}-${this.insights.filter.monthStart.padStart(2,'0')}-01`
      to = `${this.insights.filter.yearStart}-${this.insights.filter.monthStart.padStart(2,'0')}-${this.lastday(this.insights.filter.yearStart,this.insights.filter.monthStart)}`
    }
    if(this.insights.filter.type == '2'){
      from = `${this.insights.filter.yearStart}-${String((this.insights.filter.quarterStart*3)-2).padStart(2,'0')}-01`
      to = `${this.insights.filter.yearStart}-${String(this.insights.filter.quarterStart*3).padStart(2,'0')}-${this.lastday(this.insights.filter.yearStart,this.insights.filter.quarterStart*3)}`
    }
    if(this.insights.filter.type == '3'){
      from = `${this.insights.filter.yearStart}-01-01`
      to = `${this.insights.filter.yearStart}-12-${this.lastday(this.insights.filter.yearStart,12)}`
    }
    this.router.navigate([`${url}`], { queryParams: {from, to}});
  }

  lastday (y,m){
    return  new Date(y, m, 0).getDate();
  }
}