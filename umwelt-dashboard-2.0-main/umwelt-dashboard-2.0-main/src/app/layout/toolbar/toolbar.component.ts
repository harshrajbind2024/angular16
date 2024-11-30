import { Component, OnInit, Input } from '@angular/core';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { DashboardService } from '@lib/umwelt-lib';
import { AuthService } from '@lib/umwelt-lib';
// import { DateFilterComponent } from '@lib/umwelt-lib';
import { FilterConstants } from '@lib/umwelt-lib';
import { ToolbarNotificationComponent } from '@lib/umwelt-lib';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
	
  @Input() sidenav :any;
	@Input() sidebar :any;
	@Input() drawer :any;
  @Input() matDrawerShow :any;
  public time: any;
  public isEmpExp;
  public isCovidPresense;
  public isActionInsights = false;
  public selectedFilters=[];
  public showCompare:boolean=false;
  public showToolbarFilters:boolean=false;
  quarters = FilterConstants.getQuarters();
  months = FilterConstants.getMonths();
  
  searchOpen: boolean = false;
    notificationObjs: any;
    constructor(
      private _trend: DashboardService,
      public auth: AuthService,
      private dialog: MatLegacyDialog) { 
      let url = window.location.href;
      let array = url.split("/");
      if(array[array.length-2] == 'employee-experience'){
        this.isEmpExp = true;
        this.isCovidPresense = false;
      }
      else{
        this.isEmpExp = false;
        this.isCovidPresense = true;
      }
      let details = JSON.parse(atob(sessionStorage.getItem('details')));
      for(let i=0;i<details.product.length;i++){
        for(let j=0;j<details.product[i].ProductFeatures.length;j++){
          if(details.product[i].ProductFeatures[j]['FeatureComponent'] == 'Action Insights'){
            this.isActionInsights = true
          }
        }
      }
      if (array[array.length-1] === 'engagement-insights' || array[array.length-1] === 'sentiments' || array[array.length-1] === 'action-insights'){
        this.showCompare = true
        this.auth.displaySubCaption = this.getSubCaption('filter');
        this.auth.displaySubCaption2 = this.getSubCaption('filter2');
      }
      else{
        this.showCompare = false
      }
      this.auth.displaySubCaption = this.getSubCaption('filter');
      this.auth.displaySubCaption2 = this.getSubCaption('filter2');
      if (array[array.length-1] === 'dashboard' || array[array.length-1] === 'roi-calculator'){
        this.showToolbarFilters = false;
        this.auth.setSelectedFilter([])
      }
      else{
        this.showToolbarFilters = true
      }
      if (array[array.length-1] === 'reports'){
        this.auth.hideDateFilter = true;
      }
      else{
        this.auth.hideDateFilter = false;
      }
      this.getNotificationObjs()
    }

   // time
  	ngOnInit() {
      this.getTime();
      let empType = this.auth.getEmpType();
    }

    getNotificationObjs(){
      this.auth.getNotifications().subscribe(res => {
        this.notificationObjs = res['product_notifications']
      })
    }
    
    getTime(){
      this._trend.get().subscribe(
        (res)=>{
            this.time = res.Dashboard_updatetime;
        }
      )
    }

    clickOn(type: any){
      if(type == 'covid'){
        if(this.auth.getCovidPresense()){
          this.isCovidPresense = true;
          this.isEmpExp = false;
        }
      }
      else{
        this.isEmpExp = true;
        this.isCovidPresense = false;
      }
    }

    addSelectedFilters(filters:any){
      this.selectedFilters = filters
      this.applySelectedFilters()
    }

    applySelectedFilters() {
      let filters: any = []
      let filterFields = this.getFilterParam();
      filterFields.forEach(
        filter => {
          filters.push(filter);
        }
      )
      this.auth.setSelectedFilter(filters);
    }

    getFilterParam() {
      //Tenure
      let fields: any = [];
      this.selectedFilters.forEach(
        filter => {
          if (filter.filterType == 'tenure') {
            fields.push({
              id: "TenureID",
              value: (filter.filterValue).toString()
            })
          }
  
          //Enps
          if (filter.filterType == 'enpsstatus') {
            fields.push({
              id: "EnpsStatus",
              value: (filter.filterValue).toString()
            })
          } 
  
          //Engagement
          if (filter.filterType == 'engagement') {
            fields.push({
              id: "HapinessStatus",
              value: (filter.filterValue).toString()
            })
          }        
  
          //Happiness Status
          if (filter.filterType == 'happiness') {
            fields.push({
              id: "Mood",
              value: (filter.filterValue).toString()
            })
          }
  
          //Risk Status
          if (filter.filterType == 'risk') {
            fields.push({
              id: "FlightRiskStatus",
              value: (filter.filterValue).toString()
            })
          }
  
          //Action Status
          if (filter.filterType == 'action') {
            fields.push({
              id: "ActionStatus",
              value: (filter.filterValue).toString()
            })
          }
      
          //Function
          if (filter.filterType == 'function') {
            fields.push({
              id: "FuncID",
              value: (filter.filterValue).toString()
            })
          }
      
          //Department
          if (filter.filterType == 'department') {
            fields.push({
              id: "DeptID",
              value: (filter.filterValue).toString()
            })
          }
  
          //SubDepartment
          if (filter.filterType == 'subdepartment') {
            fields.push({
              id: "SubDeptID",
              value: (filter.filterValue).toString()
            })
          }
      
          //Role
          if (filter.filterType == 'role') {
            fields.push({
              id: "RoleID",
              value: (filter.filterValue).toString()
            })
          }
  
          //Branch
          if (filter.filterType == 'branch') {
            fields.push({
              id: "BranchID",
              value: (filter.filterValue).toString()
            })
          }
      
          //Location
          if (filter.filterType == 'location') {
            fields.push({
              id: "LocID",
              value: (filter.filterValue).toString()
            })
          }
          //Company
          if (filter.filterType == 'company') {
            fields.push({
              id: "CompanyID",
              value: (filter.filterValue).toString()
            })
          }
  
          //AssignedTo
          if (filter.filterType == 'assignedto') {
            fields.push({
              id: "AssignedToCode",
              value: (filter.filterValue).toString()
            })
          }
  
          //AssignedBy
          if (filter.filterType == 'assignedby') {
            fields.push({
              id: "AssignedBy",
              value: (filter.filterValue).toString()
            })
          }
  
          //SubLocation
          if (filter.filterType == 'sublocation') {
            fields.push({
              id: "SubLocID",
              value: (filter.filterValue).toString()
            })
          }
      
          //Band
          if (filter.filterType == 'band') {
            fields.push({
              id: "BandID",
              value: (filter.filterValue).toString()
            })
          }
  
          //BusinessUnit
          if (filter.filterType == 'businessunit') {
            fields.push({
              id: "BusinessUnitID",
              value: (filter.filterValue).toString()
            })
          }
  
          //Manager
          if (filter.filterType == 'manager') {
            fields.push({
              id: "MgrID",
              value: (filter.filterValue).toString()
            })
          }
      
          //HR Spoc
          if (filter.filterType == 'hrspoc') {
            fields.push({
              id: "HRSpocID",
              value: (filter.filterValue).toString()
            })
          }
  
          //int type
          if (filter.filterType == 'inttype') {
            fields.push({
              id: "IntTypeID",
              value: (filter.filterValue).toString()
            })
          }
  
          //Emp Status
          if (filter.filterType == 'empStatus') {
            fields.push({
              id: "EmpStatus",
              value: (filter.filterValue).toString()
            })
          }
  
          //Gender
          if (filter.filterType == 'genderlist') {
            fields.push({
              id: "Gender",
              value: (filter.filterValue).toString()
            })
          }
  
          //Int Name
          if(filter.filterType == 'intname') {
            fields.push({
              id: "IntID",
              value: (filter.filterValue).toString()
            })
          }

          //BU
          if (filter.filterType == 'bu') {
            fields.push({
              id: "BusinessUnitID",
              value: (filter.filterValue).toString()
            })
          }

          //Gender
          if (filter.filterType == 'gender') {
            fields.push({
              id: "Gender",
              value: (filter.filterValue).toString()
            })
          }

          //Designation
          if (filter.filterType == 'designation') {
            fields.push({
              id: "Designation",
              value: (filter.filterValue).toString()
            })
          }

          //Zone
          if (filter.filterType == 'zone') {
            fields.push({
              id: "ZoneID",
              value: (filter.filterValue).toString()
            })
          }
        }
      )
  
      return fields;
    }

    routeChangeEvent(param){
      if (param === "action-page" || param === "sentiments" || param === "engagement-insights"){
        this.showCompare = true
        this.auth.displaySubCaption = this.getSubCaption('filter');
        this.auth.displaySubCaption2 = this.getSubCaption('filter2');
      }else{
        this.showCompare = false
      }
      if (param === 'dashboard' || param === 'roi'){
        this.showToolbarFilters = false
        this.auth.setSelectedFilter([])
      }
      else{
        this.showToolbarFilters = true
      }
      if (param === 'reports'){
        this.auth.hideDateFilter = true
      }
      else{
        this.auth.hideDateFilter = false
      }
    }


    getSubCaption(filter:any){
      let subCaption = "";
      if(this.auth[filter].type == "1"){
        subCaption = this.getMonthNameForId(this.auth[filter].monthStart)+" "+this.auth[filter].yearStart;
      }
      else if(this.auth[filter].type == "2"){
        subCaption = this.getQuarterNameForId(this.auth[filter].quarterStart)+" "+this.auth[filter].yearStart;
      }
      else if (this.auth[filter].type == "4"){
        if (this.auth[filter].pickfrom && this.auth[filter].pickto){
          let from = new Date(this.auth[filter].pickfrom)
          let to = new Date(this.auth[filter].pickto)
          subCaption = from.getDate() + "/" + (from.getMonth() + 1)  + "/" + from.getFullYear() + " - " + to.getDate() + "/" + (to.getMonth() + 1)  + "/" + to.getFullYear()
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

    getMonthNameForId(month) {
      let selectedMonth = this.months.filter(x => x.id === month.toString());
      return selectedMonth[0].name;
    }
    getQuarterNameForId(quarter) {
      let selectedQuarter = this.quarters.filter(x => x.id === quarter.toString());
      return selectedQuarter[0].name;
    }

    openDialog(){
      const dialogRef = this.dialog.open(ToolbarNotificationComponent,{
        height: 'calc(100vh - 55px)',
        width: '350px',
        position: {
          top: '54px',
          right: '0',
        },
        panelClass: 'notification-dialog',
        disableClose: true,
        data: this.notificationObjs,
        // hasBackdrop: false,
      });
      dialogRef.afterClosed().subscribe(
        res => {
          this.getNotificationObjs()
        })
  }
}