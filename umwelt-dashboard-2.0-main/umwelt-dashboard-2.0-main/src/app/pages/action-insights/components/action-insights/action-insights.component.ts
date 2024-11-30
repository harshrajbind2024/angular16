import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { FilterConstants } from '@lib/umwelt-lib';
import { ListViewColumns } from '@lib/umwelt-lib';
import { AuthService } from '@lib/umwelt-lib';
import { ActionInsightsService } from '@lib/umwelt-lib';
import { RecordActionComponent } from '../../../../common-views/modals/record-action/record-action.component';

@Component({
  selector: 'app-action-insights',
  templateUrl: './action-insights.component.html',
  styleUrls: ['./action-insights.component.scss']
})
export class ActionInsightsComponent implements OnInit, OnChanges {
    public listViewColumns = [ListViewColumns.NAME, ListViewColumns.EMPSTATUS, ListViewColumns.LOCATION, ListViewColumns.MANAGER, ListViewColumns.HRSPOC, ListViewColumns.ASSIGNEDTO, ListViewColumns.STAGE, ListViewColumns.INTNAME ,ListViewColumns.COMPLETEDON, ListViewColumns.ENPSSTATUS, ListViewColumns.ENGAGEMENT, ListViewColumns.HAPPINESS, ListViewColumns.FLIGHTRISK, ListViewColumns.ACTIONREQUIRED, ListViewColumns.ACTIONSTATUS];
    quarters = FilterConstants.getQuarters();
    months = FilterConstants.getMonths();
    cap1:any = ''
    cap2:any = ''
    empType:any;
    actioninsightsCardData:any = {}
    actioninsightsCardDataCopy:any = {}
    actionType:any;
    selectedFilters=[];
    multiSelectedFilters=[];
    ouSelectedFilters=[];
    constructor(
        public auth: AuthService,
        public actionInsightsService: ActionInsightsService,
        private dialog: MatLegacyDialog
    ) {}
    @ViewChild('listview',{static: false}) list: any;

    async ngOnInit() {
        this.auth.setCurrentPage('action-page')
        this.actionType={type:"action-required"}
        this.empType = this.auth.getEmpType()
        this.actionInsightsService.displaySubCaption = this.getSubCaption('filter');
        this.actionInsightsService.displaySubCaption2 = this.getSubCaption('filter2');
        this.cap1 = this.getTitle('filter');
        this.cap2 = this.getTitle('filter2');
        let details = JSON.parse(atob(sessionStorage.getItem('details')));
        this.actioninsightsCardData = await this.actionInsightsService.getActionCardsData({empType:this.empType,empCode:details.empcode});
        this.actioninsightsCardDataCopy = JSON.parse(JSON.stringify(this.actioninsightsCardData))
        this.auth.getSelectedFilter().subscribe(filter => {
          this.ouSelectedFilters = filter;
          if (this.auth.currentPage === 'action-page' && this.auth.isFilterSet){
            this.sendSelectedFilters()
          }
        });
        this.auth.getDateFilter().subscribe(filter => {
          if (this.auth.currentPage === 'action-page' && this.auth.isDateFilterSet){
            this.cap1 = this.getTitle('filter');
            this.cap2 = this.getTitle('filter2');
            this.sendSelectedFilters()
          }
        });
    }
    ngOnChanges(changes: SimpleChanges): void {   
    }

    getSubCaption(filter:any){
        let subCaption = "";
        if(this.actionInsightsService[filter].type == "1"){
          subCaption = this.getMonthNameForId(this.actionInsightsService[filter].monthStart)+" "+this.actionInsightsService[filter].yearStart;
        }
        else if(this.actionInsightsService[filter].type == "2"){
          subCaption = this.getQuarterNameForId(this.actionInsightsService[filter].quarterStart)+" "+this.actionInsightsService[filter].yearStart;
        }
        else if (this.actionInsightsService[filter].type == "4"){
          if (this.actionInsightsService[filter].pickfrom && this.actionInsightsService[filter].pickto){
            let from = new Date(this.actionInsightsService[filter].pickfrom)
            let to = new Date(this.actionInsightsService[filter].pickto)
            subCaption = from.getDate() + "/" + (from.getMonth() + 1)  + "/" + from.getFullYear() + " - " + to.getDate() + "/" + (to.getMonth() + 1)  + "/" + to.getFullYear()
          }
          else{
            subCaption = ''
          }
        }
        else{
          subCaption = this.actionInsightsService[filter].yearStart;
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
      let filters = []
      this.multiSelectedFilters = this.ouSelectedFilters
      filters = this.ouSelectedFilters
      this.selectedFilters = this.ouSelectedFilters
      let details = JSON.parse(atob(sessionStorage.getItem('details')));
      this.actioninsightsCardData = await this.actionInsightsService.getActionCardsData({empType:this.empType,empCode:details.empcode,range_filter_1:this.auth.filter,range_filter_2:this.auth.filter2,actionParams:filters});
      await this.actionInsightsService.getParentActionHeatlist({empType:this.empType,empCode:details.empcode,range_filter_1:this.auth.filter,range_filter_2:this.auth.filter2,actionParams:filters,data_type:""});
      this.actioninsightsCardDataCopy = JSON.parse(JSON.stringify(this.actioninsightsCardData))
    }

    goToCuratedTable(type:any){
      this.actionType = type
      let element = document.getElementById('curated-table');
      element.scrollIntoView({block: 'nearest'});
    }

    addSelectedFilters(filters:any){
      this.selectedFilters = filters
      this.sendSelectedFilters()
    }

    openActionModal(employee: any){
      let tab= employee.tab
      employee= employee.record
      let actionPopUpDialogRef = this.dialog.open(RecordActionComponent, {
        height: '80%',
        width: '80%',
        panelClass: 'dialog-padding-0',
        disableClose: true,
        data: {
          employee: employee,
          tab: tab
        }
      });

      actionPopUpDialogRef
      .afterClosed()
      .subscribe(result =>{
        if(result){
          this.list.refreshData(result.status,result.pk,result.AssignedToCode,result.AssignedToName,result.AssignedBy,result.AssignedByName,result.AssignedDate);
        }
      })
    }
}