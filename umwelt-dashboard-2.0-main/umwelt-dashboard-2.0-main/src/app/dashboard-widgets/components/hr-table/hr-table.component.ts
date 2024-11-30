import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { RecordActionComponent } from '../../../common-views/modals/record-action/record-action.component';
import { ListViewColumns } from '@lib/umwelt-lib';
import { DashboardService } from '@lib/umwelt-lib'
import { AuthService } from '@lib/umwelt-lib';
@Component({
  selector: 'app-hr-table',
  templateUrl: './hr-table.component.html',
  styleUrls: ['./hr-table.component.scss']
})
export class HrTableComponent implements OnInit {
  public listViewColumns = [ListViewColumns.NAME, ListViewColumns.EMPSTATUS, ListViewColumns.LOCATION, ListViewColumns.MANAGER, ListViewColumns.HRSPOC, ListViewColumns.ASSIGNEDTO, ListViewColumns.STAGE, ListViewColumns.INTNAME, ListViewColumns.COMPLETEDON, ListViewColumns.ENPSSTATUS, ListViewColumns.ENGAGEMENT, ListViewColumns.HAPPINESS, ListViewColumns.FLIGHTRISK, ListViewColumns.ACTIONREQUIRED, ListViewColumns.ACTIONSTATUS];
  public apiUrl = "";
  filter: any;
  @Input() filters = [];
  public dataPlotObj: string;

    constructor(private dashboardService: DashboardService,
       public auth: AuthService, private dialog: MatLegacyDialog) {
    }

    @ViewChild(MatLegacyPaginator,{static: true}) paginator: MatLegacyPaginator;
    @ViewChild(MatSort,{static: true}) sort: MatSort;
    @ViewChild('myTable',{static: false}) table: any;
    @ViewChild('listview',{static: false}) list: any;

    public displayedColumns;
    public dataSource;
    public loading: boolean = false;

    public columns = [
      { name: 'Name' },
      { name: 'Designation' },
      { name: 'Location' },
      { name: 'Manager' },
      { name: 'HR Spoc' },
      { name: 'Sent On' },
      { name: 'Completed On' },
      { name: 'eNPS Status' },
      { name: 'Happiness' },
      { name: 'Engagement' },
      { name: 'Flight Risk' },
      { name: 'Action Status' },
      { name: 'Chat' },
    ];
    public Mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    public rows;
    public actionthumbstatus;
    public convthumbstatus;

    submitEmployeeActionForm(comment, manager) {
      //Create a method in service to submit
    }
  	
    ngOnInit() {

    //   this._chart.change.subscribe(result => {
    //     if (result.event == 'reset') {
    //       this.dataPlotObj = "";
    //     } else {
    //         let status = "";
    //         if (result.datasetName == 'Engaged') {
    //           status = 'Engaged';
    //         } else if (result.datasetName == 'Not Engaged') {
    //           status = 'Not Engaged';
    //         } else if (result.datasetName == 'Actively Disengaged') {
    //           status = 'Actively Disengaged';
    //         } else if(result.datasetName == 'Total') {
    //           status = "Total";
    //         }
    //         let obj = {}; 
    //         obj['label'] = result.categoryLabel;
    //         obj['key'] = status;
    //         this.dataPlotObj = "" + JSON.stringify(obj);
    //     }
    // });

    }

    onClickingReset() {
      this.dashboardService.getEmployees('hr').subscribe( data => {
        this.rows = data;
      });
    }

    toggleExpandRow(row, expanded) {
      //console.log('Toggled Expand Row!', row);
      this.table.rowDetail.toggleExpandRow(row);
    }

    onDetailToggle(event) {
      //console.log('Detail Toggled', event);
    }

    onSort(event) {
      // event was triggered, start sort sequence
      this.loading = true;

      this.dashboardService.getEmployees('hr', event.newValue, event.column.prop).subscribe( data => {
        this.rows = data;
        this.loading = false;
      });
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

    dataPlotClick(obj){
      this.dataPlotObj = JSON.stringify(obj);
    }

    changeDataPlotObj(obj){
      this.dataPlotObj = obj;
    }
    updateFilter(filter){
      this.filter = filter;
    }

    
  updateFilters(filters){
    this.filters = filters;
  }
}