import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatLegacyTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator } from '@angular/material/legacy-paginator';
import { Observable, Subscription } from 'rxjs';
import { MatLegacyOption } from '@angular/material/legacy-core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { HttpService } from '@lib/umwelt-lib';
import { merge } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';
import { ListViewColumns, FieldNames } from '@lib/umwelt-lib';
import { FormControl, FormGroup,FormBuilder } from '@angular/forms';
import { MatLegacyDialog, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { FilterConstants } from '@lib/umwelt-lib';
import { AuthService } from '@lib/umwelt-lib';
import { DashboardService } from '@lib/umwelt-lib';
import { DateFilterComponent } from '../../modals/date-filter/date-filter.component';
import { AssignToComponent } from '../../modals/assign-to/assign-to.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatLegacyChipInputEvent} from '@angular/material/legacy-chips';
import { FilterlistService } from '@lib/umwelt-lib';

const ColumnName = {
  name : 'Name',
  empstatus : JSON.parse(localStorage.getItem('List')).EmployeeStatus,
  zone : JSON.parse(localStorage.getItem('List')).ZoneID,
  location : JSON.parse(localStorage.getItem('List')).LocID,
  sublocation : JSON.parse(localStorage.getItem('List')).SubLocID,
  company : JSON.parse(localStorage.getItem('List')).CompanyID,
  function : JSON.parse(localStorage.getItem('List')).FuncID,
  department : JSON.parse(localStorage.getItem('List')).DeptID,
  subdepartment : JSON.parse(localStorage.getItem('List')).SubDeptID,
  role : JSON.parse(localStorage.getItem('List')).RoleID,
  band : JSON.parse(localStorage.getItem('List')).BandID,
  bu : JSON.parse(localStorage.getItem('List')).BusinessUnitID,
  branch : JSON.parse(localStorage.getItem('List')).BranchID,
  designation : JSON.parse(localStorage.getItem('List')).Designation,
  manager : JSON.parse(localStorage.getItem('List')).Manager,
  hrspoc : JSON.parse(localStorage.getItem('List')).HRSpoc,
  assignedto : JSON.parse(localStorage.getItem('List')).AssignedToName,
  assignedby : JSON.parse(localStorage.getItem('List')).AssignedByName,
  assigneddate : JSON.parse(localStorage.getItem('List')).AssignedDate,
  senton : 'Sent On',
  completedon : 'Completed On',
  enpsstatus : 'eNPS Status',
  engagement : 'Engagement',
  happiness : 'Happiness',
  flightrisk : 'Flight Risk',
  actionrequired : 'Action Required',
  actionstatus : 'Action Status',
  stage : JSON.parse(localStorage.getItem('List')).Stage,
  gender : JSON.parse(localStorage.getItem('List')).Gender,
  intname : 'Intervention Name',
}
@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit, OnChanges {
  @Input() type: string = "enps";
  @Input() dataPlotObj: any;
  @Input() displayedColumns = [];
  @Input() filters = [];
  @Input() filter: any;
  @Output() recordActionEvent = new EventEmitter<{record:any,tab:any}>();
  @Output() changeDataPlotObj = new EventEmitter<any>();
  @Input() empType;
  @Input() dateFilter: any;
  @Input() dateFilter2: any;
  @Input() selectedFilters = [];
  @Input() actionType: any;
  dataSource = new MatLegacyTableDataSource([]);
  columns = Object.keys(ListViewColumns).map(key => ListViewColumns[key]);
  columnsFormGroup: FormGroup;
  @ViewChild(MatLegacyPaginator,{static: true}) paginator: MatLegacyPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;
  months = FilterConstants.getMonths();
  quarters = FilterConstants.getQuarters();
  nameFilter: FormControl = new FormControl('');
  totalRecords = 0;
  isLoadingResults = true;
  callChartEvent = new EventEmitter<any>();
  chartParams: any;
  isFirstTimeOpen = true;
  subscriptions: Subscription[] = [];
  dataLength;
  filterNameFormGroup: FormGroup;
  actions = [{'ID':'0','name':'Pending'},{'ID':'1','name':'Action Closed'},{'ID':'-','name':'Not Required'}];
  riskType = [{'ID':'yes','name':'High'},{'ID':'moderate','name':'Moderate'},{'ID':'no','name':'Low'},{'ID':'Disabled','name':'Disabled'}]
  happinessType = [{'ID':'5','name':'Awesome'},{'ID':'4','name':'Happy'},{'ID':'3','name':'Neutral'},{'ID':'2','name':'Sad'},{'ID':'1','name':'Awful'}]
  engagementType = [{'ID':'engaged','name':'Engaged'},{'ID':'not engaged','name':'Not Engaged'},{'ID':'actively disengaged','name':'Actively Disengaged'}]
  enpsstatusType = [{'ID':'Promoter','name':'Promoter'},{'ID':'Passive','name':'Passive'},{'ID':'Detractor','name':'Detractor'}]
  empstatusType = [{'ID':'1','name':'Active'},{'ID':'0','name':'Inactive'}]
  actionsrequired = [{'ID':'yes','name':'Yes'},{'ID':'no','name':'No'}]
  genderlist = [{'ID':'male','name':'Male'},{'ID':'female','name':'Female'},{'ID':'transgender','name':'Transgender'}]
  searchTextAction=''; searchTextCompany = '';searchTextAssignedTo = '';searchTextAssignedBy = '';searchTextRisk='';searchTextHappiness='';searchTextEngagement='';searchTextEnps='';
  searchTextStage = '';searchTextHrspoc='';searchTextManager='';searchTextLocation=''; searchTextActionRequired='';searchTextSubLocation='';searchTextFunc='';searchTextDepartment='';searchTextSubDepartment='';searchTextRole='';searchTextBand='';searchTextBU='';searchTextBranch='';searchTextIntName='';searchTextDesignation='';searchTextZone='';
  dumyListData = [];
  filterArray = [];
  locations = [];
  companies = [];
  managers = [];
  hrspocs = [];
  inttypes = [];
  stages = [];
  assignedtos = [];
  assignedbys = [];
  assignedtofilter = [];
  sublocations = [];
  functions = [];
  departments = [];
  subdepartments = [];
  roles = [];
  bands = [];
  businessunit = [];
  branches = [];
  intnames = [];
  designations = [];
  zones = [];
  checkedNumber=0;
  textColorChange = false
  highlightLocation = false; highlightComp = false;highlightAssignedTo = false;highlightAssignedBy = false;highlightAssignedDate = false;highlightManager = false; highlightHR = false; highlightStage = false; highlightSentOn = false; highlightCompletedOn = false;
  highlightEnps = false; highlightEngagement= false; highlightHappiness = false; highlightRisk = false; highlightAction = false; highlightEmpStatus = false; highlightActionRequired = false;  highlightSubLocation = false; highlightFunc = false; highlightDepartment = false; highlightSubDepartment = false; highlightRole = false; highlightBand = false; highlightBU = false; highlightBranch = false; highlightIntName = false; highlightGender = false; highlightDesignation = false; highlightZone = false;
  @ViewChild('allLocSelected',{static: false}) private allLocSelected: MatLegacyOption;
  @ViewChild('allCompanySelected',{static: false}) private allCompanySelected: MatLegacyOption;
  @ViewChild('allAssignedToSelected',{static: false}) private allAssignedToSelected: MatLegacyOption;
  @ViewChild('allAssignedBySelected',{static: false}) private allAssignedBySelected: MatLegacyOption;
  @ViewChild('allMgrSelected',{static: false}) private allMgrSelected: MatLegacyOption;
  @ViewChild('allHrSelected',{static: false}) private allHrSelected: MatLegacyOption;
  @ViewChild('allStageSelected',{static: false}) private allStageSelected: MatLegacyOption;
  @ViewChild('allEnpsSelected',{static: false}) private allEnpsSelected: MatLegacyOption;
  @ViewChild('allEngSelected',{static: false}) private allEngSelected: MatLegacyOption;
  @ViewChild('allHappinessSelected',{static: false}) private allHappinessSelected: MatLegacyOption;
  @ViewChild('allRiskSelected',{static: false}) private allRiskSelected: MatLegacyOption;
  @ViewChild('allActionSelected',{static: false}) private allActionSelected: MatLegacyOption;
  @ViewChild('allActionRequiredSelected',{static: false}) private allActionRequiredSelected: MatLegacyOption;
  @ViewChild('allEmpStatusSelected',{static: false}) private allEmpStatusSelected: MatLegacyOption;
  @ViewChild('allSubLocSelected',{static: false}) private allSubLocSelected: MatLegacyOption;
  @ViewChild('allFuncSelected',{static: false}) private allFuncSelected: MatLegacyOption;
  @ViewChild('allDepartmentSelected',{static: false}) private allDepartmentSelected: MatLegacyOption;
  @ViewChild('allSubDepartmentSelected',{static: false}) private allSubDepartmentSelected: MatLegacyOption;
  @ViewChild('allRoleSelected',{static: false}) private allRoleSelected: MatLegacyOption;
  @ViewChild('allBandSelected',{static: false}) private allBandSelected: MatLegacyOption;
  @ViewChild('allBUSelected',{static: false}) private allBUSelected: MatLegacyOption;
  @ViewChild('allBranchSelected',{static: false}) private allBranchSelected: MatLegacyOption;
  @ViewChild('allIntNameSelected',{static: false}) private allIntNameSelected: MatLegacyOption;
  @ViewChild('allGenderSelected',{static: false}) private allGenderSelected: MatLegacyOption;
  @ViewChild('allDesignationSelected',{static: false}) private allDesignationSelected: MatLegacyOption;
  @ViewChild('allZoneSelected',{static: false}) private allZoneSelected: MatLegacyOption;

  actionCount= 0;
  displaySubCaption;
  name = '';
  duplicatesHR = [];
  duplicatesManager = [];
  duplicatesAssignedToFilter = [];
  timezones;
  UTCValue = 'UTC';
  issearch:boolean = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];
  assignToDialogRef: MatLegacyDialogRef<AssignToComponent>;
  selectedCompanies: any[] = []; selectedFunctions: any[] = []; selectedDepartments: any[] = []; selectedSubDepartments: any[] = []; selectedRoles: any[] = []; selectedLocations: any[] = []; selectedSubLocations: any[] = []; selectedBands: any[] = []; selectedBusinessUnits: any[] = []; selectedBranches: any[] = []; selectedManagers: any[] = []; selectedHrspocs: any[] = []; selectedInttypes: any[] = []; selectedIntnames: any[] = []; selectedZones: any[] = [];
  selectedActions: any[] = []; selectedActionRequireds: any[] = []; selectedRisks: any[] = []; selectedHappiness: any[] = []; selectedEngagements: any[] = []; selectedEnpsstatuses: any[] = []; selectedAssignedtos: any[] = []; selectedAssignedbys: any[] = []; selectedDesignations: any[] = []; selectedStages: any[] = [];
  constructor(
    private http: HttpService,
    private dialog: MatLegacyDialog,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private auth: AuthService,
    private filterlistService: FilterlistService
  ) {
    this.auth.setCurrentPage('dashboard')
    this.filterNameFormGroup = this.formBuilder.group({
      'location':[''],'manager':[''],'hrspoc':[''],'stage':[''],'company':[''],'assignedto':[''],'assignedby':[''],'enpsstatus':[''],'engagement':[''],
      'happiness':[''],'risk':[''],'action': [''],'empstatus': [''], 'actionrequired':[''], 'sublocation':[''], 'function':[''], 'department':[''], 
      'subdepartment':[''], 'role':[''], 'band':[''], 'bu':[''], 'branch':[''], 'intname':[''], 'gender':[''], 'designation':[''], 'zone':['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    let details = JSON.parse(atob(sessionStorage.getItem('details')));
      this.filterlistService.fetchFilterlistData(details.empcode,this.empType).then((data: any) => {
        this.filterArray = JSON.parse(JSON.stringify(data));
        this.locations = this.sortByKey(this.filterArray['location'], 'LocName');
        this.companies = this.sortByKey(this.filterArray['company'], 'CompanyName');
        this.managers = this.filterArray['manager'];
        this.hrspocs = this.filterArray['hr'];
        this.inttypes = this.customSort(this.filterArray['inttype']);
        this.assignedtos = this.sortByKey(this.filterArray['assigned_to'], 'HRSpoc');
        this.assignedbys = this.sortByKey(this.filterArray['assigned_by'], 'HRSpoc');
        this.assignedtofilter = this.filterArray['assigned_to_filter'];
        this.sublocations = this.sortByKey(this.filterArray['sublocation'], 'SubLocName');
        this.functions = this.sortByKey(this.filterArray['function'], 'FuncName');
        this.departments = this.sortByKey(this.filterArray['department'], 'DeptName');
        this.subdepartments = this.sortByKey(this.filterArray['subdepartment'], 'SubDeptName');
        this.roles = this.sortByKey(this.filterArray['role'], 'Role');
        this.bands = this.sortByKey(this.filterArray['band'], 'Band');
        this.businessunit = this.sortByKey(this.filterArray['businessunit'], 'BusinessUnitName');
        this.branches = this.sortByKey(this.filterArray['branch'], 'BranchName');
        this.intnames = this.filterArray['intervention'];
        this.designations = this.sortByKey(this.filterArray['designation'], 'Designation');
        this.zones = this.sortByKey(this.filterArray['zone'], 'Zone');
        this.stages = this.filterArray['stages'];
        let i = 0;
        this.filterArray['hr'].forEach(obj =>{ 
          this.hrspocs[i] = this.getHRSPOC(obj);
          i++;
        }) 
        this.hrspocs = this.hrspocs.filter(x => x !== undefined); 

        let j = 0;
        this.filterArray['manager'].forEach(obj =>{
          this.managers[j] = this.getManager(obj);
          j++;
        })
        this.managers = this.managers.filter(x => x !== undefined);

        let l = 0;
        this.filterArray['assigned_to_filter'].forEach(obj =>{ 
          this.assignedtofilter[l] = this.getAssignedToFilter(obj);
          l++;
        })
        this.assignedtofilter = this.assignedtofilter.filter(x => x !== undefined);
      })
    
      if (!this.actionType){
        this.displaySubCaption = this.getSubCaption();
        if (this.displayedColumns.indexOf('#') === -1) {
          this.displayedColumns.push('#');
        }
        if (changes['dataPlotObj'] && changes['dataPlotObj'].currentValue && changes['dataPlotObj'].currentValue !== "") {
          let val = JSON.parse(changes['dataPlotObj'].currentValue);
          let key = [];
          if (this.type === 'enps') {
            key = (FilterConstants.getEnpsKeys()).filter(x => x.name === val.key);
          } else if (this.type === 'happiness') {
            key = (FilterConstants.getHappinessKeys()).filter(x => x.name === val.key);
          } else if (this.type === 'hr') {
            key = (FilterConstants.getHrKeys()).filter(x => x.name === val.key);
          } else if (this.type === 'flight') {
            key = (FilterConstants.getFlightKeys()).filter(x => x.name === val.key);
          }

          let field: any;
          if (val.label.indexOf(" ") === -1) {
            field = this.getFieldsForYear(Number.parseInt(val.label));
          } else if (val.label.indexOf("-") !== -1) {
            let label: string = val.label;
            let quarter = this.getQuarterIdForName((label.split(" "))[0]);
            field = this.getFieldsForQuarterYear(quarter, (label.split(" "))[1]);
          } else {
            let label: string = val.label;
            let month = this.getMonthIdForName((label.split(" "))[0]);
            field = this.getFieldsForMonthYear(month, (label.split(" "))[1]);
          }

          key.forEach(
            item => {
              field.push({
                id: item.id,
                value: item.value
              });
            }
          )
          this.chartParams = {};
          this.chartParams['fields'] = field;
          if (this.paginator.pageIndex === 0) {
            this.callChartEvent.emit();
          } else {
            this.paginator.pageIndex = 0;
          }
          let element = document.getElementById('target');
          element.scrollIntoView({block: 'nearest'});
        }
        else {
          if (this.paginator.pageIndex === 0) {
            this.updateData();
          } else {
            this.paginator.pageIndex = 0;
          }
        }
      }
      if (this.actionType){
        let flag;
        if (this.actionType['type'] == 'action-required'){
          flag = '0';
        }
        else if (this.actionType['type'] == 'action-taken'){
          flag = '2'
        }
        else if (this.actionType['type'] == 'action-pending'){
          flag = '1'
        }
        else if (this.actionType['type'] == 'people-saved'){
          flag = '3'
        }
        if (changes['selectedFilters'] && changes['selectedFilters'].currentValue && changes['selectedFilters'].currentValue.length > 0){
          this.selectedFilters = changes['selectedFilters'].currentValue
          this.updateData()
        }
        else{
          this.paginator.pageIndex = 0;
          this.getActionPageFilters(flag)
        }
      }
  }

  ngOnInit() {
    this.columnsFormGroup = new FormGroup({});
    this.columns.forEach(
      col => {
        this.columnsFormGroup.addControl(col, new FormControl(this.displayedColumns.indexOf(col) !== -1));
      }
    )
    if (this.actionType){
      this.checkedNumber = this.displayedColumns.length
    }else{
      this.checkedNumber = this.displayedColumns.length - 1
    }
    this.updateData(); //added later
    this.getTimezones();
  }

  spaceKeyDown(event){}

  clearSearch() {
    this.nameFilter.setValue('');
    this.tags = []
    this.updateData();
    this.issearch = false;
  }

  getActionPageFilters(flag?){
    this.highlightActionRequired = false;
    this.highlightAction = false;
    if (flag){
      if (flag == '0'){
      this.filterNameFormGroup.get('actionrequired').setValue([this.actionsrequired[0]])
      this.filterNameFormGroup.get('action').setValue('')
      }
      else if (flag == '1'){
        this.filterNameFormGroup.get('actionrequired').setValue([this.actionsrequired[0]])
        this.filterNameFormGroup.get('action').setValue([this.actions[0]])
      }
      else if (flag == '2'){
        this.filterNameFormGroup.get('actionrequired').setValue([this.actionsrequired[0]])
        this.filterNameFormGroup.get('action').setValue([this.actions[1]])
      }
      else {
        this.filterNameFormGroup.get('actionrequired').setValue('')
        this.filterNameFormGroup.get('action').setValue('')
      }
    }
    let data = this.filterNameFormGroup.value.actionrequired
    let actionRequiredArray = data == "0" ? this.resetFormGroup('actionrequired'):data;
    let actionRequiredValue = Array.prototype.map.call(actionRequiredArray, s => s.ID).toString();
    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'actionrequired'){
        this.filters.splice(i,1);
      }
    }
    if(actionRequiredValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "actionrequired";
      filter.filterValue = actionRequiredValue;
      this.filters.push(filter);
      this.highlightActionRequired = true;
    }

    let dataaction = this.filterNameFormGroup.value.action
    let actionArray = dataaction == "0" ? this.resetFormGroup('action'):dataaction;
    let actionValue = Array.prototype.map.call(actionArray, s => s.ID).toString();
    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'action'){
        this.filters.splice(i,1);
      }
    }
    if(actionValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "action";
      filter.filterValue = actionValue;
      this.filters.push(filter);
      this.highlightAction = true;
    }
    this.updateData();
  }

  updateData(filter?){
    if (this.tags.length > 0){
      this.issearch = true
    }
    if(filter){
      let sortable = {}
      sortable['id'] = 'actionstatus';
      sortable['disableClear'] = true;
      this.sort.sort(<MatSortable>sortable);
    }
    this.paginator.pageIndex = 0;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.subscriptions.push(
      merge(
        this.sort.sortChange, 
        this.paginator.page, this.callChartEvent)
      .pipe(
        startWith({}),
        switchMap(() => {
          if (this.isFirstTimeOpen) {
            let sortable = {}
            sortable['id'] = 'actionstatus';
            sortable['disableClear'] = true;
            this.sort.sort(<MatSortable>sortable);
            this.isFirstTimeOpen = false;
          }
          this.isLoadingResults = true;
          if(this.sort.active == 'senton'){
            this.highlightSentOn = true;
            this.highlightCompletedOn = false;
          }
          else if(this.sort.active == 'completedon'){
            this.highlightCompletedOn = true;
            this.highlightSentOn = false;
          }
          else if(this.sort.active == 'assigneddate'){
            this.highlightAssignedDate = true;
          }
          else{
            this.highlightSentOn = false;
            this.highlightCompletedOn = false;
            this.highlightAssignedDate = false;
          }
          return this.getData(
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize, this.nameFilter.value, this.tags);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalRecords = data['total'];
          return data;
        })
      ).subscribe(data => {
        this.dataSource.data = JSON.parse(JSON.stringify(data.data));
        this.dataLength = this.dataSource.data.length;
        this.dumyListData = this.dataSource.data;
      }
      )
    );
  }

  refreshData(status,pk,AssignedToCode?,AssignedToName?,AssignedBy?,AssignedByName?,AssignedDate?){
    if (status == 'AssignedTo Updated'){
      this.dumyListData.forEach(obj =>{
        if(obj.Pk == pk){
          obj.AssignedToCode = AssignedToCode
          obj.AssignedToName = AssignedToName
          obj.AssignedBy = AssignedBy
          obj.AssignedByName = AssignedByName
          obj.AssignedDate = AssignedDate
        }
      })
      this.dataSource.data = this.dumyListData;
    }
    else{
      let actionstatus = status == "yes"? "1":"0"
      this.dumyListData.forEach(obj =>{
        if(obj.Pk == pk){
          obj.ActionStatus = actionstatus
          if (AssignedToCode && AssignedToName){
            obj.AssignedToCode = AssignedToCode
            obj.AssignedToName = AssignedToName
            obj.AssignedBy = AssignedBy
            obj.AssignedByName = AssignedByName
            obj.AssignedDate = AssignedDate
          }
        }
      })
      this.dataSource.data = this.dumyListData;
    }
  }
  ngAfterViewInit() {

  }

  getTimezones(){
    this.dashboardService.getTimezones().subscribe(
      res =>{
        this.timezones = res;
        this.UTCValue = this.getUTCValue()
      }
    )
  }

  getUTCValue(){
    for(let i=0; i<this.timezones.length; i++){
      if(this.timezones[i].TimezoneID == this.auth.timezone){
        this.UTCValue = this.timezones[i].UTCValue;
        return this.UTCValue;
      }
    }
  }

  getValueForTimezone(){
    return this.UTCValue;
  }

  getHRSPOC(data){
    if(data.HRSpoc == this.name){
      let duplicate = {
        HRSpocID : data.HRSpocID,
        HRSpoc : data.HRSpoc
      }
      this.duplicatesHR.push(duplicate);
      return;
    }

    let value = {
      HRSpocID : data.HRSpocID,
      HRSpoc: data.HRSpoc
    }
    this.name = data.HRSpoc;
    return value;
  }

  getManager(data){
    if(data.Manager == this.name){
      let duplicate = {
        ManagerID : data.ManagerID,
        Manager : data.Manager
      }
      this.duplicatesManager.push(duplicate)
      return;
    }

    let value = {
      ManagerID : data.ManagerID,
      Manager: data.Manager
    }
    this.name = data.Manager;
    return value;
  }

  getAssignedToFilter(data){
    if(data.HRSpoc == this.name){
      let duplicate = {
        HRSpocID : data.HRSpocID,
        HRSpoc : data.HRSpoc
      }
      this.duplicatesAssignedToFilter.push(duplicate);
      return;
    }

    let value = {
      HRSpocID : data.HRSpocID,
      HRSpoc: data.HRSpoc
    }
    this.name = data.HRSpoc;
    return value;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(
      item => {
        item.unsubscribe();
      }
    )
  }

  sortData(e){
    this.paginator.pageIndex = 0
    console.log('sort',e)
  }

  getData(sort: string, order: string, page: number, pageSize: number, name?: string, tags?:any): Observable<any> {
    let details = JSON.parse(atob(sessionStorage.getItem('details')));
    let param = {
      "page": page + 1,
      "limit": pageSize ? pageSize.toString() : '10',
      "name": name ? name : '',
      "sort": order ? order : 'asc',
      "sortOn": sort ? FieldNames[sort] : 'GLFname',
      "emp": details.empcode,
      "empType": this.empType,
      "sortCompleted": sort == 'actionstatus'?'desc':'',
      "sortOnCompleted": sort == 'actionstatus'?FieldNames['completedon']:'',
      "timezone": this.auth.timezone,
      "tags": tags ? tags : []
    }
    let conversationCompletedField = {
      id: "ConvCompleted",
      value: "yes"
    }
    if(this.dateFilter){
      // param['date_filter_1'] = this.dateFilter

      if (this.dateFilter.type == '1') {
        param['StartMonth'] = this.dateFilter['monthStart']
      }
      else if (this.dateFilter.type == '2') {
        param['StartMonth'] = this.dateFilter.quarterStart == "1" ? '1' : (this.dateFilter.quarterStart == "2" ? '4': (this.dateFilter.quarterStart == "3"? '7': '10'));
      }
      else {
        param['StartMonth'] = '1';
      }
      param['StartYear'] = this.dateFilter.yearStart;
      param['DateFilterBy'] = this.dateFilter.dateFilterBy;
      param['filter_type'] = this.dateFilter.type;
      param['pickfrom'] = this.dateFilter['pickfrom']
      param['pickto'] = this.dateFilter['pickto']
    }
    if (this.dateFilter2){
      // param['date_filter_2'] = this.dateFilter2

      if (this.dateFilter2.type == '1') {
        param['EndMonth'] = this.dateFilter['monthStart']
      }
      else if (this.dateFilter2.type == '2') {
        param['EndMonth'] = this.dateFilter.quarterStart == "1" ? '3' : (this.dateFilter.quarterStart == "2" ? '6': (this.dateFilter.quarterStart == "3"? '9': '12'));
      }
      else {
        param['EndMonth'] = '12';
      }
      param['EndYear'] = this.dateFilter.yearStart;
    }
    if (this.actionType){
      param['actionType'] = this.actionType
    }
    if (this.chartParams) {
      param['chartParams'] = this.chartParams;
    } else {
      param['chartParams'] = { fields: [] };
      param['dateFilter'] = this.getDateFilter()
    }
    if(!this.actionType){
    if((this.type === 'flight' && !this.chartParams) || this.type !== 'flight'){
      param['chartParams']['fields'].push(conversationCompletedField);
    }}
    let filterFields = this.getFilterParam();
    filterFields.forEach(
      filter => {
        param['chartParams']['fields'].push(filter);
      }
    )
    if(this.filter){
      if(this.filter.type == "1"){
        param['StartMonth'] = this.filter.monthStart;
        param['EndMonth'] = this.filter.monthEnd;
      }
      else if(this.filter.type == "2"){
        param['StartMonth'] = this.filter.quarterStart == "1" ? '1' : (this.filter.quarterStart == "2" ? '4': (this.filter.quarterStart == "3"? '7': '10'))
        param['EndMonth'] = this.filter.quarterEnd == "1" ? '3' : (this.filter.quarterEnd == "2" ? '6': (this.filter.quarterEnd == "3"? '9': '12'))

      }
      else{
        param['StartMonth'] = '1';
        param['EndMonth'] = '12';
      }
      param['StartYear'] = this.filter.yearStart;
      param['EndYear'] = this.filter.yearEnd;
      param['DateFilterBy'] = this.filter.dateFilterBy;
    }
    if (this.selectedFilters){
      let filterFields = this.selectedFilters
      filterFields.forEach(
        filter => {
          param['chartParams']['fields'].push(filter);
        }
      )
    }
    return this.http.doPost('get_curated/', param);
  }

  changeFilter(){
    let dateFilterModal = this.dialog.open(DateFilterComponent, {
      panelClass: 'dialog-padding-0',
      width: '435px',
      height: '520px',
      data: {
        value: this.filter,
        type:'chat record table'
      }
    });

    dateFilterModal.afterClosed().subscribe(
      res => {
        if (res) {
          this.filter = res;
          this.displaySubCaption = this.getSubCaption();
          this.updateData();
        }
      }
    )
  }

  checkMaxColumnsSelect(){
    if (this.checkedNumber >= 15){
      this.textColorChange = true
      this.columns.forEach(
        item => {
          if (!this.columnsFormGroup.value[item]){
            this.columnsFormGroup.controls[item].disable()
          }
        })
    }
    else{
      this.textColorChange = false
      this.columns.forEach(
        item => {
          if (!this.columnsFormGroup.value[item]){
            this.columnsFormGroup.controls[item].enable()
          }
        })
    }
  }

  onChecked(event){
    event.checked ? this.checkedNumber++ : this.checkedNumber--;
    if (this.checkedNumber >= 15){
      this.textColorChange = true
      this.columns.forEach(
        item => {
          if (!this.columnsFormGroup.value[item]){
            this.columnsFormGroup.controls[item].disable()
          }
        })
    }
    else{
      this.textColorChange = false
      this.columns.forEach(
        item => {
          if (!this.columnsFormGroup.value[item]){
            this.columnsFormGroup.controls[item].enable()
          }
        })
    }
  }

  getSubCaption(){
    let subCaption = "";
    if(this.filter.type == "1"){
      subCaption = this.getMonthNameForId(this.filter.monthStart)+" "+this.filter.yearStart+" to "+this.getMonthNameForId(this.filter.monthEnd)+" "+this.filter.yearEnd;
    }
    else if(this.filter.type == "2"){
      subCaption = this.getQuarterNameForId(this.filter.quarterStart)+" "+this.filter.yearStart+" to "+this.getQuarterNameForId(this.filter.quarterEnd)+" "+this.filter.yearEnd;
    }
    else{
      subCaption = this.filter.yearStart+" to "+this.filter.yearEnd;
    }
    return subCaption;
  }

  getChildFilterValue(){
    this.actionCount++;
    let data = this.filterNameFormGroup.value.action;
    let filter = {"filterType": "", "filterValue": ""};
    filter.filterType = "action";
    filter.filterValue = data.ID; //data[0].ID;
    this.filters.push(filter);

    this.updateData();
  }
  
  getFilterParam(param?) {
    let paramFilters;
    if (param){
      paramFilters = this.selectedFilters
    }
    else{
      paramFilters = this.filters
    }
    //Tenure
    let fields = [];
      paramFilters.forEach(
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

         //Employee Status
         if (filter.filterType == 'empstatus') {
          fields.push({
            id: "EmpStatus",
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

        //Action Required
        if (filter.filterType == 'actionrequired') {
          fields.push({
            id: "ActionRequired",
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

        //BU
        if (filter.filterType == 'bu') {
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
        //stage
        if (filter.filterType == 'stage') {
          fields.push({
            id: "TenureID",
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

        //Gender
        if (filter.filterType == 'gender') {
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

  changeInput(event: Event, type) {
    const inputElement = event.target as HTMLInputElement;
    if(type =='action'){this.searchTextAction = inputElement.value;}
    else if(type =='actionrequired'){this.searchTextActionRequired = inputElement.value;}
    else if(type =='risk'){this.searchTextRisk = inputElement.value;}
    else if(type =='happiness'){this.searchTextHappiness = inputElement.value;}
    else if(type =='engagement'){this.searchTextEngagement = inputElement.value;}
    else if(type =='enpsstatus'){this.searchTextEnps = inputElement.value;}
    else if(type =='stage'){this.searchTextStage = inputElement.value;}
    else if(type =='hrspoc'){this.searchTextHrspoc = inputElement.value;}
    else if(type =='manager'){this.searchTextManager = inputElement.value;}
    else if(type =='location'){this.searchTextLocation = inputElement.value;}
    else if(type =='company'){this.searchTextCompany = inputElement.value;}
    else if(type =='assignedto'){this.searchTextAssignedTo = inputElement.value;}
    else if(type =='assignedby'){this.searchTextAssignedBy = inputElement.value;}
    else if(type =='sublocation'){this.searchTextSubLocation = inputElement.value;}
    else if(type =='function'){this.searchTextFunc = inputElement.value;}
    else if(type =='department'){this.searchTextDepartment = inputElement.value;}
    else if(type =='subdepartment'){this.searchTextSubDepartment = inputElement.value;}
    else if(type =='role'){this.searchTextRole = inputElement.value;}
    else if(type =='band'){this.searchTextBand = inputElement.value;}
    else if(type =='bu'){this.searchTextBU = inputElement.value;}
    else if(type =='branch'){this.searchTextBranch = inputElement.value;}
    else if(type =='intname'){this.searchTextIntName = inputElement.value;}
    else if(type =='designation'){this.searchTextDesignation = inputElement.value;}
    else if(type =='zone'){this.searchTextZone = inputElement.value;}
  }

  // changeInput(value,type){
  //   if(value.data == null){
  //     if(type =='action'){this.searchTextAction = this.searchTextAction.slice(0, this.searchTextAction.length - 1)}
  //     else if(type =='actionrequired'){this.searchTextActionRequired = this.searchTextActionRequired.slice(0, this.searchTextActionRequired.length - 1)}
  //     else if(type =='risk'){this.searchTextRisk = this.searchTextRisk.slice(0, this.searchTextRisk.length - 1)}
  //     else if(type =='happiness'){this.searchTextHappiness = this.searchTextHappiness.slice(0, this.searchTextHappiness.length - 1)}
  //     else if(type =='engagement'){this.searchTextEngagement = this.searchTextEngagement.slice(0, this.searchTextEngagement.length - 1)}
  //     else if(type =='enpsstatus'){this.searchTextEnps = this.searchTextEnps.slice(0, this.searchTextEnps.length - 1)}
  //     else if(type =='stage'){this.searchTextStage = this.searchTextStage.slice(0, this.searchTextStage.length - 1)}
  //     else if(type =='hrspoc'){this.searchTextHrspoc = this.searchTextHrspoc.slice(0, this.searchTextHrspoc.length - 1)}
  //     else if(type =='manager'){this.searchTextManager = this.searchTextManager.slice(0, this.searchTextManager.length - 1)}
  //     else if(type =='location'){this.searchTextLocation = this.searchTextLocation.slice(0, this.searchTextLocation.length - 1)}
  //     else if(type =='company'){this.searchTextCompany = this.searchTextCompany.slice(0, this.searchTextCompany.length - 1)}
  //     else if(type =='assignedto'){this.searchTextAssignedTo = this.searchTextAssignedTo.slice(0, this.searchTextAssignedTo.length - 1)}
  //     else if(type =='assignedby'){this.searchTextAssignedBy = this.searchTextAssignedBy.slice(0, this.searchTextAssignedBy.length - 1)}
  //     else if(type =='sublocation'){this.searchTextSubLocation = this.searchTextSubLocation.slice(0, this.searchTextSubLocation.length - 1)}
  //     else if(type =='function'){this.searchTextFunc = this.searchTextFunc.slice(0, this.searchTextFunc.length - 1)}
  //     else if(type =='department'){this.searchTextDepartment = this.searchTextDepartment.slice(0, this.searchTextDepartment.length - 1)}
  //     else if(type =='subdepartment'){this.searchTextSubDepartment = this.searchTextSubDepartment.slice(0, this.searchTextSubDepartment.length - 1)}
  //     else if(type =='role'){this.searchTextRole = this.searchTextRole.slice(0, this.searchTextRole.length - 1)}
  //     else if(type =='band'){this.searchTextBand = this.searchTextBand.slice(0, this.searchTextBand.length - 1)}
  //     else if(type =='bu'){this.searchTextBU = this.searchTextBU.slice(0, this.searchTextBU.length - 1)}
  //     else if(type =='branch'){this.searchTextBranch = this.searchTextBranch.slice(0, this.searchTextBranch.length - 1)}
  //     else if(type =='intname'){this.searchTextIntName = this.searchTextIntName.slice(0, this.searchTextIntName.length - 1)}
  //     else if(type =='designation'){this.searchTextDesignation = this.searchTextDesignation.slice(0, this.searchTextDesignation.length - 1)}
  //     else if(type =='zone'){this.searchTextZone = this.searchTextZone.slice(0, this.searchTextZone.length - 1)}
  //   }
  //   else{
  //     if(type == 'action'){this.searchTextAction = this.searchTextAction+value.data}
  //     else if(type == 'actionrequired'){this.searchTextActionRequired = this.searchTextActionRequired+value.data}
  //     else if(type == 'risk'){this.searchTextRisk = this.searchTextRisk+value.data}
  //     else if(type == 'happiness'){this.searchTextHappiness = this.searchTextHappiness+value.data}
  //     else if(type == 'engagement'){this.searchTextEngagement = this.searchTextEngagement+value.data}
  //     else if(type == 'enpsstatus'){this.searchTextEnps = this.searchTextEnps+value.data}
  //     else if(type == 'stage'){this.searchTextStage = this.searchTextStage+value.data}
  //     else if(type == 'hrspoc'){this.searchTextHrspoc = this.searchTextHrspoc+value.data}
  //     else if(type == 'manager'){this.searchTextManager = this.searchTextManager+value.data}
  //     else if(type == 'location'){this.searchTextLocation = this.searchTextLocation+value.data}
  //     else if(type == 'company'){this.searchTextCompany = this.searchTextCompany+value.data}
  //     else if(type == 'assignedto'){this.searchTextAssignedTo = this.searchTextAssignedTo+value.data}
  //     else if(type == 'assignedby'){this.searchTextAssignedBy = this.searchTextAssignedBy+value.data}
  //     else if(type == 'sublocation'){this.searchTextSubLocation = this.searchTextSubLocation+value.data}
  //     else if(type == 'function'){this.searchTextFunc = this.searchTextFunc+value.data}
  //     else if(type == 'department'){this.searchTextDepartment = this.searchTextDepartment+value.data}
  //     else if(type == 'subdepartment'){this.searchTextSubDepartment = this.searchTextSubDepartment+value.data}
  //     else if(type == 'role'){this.searchTextRole = this.searchTextRole+value.data}
  //     else if(type == 'band'){this.searchTextBand = this.searchTextBand+value.data}
  //     else if(type == 'bu'){this.searchTextBU = this.searchTextBU+value.data}
  //     else if(type == 'branch'){this.searchTextBranch = this.searchTextBranch+value.data}
  //     else if(type == 'intname'){this.searchTextIntName = this.searchTextIntName+value.data}
  //     else if(type == 'designation'){this.searchTextDesignation = this.searchTextDesignation+value.data}
  //     else if(type == 'zone'){this.searchTextZone = this.searchTextZone+value.data}
  //   }
  // }

  recordAction(record,tab?) {
    this.recordActionEvent.emit({record,tab});
  }

  assignTo(record){
    this.assignToDialogRef = this.dialog.open(AssignToComponent, {
      height: '38%',
      width: '25%',
      panelClass: 'dialog-padding-0',
      disableClose: true,
      data: record
    });

    this.assignToDialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.dashboardService.getDataFromCurated(record.Pk).subscribe(data => {
          let AssignedToCode = data['AssignedToCode']
          let AssignedToName = data['AssignedToName']
          let AssignedBy = data['AssignedBy']
          let AssignedByName = data['AssignedByName']
          let AssignedDate = data['AssignedDate']
          this.refreshData('AssignedTo Updated',record.Pk,AssignedToCode,AssignedToName,AssignedBy,AssignedByName,AssignedDate)
        })
        }
      });
  }

  updateColumns() {
    this.displayedColumns = this.displayedColumns.filter(x => x === "#");
    this.columns.forEach(
      item => {
        if (this.columnsFormGroup.value[item]) {
          if (this.displayedColumns.length === 1) {
            this.displayedColumns.unshift(item);
          } else if (this.displayedColumns.length === 2) {
            this.displayedColumns.splice(1, 0, item);
          } else {
            this.displayedColumns.splice(this.displayedColumns.length - 1, 0, item);
          }
        }
      }
    )
  }

  getDisplayedColumns() {
    if (this.columnsFormGroup) {
      let arr = [];
      this.columns.forEach(
        item => {
          if (this.columnsFormGroup.value[item]) {
            arr.push(item);
          }
        }
      );
      arr.push('#');

      return arr;
    }

    return [];
  }

  getColumnName(key) {
    return ColumnName[key];
    // return ColumnNames[key];
  }

  getFieldsForYear(year) {
    let fields = [];

    fields.push({
      id: 'Year',
      value: year.toString()
    });

    return fields;
  }

  getFieldsForMonthYear(month, year) {
    let fields = [];
    fields.push({
      id: 'Month',
      value: month.toString()
    });

    fields.push({
      id: 'Year',
      value: year.toString()
    });

    return fields;
  }

  getMonthNameForId(month) {
    let selectedMonth = this.months.filter(x => x.id === month.toString());
    return selectedMonth[0].name;
  }

  getMonthIdForName(month) {
    let selectedMonth = this.months.filter(x => x.name === month);
    return selectedMonth[0].id;
  }

  getFieldsForQuarterYear(quarter, year) {
    let fields = [];
    let quarterArr = [];
    for (let i = 0; i < 3; i++) {
      quarterArr.push((3 * quarter - i).toString());
    }
    fields.push({
      id: 'Month',
      value: quarterArr
    });

    fields.push({
      id: 'Year',
      value: year.toString()
    });

    return fields;
  }

  getQuarterNameForId(quarter) {
    let selectedQuarter = this.quarters.filter(x => x.id === quarter.toString());
    return selectedQuarter[0].name;
  }

  getQuarterIdForName(quarter) {
    let selectedQuarter = this.quarters.filter(x => x.name === quarter);
    return selectedQuarter[0].id;
  }

  removeChartParams() {
    this.chartParams = undefined;
    this.dataPlotObj = "";

    this.changeDataPlotObj.emit("");
  }

  getChartFilterValue() {
    if (this.dataPlotObj) {
      let obj = JSON.parse(this.dataPlotObj);
      return obj.key + ": " + obj.label;
    }

    return "";
  }

  getDateFilter(){
    let obj = {
      start: {
        month:"",
        year: ""
      },
      end:{
        month: "",
        year: ""
      }
    }
    if (this.filter){
      if(this.filter.type === "1"){
        obj.start.month = this.filter.monthStart;
        obj.start.year = this.filter.yearStart;
        obj.end.month = this.filter.monthEnd;
        obj.end.year = this.filter.yearEnd;
      } else if(this.filter.type === "2"){
        obj.start.month = this.getStartMonthOfQuarter(this.filter.quarterStart);
        obj.start.year = this.filter.yearStart;
        obj.end.month = this.getEndMonthOfQuarter(this.filter.quarterEnd);
        obj.end.year = this.filter.yearEnd;
      }else if(this.filter.type === "3"){
        obj.start.month = "1";
        obj.start.year = this.filter.yearStart;
        obj.end.month = "12";
        obj.end.year = this.filter.yearEnd;
      }

      return obj;
    }
  }

  getStartMonthOfQuarter(quarter){
    let res = "";
    switch(quarter){
      case "1":
      res = "1";
      break;
      case "2":
      res = "4";
      break;
      case "3":
      res = "7";
      break;
      case "4":
      res = "10";
      break;
    }
    return res;
  }

  getEndMonthOfQuarter(quarter){
    let res = "";
    switch(quarter){
      case "1":
      res = "3";
      break;
      case "2":
      res = "6";
      break;
      case "3":
      res = "9";
      break;
      case "4":
      res = "12";
      break;
    }

    return res;
  }

  getFilterOnLocation(){
    this.highlightLocation = false;
    let data = this.filterNameFormGroup.value.location
    let locationArray = data == "0" ? this.resetFormGroup('location'):data;
    let locationValue = Array.prototype.map.call(locationArray, s => s.LocID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'location'){
        this.filters.splice(i,1);
      }
    }
    if(locationValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "location";
      filter.filterValue = locationValue;
      this.filters.push(filter);
      this.highlightLocation = true;
    }
    this.updateData();
  }

  getFilterOnCompany(){
    this.highlightComp = false;
    let data = this.filterNameFormGroup.value.company
    let companyArray = data == "0" ? this.resetFormGroup('company'):data;
    let companyValue = Array.prototype.map.call(companyArray, s => s.CompanyID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'company'){
        this.filters.splice(i,1);
      }
    }
    if(companyValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "company";
      filter.filterValue = companyValue;
      this.filters.push(filter);
      this.highlightComp = true;
    }
    this.updateData();
  }

  getFilterOnAssignedTo(){
    this.highlightAssignedTo = false;
    let data = this.filterNameFormGroup.value.assignedto
    let assignedtoArray = data == "0" ? this.resetFormGroup('assignedto'):data;
    if(assignedtoArray){
      assignedtoArray.forEach(obj =>{
        for(let i=0;i<this.duplicatesAssignedToFilter.length;i++){
          if(this.duplicatesAssignedToFilter[i].HRSpoc == obj.HRSpoc){
            assignedtoArray.push(this.duplicatesAssignedToFilter[i]);
          }
        }
      })
    }
    let assignedtoValue = Array.prototype.map.call(assignedtoArray, s => s.HRSpocID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'assignedto'){
        this.filters.splice(i,1);
      }
    }
    if(assignedtoValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "assignedto";
      filter.filterValue = assignedtoValue;
      this.filters.push(filter);
      this.highlightAssignedTo = true;
    }
    this.updateData();
  }

  getFilterOnAssignedBy(){
    this.highlightAssignedBy = false;
    let data = this.filterNameFormGroup.value.assignedby
    let assignedbyArray = data == "0" ? this.resetFormGroup('assignedby'):data;
    let assignedbyValue = Array.prototype.map.call(assignedbyArray, s => s.HRSpocID).toString();
    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'assignedby'){
        this.filters.splice(i,1);
      }
    }
    if(assignedbyValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "assignedby";
      filter.filterValue = assignedbyValue;
      this.filters.push(filter);
      this.highlightAssignedBy = true;
    }
    this.updateData();
  }

  getFilterOnManager(){
    this.highlightManager = false;
    let data = this.filterNameFormGroup.value.manager
    let managerArray = data == "0" ? this.resetFormGroup('manager'):data;
    if(managerArray){
      managerArray.forEach(obj =>{
        for(let i=0;i<this.duplicatesManager.length;i++){
          if(this.duplicatesManager[i].Manager == obj.Manager){
            managerArray.push(this.duplicatesManager[i]);
          }
        }
      })
    }
    let managerValue = Array.prototype.map.call(managerArray, s => s.ManagerID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'manager'){
        this.filters.splice(i,1);
      }
    }
    if(managerValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "manager";
      filter.filterValue = managerValue;
      this.filters.push(filter);
      this.highlightManager = true;
    }
    this.updateData();
  }

  getFilterOnHR(){
    this.highlightHR = false;
    let data = this.filterNameFormGroup.value.hrspoc
    let hrArray = data == "0" ? this.resetFormGroup('hrspoc'):data;
    if(hrArray){
      hrArray.forEach(obj =>{
        for(let i=0;i<this.duplicatesHR.length;i++){
          if(this.duplicatesHR[i].HRSpoc == obj.HRSpoc){
            hrArray.push(this.duplicatesHR[i]);
          }
        }
      })
    }
    let hrValue = Array.prototype.map.call(hrArray, s => s.HRSpocID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'hrspoc'){
        this.filters.splice(i,1);
      }
    }
    if(hrValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "hrspoc";
      filter.filterValue = hrValue;
      this.filters.push(filter);
      this.highlightHR = true;
    }
    this.updateData();
  }

  getFilterOnStage(){
    this.highlightStage = false;
    let data = this.filterNameFormGroup.value.stage
    let stageArray = data == "0" ? this.resetFormGroup('stage'):data;
    let stageValue = Array.prototype.map.call(stageArray, s => s.StageID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'stage'){
        this.filters.splice(i,1);
      }
    }
    if(stageValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "stage";
      filter.filterValue = stageValue;
      this.filters.push(filter);
      this.highlightStage = true;
    }
    this.updateData();
    // this.highlightStage = false;
    // let data = this.filterNameFormGroup.value.stage
    // let stageArray = data == "0" ? this.resetFormGroup('stage'):data;
    // let stageValue = Array.prototype.map.call(stageArray, s => s.IntTypeID).toString();

    // for(let i=0; i<this.filters.length; i++){
    //   if(this.filters[i].filterType == 'inttype'){
    //     this.filters.splice(i,1);
    //   }
    // }
    // if(stageValue){
    //   let filter = {"filterType": "", "filterValue": ""};
    //   filter.filterType = "inttype";
    //   filter.filterValue = stageValue;
    //   this.filters.push(filter);
    //   this.highlightStage = true;
    // }
    // this.updateData();
  }

  getFilterOnEnps(){
    this.highlightEnps = false;
    let data = this.filterNameFormGroup.value.enpsstatus
    let enpsArray = data == "0" ? this.resetFormGroup('enpsstatus'):data;
    let enpsValue = Array.prototype.map.call(enpsArray, s => s.ID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'enpsstatus'){
        this.filters.splice(i,1);
      }
    }
    if(enpsValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "enpsstatus";
      filter.filterValue = enpsValue;
      this.filters.push(filter);
      this.highlightEnps = true;
    }
    this.updateData();
  }

  getFilterOnEmpStatus(){
    this.highlightEmpStatus = false;
    let data = this.filterNameFormGroup.value.empstatus
    let empstatusArray = data == "2" ? this.resetFormGroup('empstatus'):data;
    let empstatusValue = Array.prototype.map.call(empstatusArray, s => s.ID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'empstatus'){
        this.filters.splice(i,1);
      }
    }
    if(empstatusValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "empstatus";
      filter.filterValue = empstatusValue;
      this.filters.push(filter);
      this.highlightEmpStatus = true;
    }
    this.updateData();
  }

  getFilterOnEngagement(){
    this.highlightEngagement = false;
    let data = this.filterNameFormGroup.value.engagement
    let engagementArray = data == "0" ? this.resetFormGroup('engagement'):data;
    let engagementValue = Array.prototype.map.call(engagementArray, s => s.ID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'engagement'){
        this.filters.splice(i,1);
      }
    }
    if(engagementValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "engagement";
      filter.filterValue = engagementValue;
      this.filters.push(filter);
      this.highlightEngagement = true;
    }
    this.updateData();
  }

  getFilterOnHappiness(){
    this.highlightHappiness = false;
    let data = this.filterNameFormGroup.value.happiness
    let happinessArray = data == "0" ? this.resetFormGroup('happiness'):data;
    let happinessValue = Array.prototype.map.call(happinessArray, s => s.ID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'happiness'){
        this.filters.splice(i,1);
      }
    }
    if(happinessValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "happiness";
      filter.filterValue = happinessValue;
      this.filters.push(filter);
      this.highlightHappiness = true;
    }
    this.updateData();
  }

  getFilterOnRisk(){
    this.highlightRisk = false;
    let data = this.filterNameFormGroup.value.risk
    let riskArray = data == "0" ? this.resetFormGroup('risk'):data;
    let riskValue = Array.prototype.map.call(riskArray, s => s.ID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'risk'){
        this.filters.splice(i,1);
      }
    }
    if(riskValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "risk";
      filter.filterValue = riskValue;
      this.filters.push(filter);
      this.highlightRisk = true;
    }
    this.updateData();
  }

  getFilterOnActionRequired(){
    this.highlightActionRequired = false;
    let data = this.filterNameFormGroup.value.actionrequired
    let actionRequiredArray = data == "0" ? this.resetFormGroup('actionrequired'):data;
    let actionRequiredValue = Array.prototype.map.call(actionRequiredArray, s => s.ID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'actionrequired'){
        this.filters.splice(i,1);
      }
    }
    if(actionRequiredValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "actionrequired";
      filter.filterValue = actionRequiredValue;
      this.filters.push(filter);
      this.highlightActionRequired = true;
    }
    this.updateData();
  }

  getFilterOnAction(){
    this.highlightAction = false;
    let data = this.filterNameFormGroup.value.action
    let actionArray = data == "0" ? this.resetFormGroup('action'):data;
    let actionValue = Array.prototype.map.call(actionArray, s => s.ID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'action'){
        this.filters.splice(i,1);
      }
    }
    if(actionValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "action";
      filter.filterValue = actionValue;
      this.filters.push(filter);
      this.highlightAction = true;
    }
    this.updateData();
  }

  getFilterOnSubLocation(){
    this.highlightSubLocation = false;
    let data = this.filterNameFormGroup.value.sublocation
    let sublocationArray = data == "0" ? this.resetFormGroup('sublocation'):data;
    let sublocationValue = Array.prototype.map.call(sublocationArray, s => s.SubLocID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'sublocation'){
        this.filters.splice(i,1);
      }
    }
    if(sublocationValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "sublocation";
      filter.filterValue = sublocationValue;
      this.filters.push(filter);
      this.highlightSubLocation = true;
    }
    this.updateData();
  }

  getFilterOnFunc(){
    this.highlightFunc = false;
    let data = this.filterNameFormGroup.value.function
    let functionArray = data == "0" ? this.resetFormGroup('function'):data;
    let functionValue = Array.prototype.map.call(functionArray, s => s.FuncID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'function'){
        this.filters.splice(i,1);
      }
    }
    if(functionValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "function";
      filter.filterValue = functionValue;
      this.filters.push(filter);
      this.highlightFunc = true;
    }
    this.updateData();
  }

  getFilterOnDepartment(){
    this.highlightDepartment = false;
    let data = this.filterNameFormGroup.value.department
    let departmentArray = data == "0" ? this.resetFormGroup('department'):data;
    let departmentValue = Array.prototype.map.call(departmentArray, s => s.DeptID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'department'){
        this.filters.splice(i,1);
      }
    }
    if(departmentValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "department";
      filter.filterValue = departmentValue;
      this.filters.push(filter);
      this.highlightDepartment = true;
    }
    this.updateData();
  }

  getFilterOnSubDepartment(){
    this.highlightSubDepartment = false;
    let data = this.filterNameFormGroup.value.subdepartment
    let subdepartmentArray = data == "0" ? this.resetFormGroup('subdepartment'):data;
    let subdepartmentValue = Array.prototype.map.call(subdepartmentArray, s => s.SubDeptID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'subdepartment'){
        this.filters.splice(i,1);
      }
    }
    if(subdepartmentValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "subdepartment";
      filter.filterValue = subdepartmentValue;
      this.filters.push(filter);
      this.highlightSubDepartment = true;
    }
    this.updateData();
  }

  getFilterOnRole(){
    this.highlightRole = false;
    let data = this.filterNameFormGroup.value.role
    let roleArray = data == "0" ? this.resetFormGroup('role'):data;
    let roleValue = Array.prototype.map.call(roleArray, s => s.RoleID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'role'){
        this.filters.splice(i,1);
      }
    }
    if(roleValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "role";
      filter.filterValue = roleValue;
      this.filters.push(filter);
      this.highlightRole = true;
    }
    this.updateData();
  }

  getFilterOnBand(){
    this.highlightBand = false;
    let data = this.filterNameFormGroup.value.band
    let bandArray = data == "0" ? this.resetFormGroup('band'):data;
    let bandValue = Array.prototype.map.call(bandArray, s => s.BandID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'band'){
        this.filters.splice(i,1);
      }
    }
    if(bandValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "band";
      filter.filterValue = bandValue;
      this.filters.push(filter);
      this.highlightBand = true;
    }
    this.updateData();
  }

  getFilterOnBU(){
    this.highlightBU = false;
    let data = this.filterNameFormGroup.value.bu
    let buArray = data == "0" ? this.resetFormGroup('bu'):data;
    let buValue = Array.prototype.map.call(buArray, s => s.BusinessUnitID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'bu'){
        this.filters.splice(i,1);
      }
    }
    if(buValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "bu";
      filter.filterValue = buValue;
      this.filters.push(filter);
      this.highlightBU = true;
    }
    this.updateData();
  }

  getFilterOnBranch(){
    this.highlightBranch = false;
    let data = this.filterNameFormGroup.value.branch
    let branchArray = data == "0" ? this.resetFormGroup('branch'):data;
    let branchValue = Array.prototype.map.call(branchArray, s => s.BranchID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'branch'){
        this.filters.splice(i,1);
      }
    }
    if(branchValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "branch";
      filter.filterValue = branchValue;
      this.filters.push(filter);
      this.highlightBranch = true;
    }
    this.updateData();
  }

  getFilterOnIntName(){
    this.highlightIntName = false;
    let data = this.filterNameFormGroup.value.intname
    let intnameArray = data == "0" ? this.resetFormGroup('intname'):data;
    let intnameValue = Array.prototype.map.call(intnameArray, s => s.IntID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'intname'){
        this.filters.splice(i,1);
      }
    }
    if(intnameValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "intname";
      filter.filterValue = intnameValue;
      this.filters.push(filter);
      this.highlightIntName = true;
    }
    this.updateData();
  }

  getFilterOnGender(){
    this.highlightGender = false;
    let data = this.filterNameFormGroup.value.gender
    let genderArray = data == "0" ? this.resetFormGroup('gender'):data;
    let genderValue = Array.prototype.map.call(genderArray, s => s.ID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'gender'){
        this.filters.splice(i,1);
      }
    }
    if(genderValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "gender";
      filter.filterValue = genderValue;
      this.filters.push(filter);
      this.highlightGender = true;
    }
    this.updateData();
  }

  getFilterOnDesignation(){
    this.highlightDesignation = false;
    let data = this.filterNameFormGroup.value.designation
    let designationArray = data == "0" ? this.resetFormGroup('designation'):data;
    let designationValue = Array.prototype.map.call(designationArray, s => s.Designation).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'designation'){
        this.filters.splice(i,1);
      }
    }
    if(designationValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "designation";
      filter.filterValue = designationValue;
      this.filters.push(filter);
      this.highlightDesignation = true;
    }
    this.updateData();
  }

  getFilterOnZone(){
    this.highlightZone = false;
    let data = this.filterNameFormGroup.value.zone
    let zoneArray = data == "0" ? this.resetFormGroup('zone'):data;
    let zoneValue = Array.prototype.map.call(zoneArray, s => s.ZoneID).toString();

    for(let i=0; i<this.filters.length; i++){
      if(this.filters[i].filterType == 'zone'){
        this.filters.splice(i,1);
      }
    }
    if(zoneValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "zone";
      filter.filterValue = zoneValue;
      this.filters.push(filter);
      this.highlightZone = true;
    }
    this.updateData();
  }

  resetFormGroup(name){
    this.filterNameFormGroup.controls[name].setValue('');
    return "";
  }

  removeHightlight(){
    this.highlightLocation = false;
  }

  onOptionClick(type, value): void {
    if(type == 'function'){
      const index = this.selectedFunctions.indexOf(value);
      if (index === -1) {
        this.selectedFunctions.push(value);
      }
      else {
        this.selectedFunctions.splice(index, 1);
      }
      this.filterNameFormGroup.controls['function'].patchValue(this.selectedFunctions)
    }
    else if(type == 'company') {
      const index = this.selectedCompanies.indexOf(value);
      if (index === -1) {
        this.selectedCompanies.push(value);
      }
      else {
        this.selectedCompanies.splice(index, 1);
      }
      this.filterNameFormGroup.controls['company'].patchValue(this.selectedCompanies)
    }
    else if(type == 'department') {
      const index = this.selectedDepartments.indexOf(value);
      if (index === -1) {
        this.selectedDepartments.push(value);
      }
      else {
        this.selectedDepartments.splice(index, 1);
      }
      this.filterNameFormGroup.controls['department'].patchValue(this.selectedDepartments)
    }
    else if (type == 'subdepartment') {
      const index = this.selectedSubDepartments.indexOf(value);
      if (index === -1) {
        this.selectedSubDepartments.push(value);
      }
      else {
        this.selectedSubDepartments.splice(index, 1);
      }
      this.filterNameFormGroup.controls['subdepartment'].patchValue(this.selectedSubDepartments)
    }
    else if (type == 'role') {
      const index = this.selectedRoles.indexOf(value);
      if (index === -1) {
        this.selectedRoles.push(value);
      }
      else {
        this.selectedRoles.splice(index, 1);
      }
      this.filterNameFormGroup.controls['role'].patchValue(this.selectedRoles)
    }
    else if (type == 'location') {
      const index = this.selectedLocations.indexOf(value);
      if (index === -1) {
        this.selectedLocations.push(value);
      }
      else {
        this.selectedLocations.splice(index, 1);
      }
      this.filterNameFormGroup.controls['location'].patchValue(this.selectedLocations)
    }
    else if (type == 'sublocation') {
      const index = this.selectedSubLocations.indexOf(value);
      if (index === -1) {
        this.selectedSubLocations.push(value);
      }
      else {
        this.selectedSubLocations.splice(index, 1);
      }
      this.filterNameFormGroup.controls['sublocation'].patchValue(this.selectedSubLocations)
    }
    else if (type == 'band') {
      const index = this.selectedBands.indexOf(value);
      if (index === -1) {
        this.selectedBands.push(value);
      }
      else {
        this.selectedBands.splice(index, 1);
      }
      this.filterNameFormGroup.controls['band'].patchValue(this.selectedBands)
    }
    else if (type == 'businessunit') {
      const index = this.selectedBusinessUnits.indexOf(value);
      if (index === -1) {
        this.selectedBusinessUnits.push(value);
      }
      else {
        this.selectedBusinessUnits.splice(index, 1);
      }
      this.filterNameFormGroup.controls['bu'].patchValue(this.selectedBusinessUnits)
    }
    else if (type == 'branch') {
      const index = this.selectedBranches.indexOf(value);
      if (index === -1) {
        this.selectedBranches.push(value);
      }
      else {
        this.selectedBranches.splice(index, 1);
      }
      this.filterNameFormGroup.controls['branch'].patchValue(this.selectedBranches)
    }
    else if (type == 'manager') {
      const index = this.selectedManagers.indexOf(value);
      if (index === -1) {
        this.selectedManagers.push(value);
      }
      else {
        this.selectedManagers.splice(index, 1);
      }
      this.filterNameFormGroup.controls['manager'].patchValue(this.selectedManagers)
    }
    else if (type == 'hrspoc') {
      const index = this.selectedHrspocs.indexOf(value);
      if (index === -1) {
        this.selectedHrspocs.push(value);
      }
      else {
        this.selectedHrspocs.splice(index, 1);
      }
      this.filterNameFormGroup.controls['hrspoc'].patchValue(this.selectedHrspocs)
    }
    else if (type == 'inttype') {
      const index = this.selectedInttypes.indexOf(value);
      if (index === -1) {
        this.selectedInttypes.push(value);
      }
      else {
        this.selectedInttypes.splice(index, 1);
      }
      this.filterNameFormGroup.controls['stage'].patchValue(this.selectedInttypes)
    }
    else if (type == 'intname') {
      const index = this.selectedIntnames.indexOf(value);
      if (index === -1) {
        this.selectedIntnames.push(value);
      }
      else {
        this.selectedIntnames.splice(index, 1);
      }
      this.filterNameFormGroup.controls['intname'].patchValue(this.selectedIntnames)
    }
    else if (type == 'zone') {
      const index = this.selectedZones.indexOf(value);
      if (index === -1) {
        this.selectedZones.push(value);
      }
      else {
        this.selectedZones.splice(index, 1);
      }
      this.filterNameFormGroup.controls['zone'].patchValue(this.selectedZones)
    }
    else if (type == 'stage') {
      const index = this.selectedStages.indexOf(value);
      if (index === -1) {
        this.selectedStages.push(value);
      }
      else {
        this.selectedStages.splice(index, 1);
      }
      this.filterNameFormGroup.controls['stage'].patchValue(this.selectedStages)
    }



    else if (type == 'action') {
      const index = this.selectedActions.indexOf(value);
      if (index === -1) {
        this.selectedActions.push(value);
      }
      else {
        this.selectedActions.splice(index, 1);
      }
      this.filterNameFormGroup.controls['action'].patchValue(this.selectedActions)
    }
    else if (type == 'actionrequired') {
      const index = this.selectedActionRequireds.indexOf(value);
      if (index === -1) {
        this.selectedActionRequireds.push(value);
      }
      else {
        this.selectedActionRequireds.splice(index, 1);
      }
      this.filterNameFormGroup.controls['actionrequired'].patchValue(this.selectedActionRequireds)
    }
    else if (type == 'risk') {
      const index = this.selectedRisks.indexOf(value);
      if (index === -1) {
        this.selectedRisks.push(value);
      }
      else {
        this.selectedRisks.splice(index, 1);
      }
      this.filterNameFormGroup.controls['risk'].patchValue(this.selectedRisks)
    }
    else if (type == 'happiness') {
      const index = this.selectedHappiness.indexOf(value);
      if (index === -1) {
        this.selectedHappiness.push(value);
      }
      else {
        this.selectedHappiness.splice(index, 1);
      }
      this.filterNameFormGroup.controls['happiness'].patchValue(this.selectedHappiness)
    }
    else if (type == 'engagement') {
      const index = this.selectedEngagements.indexOf(value);
      if (index === -1) {
        this.selectedEngagements.push(value);
      }
      else {
        this.selectedEngagements.splice(index, 1);
      }
      this.filterNameFormGroup.controls['engagement'].patchValue(this.selectedEngagements)
    }
    else if (type == 'enpsstatus') {
      const index = this.selectedEnpsstatuses.indexOf(value);
      if (index === -1) {
        this.selectedEnpsstatuses.push(value);
      }
      else {
        this.selectedEnpsstatuses.splice(index, 1);
      }
      this.filterNameFormGroup.controls['enpsstatus'].patchValue(this.selectedEnpsstatuses)
    }
    else if (type == 'assignedto') {
      const index = this.selectedAssignedtos.indexOf(value);
      if (index === -1) {
        this.selectedAssignedtos.push(value);
      }
      else {
        this.selectedAssignedtos.splice(index, 1);
      }
      this.filterNameFormGroup.controls['assignedto'].patchValue(this.selectedAssignedtos)
    }
    else if (type == 'assignedby') {
      const index = this.selectedAssignedbys.indexOf(value);
      if (index === -1) {
        this.selectedAssignedbys.push(value);
      }
      else {
        this.selectedAssignedbys.splice(index, 1);
      }
      this.filterNameFormGroup.controls['assignedby'].patchValue(this.selectedAssignedbys)
    }
    else if (type == 'designation') {
      const index = this.selectedDesignations.indexOf(value);
      if (index === -1) {
        this.selectedDesignations.push(value);
      }
      else {
        this.selectedDesignations.splice(index, 1);
      }
      this.filterNameFormGroup.controls['designation'].patchValue(this.selectedDesignations)
    }
  }
  
  toggleAllSelection(type) {
    if(type == 'location'){
      if(this.allLocSelected.selected){
        this.selectedLocations = [...this.locations];
        this.filterNameFormGroup.controls['location'].patchValue([...this.locations.map(item => item), 0])
      }
      else{
        this.selectedLocations = [];
        this.filterNameFormGroup.controls['location'].setValue('');
      }
    }
    if(type == 'company'){
      if(this.allCompanySelected.selected){
        this.selectedCompanies = [...this.companies];
        this.filterNameFormGroup.controls['company'].patchValue([...this.companies.map(item => item), 0])
      }
      else{
        this.selectedCompanies = [];
        this.filterNameFormGroup.controls['company'].setValue('');
      }
    }
    if(type == 'assignedto'){
      if(this.allAssignedToSelected.selected){
        this.selectedAssignedtos = [...this.assignedtofilter];
        this.filterNameFormGroup.controls['assignedto'].patchValue([...this.assignedtofilter.map(item => item), 0])
      }
      else{
        this.selectedAssignedtos = [];
        this.filterNameFormGroup.controls['assignedto'].setValue('');
      }
    }
    if(type == 'assignedby'){
      if(this.allAssignedBySelected.selected){
        this.selectedAssignedbys = [...this.assignedbys];
        this.filterNameFormGroup.controls['assignedby'].patchValue([...this.assignedbys.map(item => item), 0])
      }
      else{
        this.selectedAssignedbys = [];
        this.filterNameFormGroup.controls['assignedby'].setValue('');
      }
    }
    if(type == 'manager'){
      if(this.allMgrSelected.selected){
        this.selectedManagers = [...this.managers];
        this.filterNameFormGroup.controls['manager'].patchValue([...this.managers.map(item => item), 0])
      }
      else{
        this.selectedManagers = [];
        this.filterNameFormGroup.controls['manager'].setValue('');
      }
    }
    if(type == 'hrspoc'){
      if (this.allHrSelected.selected) {
        this.selectedHrspocs = [...this.hrspocs];
        this.filterNameFormGroup.controls['hrspoc'].patchValue([...this.hrspocs.map(item => item), 0]);
      } else {
        this.selectedHrspocs = [];
        this.filterNameFormGroup.controls['hrspoc'].setValue('');
      }
    }
    if(type == 'stage'){
      if(this.allStageSelected.selected){
        this.selectedStages = [...this.stages];
        this.filterNameFormGroup.controls['stage'].patchValue([...this.stages.map(item => item), 0])
      }
      else{
        this.selectedStages = [];
        this.filterNameFormGroup.controls['stage'].setValue('');
      }
    }
    if(type == 'enpsstatus'){
      if(this.allEnpsSelected.selected){
        this.selectedEnpsstatuses = [...this.enpsstatusType];
        this.filterNameFormGroup.controls['enpsstatus'].patchValue([...this.enpsstatusType.map(item => item), 0])
      }
      else{
        this.selectedEnpsstatuses = [];
        this.filterNameFormGroup.controls['enpsstatus'].setValue('');
      }
    }
    if(type == 'engagement'){
      if(this.allEngSelected.selected){
        this.selectedEngagements = [...this.engagementType];
        this.filterNameFormGroup.controls['engagement'].patchValue([...this.engagementType.map(item => item), 0])
      }
      else{
        this.selectedEngagements = [];
        this.filterNameFormGroup.controls['engagement'].setValue('');
      }
    }
    if(type == 'happiness'){
      if(this.allHappinessSelected.selected){
        this.selectedHappiness = [...this.happinessType];
        this.filterNameFormGroup.controls['happiness'].patchValue([...this.happinessType.map(item => item), 0])
      }
      else{
        this.selectedHappiness = [];
        this.filterNameFormGroup.controls['happiness'].setValue('');
      }
    }
    if(type == 'risk'){
      if(this.allRiskSelected.selected){
        this.selectedRisks = [...this.riskType];
        this.filterNameFormGroup.controls['risk'].patchValue([...this.riskType.map(item => item), 0])
      }
      else{
        this.selectedRisks = [];
        this.filterNameFormGroup.controls['risk'].setValue('');
      }
    }
    if(type == 'action'){
      if(this.allActionSelected.selected){
        this.selectedActions = [...this.actions];
        this.filterNameFormGroup.controls['action'].patchValue([...this.actions.map(item => item), 0])
      }
      else{
        this.selectedActions = [];
        this.filterNameFormGroup.controls['action'].setValue('');
      }
    }
    if(type == 'actionrequired'){
      if(this.allActionRequiredSelected.selected){
        this.selectedActionRequireds = [...this.actionsrequired];
        this.filterNameFormGroup.controls['actionrequired'].patchValue([...this.actionsrequired.map(item => item), 0])
      }
      else{
        this.selectedActionRequireds = [];
        this.filterNameFormGroup.controls['actionrequired'].setValue('');
      }
    }
    if(type == 'empstatus'){
      if(this.allEmpStatusSelected.selected){
        this.filterNameFormGroup.controls['empstatus'].patchValue([...this.empstatusType.map(item => item), 2])
      }
      else{
        this.filterNameFormGroup.controls['empstatus'].setValue('');
      }
    }
    if(type == 'sublocation'){
      if(this.allSubLocSelected.selected){
        this.selectedSubLocations = [...this.sublocations];
        this.filterNameFormGroup.controls['sublocation'].patchValue([...this.sublocations.map(item => item), 0])
      }
      else{
        this.selectedSubLocations = [];
        this.filterNameFormGroup.controls['sublocation'].setValue('');
      }
    }
    if(type == 'function'){
      if(this.allFuncSelected.selected){
        this.selectedFunctions = [...this.functions];
        this.filterNameFormGroup.controls['function'].patchValue([...this.functions.map(item => item), 0])
      }
      else{
        this.selectedFunctions = [];
        this.filterNameFormGroup.controls['function'].setValue('');
      }
    }
    if(type == 'department'){
      if(this.allDepartmentSelected.selected){
        this.selectedDepartments = [...this.departments];
        this.filterNameFormGroup.controls['department'].patchValue([...this.departments.map(item => item), 0])
      }
      else{
        this.selectedDepartments = [];
        this.filterNameFormGroup.controls['department'].setValue('');
      }
    }
    if(type == 'subdepartment'){
      if(this.allSubDepartmentSelected.selected){
        this.selectedSubDepartments = [...this.subdepartments];
        this.filterNameFormGroup.controls['subdepartment'].patchValue([...this.subdepartments.map(item => item), 0])
      }
      else{
        this.selectedSubDepartments = [];
        this.filterNameFormGroup.controls['subdepartment'].setValue('');
      }
    }
    if(type == 'role'){
      if(this.allRoleSelected.selected){
        this.selectedRoles = [...this.roles];
        this.filterNameFormGroup.controls['role'].patchValue([...this.roles.map(item => item), 0])
      }
      else{
        this.selectedRoles = [];
        this.filterNameFormGroup.controls['role'].setValue('');
      }
    }
    if(type == 'band'){
      if(this.allBandSelected.selected){
        this.selectedBands = [...this.bands];
        this.filterNameFormGroup.controls['band'].patchValue([...this.bands.map(item => item), 0])
      }
      else{
        this.selectedBands = [];
        this.filterNameFormGroup.controls['band'].setValue('');
      }
    }
    if(type == 'bu'){
      if(this.allBUSelected.selected){
        this.selectedBusinessUnits = [...this.businessunit];
        this.filterNameFormGroup.controls['bu'].patchValue([...this.businessunit.map(item => item), 0])
      }
      else{
        this.selectedBusinessUnits = [];
        this.filterNameFormGroup.controls['bu'].setValue('');
      }
    }
    if(type == 'branch'){
      if(this.allBranchSelected.selected){
        this.selectedBranches = [...this.branches];
        this.filterNameFormGroup.controls['branch'].patchValue([...this.branches.map(item => item), 0])
      }
      else{
        this.selectedBranches = [];
        this.filterNameFormGroup.controls['branch'].setValue('');
      }
    }
    if(type == 'intname'){
      if(this.allIntNameSelected.selected){
        this.selectedIntnames = [...this.intnames];
        this.filterNameFormGroup.controls['intname'].patchValue([...this.intnames.map(item => item), 0])
      }
      else{
        this.selectedIntnames = [];
        this.filterNameFormGroup.controls['intname'].setValue('');
      }
    }
    if(type == 'gender'){
      if(this.allGenderSelected.selected){
        this.filterNameFormGroup.controls['gender'].patchValue([...this.genderlist.map(item => item), 0])
      }
      else{
        this.filterNameFormGroup.controls['gender'].setValue('');
      }
    }
    if(type == 'designation'){
      if(this.allDesignationSelected.selected){
        this.selectedDesignations = [...this.designations];
        this.filterNameFormGroup.controls['designation'].patchValue([...this.designations.map(item => item), 0])
      }
      else{
        this.selectedDesignations = [];
        this.filterNameFormGroup.controls['designation'].setValue('');
      }
    }
    if(type == 'zone'){
      if(this.allZoneSelected.selected){
        this.selectedZones = [...this.zones];
        this.filterNameFormGroup.controls['zone'].patchValue([...this.zones.map(item => item), 0])
      }
      else{
        this.selectedZones = [];
        this.filterNameFormGroup.controls['zone'].setValue('');
      }
    }
  }

  removeTableParam(type){
    if(type == 'location'){
      this.filterNameFormGroup.controls['location'].setValue('');
      this.getFilterOnLocation()
    }
    if(type == 'company'){
      this.filterNameFormGroup.controls['company'].setValue('');
      this.getFilterOnCompany()
    }
    if(type == 'assignedto'){
      this.filterNameFormGroup.controls['assignedto'].setValue('');
      this.getFilterOnAssignedTo()
    }
    if(type == 'assignedby'){
      this.filterNameFormGroup.controls['assignedby'].setValue('');
      this.getFilterOnAssignedBy()
    }
    if(type == 'manager'){
      this.filterNameFormGroup.controls['manager'].setValue('');
      this.getFilterOnManager()
    }
    if(type == 'hrspoc'){
      this.filterNameFormGroup.controls['hrspoc'].setValue('');
      this.getFilterOnHR()
    }
    if(type == 'stage'){
      this.filterNameFormGroup.controls['stage'].setValue('');
      this.getFilterOnStage()
    }
    if(type =='enpsstatus'){
      this.filterNameFormGroup.controls['enpsstatus'].setValue('');
      this.getFilterOnEnps()
    }
    if(type =='empstatus'){
      this.filterNameFormGroup.controls['empstatus'].setValue('');
      this.getFilterOnEmpStatus()
    }
    if(type == 'engagement'){
      this.filterNameFormGroup.controls['engagement'].setValue('');
      this.getFilterOnEngagement()
    }
    if(type == 'happiness'){
      this.filterNameFormGroup.controls['happiness'].setValue('');
      this.getFilterOnHappiness()
    }
    if(type == 'risk'){
      this.filterNameFormGroup.controls['risk'].setValue('');
      this.getFilterOnRisk()
    }
    if(type == 'action'){
      this.filterNameFormGroup.controls['action'].setValue('');
      this.getFilterOnAction()
    }
    if(type == 'actionrequired'){
      this.filterNameFormGroup.controls['actionrequired'].setValue('');
      this.getFilterOnActionRequired()
    }
    if(type == 'senton'){
      this.highlightSentOn = false;
      this.updateData('removefilter');
    }
    if(type == 'completedon'){
      this.highlightCompletedOn = false;
      this.updateData('removefilter');
    }
    if(type == 'assigneddate'){
      this.highlightAssignedDate = false;
      this.updateData('removefilter');
    }
    if(type == 'sublocation'){
      this.filterNameFormGroup.controls['sublocation'].setValue('');
      this.getFilterOnSubLocation()
    }
    if(type == 'function'){
      this.filterNameFormGroup.controls['function'].setValue('');
      this.getFilterOnFunc()
    }
    if(type == 'department'){
      this.filterNameFormGroup.controls['department'].setValue('');
      this.getFilterOnDepartment()
    }
    if(type == 'subdepartment'){
      this.filterNameFormGroup.controls['subdepartment'].setValue('');
      this.getFilterOnSubDepartment()
    }
    if(type == 'role'){
      this.filterNameFormGroup.controls['role'].setValue('');
      this.getFilterOnRole()
    }
    if(type == 'band'){
      this.filterNameFormGroup.controls['band'].setValue('');
      this.getFilterOnBand()
    }
    if(type == 'bu'){
      this.filterNameFormGroup.controls['bu'].setValue('');
      this.getFilterOnBU()
    }
    if(type == 'branch'){
      this.filterNameFormGroup.controls['branch'].setValue('');
      this.getFilterOnBranch()
    }
    if(type == 'intname'){
      this.filterNameFormGroup.controls['intname'].setValue('');
      this.getFilterOnIntName()
    }
    if(type == 'gender'){
      this.filterNameFormGroup.controls['gender'].setValue('');
      this.getFilterOnGender()
    }
    if(type == 'designation'){
      this.filterNameFormGroup.controls['designation'].setValue('');
      this.getFilterOnDesignation()
    }
    if(type == 'zone'){
      this.filterNameFormGroup.controls['zone'].setValue('');
      this.getFilterOnZone()
    }
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

  sortByKey<T>(array: T[], key: keyof T): T[] {
    return array.sort((a, b) => {
      const valueA = a[key].toString().toLowerCase();
      const valueB = b[key].toString().toLowerCase();
      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  customSort(array: any[]): any[] {
    const trigger1Array = array.filter(item => item.IntTriggerID === 1);
    const otherTriggerArray = array.filter(item => item.IntTriggerID !== 1);
  
    const sortedTrigger1Array = trigger1Array.sort((a, b) => {
      const logicA = Number(a.Logic);
      const logicB = Number(b.Logic);
      return logicA - logicB;
    });
  
    const sortedOtherTriggerArray = otherTriggerArray.sort((a, b) => {
      const nameA = a.IntTypeName.toLowerCase();
      const nameB = b.IntTypeName.toLowerCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });

    return sortedTrigger1Array.concat(sortedOtherTriggerArray);
  }
}