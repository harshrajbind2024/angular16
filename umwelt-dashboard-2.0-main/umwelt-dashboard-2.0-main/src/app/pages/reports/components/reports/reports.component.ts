import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from '@lib/umwelt-lib';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatLegacyTableDataSource } from '@angular/material/legacy-table';
import { saveAs } from 'file-saver';
import { AuthService } from '@lib/umwelt-lib';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
// import { SubscriberModalComponent } from '../../../shared/subscriber-modal/subscriber-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatLegacyChipInputEvent} from '@angular/material/legacy-chips';
import { FilterlistService } from '@lib/umwelt-lib';

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  filterForm: FormGroup;
  companies = [];
  interventions = [];
  functions = [];
  roles = [];
  departments = [];
  managers = [];
  bands = [];
  hrSpocs = [];
  locations = [];
  status = [];
  public period;
  isLoadingResults = false;
  reportType = [
    {
      "id": "1",
      "name": "Intervention Status"
    },
    {
      "id": "2",
      "name": "Chat Feedback"
    },
    {
      "id": "3",
      "name": "Email/SMS Status"
    },
    {
      "id":"4",
      "name":"Employee Engagement Report"
    },
    {
      "id":"5",
      "name":"Direct Manager Score Report"
    },
    {
      "id":"6",
      "name":"Action Report"
    },
    {
      "id":"7",
      "name":"HRSPOC Report"
    }
  ];
  presenseReportType = [
    {
      "id": "1",
      "name": "Covid Presense Report"
    }
  ];
  isEmpExp = true;
  isCovidPresense = false;
  showForm: boolean = true;
  showTable: boolean = false;
  page = 1;
  pageSize = 20;
  sortOn = "empname";
  sortOrder = "A";
  getFilteredDetailsSubscription: Subscription;
  totalNoOfRecords = 0;
  displayedColumns: string[] = [];
  dataSource: MatLegacyTableDataSource<any>;
  data: any[] = [];
  sortSubscription: Subscription;
  filteredEmp: Observable<any>;
  

  interventionDropDownSettings = {
    singleSelection: false,
    text: "Select Interventions",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'IntName',
    primaryKey: 'IntID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedIntervention = [];

  companyDropDownSettings = {
    singleSelection: false,
    text: "Select Companies",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'CompanyName',
    primaryKey: 'CompanyID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedCompany = [];
  
  funcDropDownSettings = {
    singleSelection: false,
    text: "Select Functions",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'FuncName',
    primaryKey: 'FuncID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedFunc = [];

  roleDropDownSettings = {
    singleSelection: false,
    text: "Select Roles",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'Role',
    primaryKey: 'RoleID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedRoles = [];

  departmentDropDownSettings = {
    singleSelection: false,
    text: "Select Departments",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'DeptName',
    primaryKey: 'DeptID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedDepartment = [];

  bandDropDownSettings = {
    singleSelection: false,
    text: "Select Bands",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'Band',
    primaryKey: 'BandID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedBand = [];

  managerDropDownSettings = {
    singleSelection: false,
    text: "Select Managers",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'Manager',
    primaryKey: 'ManagerID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedManager = [];

  hrSpocDropDownSettings = {
    singleSelection: false,
    text: "Select HRSpocs",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'HRSpoc',
    primaryKey: 'HRSpocID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedhrSpoc = [];

  locationDropDownSettings = {
    singleSelection: false,
    text: "Select Locations",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'LocName',
    primaryKey: 'LocID',
    badgeShowLimit: 1,
    lazyLoading: true
  }
  selectedLocation = [];

  statusDropDownSettings = {
    singleSelection: false,
    text: "Select Status",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    labelKey: 'StatusName',
    primaryKey: 'StatusValue',
    badgeShowLimit: 1,
    // position: 'top',
    lazyLoading: true
  }
  selectedStatus = [];
  selectedStatusIDs: string[] = [];

  reportTypeDropDownSettings = {
    singleSelection: true,
    text: "Select Report Type",
    enableSearchFilter: false,
    labelKey: 'name',
    primaryKey: 'id',
    badgeShowLimit: 1,
    enableFilterSelectAll: false,
    classes: "myclass report-type-class"
  }
  selectedReport = [{
    "id": "1",
    "name": "Intervention Status"
  }];
  actualStatus = [];
  public list:any;
  public waitingMessage:boolean = false;
  public endingMessage :boolean = false;

  public waitingMsg = "Please Wait!! We are fetching report for you";
  public endingMsg = "Thanks!!";

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];

  constructor(private reportsUtil: ReportsService, private auth: AuthService,public route: ActivatedRoute, public router: Router,
    private dialog:MatLegacyDialog, private filterlistService: FilterlistService) {
    this.auth.setCurrentPage('reports')
    this.route.queryParams.subscribe((params:any) => {
      if(params){
        if (Object.keys(params).length === 0){
          //this.getFilteredDetails('submit')
        }else{
        this.period = params
        // this.isLoadingResults = true
        this.getFilteredDetails('submit',this.period)
      }}})
    this.filterForm = new FormGroup({
      company: new FormControl([]),
      intervention: new FormControl([]),
      function: new FormControl([]),
      role: new FormControl([]),
      department: new FormControl([]),
      manager: new FormControl([]),
      band: new FormControl([]),
      hrSpoc: new FormControl([]),
      location: new FormControl([]),
      empCode: new FormControl(''),
      to: new FormControl(new Date()),
      from: new FormControl(new Date((new Date().getTime() - 2622000000))),
      status: new FormControl([]),
      reportType: new FormControl([], [Validators.required])
    });

      let isEmpExp = this.auth.getEmpExp()
      // if(!isEmpExp){
      //   this.dialog.open(SubscriberModalComponent,{
      //     disableClose: true,
      //     data:{
      //       'moduleName':'Employee Experience'
      //     }
      //   });
      // }
      let url = window.location.href;
      let array = url.split("/");
      if(array[array.length-2] == 'employee-experience'){
        this.reportType = this.reportType;
        this.isEmpExp = true;
        this.isCovidPresense = false;
      }
      else{
        this.isEmpExp = false;
        this.isCovidPresense = true;
        this.reportType = this.presenseReportType
        this.selectedReport = [{
          "id": "1",
          "name": "Covid Presense Report"
        }];
      }
  } 


  ngOnInit() {
    this.route.queryParams.subscribe((params:any) => {
      if(params){
        if (Object.keys(params).length === 0){
          //this.getFilteredDetails('submit')
        }else{
        this.period = params
        // this.isLoadingResults = true
        this.getFilteredDetails('submit',this.period)
      }}})
    this.list = JSON.parse(localStorage.getItem('List'));

    let empType = this.auth.getEmpType();
    let empCode = JSON.parse(atob(sessionStorage.getItem('details'))).empcode;
    this.filterlistService.fetchFilterlistData(empCode,empType).then((res: any) => {
        let data = JSON.parse(JSON.stringify(res));
        this.interventions = data.intervention;
        this.filterForm.controls['intervention'].setValue(this.interventions);
        this.selectedIntervention = JSON.parse(JSON.stringify(this.interventions));

        this.companies = data.company;
        this.filterForm.controls['company'].setValue(this.companies);
        this.selectedCompany = JSON.parse(JSON.stringify(this.companies));

        this.functions = data.function;
        this.filterForm.controls['function'].setValue(this.functions);
        this.selectedFunc = JSON.parse(JSON.stringify(this.functions));

        this.roles = data.role;
        this.filterForm.controls['role'].setValue(this.roles);
        this.selectedRoles = JSON.parse(JSON.stringify(this.roles))

        this.bands = data.band;
        this.filterForm.controls['band'].setValue(this.bands);
        this.selectedBand = JSON.parse(JSON.stringify(this.bands))

        this.locations = data.location;
        this.filterForm.controls['location'].setValue(this.locations);
        this.selectedLocation = JSON.parse(JSON.stringify(this.locations))

        this.departments = data.department;
        this.filterForm.controls['department'].setValue(this.departments);
        this.selectedDepartment = JSON.parse(JSON.stringify(this.departments))

        this.managers = data.manager;
        this.filterForm.controls['manager'].setValue(this.managers);
        this.selectedManager = JSON.parse(JSON.stringify(this.managers))

        this.hrSpocs = data.hr;
        this.filterForm.controls['hrSpoc'].setValue(this.hrSpocs);
        this.selectedhrSpoc = JSON.parse(JSON.stringify(this.hrSpocs))
      },
      error =>{
        console.log(error);
      }
    )
    this.reportsUtil.getStatus().subscribe(
      res => {
        this.actualStatus = JSON.parse(JSON.stringify(res));
        this.status = this.actualStatus.filter(x => x.ReportType === this.selectedReport[0].id)
        this.filterForm.controls['status'].setValue(JSON.parse(JSON.stringify(this.status)));
        this.selectedStatus = JSON.parse(JSON.stringify(this.status))
        this.selectedStatusIDs = this.selectedStatus.map(stat => stat.StatusValue);
      }
    )
  }

  reset() {
    if (this.showTable){
      this.page = 1;
      this.pageSize = 10;
      this.sortOn = "empname";
      this.showTable = false;
      this.showForm = true;
      this.period = ''
      this.endingMessage = false
    }
    else{
      this.filterForm.reset();
      this.filterForm.controls['intervention'].setValue([]);
      this.filterForm.controls['company'].setValue([]);
      this.filterForm.controls['function'].setValue([]);
      this.filterForm.controls['role'].setValue([]);
      this.filterForm.controls['department'].setValue([]);
      this.filterForm.controls['band'].setValue([]);
      this.filterForm.controls['manager'].setValue([]);
      this.filterForm.controls['hrSpoc'].setValue([]);
      this.filterForm.controls['location'].setValue([]);
      this.filterForm.controls['status'].setValue([]);
    }
  }

  submit(flag) {
    this.filterForm.controls['from'].updateValueAndValidity({ emitEvent: true });
    if (this.period){
      this.getFilteredDetails(flag,this.period);
    }else{
      if (this.filterForm.valid) {
        this.getFilteredDetails(flag)
      }
    }
  }

  onReportTypeSelect(event){
    this.selectedReport = this.reportType.filter(x => x.id == event)
    this.status = this.actualStatus.filter(x => x.ReportType === event)
    this.filterForm.controls['status'].setValue(JSON.parse(JSON.stringify(this.status)));
    this.selectedStatus = JSON.parse(JSON.stringify(this.status));
    this.selectedStatusIDs = this.selectedStatus.map(stat => stat.StatusValue);
  }

  getFilteredDetails(flag,params?) {
    this.endingMsg = "Thanks!!"
    let empType = this.auth.getEmpType();
    let param;
    if (params){
      param = [
      {
        page: this.page,
        limit: this.pageSize,
        sortOrder: this.sortOrder,
        sortOn: this.sortOn,
        flag: flag,
        timezoneOffset: (new Date()).getTimezoneOffset(),
        timezone : this.auth.timezone,
        period : params
      },
      ]
    }
    else{
    let datefilter:any = {
      "type": "4",
      "monthStart": "",
      "monthEnd": "",
      "yearStart": "",
      "yearEnd": "",
      "quarterStart": "",
      "quarterEnd": "",
      "dateFilterBy": "StartTime",
      "yearStartQuart":"",
      "pickfrom": !this.filterForm.controls['from'].value ? "" : new Date(this.filterForm.controls['from'].value).toLocaleString('en-US'),
      "pickto": !this.filterForm.controls['to'].value ? "" : new Date(this.filterForm.controls['to'].value).toLocaleString('en-US'),
      "timezone": this.auth.timezone
    }
    param = [
      {
        page: this.page,
        limit: this.pageSize,
        sortOrder: this.sortOrder,
        sortOn: this.sortOn,
        flag: flag,
        timezoneOffset: (new Date()).getTimezoneOffset(),
        timezone : this.auth.timezone
      },
      {
        reportParams: this.auth.ouFilters,
        searchempcode: this.tags,
        EmpType: empType,
        EmpCode: JSON.parse(atob(sessionStorage.getItem('details'))).empcode,
        status: this.getValue('status',this.filterForm.controls['status'].value),
        timezone: this.auth.timezone,
        filter: datefilter
      }
    ]}

    if (this.getFilteredDetailsSubscription) {
      this.getFilteredDetailsSubscription.unsubscribe();
    }
    if (flag === 'export') {
      this.endingMessage = false;
      this.waitingMessage = true;
      let type = this.isCovidPresense ? 'presense' : 'experience';
      this.getFilteredDetailsSubscription = this.reportsUtil.export(param, this.selectedReport[0].id,type).subscribe(
        res => {
          const contentType = res.headers.get('Content-Type');
          let date = new Date();
          let fileName;
          let dateStr = date.getDate() + "_" + (date.getMonth() + 1) + "_" + ((date.getFullYear() + "").substr(2, 2));
          let rptName = "";
          if(this.selectedReport[0].id === "1"){
            rptName = "Intervention_Status_Report_";
            fileName = rptName + dateStr + ".xls";
          } else if(this.selectedReport[0].id === "2"){
            rptName = "Chat_Feedback_Report_";
            fileName = rptName + dateStr + ".xls";
          } else if(this.selectedReport[0].id === "3"){
            rptName = "Email_SMS_Status_Report_";
            fileName = rptName + dateStr + ".xls";
          } else if(this.selectedReport[0].id === "4"){
            rptName = "Employee_Engagement_Report_";
            fileName = rptName + dateStr + ".xls";
          } else if(this.selectedReport[0].id === "5"){
            rptName = "Direct_Manager_Score_Report_";
            fileName = rptName + dateStr + ".xls";
          } else if(this.selectedReport[0].id === "6"){
            rptName = "Action_Report_";
            fileName = rptName + dateStr + ".xls";
          } else if(this.selectedReport[0].id === "7"){
            rptName = "HRSPOC_Report_";
            fileName = rptName + dateStr + ".xls";
          }

          this.waitingMessage = false;
          if(res['body'].size == 44 || contentType == "application/json"){
            this.endingMsg = "No Data available for the filters applied"
            this.endingMessage = true;
            return;
          }
          else{
            this.endingMessage = true;
          }
          this.saveFile(res.body, fileName);
        },
        error =>{
          this.waitingMessage = false;
          this.endingMsg = "Something went wrong, Please try to contact at care@umwelt.ai"
          this.endingMessage = true;
          console.log(error);
        }
      )
    } else {
      this.isLoadingResults = true
      if(this.isCovidPresense){
        return
      }
      this.getFilteredDetailsSubscription = this.reportsUtil.getFilteredDetails(param).subscribe(
        res => {
          // this.showForm = false;
          this.isLoadingResults = false
          this.createOrUpdateTable(res);
        }
      );
    }
  }

  saveFile = (blobContent: Blob, fileName: string) => {
    const blob = new Blob([blobContent], { type: 'application/vnd.ms-excel' });
    saveAs(blob, fileName);
  };

  getValue(control, value){
    if(value){
      let key = "";
      let len = 0;
      switch(control){
        case 'intervention':
        key = 'IntID';
        len = this.interventions.length;
        break;        
        case 'company':
        key = 'CompanyID';
        len = this.companies.length;
        break;        
        case 'function':
        key = 'FuncID';
        len = this.functions.length;
        break;
        case 'role':
        key = 'RoleID';
        len = this.roles.length;
        break;
        case 'department':
        key = 'DeptID';
        len = this.departments.length;
        break;
        case 'manager':
        key = 'ManagerID';
        len = this.managers.length;
        break;
        case 'band':
        key = 'BandID';
        len = this.bands.length;
        break;
        case 'hrSpoc':
        key = 'HRSpocID';
        len = this.hrSpocs.length;
        break;
        case 'location':
        key = 'LocID';
        len = this.locations.length;
        break;
        case 'status':
        key = 'StatusValue';
        len = this.status.length;
        break;
      }

      let arr = [];
      value.forEach(
        item => {
          arr.push(item[key]);
        }
      )
        if(len === arr.length){
          return "";
        } else {
          return arr.join(',');
        }   
    } else {
      return "";
    }
  }

  createOrUpdateTable(res) {
    this.showTable = false;
    this.data = [];
    this.totalNoOfRecords = res['count'];
    let resData = res['data'];
    this.displayedColumns = [
      'Employee',
      'Company',
      'Function',
      'Role',
      'Location',
      'Manager',
      'HRSpoc',
      'Status'
    ];

    resData.forEach(
      row => {
        this.data.push(
          {
            Employee: row.EmpName + " (" + row.EmpCode + ")",
            Company: row.CompanyName,
            Function: row.FuncName,
            Role: row.Role,
            Location: row.LocName,
            Manager: row.MgrName,
            HRSpoc: row.HrName,
            Status: row.Status_Tag
          }
        )
      }
    )

    this.dataSource = new MatLegacyTableDataSource<any>(this.data);
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item[property];
    };
    this.showTable = true;
  }
  sortData(sort) {
    switch (sort.active) {
      case 'Employee':
        this.sortOn = "empname";
        break;
        case 'Intervention':
        this.sortOn = "intname";
        break;
        case 'Company':
        this.sortOn = "companyname";
        break;
        case 'Function':
        this.sortOn = "funcname";
        break;
      case 'Role':
        this.sortOn = "role";
        break;
      case 'Manager':
        this.sortOn = "mgrname";
        break;
      case 'Location':
        this.sortOn = "locname";
        break;
      case 'HRSpoc':
        this.sortOn = "hrname";
        break;
      case 'Status':
        this.sortOn = "status";
        break;
    }

    if (sort.direction === 'asc') {
      this.sortOrder = "A";
    } else {
      this.sortOrder = "D";
    }
    if (this.period){this.getFilteredDetails('submit',this.period);}
    else{this.getFilteredDetails('submit');}
  }

  changePage(page) {
    this.pageSize = page.pageSize;
    this.page = page.pageIndex + 1;
    if (this.period){this.getFilteredDetails('submit',this.period);}
    else{this.getFilteredDetails('submit');}
  }

  editFilter() {
    this.page = 1;
    this.showTable = false;
    this.showForm = true;
  }

  getTodayDate() {
    return new Date();
  }

  getMaxDateForFrom() {
    let to = this.filterForm.controls['to'].value;
    if (to === undefined || to === null || to === "") {
      return new Date();
    } else {
      return to;
    }
  }

  getMinDateForTo() {
    let from = this.filterForm.controls['from'].value;
    if (from === undefined || from === null || from === "") {
      return;
    } else {
      return from;
    }
  }

  fromDateValueChange(value) {
    if (this.filterForm.controls['to'].value) {
      if (this.filterForm.controls['to'].value < this.filterForm.controls['from'].value) {
        this.filterForm.controls['to'].setValue(value);
      }
    } else {
      this.filterForm.controls['to'].setValue(value);
    }
  }

  toDateValueChange(value) {
    if (this.filterForm.controls['from'].value) {
      if (this.filterForm.controls['to'].value < this.filterForm.controls['from'].value) {
        this.filterForm.controls['from'].setValue(value);
      }
    } else {
      this.filterForm.controls['from'].setValue(value);
    }
  }

  employeeDisplayFnc(emp) {
    if (emp) {
      return emp.EmpName + " (" + emp.EmpCode + ")";
    } else {
      return "";
    }
  }

  navigateROICalculator(){
    let url = '/auth/employee-experience/roi-calculator'
    this.router.navigate([`${url}`]);
  }

  addTag(event: MatLegacyChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeTag(tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}