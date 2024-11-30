import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnDestroy,ViewChild } from '@angular/core';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { MatLegacyOption } from '@angular/material/legacy-core';
import { DateFilterComponent } from '../../modals/date-filter/date-filter.component';
import { DashboardService, FilterConstants } from '@lib/umwelt-lib';
import { ComboChart, Category, Dataset, Data } from '../../../charts/combo-chart/combo-chart';
import { ENPSComboChartData, HappinessComboChartData, ENPSStackedBarChartData, ENPSMSLINECHARTData, ENPSStackedColumn2dChartData, HappinessMSLINECHARTData, HappinessStackedColumn2dChartData, HappinessStackedBarChartData, HRComboChartData, EngagmentMSLINECHARTData, EngagmentStackedColumn2dChartData, EngagmentStackedBarChartData, FlightChartStackedBarChartData, FlightComboChartData, FlightChartMSLINECHARTData, FlightChartMSColumn2dChartData, EnpsPie2dCHartData, HappinessPie2dCHartData, HrPie2dCHartData } from '../../../charts/chart-enums/chart-enums';
import { ENPSComboChartScoreData,ENPSMSLINECHARTScoreData,ENPSStackedColumn2dChartScoreData,HappinessComboChartScoreData,HappinessMSLINECHARTScoreData,HappinessStackedColumn2dChartScoreData,HRComboChartScoreData,EngagmentMSLINECHARTScoreData,EngagmentStackedColumn2dChartScoreData,EngagmentStackedBarChartFactorData } from '../../../charts/chart-enums/chart-enums';
import { ENPSStackedBarChartScoreData,HappinessStackedBarCharScoretData,EngagmentStackedBarChartScoreData,EngagmentStackedBarChartFactorScoreData } from '../../../charts/chart-enums/chart-enums';
import { StackedBar2d } from '../../../charts/stackedbar2d/stackedbar2d';
import { MsLine, MSLineDataSet } from '../../../charts/line-chart/msline';
import { StackedColumn2d } from '../../../charts/stacked-column2d/stackedColumn2d';
import { MsColumn2d } from '../../../charts/multi-series-column-chart2d/msColumn2d';
import { Pie2d, DataPie } from '../../../charts/pie2d/pie-2d';
import { Subscription } from 'rxjs';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '@lib/umwelt-lib';
import { FilterlistService } from '@lib/umwelt-lib';

const Filters = {
  EMPLOYEESTATUS :'Employee Status',
  GENDER :'Gender',
  FUNCTION : JSON.parse(localStorage.getItem('List')).FuncID,
  DEPARTMENT : JSON.parse(localStorage.getItem('List')).DeptID,
  SUBDEPARTMENT : JSON.parse(localStorage.getItem('List')).SubDeptID,
  COMPANY : JSON.parse(localStorage.getItem('List')).CompanyID,
  ROLE : JSON.parse(localStorage.getItem('List')).RoleID,
  ZONE : JSON.parse(localStorage.getItem('List')).ZoneID,
  LOCATION : JSON.parse(localStorage.getItem('List')).LocID,
  SUBLOCATION : JSON.parse(localStorage.getItem('List')).SubLocID,
  BAND : JSON.parse(localStorage.getItem('List')).BandID,
  BUSINESSUNIT : JSON.parse(localStorage.getItem('List')).BusinessUnitID,
  BRANCH : JSON.parse(localStorage.getItem('List')).BranchID,
  MANAGER : JSON.parse(localStorage.getItem('List')).Manager,
  HRSPOC : JSON.parse(localStorage.getItem('List')).HRSpoc,
  INTTYPE : JSON.parse(localStorage.getItem('List')).IntTypeID,
  INTNAME : 'Intervention Name',
}
@Component({
  selector: 'app-multi-chart',
  templateUrl: './multi-chart.component.html',
  styleUrls: ['./multi-chart.component.scss']
})
export class MultiChartComponent implements OnInit, OnDestroy {
  @Input() type: string = 'hr';
  @Input() filters = [];
  filter: any;
  list = JSON.parse(localStorage.getItem('List'));
  @Output() filterEvent = new EventEmitter<any>();
  @Output() filtersEvent = new EventEmitter<any>();
  @Input() empType;
  comboChart: ComboChart;
  comboChartScore: ComboChart;
  msline: MsLine;
  mslineScore: MsLine;
  stackedColumn2d: StackedColumn2d;
  stackedColumn2dScore: StackedColumn2d;
  msColumn2d: MsColumn2d;
  stackedBar2d: StackedBar2d;
  stackedBar2dScore: StackedBar2d;
  pie2d: Pie2d;
  months = FilterConstants.getMonths();
  quarters = FilterConstants.getQuarters();
  periods = FilterConstants.getPeriods();
  isLoadingResults = true;
  isLoadingResultsStackedBar = true;
  isDataFound = true;
  subscriptions: Subscription[] = [];
  filtersName = Object.keys(Filters).map(key => Filters[key]);
  displayEmp:boolean = false;
  displayGender:boolean = false;
  displayFunc:boolean = true;
  displayCompany:boolean = true;
  displayDepart:boolean = true;
  displaySubdepart:boolean = false;
  displayRole:boolean = true;
  displayLoc:boolean = true;
  displaySubloc:boolean = false;
  displayBand:boolean = true;
  displayBusinessunit:boolean = false;
  displayBranch:boolean = false;
  displayManager:boolean = true;
  displayHR:boolean = true;
  displayInt:boolean = false;
  displayIntName:boolean = true;
  displayZone:boolean = false;

  filterFormGroup: FormGroup;
  filterNameFormGroup: FormGroup;
  // displayedFilter = ["function","company","department","role","location","band","manager","hrspoc","intname"]
  displayedFilter = [this.list.FuncID,this.list.CompanyID,this.list.DeptID,this.list.RoleID,this.list.LocID,this.list.BandID,this.list.Manager,this.list.HRSpoc,Filters['INTNAME']]
  searchTextEmp;searchTextGender;searchTextFunc= '';searchTextDepart= '';searchTextSubdepart= '';searchTextRole= '';searchTextLoc= '';searchTextSubloc= '';searchTextBand= '';searchTextBusinessunit= '';searchTextBranch= '';searchTextCompany= '';searchTextManager= '';searchTextHr= '';searchTextInt= '';searchTextIntName='';searchTextZone='';
  highlightEmp = false;highlightGender = false;highlightFunc = false;highlightComp = false;highlightDepart = false;highlightSubdepart = false;highlightRole = false;highlightLocation = false;highlightSublocation = false;highlightBand = false;highlightBusinessunit = false;highlightBranch = false;highlightManager = false;highlightHR = false;highlightInt = false;highlightIntName = false;highlightZone = false;
  selectedCompanies: any[] = []; selectedFunctions: any[] = []; selectedDepartments: any[] = []; selectedSubDepartments: any[] = []; selectedRoles: any[] = []; selectedLocations: any[] = []; selectedSubLocations: any[] = []; selectedBands: any[] = []; selectedBusinessUnits: any[] = []; selectedBranches: any[] = []; selectedManagers: any[] = []; selectedHrspocs: any[] = []; selectedInttypes: any[] = []; selectedIntnames: any[] = []; selectedZones: any[] = [];
  filterArray = [];
  count = 0;
  name='';
  HRSPOCS = [];
  managers = [];
  duplicatesHR = [];
  duplicatesManager = [];
  assignedtos = [];
  bands;locations;sublocations;businessunits;branches;roles;departments;subdepartments;functions;companies;inttypes;intnames;zones;
  @Output() dataPlotClickEvent = new EventEmitter<any>();
  graphs = [{
    name: "Combo",
    type: "combo"
  }, {
    name: "Line",
    type: "line"
  }, {
    name: "Bar",
    type: "bar"
  },{
    name:"Pie",
    type: "pie"
  }];
  graphType = 'combo';
  @ViewChild('allHrSelected',{static: false}) private allHrSelected: MatLegacyOption;
  @ViewChild('allMgrSelected',{static: false}) private allMgrSelected: MatLegacyOption;
  @ViewChild('allBandSelected',{static: false}) private allBandSelected: MatLegacyOption;
  @ViewChild('allBusinessunitSelected',{static: false}) private allBusinessunitSelected: MatLegacyOption;
  @ViewChild('allBranchSelected',{static: false}) private allBranchSelected: MatLegacyOption;
  @ViewChild('allLocSelected',{static: false}) private allLocSelected: MatLegacyOption;
  @ViewChild('allSublocSelected',{static: false}) private allSublocSelected: MatLegacyOption;
  @ViewChild('allRoleSelected',{static: false}) private allRoleSelected: MatLegacyOption;
  @ViewChild('allDeptSelected',{static: false}) private allDeptSelected: MatLegacyOption;
  @ViewChild('allSubdeptSelected',{static: false}) private allSubdeptSelected: MatLegacyOption;
  @ViewChild('allFuncSelected',{static: false}) private allFuncSelected: MatLegacyOption;
  @ViewChild('allCompanySelected',{static: false}) private allCompanySelected: MatLegacyOption;
  @ViewChild('allInttypeSelected',{static: false}) private allInttypeSelected: MatLegacyOption;
  @ViewChild('allEmpStatusSelected',{static: false}) private allEmpStatusSelected: MatLegacyOption;
  @ViewChild('allGenderSelected',{static: false}) private allGenderSelected: MatLegacyOption;
  @ViewChild('allIntnameSelected',{static: false}) private allIntnameSelected: MatLegacyOption;
  @ViewChild('allZoneSelected',{static: false}) private allZoneSelected: MatLegacyOption;

  toggle = false;
  chartButton = 'View Score'
  scoreParam = {};
  tenureScoreParam = {};
  tenureChartTypes = [{'name':'View by Stages','value':'tenure'},{'name':'View by Factors','value':'factor'}]
  tenureChartType = 'tenure'
  tenureCaption = '';
  tenureSubCaption = '';
  tenureScoreCaption = '';
  isChartData = true;
  isStageChartData = true;
  displaySubCaption
  constructor(private dialog: MatLegacyDialog, private dashboardService: DashboardService,private formBuilder: FormBuilder,private auth: AuthService, private filterlistService: FilterlistService) {
    this.auth.setCurrentPage('dashboard')
  }

  ngOnDestroy(){
    this.subscriptions.forEach(
      item => {
        item.unsubscribe();
      }
    )
  }

  getFilterName(key){
    return key;
  }

  removeFilter(key){
    if(key == 'Employee Status'){ this.displayEmp = this.displayEmp ? false : true;}
    else if(key == 'Gender'){ this.displayGender = this.displayGender ? false : true;}
    else if(key == this.list.FuncID){ this.displayFunc = this.displayFunc ? false : true;}
    else if(key == this.list.CompanyID){ this.displayCompany = this.displayCompany ? false : true;}
    else if(key == this.list.DeptID){ this.displayDepart = this.displayDepart ? false : true;}
    else if(key == this.list.SubDeptID){ this.displaySubdepart = this.displaySubdepart ? false : true;}
    else if(key == this.list.RoleID){ this.displayRole = this.displayRole ? false : true;}
    else if(key == this.list.LocID){ this.displayLoc = this.displayLoc ? false : true;}
    else if(key == this.list.SubLocID){ this.displaySubloc = this.displaySubloc ? false : true;}
    else if(key == this.list.BandID){ this.displayBand = this.displayBand ? false : true;}
    else if(key == this.list.BusinessUnitID){ this.displayBusinessunit = this.displayBusinessunit ? false : true;}
    else if(key == this.list.BranchID){ this.displayBranch = this.displayBranch ? false : true;}
    else if(key == this.list.Manager){ this.displayManager = this.displayManager ? false : true;}
    else if(key == this.list.HRSpoc){ this.displayHR = this.displayHR ? false : true;}
    else if(key == this.list.IntTypeID){ this.displayInt = this.displayInt ? false : true;}
    else if(key == this.list.ZoneID){ this.displayZone = this.displayZone ? false : true;}
    else if(key == 'Intervention Name'){ this.displayIntName = this.displayIntName ? false : true;}
  }

  // changeInput(value,type){
  //   if(value.data == null){
  //     if(type == 'function'){this.searchTextFunc =  this.searchTextFunc.slice(0, this.searchTextFunc.length - 1)}
  //     else if(type == 'company'){this.searchTextCompany =  this.searchTextCompany.slice(0, this.searchTextCompany.length - 1)}
  //     else if(type == 'department'){this.searchTextDepart = this.searchTextDepart.slice(0, this.searchTextDepart.length - 1)}
  //     else if(type == 'subdepartment'){this.searchTextSubdepart = this.searchTextSubdepart.slice(0, this.searchTextSubdepart.length - 1)}
  //     else if(type == 'role'){this.searchTextRole =  this.searchTextRole.slice(0, this.searchTextRole.length - 1)}
  //     else if(type == 'location'){this.searchTextLoc =  this.searchTextLoc.slice(0, this.searchTextLoc.length - 1)}
  //     else if(type == 'sublocation'){this.searchTextSubloc =  this.searchTextSubloc.slice(0, this.searchTextSubloc.length - 1)}
  //     else if(type == 'band'){this.searchTextBand =  this.searchTextBand.slice(0, this.searchTextBand.length - 1)}
  //     else if(type == 'businessunit'){this.searchTextBusinessunit =  this.searchTextBusinessunit.slice(0, this.searchTextBusinessunit.length - 1)}
  //     else if(type == 'branch'){this.searchTextBranch =  this.searchTextBranch.slice(0, this.searchTextBranch.length - 1)}
  //     else if(type == 'manager'){this.searchTextManager =  this.searchTextManager.slice(0, this.searchTextManager.length - 1)}
  //     else if(type == 'hrspoc'){this.searchTextHr =  this.searchTextHr.slice(0, this.searchTextHr.length - 1)}
  //     else if(type == 'inttype'){this.searchTextInt =  this.searchTextInt.slice(0, this.searchTextInt.length - 1)}
  //     else if(type == 'inttname'){this.searchTextIntName =  this.searchTextIntName.slice(0, this.searchTextIntName.length - 1)}
  //     else if(type == 'zone'){this.searchTextZone =  this.searchTextZone.slice(0, this.searchTextZone.length - 1)}
  //   }
  //   else{
  //     if(type == 'function'){this.searchTextFunc = this.searchTextFunc+value.data}
  //     else if(type == 'company'){this.searchTextCompany = this.searchTextCompany+value.data}
  //     else if(type == 'department'){this.searchTextDepart = this.searchTextDepart+value.data}
  //     else if(type == 'subdepartment'){this.searchTextSubdepart = this.searchTextSubdepart+value.data}
  //     else if(type == 'role'){this.searchTextRole = this.searchTextRole+value.data}
  //     else if(type == 'location'){this.searchTextLoc = this.searchTextLoc+value.data}
  //     else if(type == 'sublocation'){this.searchTextSubloc = this.searchTextSubloc+value.data}
  //     else if(type == 'band'){this.searchTextBand = this.searchTextBand+value.data}
  //     else if(type == 'businessunit'){this.searchTextBusinessunit = this.searchTextBusinessunit+value.data}
  //     else if(type == 'branch'){this.searchTextBranch = this.searchTextBranch+value.data}
  //     else if(type == 'manager'){this.searchTextManager = this.searchTextManager+value.data}
  //     else if(type == 'hrspoc'){this.searchTextHr = this.searchTextHr+value.data}
  //     else if(type == 'inttype'){this.searchTextInt = this.searchTextInt+value.data}
  //     else if(type == 'inttname'){this.searchTextIntName = this.searchTextIntName+value.data}
  //     else if(type == 'zone'){this.searchTextZone = this.searchTextZone+value.data}
  //   }
  // }

  changeInput(event: Event, type) {
    const inputElement = event.target as HTMLInputElement;
    if (type == 'company') {this.searchTextCompany = inputElement.value;}
    else if (type == 'department') {this.searchTextDepart = inputElement.value;}
    else if(type == 'function'){this.searchTextFunc = inputElement.value;}
    else if(type == 'subdepartment'){this.searchTextSubdepart = inputElement.value;}
    else if(type == 'role'){this.searchTextRole = inputElement.value;}
    else if(type == 'location'){this.searchTextLoc = inputElement.value;}
    else if(type == 'sublocation'){this.searchTextSubloc = inputElement.value;}
    else if(type == 'band'){this.searchTextBand = inputElement.value;}
    else if(type == 'businessunit'){this.searchTextBusinessunit = inputElement.value;}
    else if(type == 'branch'){this.searchTextBranch = inputElement.value;}
    else if(type == 'manager'){this.searchTextManager = inputElement.value;}
    else if(type == 'hrspoc'){this.searchTextHr = inputElement.value;}
    else if(type == 'inttype'){this.searchTextInt = inputElement.value;}
    else if(type == 'intname'){this.searchTextIntName = inputElement.value;}
    else if(type == 'zone'){this.searchTextZone = inputElement.value;}
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
      this.filterNameFormGroup.controls['businessunit'].patchValue(this.selectedBusinessUnits)
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
      this.filterNameFormGroup.controls['inttype'].patchValue(this.selectedInttypes)
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
  }

  toggleAllSelection(type) {
    if(type == 'empstatus'){
      if(this.allEmpStatusSelected.selected){
        let empStatus = ["2", "1", "0"];
        this.filterNameFormGroup.controls['empstatus'].patchValue(empStatus)
      }
      else{
        this.filterNameFormGroup.controls['empstatus'].setValue('');
      }
    }
    if(type == 'gender'){
      if(this.allGenderSelected.selected){
        let genderlist = ["-1", "male", "female", "transgender"];
        this.filterNameFormGroup.controls['gender'].patchValue(genderlist)
      }
      else{
        this.filterNameFormGroup.controls['gender'].setValue('');
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
    if(type == 'department'){
      if(this.allDeptSelected.selected){
        this.selectedDepartments = [...this.departments];
        this.filterNameFormGroup.controls['department'].patchValue([...this.departments.map(item => item), 0])
      }
      else{
        this.selectedDepartments = [];
        this.filterNameFormGroup.controls['department'].setValue('');
      }
    }
    if(type == 'subdepartment'){
      if(this.allSubdeptSelected.selected){
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
        this.selectedRoles = [...this.roles]
        this.filterNameFormGroup.controls['role'].patchValue([...this.roles.map(item => item), 0])
      }
      else{
        this.selectedRoles = [];
        this.filterNameFormGroup.controls['role'].setValue('');
      }
    }
    if(type == 'location'){
      if(this.allLocSelected.selected){
        this.selectedLocations = [...this.locations]
        this.filterNameFormGroup.controls['location'].patchValue([...this.locations.map(item => item), 0])
      }
      else{
        this.selectedLocations = [];
        this.filterNameFormGroup.controls['location'].setValue('');
      }
    }
    if(type == 'sublocation'){
      if(this.allSublocSelected.selected){
        this.selectedSubLocations = [...this.sublocations];
        this.filterNameFormGroup.controls['sublocation'].patchValue([...this.sublocations.map(item => item), 0])
      }
      else{
        this.selectedSubLocations = [];
        this.filterNameFormGroup.controls['sublocation'].setValue('');
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
    if(type == 'businessunit'){
      if(this.allBusinessunitSelected.selected){
        this.selectedBusinessUnits = [...this.businessunits];
        this.filterNameFormGroup.controls['businessunit'].patchValue([...this.businessunits.map(item => item), 0])
      }
      else{
        this.selectedBusinessUnits = [];
        this.filterNameFormGroup.controls['businessunit'].setValue('');
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
        this.selectedHrspocs = [...this.HRSPOCS];
        this.filterNameFormGroup.controls['hrspoc'].patchValue([...this.HRSPOCS.map(item => item), 0]);
      } else {
        this.selectedHrspocs = [];
        this.filterNameFormGroup.controls['hrspoc'].setValue('');
      }
    }
    if(type == 'inttype'){
      if(this.allInttypeSelected.selected){
        this.selectedInttypes = [...this.inttypes];
        this.filterNameFormGroup.controls['inttype'].patchValue([...this.inttypes.map(item => item), 0])
      }
      else{
        this.selectedInttypes = [];
        this.filterNameFormGroup.controls['inttype'].setValue('');
      }
    }
    if(type == 'intname'){
      if(this.allIntnameSelected.selected){
        this.selectedIntnames = [...this.intnames];
        this.filterNameFormGroup.controls['intname'].patchValue([...this.intnames.map(item => item), 0])
      }
      else{
        this.selectedIntnames = [];
        this.filterNameFormGroup.controls['intname'].setValue('');
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

  initFilter() {
    let years = [];

    let currentYear = (new Date()).getFullYear();
    for (let i = 2018; i <= currentYear; i++) {
      years.push({
        id: i.toString(),
        name: i.toString()
      });
    }

    let currentDate = new Date();
    let currMonth = currentDate.getMonth() + 1;
    let currQuarter = 1;
    if(currMonth == 1 || currMonth == 2 || currMonth == 3){currQuarter = 1}
    if(currMonth == 4 || currMonth == 5 || currMonth == 6){currQuarter = 2}
    if(currMonth == 7 || currMonth == 8 || currMonth == 9){currQuarter = 3}
    if(currMonth == 10 || currMonth == 11 || currMonth == 12){currQuarter = 4}
    this.filter = {
      monthEnd: (currentDate.getMonth() + 1).toString(),
      monthStart: (currMonth >= 6 ? currMonth - 5 : 7 + currMonth).toString(),
      quarterEnd: currQuarter.toString(),
      quarterStart: currQuarter==1 ? "4":(currQuarter-1).toString(),
      type: "1",
      yearEnd: years[years.length - 1].id,
      yearStart:  currMonth >= 6 ? years[years.length - 1].id : years[years.length - 2].id,
      yearStartQuart: currMonth > 3 ? years[years.length - 1].id : years[years.length - 2].id,
      dateFilterBy: 'StartTime'
    }
    this.filterEvent.emit(this.filter);
  }

  ngOnInit() {
        this.list = JSON.parse(localStorage.getItem('List'));
        this.filterFormGroup = new FormGroup({});
        this.filtersName.forEach(
          filter =>{
            this.filterFormGroup.addControl(filter,new FormControl(this.displayedFilter.indexOf(filter) !== -1));
          }
        )

        this.filterNameFormGroup = this.formBuilder.group({
          'empstatus':[''],'gender':[''],'function': [''], 'department': [''], 'subdepartment': [''], 'role': [''], 'location': [''], 'sublocation': [''], 'band': [''], 'businessunit': [''], 'branch': [''], 'manager': [''], 'company':[''],
          'hrspoc': [''],'inttype':[''],'intname':[''],'zone':['']
        });
  }

  spaceKeyDown(event){}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(!this.filter){
      this.initFilter();
      this.getValuesForComboChart();
      this.getValuesForStackedBarChart();
    }
    this.displaySubCaption = this.getSubCaption1()
    this.count = this.count+1;
    if(this.count>1){
      return;
    }
    let enpsCount = this.dashboardService.enpsCount;
    if(changes['type'].currentValue != 'hr'){
      let element = document.getElementById('targetGraph');
      element.scrollIntoView({block: 'nearest'});
    }
    else{
      if(enpsCount>0){
        let element = document.getElementById('targetGraph');
        element.scrollIntoView({block: 'nearest'});
      }
      this.dashboardService.increaseEnpsCount();
    }
    let details = JSON.parse(atob(sessionStorage.getItem('details')));
      this.filterlistService.fetchFilterlistData(details.empcode,this.empType).then((data: any) => {
        this.filterArray = JSON.parse(JSON.stringify(data));
        this.bands = this.sortByKey(this.filterArray['band'], 'Band');
        this.locations = this.sortByKey(this.filterArray['location'], 'LocName');
        this.sublocations = this.sortByKey(this.filterArray['sublocation'], 'SubLocName');
        this.roles = this.sortByKey(this.filterArray['role'], 'Role');
        this.businessunits = this.sortByKey(this.filterArray['businessunit'], 'BusinessUnitName');
        this.branches = this.sortByKey(this.filterArray['branch'], 'BranchName');
        this.departments = this.sortByKey(this.filterArray['department'], 'DeptName');
        this.subdepartments = this.sortByKey(this.filterArray['subdepartment'], 'SubDeptName');
        this.functions = this.sortByKey(this.filterArray['function'], 'FuncName');
        this.companies = this.sortByKey(this.filterArray['company'], 'CompanyName');
        this.inttypes = this.customSort(this.filterArray['inttype']);
        this.intnames = this.filterArray['intervention'];
        this.assignedtos = this.sortByKey(this.filterArray['assigned_to'], 'HRSpoc');
        this.zones = this.sortByKey(this.filterArray['zone'], 'Zone');
        let i = 0;
        this.filterArray['hr'].forEach(obj =>{
          this.HRSPOCS[i] = this.getHRSPOC(obj);
          i++;
        }) 
        this.HRSPOCS = this.HRSPOCS.filter(x => x !== undefined);     
        localStorage.setItem('HrspocList', JSON.stringify(this.HRSPOCS))

        let j = 0;
        this.filterArray['manager'].forEach(obj =>{
          this.managers[j] = this.getManager(obj);
          j++;
        })
        this.managers = this.managers.filter(x => x !== undefined);
        localStorage.setItem('ManagerList', JSON.stringify(this.managers))

        this.companies = this.companies.filter(x => x !== undefined);     
        localStorage.setItem('CompanyList', JSON.stringify(this.companies))
      }
    )
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

  changeFilter() {
    let dateFilterModal = this.dialog.open(DateFilterComponent, {
      panelClass: 'dialog-padding-0',
      width: '435px',
      height: '520px',
      data: {
        value: this.filter,
        type: 'chart'
      }
    });

    dateFilterModal.afterClosed().subscribe(
      res => {
        if (res) {
          this.filter = res;
          this.filterEvent.emit(res);
          this.displaySubCaption = this.getSubCaption1()
          this.getValuesForComboChart();
          this.getValuesForStackedBarChart()
          this.filterEvent.emit(this.filter);
        }
      }
    )
  }

  getValuesForStackedBarChart() {
    this.isLoadingResultsStackedBar = true;
    let param = {};
    param['charttype'] = '';
    param['labelType'] = this.filter.type;
    param['chartParams'] = { fields: [] };
    this.tenureScoreParam['chartParams'] = { fields: [] };
    this.tenureScoreParam['labelType'] = this.filter.type
    let labels = [];
    this.subscriptions.push(
      this.dashboardService.getStages().subscribe(
        res => {
          if (res) {
            JSON.parse(JSON.stringify(res)).forEach(
              item => {
                let label = {};
                label['value'] = item['Name'];
                label['fields'] = [
                  {
                    id: "ConvCompleted",
                    value: "yes"
                  },
                  {
                    id: "TenureName",
                    value: item['Name']
                  }
                ]
                labels.push(label);
                // this.setFilterValueForStackedChart(label);
              }
            )
            let filterFields = this.getFilterParam();
            filterFields.forEach(
              filter => {
                param['chartParams']['fields'].push(filter);
                this.tenureScoreParam['chartParams']['fields'].push(filter);
              }
            )
            param['labels'] = labels;
            param['StartMonth'] = this.scoreParam['StartMonth'];
            param['StartYear'] = this.scoreParam['StartYear'];
            param['EndMonth'] = this.scoreParam['EndMonth'];
            param['EndYear'] = this.scoreParam['EndYear'];
            param['DateFilterBy']= this.filter.dateFilterBy;
            this.tenureScoreParam['labels'] = labels;
            this.tenureScoreParam['StartMonth'] = this.scoreParam['StartMonth'];
            this.tenureScoreParam['StartYear'] = this.scoreParam['StartYear'];
            this.tenureScoreParam['EndMonth'] = this.scoreParam['EndMonth'];
            this.tenureScoreParam['EndYear'] = this.scoreParam['EndYear'];
            this.tenureScoreParam['DateFilterBy'] = this.scoreParam['DateFilterBy'];
            switch (this.type) {
              case 'enps':
                param['keys'] = FilterConstants.getEnpsKeys();
                break;
  
              case 'happiness':
                param['keys'] = FilterConstants.getHappinessKeys();
                break;
              case 'hr':
                param['keys'] = FilterConstants.getHrKeys();
                break;
              case 'flight':
                param['keys'] = FilterConstants.getFlightTenureKeys();
                break;
            }
            let details = JSON.parse(atob(sessionStorage.getItem('details')));
            param["empCode"] = details.empcode;
            param["empType"] = this.empType;
            this.tenureScoreParam["empCode"] = details.empcode;
            this.tenureScoreParam["empType"] = this.empType;
            this.dashboardService.getChartValues(param).subscribe(
              res => {
                if(res['total'] == 0){
                  this.isLoadingResultsStackedBar = false;
                }
                this.updateStackedBarChart(res);
                if(res['len'] == 0){
                  this.isStageChartData = false;
                }else{
                  this.isStageChartData = true;
                }
                this.isLoadingResultsStackedBar = false;
              },
              error => {
                this.isLoadingResultsStackedBar = false;
              }
            )
            if(this.type != 'flight'){
              this.getTenureScoreChart();
            }
          }
        }
      )
    )
  }

  setFilterValueForStackedChart(label){
    this.filters.forEach(
      filter => {
        //Function
        if (filter.filterType == 'function') {
          label['fields'].push({
            id: "FuncID",
            value: (filter.filterValue).toString()
          })
        }
        //Company
        if (filter.filterType == 'company') {
          label['fields'].push({
            id: "CompanyID",
            value: (filter.filterValue).toString()
          })
        }
        //Department
        if (filter.filterType == 'department') {
          label['fields'].push({
            id: "DeptID",
            value: (filter.filterValue).toString()
          })
        }   
        //Subdepartment
        if (filter.filterType == 'subdepartment') {
          label['fields'].push({
            id: "SubDeptID",
            value: (filter.filterValue).toString()
          })
        }    
        //Role
        if (filter.filterType == 'role') {
          label['fields'].push({
            id: "RoleID",
            value: (filter.filterValue).toString()
          })
        }
        //Location
        if (filter.filterType == 'location') {
          label['fields'].push({
            id: "LocID",
            value: (filter.filterValue).toString()
          })
        }
        //Sublocation
        if (filter.filterType == 'sublocation') {
          label['fields'].push({
            id: "SubLocID",
            value: (filter.filterValue).toString()
          })
        }
        //Band
        if (filter.filterType == 'band') {
          label['fields'].push({
            id: "BandID",
            value: (filter.filterValue).toString()
          })
        }  
        //BusinessUnit
        if (filter.filterType == 'businessunit') {
          label['fields'].push({
            id: "BusinessUnitID",
            value: (filter.filterValue).toString()
          })
        }   
        //Branch
        if (filter.filterType == 'branch') {
          label['fields'].push({
            id: "BranchID",
            value: (filter.filterValue).toString()
          })
        }     
        //Manager
        if (filter.filterType == 'manager') {
          label['fields'].push({
            id: "MgrID",
            value: (filter.filterValue).toString()
          })
        }    
        //HR Spoc
        if (filter.filterType == 'hrspoc') {
          label['fields'].push({
            id: "HRSpocID",
            value: (filter.filterValue).toString()
          })
        }
        //int type
        if (filter.filterType == 'inttype') {
          label['fields'].push({
            id: "IntTypeID",
            value: (filter.filterValue).toString()
          })
        }
        //Emp STatus
        if (filter.filterType == 'empStatus') {
          label['fields'].push({
            id: "EmpStatus",
            value: (filter.filterValue).toString()
          })
        }
        //Gender
        if (filter.filterType == 'genderlist') {
          label['fields'].push({
            id: "Gender",
            value: (filter.filterValue).toString()
          })
        }
        //int name
        if (filter.filterType == 'intname') {
          label['fields'].push({
            id: "IntID",
            value: (filter.filterValue).toString()
          })
        }  
        //Zone
        if (filter.filterType == 'zone') {
          label['fields'].push({
            id: "ZoneID",
            value: (filter.filterValue).toString()
          })
        }      
    })
  }

  getValuesForComboChart() {
    this.isLoadingResults = true;
    let param = {}
    param['charttype'] = "";
    param['labelType'] = this.filter.type;
    param['chartParams'] = { fields: [] };
    this.scoreParam['chartParams'] = { fields: [] };
    this.scoreParam['labelType'] = this.filter.type;
    let labels = [];
    if (this.filter.type === "1") {
      let month = Number.parseInt(this.filter.monthStart) - 1;
      let year = Number.parseInt(this.filter.yearStart);
      if (month <= 0) {
        month = 12;
        year--;
      }
      while (true) {
        let label = {};
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
        label['value'] = this.getMonthNameForId(month) + " " + year.toString();
        label['fields'] = this.getFieldsForMonthYear(month, year);
        labels.push(label);

        if (month.toString() === this.filter.monthEnd && year.toString() === this.filter.yearEnd) {
          break;
        }
      }
    } else if (this.filter.type === "2") {
      let quarter = Number.parseInt(this.filter.quarterStart) - 1;
      let year = Number.parseInt(this.filter.yearStart);
      if (quarter <= 0) {
        quarter = 4;
        year--;
      }
      while (true) {
        let label = {};
        quarter++;
        if (quarter > 4) {
          quarter = 1;
          year++;
        }
        label['value'] = this.getQuarterNameForId(quarter) + " " + year.toString();
        label['fields'] = this.getFieldsForQuarterYear(quarter, year);
        labels.push(label);

        if (quarter.toString() === this.filter.quarterEnd && year.toString() === this.filter.yearEnd) {
          break;
        }
      }
    } else {
      let year = Number.parseInt(this.filter.yearStart);
      year--;
      while (true) {
        year++;
        let label = {};
        label['value'] = year.toString();
        label['fields'] = this.getFieldsForYear(year);
        labels.push(label);

        if (year.toString() === this.filter.yearEnd) {
          break;
        }
      }
    }

    let filterFields = this.getFilterParam();
    filterFields.forEach(
      filter => {
        param['chartParams']['fields'].push(filter);
        this.scoreParam['chartParams']['fields'].push(filter);
      }
    )
     let startMonth = '1',startYear,endMonth = '12',endYear;
      if(labels[0].fields[0].id == 'Month'){
        startMonth = labels[0].fields[0].value
      }
      else{
        startYear = labels[0].fields[0].value
      }

      if(labels[0].fields.length>1){
        if(labels[0].fields[1].id == 'Year'){
          startYear = labels[0].fields[1].value
        }
      } 

      if(labels[labels.length-1].fields[0].id == 'Month'){
        endMonth = labels[labels.length-1].fields[0].value;
      }
      else{
        endYear = labels[labels.length-1].fields[0].value;
      }

      if(labels[labels.length-1].fields.length>1){
        if(labels[labels.length-1].fields[1].id == 'Year'){
          endYear = labels[labels.length-1].fields[1].value
        }
      }

      if(Array.isArray(startMonth)){
        startMonth = startMonth[startMonth.length-1]
      }
      if(Array.isArray(endMonth)){
        endMonth = endMonth[0]
      }

    param['StartMonth'] = startMonth;
    param['StartYear'] = startYear;
    param['EndMonth'] = endMonth;
    param['EndYear'] = endYear;
    param['labels'] = labels;
    param['DateFilterBy']= this.filter.dateFilterBy;
    this.scoreParam['labels'] = labels;
    this.scoreParam['StartMonth'] = startMonth;
    this.scoreParam['StartYear'] =  startYear;
    this.scoreParam['EndMonth'] = endMonth;
    this.scoreParam['EndYear'] = endYear;
    this.scoreParam['DateFilterBy'] = this.filter.dateFilterBy;
    switch (this.type) {
      case 'enps':
        param['keys'] = FilterConstants.getEnpsKeys();
        break;

      case 'happiness':
        param['keys'] = FilterConstants.getHappinessKeys();
        break;
      case 'hr':
        param['keys'] = FilterConstants.getHrKeys();
        break;
      case 'flight':
        param['keys'] = FilterConstants.getFlightKeys();
        break;
    }
    let details = JSON.parse(atob(sessionStorage.getItem('details')));
    param["empCode"] = details.empcode;
    param["empType"] = this.empType;
    this.scoreParam["empCode"] = details.empcode;
    this.scoreParam["empType"] = this.empType;
    this.subscriptions.push(
      this.dashboardService.getChartValues(param).subscribe(
        res => {
          if(res['total'] == 0){
            this.isLoadingResults = false;
            this.isChartData = false;
          }
          this.updateChart(res);
          if(res['len'] == 0){
            this.isChartData = false;
          }else{
            this.isChartData = true;
          }
          this.isLoadingResults = false;
        },
        error => {
          this.isLoadingResults = false;
        }
      )
    )
    this.getScoreChart();
  }

  getFilterParam() {
    //Tenure
    let fields = [];
    this.filters.forEach(
      filter => {
        if (filter.filterType == 'tenure') {
          fields.push({
            id: "TenureID",
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
        //company
        if (filter.filterType == 'company') {
          fields.push({
            id: "CompanyID",
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
        //Subdepartment
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
    
        //Location
        if (filter.filterType == 'location') {
          fields.push({
            id: "LocID",
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

        //Branch
        if (filter.filterType == 'branch') {
          fields.push({
            id: "BranchID",
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

        //Emp STatus
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

        //int name
        if (filter.filterType == 'intname') {
          fields.push({
            id: "IntID",
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

  updateChart(res) {
    if (this.comboChart) {
      delete this.comboChart;
    }
    if (this.type === 'enps') {
      this.comboChart = new ComboChart(ENPSComboChartData.caption, ENPSComboChartData.subCaption, ENPSComboChartData.xAxisname, ENPSComboChartData.pYAxisName, ENPSComboChartData.sYAxisName, ENPSComboChartData.numberPrefix, ENPSComboChartData.sNumberSuffix, ENPSComboChartData.colorPalete,ENPSComboChartData.sYAxisMaxValue,ENPSComboChartData.decimals);
      this.msline = new MsLine(ENPSMSLINECHARTData.caption,ENPSMSLINECHARTData.subCaption);
      this.stackedColumn2d = new StackedColumn2d(ENPSStackedColumn2dChartData.caption,ENPSStackedColumn2dChartData.subCaption, ENPSStackedColumn2dChartData.yAxisMaxValue, ENPSStackedColumn2dChartData.yAxisName, ENPSStackedColumn2dChartData.numberSuffix, ENPSStackedColumn2dChartData.colorPalete,'0',ENPSStackedColumn2dChartData.decimals);
      this.pie2d = new Pie2d(EnpsPie2dCHartData.caption,EnpsPie2dCHartData.numberSuffix, EnpsPie2dCHartData.colorPalete);
    } else if (this.type === 'happiness') {
      this.comboChart = new ComboChart(HappinessComboChartData.caption, HappinessComboChartData.subCaption, HappinessComboChartData.xAxisname, HappinessComboChartData.pYAxisName, HappinessComboChartData.sYAxisName, HappinessComboChartData.numberPrefix, HappinessComboChartData.sNumberSuffix, HappinessComboChartData.colorPalete,HappinessComboChartData.sYAxisMaxValue,HappinessComboChartData.decimals)
      this.msline = new MsLine(HappinessMSLINECHARTData.caption, HappinessMSLINECHARTData.subCaption);
      this.stackedColumn2d = new StackedColumn2d(HappinessStackedColumn2dChartData.caption,HappinessStackedColumn2dChartData.subCaption, HappinessStackedColumn2dChartData.yAxisMaxValue, HappinessStackedColumn2dChartData.yAxisName, HappinessStackedColumn2dChartData.numberSuffix, HappinessStackedColumn2dChartData.colorPalete,'0',HappinessStackedColumn2dChartData.decimals);
      this.pie2d = new Pie2d(HappinessPie2dCHartData.caption,HappinessPie2dCHartData.numberSuffix, HappinessPie2dCHartData.colorPalete);
    } else if (this.type === 'hr') {
      this.comboChart = new ComboChart(HRComboChartData.caption, HRComboChartData.subCaption, HRComboChartData.xAxisname, HRComboChartData.pYAxisName, HRComboChartData.sYAxisName, HRComboChartData.numberPrefix, HRComboChartData.sNumberSuffix, HRComboChartData.colorPalete,HRComboChartData.sYAxisMaxValue,HRComboChartData.decimals)
      this.msline = new MsLine(EngagmentMSLINECHARTData.caption,EngagmentMSLINECHARTData.subCaption);
      this.stackedColumn2d = new StackedColumn2d(EngagmentStackedColumn2dChartData.caption,EngagmentStackedColumn2dChartData.subCaption, EngagmentStackedColumn2dChartData.yAxisMaxValue, EngagmentStackedColumn2dChartData.yAxisName, EngagmentStackedColumn2dChartData.numberSuffix, EngagmentStackedColumn2dChartData.colorPalete,'0',EngagmentStackedColumn2dChartData.decimals);
      this.pie2d = new Pie2d(HrPie2dCHartData.caption,HrPie2dCHartData.numberSuffix, HrPie2dCHartData.colorPalete);
    } else if (this.type === 'flight') {
      this.comboChart = new ComboChart(FlightComboChartData.caption, FlightComboChartData.subCaption, FlightComboChartData.xAxisname, FlightComboChartData.pYAxisName, FlightComboChartData.sYAxisName, FlightComboChartData.numberPrefix, FlightComboChartData.sNumberSuffix, FlightComboChartData.colorPalete,FlightComboChartData.sYAxisMaxValue,FlightComboChartData.decimals)
      this.msline = new MsLine(FlightChartMSLINECHARTData.caption,FlightChartMSLINECHARTData.subCaption);
      this.msColumn2d = new MsColumn2d(FlightChartMSColumn2dChartData.caption,FlightChartMSColumn2dChartData.subCaption, FlightChartMSColumn2dChartData.numberPrefix, FlightChartMSColumn2dChartData.colorPalete);
    }

    this.comboChart.dataset.push(new Dataset("Total"));
    let conClosed = 0;
    let conInit = 0;
    let onFLightRisk = 0;
    let totalActionsClosed = 0;
    res.keys.forEach(
      key => {
        key['count'] = 0;
        if (this.type !== 'flight') {
          if (key.hasOwnProperty('showValues')){
            this.comboChart.dataset.push(new Dataset(key.name, key.parentYAxis, key.renderAs, "1"));
            this.stackedColumn2d.dataset.push(new Dataset(key.name,key.parentYAxis,key.renderAs,"1"));
          }
          else {
            this.comboChart.dataset.push(new Dataset(key.name));
            this.stackedColumn2d.dataset.push(new Dataset(key.name));
          }
          this.msline.dataset.push(new MSLineDataSet(key.name, key.color, key.anchorbordercolor, key.anchorbgcolor));
          // this.stackedColumn2d.dataset.push(new Dataset(key.name));
        } else {
          if (key.id === 'FlightRiskStatus') {
            this.comboChart.dataset.push(new Dataset(key.name, key.parentYAxis, key.renderAs, "1"));
          }
          this.msline.dataset.push(new MSLineDataSet(key.name, key.color, key.anchorbordercolor, key.anchorbgcolor));
          // this.stackedColumn2d.dataset.push(new Dataset(key.name));
        }
      }
    );
    if(this.type === 'flight'){
      this.msColumn2d.dataset.push(new Dataset('Response Rate'));
      this.msColumn2d.dataset.push(new Dataset('Action Rate'));
    }
    let k = 1;
    let subCaption = "";
    res.labels.forEach(
      label => {
        this.comboChart.categories.push(new Category(label.value));
        this.msline.categories.push(new Category(label.value));
        if (this.type !== 'flight') {
          this.stackedColumn2d.categories.push(new Category(label.value));
          let total = 0;
          for (let i = 0; i < label.keys.length; i++) {
            total += label.keys[i].count;
            res.keys[i].count += label.keys[i].count;
          }
          for (let i = 0; i < label.keys.length; i++) {
            //plotToolText = "Value $value{br}Data Value $dataValue{br}label $label{br}displayValue $displayValue {br}seriesName $seriesName"
            this.comboChart.dataset[i + 1].data.push(new Data((label.keys[i].count / total) * 100, this.getToolTextForComboChart(label.keys[i].count, total, this.type)));
            this.msline.dataset[i].data.push(new Data(label.keys[i].count, this.getToolTextForMSLineChart(label.keys[i].count, total, this.type)));
            this.stackedColumn2d.dataset[i].data.push(new Data((label.keys[i].count / total) * 100, this.getToolTextForComboChart(label.keys[i].count, total, this.type)));
          }

          this.comboChart.dataset[0].data.push(new Data(total, "$seriesName, $label, $value"));

        } else {
          this.msColumn2d.categories.push(new Category(label.value));
          let total = 0;
          for (let i = 0; i < label.keys.length; i++) {
            if (label.keys[i].id === 'ConvCompleted') {
              total += label.keys[i].count;
            }

            switch (label.keys[i].id) {
              case "ConvCompleted":
                conClosed = label.keys[i].count;
                break;
              case "ConversationInitiated":
                conInit = label.keys[i].count;
                break;
              case "FlightRiskStatus":
                if(label.keys[i].name == "High Risk"){
                  onFLightRisk = label.keys[i].count;
                }
                break;
              case "ActionsClosed":
                totalActionsClosed = label.keys[i].count;
                break;
            }
          }

          for (let i = 0; i < label.keys.length; i++) {
            if (label.keys[i].id === 'FlightRiskStatus') {
              this.comboChart.dataset[i-1].data.push(new Data((label.keys[i].count / total) * 100,this.getToolTextForComboChart(label.keys[i].count, total, this.type)));
            }
            this.msline.dataset[i].data.push(new Data(label.keys[i].count,this.getToolTextForMSLineChartForFlight(label.keys[i].count, total, label.keys[i].id, label.keys)));
            // this.stackedColumn2d.dataset[i].data.push(new Data(Math.round((label.keys[i].count / total) * 100)));
          }
          this.msColumn2d.dataset[0].data.push(new Data(conInit === 0 ? 0 : ((conClosed/conInit)*100).toFixed(2),  "$seriesName, $value% Total "+conClosed+"{br} conversations completed out of "+conInit));
          this.msColumn2d.dataset[1].data.push(new Data(onFLightRisk === 0 ? 0 : ((totalActionsClosed/onFLightRisk)*100).toFixed(2),  "$seriesName, $value% Total "+totalActionsClosed+"{br} action closed out of "+onFLightRisk));
          this.comboChart.dataset[0].data.push(new Data(total,  "$seriesName, $label, $value"));
        }

        if (k === 1) {
          subCaption = subCaption + label.value;
          if(res.labels.length === 1){
            this.comboChart.subCaption = subCaption;
            this.msline.subCaption = subCaption;
            if (this.type == 'flight') {
              this.msColumn2d.subCaption = subCaption;
            }
            else{
              this.stackedColumn2d.subCaption = subCaption;
            }
          } else {
            subCaption = subCaption + " to ";
          }
        } else if (k === res.labels.length) {
          subCaption += label.value;
          this.comboChart.subCaption = subCaption;
          this.msline.subCaption = subCaption;
          if (this.type == 'flight') {
            this.msColumn2d.subCaption = subCaption;
          }
          else{
            this.stackedColumn2d.subCaption = subCaption;
          }
        }
        k++;
      }
    )

    if(this.type !== 'flight'){
      let totalkeysCount = 0;
      res.keys.forEach(
        key => {
            totalkeysCount+= key.count;
        }
      )
      res.keys.forEach(
        key => {
            this.pie2d.subCaption = subCaption;
            this.pie2d.data.push(new DataPie(key.name,Math.round((key.count/totalkeysCount)*100).toString(),this.getToolTextForPieChart(key.count,totalkeysCount,this.type, key.name)));
        }
      )
    }
  }

  updateStackedBarChart(res,type?) {
    if (this.stackedBar2d) {
      delete this.stackedBar2d;
    }

    switch (this.type) {
      case 'enps':
        this.tenureCaption = ENPSStackedBarChartData.caption
        this.stackedBar2d = new StackedBar2d(ENPSStackedBarChartData.caption, ENPSStackedBarChartData.subCaption, ENPSStackedBarChartData.xAxisname, ENPSStackedBarChartData.yAxisName, ENPSStackedBarChartData.numberPrefix, ENPSStackedBarChartData.colorPalete,ENPSStackedBarChartData.yAxisMaxValue,ENPSStackedBarChartData.showSum)
        break;
      case 'happiness':
        this.tenureCaption = HappinessStackedBarChartData.caption
        this.stackedBar2d = new StackedBar2d(HappinessStackedBarChartData.caption, HappinessStackedBarChartData.subCaption, HappinessStackedBarChartData.xAxisname, HappinessStackedBarChartData.yAxisName, HappinessStackedBarChartData.numberPrefix, HappinessStackedBarChartData.colorPalete,HappinessStackedBarChartData.yAxisMaxValue,HappinessStackedBarChartData.showSum)
        break;
      case 'hr':
        this.tenureCaption = EngagmentStackedBarChartData.caption
        this.stackedBar2d = new StackedBar2d(EngagmentStackedBarChartData.caption, EngagmentStackedBarChartData.subCaption, EngagmentStackedBarChartData.xAxisname, EngagmentStackedBarChartData.yAxisName, EngagmentStackedBarChartData.numberPrefix, EngagmentStackedBarChartData.colorPalete,EngagmentStackedBarChartData.yAxisMaxValue,EngagmentStackedBarChartData.showSum)
        break;
      case 'flight':
        this.tenureCaption = FlightChartStackedBarChartData.caption
        this.stackedBar2d = new StackedBar2d(FlightChartStackedBarChartData.caption, FlightChartStackedBarChartData.subCaption, FlightChartStackedBarChartData.xAxisname, FlightChartStackedBarChartData.yAxisName, FlightChartStackedBarChartData.numberPrefix, FlightChartStackedBarChartData.colorPalete,FlightChartStackedBarChartData.yAxisMaxValue,FlightChartStackedBarChartData.showSum)
        break;

    }

    if(type){
      this.tenureChartType = 'factor'
      this.tenureCaption = EngagmentStackedBarChartFactorData.caption
      this.stackedBar2d = new StackedBar2d(EngagmentStackedBarChartFactorData.caption, EngagmentStackedBarChartFactorData.subCaption, EngagmentStackedBarChartFactorData.xAxisname, EngagmentStackedBarChartFactorData.yAxisName, EngagmentStackedBarChartFactorData.numberPrefix, EngagmentStackedBarChartFactorData.colorPalete,EngagmentStackedBarChartFactorData.yAxisMaxValue,EngagmentStackedBarChartFactorData.showSum)
    }
    else{
      this.tenureChartType = 'tenure'
    }

    res.keys.forEach(
      key => {
        if (this.type === 'flight') {
          if (key.id === 'FlightRiskStatus') {
            this.stackedBar2d.dataset.push(new Dataset(key.name));
          }
        } else {
          this.stackedBar2d.dataset.push(new Dataset(key.name));
        }
      }
    )
    res.labels.forEach(
      label => {
        this.stackedBar2d.categories.push(new Category(label.value));
        let total = 0;
        for (let i = 0; i < label.keys.length; i++) {
          if(this.type !== 'flight'){
            total += label.keys[i].count;
          }
          else{
            if (label.keys[i].id === 'ConvCompleted'){
              total = label.keys[i].count;
            }
          }
        }
        for (let i = 0; i < label.keys.length; i++) {

          if (this.type !== 'flight') {
            if (total === 0) {
              this.stackedBar2d.dataset[i].data.push(new Data(0, "$seriesName, $label, $dataValue{br}Total " + 0 + " of " + total));
            } else {
              let value = ((label.keys[i].count / total) * 100).toFixed(2)
              this.stackedBar2d.dataset[i].data.push(new Data((label.keys[i].count / total) * 100,"$seriesName, $label,"+value+"%{br}Total " + label.keys[i].count + " of " + total));
            }
          } else {
            if (label.keys[i].id === 'FlightRiskStatus') {
              if (total === 0) {
                this.stackedBar2d.dataset[i].data.push(new Data(0, "$seriesName, $label, $dataValue{br}Total " + 0 + " of " + total));
              } else {
                let value = ((label.keys[i].count / total) * 100).toFixed(2)
                this.stackedBar2d.dataset[i].data.push(new Data((label.keys[i].count / total) * 100,"$seriesName, $label,"+value+"%{br}Total " + label.keys[i].count + " of " + total));
              }
            }
          }
        }
      }
    )
    //this.stackedBar2d.subCaption = this.getSubCaption(res);
    this.tenureSubCaption = this.getSubCaption(res);
  }

  dataPlotClick(obj) {
    this.dataPlotClickEvent.emit(obj);
  }

  pieChartDataPlotClick(obj){
    let retObj = JSON.parse(JSON.stringify(obj));
    
  }

  getToolTextForComboChart(count, total, type){
    let cstText = "";
    switch(type){
      case 'enps':
      if(total === 0){
        cstText = 0 + "% people are $seriesName{br}Total " + count + " of " + total; 
      } else {
        cstText = ((count/total)*100).toFixed(2) + "% people are $seriesName{br}Total " + count + " of " + total; 
      }
      break;
      case 'happiness':
      if(total === 0){
        cstText = 0 + "% people feel $seriesName{br}Total " + count + " of " + total; 
      } else {
        cstText = ((count/total)*100).toFixed(2) + "% people feel $seriesName{br}Total " + count + " of " + total; 
      }
      break;
      case 'hr':
      if(total === 0){
        cstText = 0 + "% people are $seriesName{br}Total " + count + " of " + total; 
      } else {
        cstText = ((count/total)*100).toFixed(2) + "% people are $seriesName{br}Total " + count + " of " + total; 
      }
      break;
      case 'flight':
      if(total === 0){
        cstText = 0 + "% people are at $seriesName{br}Total " + count + " of " + total; 
      } else {
        cstText = ((count/total)*100).toFixed(2) + "% people are at $seriesName{br}Total " + count + " of " + total; 
      }
      break;
    }

    return cstText;
  }

  getToolTextForPieChart(count, total, type, key){
    let cstText = "";
    switch(type){
      case 'enps':
      if(total === 0){
        cstText = 0 + "% people are "+key+"{br}Total " + count + " of " + total; 
      } else {
        cstText = ((count/total)*100).toFixed(2) + "% people are "+key+"{br}Total " + count + " of " + total; 
      }
      break;
      case 'happiness':
      if(total === 0){
        cstText = 0 + "% people feel "+key+"{br}Total " + count + " of " + total; 
      } else {
        cstText = ((count/total)*100).toFixed(2) + "% people feel "+key+"{br}Total " + count + " of " + total; 
      }
      break;
      case 'hr':
      if(total === 0){
        cstText = 0 + "% people are "+key+"{br}Total " + count + " of " + total; 
      } else {
        cstText = ((count/total)*100).toFixed(2) + "% people are "+key+"{br}Total " + count + " of " + total; 
      }
      break;
      case 'flight':
      if(total === 0){
        cstText = 0 + "% people are at "+key+"{br}Total " + count + " of " + total; 
      } else {
        cstText = ((count/total)*100).toFixed(2) + "% people are at "+key+"{br}Total " + count + " of " + total; 
      }
      break;
    }

    return cstText;
  }


  getToolTextForMSLineChart(count, total, type){
    let cstText = "";
    switch(type){
      case 'enps':
      if(total === 0){
        cstText = count + " people are $seriesName{br}Total " + 0 + "% of " + total; 
      } else {
        cstText = count + " people are $seriesName{br}Total " + ((count/total)*100).toFixed(2) + "% of " + total; 
      }
      break;
      case 'happiness':
      if(total === 0){
        cstText = count + " people feel $seriesName{br}Total " + 0 + "% of " + total; 
      } else {
        cstText = count + " people feel $seriesName{br}Total " + ((count/total)*100).toFixed(2) + "% of " + total; 
      }
      break;
      case 'hr':
      if(total === 0){
        cstText = count + " people are $seriesName{br}Total " + 0 + "% of " + total; 
      } else {
        cstText = count + " people are $seriesName{br}Total " + ((count/total)*100).toFixed(2) + "% of " + total; 
      }
      break;
      case 'flight':
      if(total === 0){
        cstText = count + " people are at $seriesName{br}Total " + 0 + "% of " + total; 
      } else {
        cstText = count + " people are at $seriesName{br}Total " + ((count/total)*100).toFixed(2) + "% of " + total; 
      }
      break;
    }

    return cstText;
  }

  getToolTextForMSLineChartForFlight(count, total, key, keys){
    let cstText = "";
    switch(key){
      case "ConversationInitiated": 
        cstText = "Total " + count + " Conversations Initiated";
        break;

      case "ConvCompleted": 
        let convInitiatedCount = 0;
        for(let i=0;i<keys.length;i++){
          if(keys[i].id === 'ConversationInitiated'){
            convInitiatedCount = keys[i].count;
            break;
          }
        }
        cstText = "Total " + count + " Conversations Completed out of " + convInitiatedCount;
        break;

      case "FlightRiskStatus":
        let convCompletedCount = 0;
        for(let i=0;i<keys.length;i++){
          if(keys[i].id === 'ConvCompleted'){
            convCompletedCount = keys[i].count;
            break;
          }
        }
        cstText = "Total " + count + " at Flight Risk out of " + convCompletedCount;
        break;

      case "ActionsClosed":
        cstText = "Total " + count + " Actions Closed"
        break;
    }

    return cstText;

  }

  getFilterOnEmpStatus(){
    this.highlightEmp = false;
    let data = this.filterNameFormGroup.value;
    let empStatus;
    let empstatusArray = data.empstatus == "2" ? this.resetFormGroup('empstatus'):data.empstatus;
    if(empstatusArray != ""){
      empStatus = empstatusArray.join(",");
    }
    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'empStatus')
    if(empStatus) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "empStatus";
      filter.filterValue = empStatus;
      this.filters.push(filter);
      this.highlightEmp = true;
    } 
    this.scrollUp();
    this.updateData();
  }

  getFilterOnGender(){
    this.highlightGender = false;
    let data = this.filterNameFormGroup.value;
    let genderlist;
    let genderArray = data.gender == "-1" ? this.resetFormGroup('gender'):data.gender;
    if(genderArray != ""){
      genderlist = genderArray.join(",");
    }
    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'genderlist')
    if(genderlist) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "genderlist";
      filter.filterValue = genderlist;
      this.filters.push(filter);
      this.highlightGender = true;
    } 
    this.scrollUp();
    this.updateData();
  }

  getFilterOnFunction(){
    this.highlightFunc = false;
    let data = this.filterNameFormGroup.value;
    let functionArray = data.function == "0" ? this.resetFormGroup('function'):data.function;
    let functionValue = Array.prototype.map.call(functionArray, s => s.FuncID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'function')
    if(functionValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "function";
      filter.filterValue = functionValue;
      this.filters.push(filter);
      this.highlightFunc = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnCompany(){
    this.highlightComp = false;
    let data = this.filterNameFormGroup.value;
    let companyArray = data.company == "0" ? this.resetFormGroup('company'):data.company;
    let companyValue = Array.prototype.map.call(companyArray, s => s.CompanyID).toString();
    
    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'company')
    if(companyValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "company";
      filter.filterValue = companyValue;
      this.filters.push(filter);
      this.highlightComp = true;
    }
    this.scrollUp();
    this.updateData();
  }
  getFilterOnDepartment(){
    this.highlightDepart = false;
    let data = this.filterNameFormGroup.value;
    let departmentArray = data.department == "0" ? this.resetFormGroup('department'):data.department;
    let departmentValue = Array.prototype.map.call(departmentArray, s => s.DeptID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'department')
    if(departmentValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "department";
      filter.filterValue = departmentValue;
      this.filters.push(filter);
      this.highlightDepart = true;
    }
    this.scrollUp();
    this.updateData();
  }
  getFilterOnSubdepartment(){
    this.highlightSubdepart = false;
    let data = this.filterNameFormGroup.value;
    let subdepartmentArray = data.subdepartment == "0" ? this.resetFormGroup('subdepartment'):data.subdepartment;
    let subdepartmentValue = Array.prototype.map.call(subdepartmentArray, s => s.SubDeptID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'subdepartment')
    if(subdepartmentValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "subdepartment";
      filter.filterValue = subdepartmentValue;
      this.filters.push(filter);
      this.highlightSubdepart = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnRole(){
    this.highlightRole = false;
    let data = this.filterNameFormGroup.value;
    let roleArray = data.role == "0" ? this.resetFormGroup('role'):data.role;
    let roleValue = Array.prototype.map.call(roleArray, s => s.RoleID).toString();
    
    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'role')
    if(roleValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "role";
      filter.filterValue = roleValue;
      this.filters.push(filter);
      this.highlightRole = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnLocation(){
    this.highlightLocation = false;
    let data = this.filterNameFormGroup.value;
    let locationArray = data.location == "0" ? this.resetFormGroup('location'):data.location;
    let locationValue = Array.prototype.map.call(locationArray, s => s.LocID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'location')
    if(locationValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "location";
      filter.filterValue = locationValue;
      this.filters.push(filter);
      this.highlightLocation = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnSublocation(){
    this.highlightSublocation = false;
    let data = this.filterNameFormGroup.value;
    let sublocationArray = data.sublocation == "0" ? this.resetFormGroup('sublocation'):data.sublocation;
    let sublocationValue = Array.prototype.map.call(sublocationArray, s => s.SubLocID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'sublocation')
    if(sublocationValue){
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "sublocation";
      filter.filterValue = sublocationValue;
      this.filters.push(filter);
      this.highlightSublocation = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnBand(){
    this.highlightBand = false;
    let data = this.filterNameFormGroup.value;
    let bandArray = data.band == "0" ? this.resetFormGroup('band'):data.band;
    let bandValue = Array.prototype.map.call(bandArray, s => s.BandID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'band')
    if(bandValue) {
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "band";
      filter.filterValue = bandValue;
      this.filters.push(filter);
      this.highlightBand = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnBusinessunit(){
    this.highlightBusinessunit = false;
    let data = this.filterNameFormGroup.value;
    let businessunitArray = data.businessunit == "0" ? this.resetFormGroup('businessunit'):data.businessunit;
    let businessunitValue = Array.prototype.map.call(businessunitArray, s => s.BusinessUnitID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'businessunit')
    if(businessunitValue) {
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "businessunit";
      filter.filterValue = businessunitValue;
      this.filters.push(filter);
      this.highlightBusinessunit = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnBranch(){
    this.highlightBranch = false;
    let data = this.filterNameFormGroup.value;
    let branchArray = data.branch == "0" ? this.resetFormGroup('branch'):data.branch;
    let branchValue = Array.prototype.map.call(branchArray, s => s.BranchID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'branch')
    if(branchValue) {
      let filter = {"filterType": "", "filterValue": ""};
      filter.filterType = "branch";
      filter.filterValue = branchValue;
      this.filters.push(filter);
      this.highlightBranch = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnManager(){
    this.highlightManager = false;
    let data = this.filterNameFormGroup.value;
    let manageArray = data.manager == "0" ? this.resetFormGroup('manager'):data.manager;
    if(manageArray){
      manageArray.forEach(obj =>{
        for(let i=0;i<this.duplicatesManager.length;i++){
          if(this.duplicatesManager[i].Manager == obj.Manager){
            manageArray.push(this.duplicatesManager[i]);
          }
        }
      })
    }
    let managerValue = Array.prototype.map.call(manageArray, s => s.ManagerID).toString();
    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'manager')
    if(managerValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "manager";
      filter.filterValue = managerValue;
      this.filters.push(filter);
      this.highlightManager = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnHRSpoc(){
    this.highlightHR = false;
    let data = this.filterNameFormGroup.value;
    let hrspocArray = data.hrspoc == "0" ? this.resetFormGroup('hrspoc'):data.hrspoc;
    if(hrspocArray){
      hrspocArray.forEach(obj =>{
        for(let i=0;i<this.duplicatesHR.length;i++){
          if(this.duplicatesHR[i].HRSpoc == obj.HRSpoc){
            hrspocArray.push(this.duplicatesHR[i]);
          }
        }
      })
    }
    let hrspocValue = Array.prototype.map.call(hrspocArray, s => s.HRSpocID).toString();
    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'hrspoc')
    if(hrspocValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "hrspoc";
      filter.filterValue = hrspocValue;
      this.filters.push(filter);
      this.highlightHR = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnIntType(){
    this.highlightInt = false;
    let data = this.filterNameFormGroup.value;
    let inttypeArray = data.inttype == "0" ? this.resetFormGroup('inttype'):data.inttype;
    let inttypeValue = Array.prototype.map.call(inttypeArray, s => s.IntTypeID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'inttype')
    if(inttypeValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "inttype";
      filter.filterValue = inttypeValue;
      this.filters.push(filter);
      this.highlightInt = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnIntName(){
    this.highlightIntName = false;
    let data = this.filterNameFormGroup.value;
    let inttnameArray = data.intname == "0" ? this.resetFormGroup('intname'):data.intname;
    let intnameValue = Array.prototype.map.call(inttnameArray, s => s.IntID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'intname')
    if(intnameValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "intname";
      filter.filterValue = intnameValue;
      this.filters.push(filter);
      this.highlightIntName = true;
    }
    this.scrollUp();
    this.updateData();
  }

  getFilterOnZone(){
    this.highlightZone = false;
    let data = this.filterNameFormGroup.value;
    let zoneArray = data.zone == "0" ? this.resetFormGroup('zone'):data.zone;
    let zoneValue = Array.prototype.map.call(zoneArray, s => s.ZoneID).toString();

    let tempFilter = this.filters
    this.filters = [];
    this.updateFilter(tempFilter,'zone')
    if(zoneValue) {
      let filter = {"filterType": "", "filterValue": Object};
      filter.filterType = "zone";
      filter.filterValue = zoneValue;
      this.filters.push(filter);
      this.highlightZone = true;
    }
    this.scrollUp();
    this.updateData();
  }

  updateFilter(tempFilter,type){
    if(tempFilter.length>0){
      for(let i=0;i<tempFilter.length;i++){
        if(tempFilter[i].filterType != type){
          this.filters.push(tempFilter[i])
        }
      }
    }
  }

  removeTableParam(type){
    if(type == 'empstatus'){
      this.filterNameFormGroup.controls['empstatus'].setValue('');
      this.getFilterOnEmpStatus()
    }
    if(type == 'gender'){
      this.filterNameFormGroup.controls['gender'].setValue('');
      this.getFilterOnGender()
    }
    if(type == 'function'){
      this.filterNameFormGroup.controls['function'].setValue('');
      this.getFilterOnFunction()
    }

    if(type == 'company'){
      this.filterNameFormGroup.controls['company'].setValue('');
      this.getFilterOnCompany()
    }
    if(type == 'department'){
      this.filterNameFormGroup.controls['department'].setValue('');
      this.getFilterOnDepartment()
    }
    if(type == 'subdepartment'){
      this.filterNameFormGroup.controls['subdepartment'].setValue('');
      this.getFilterOnSubdepartment()
    }
    if(type == 'role'){
      this.filterNameFormGroup.controls['role'].setValue('');
      this.getFilterOnRole()
    }
    if(type == 'location'){
      this.filterNameFormGroup.controls['location'].setValue('');
      this.getFilterOnLocation()
    }
    if(type == 'sublocation'){
      this.filterNameFormGroup.controls['sublocation'].setValue('');
      this.getFilterOnSublocation()
    }
    if(type == 'band'){
      this.filterNameFormGroup.controls['band'].setValue('');
      this.getFilterOnBand()
    }
    if(type == 'businessunit'){
      this.filterNameFormGroup.controls['businessunit'].setValue('');
      this.getFilterOnBusinessunit()
    }
    if(type == 'branch'){
      this.filterNameFormGroup.controls['branch'].setValue('');
      this.getFilterOnBranch()
    }
    if(type == 'manager'){
      this.filterNameFormGroup.controls['manager'].setValue('');
      this.getFilterOnManager()
    }
    if(type == 'hrspoc'){
      this.filterNameFormGroup.controls['hrspoc'].setValue('');
      this.getFilterOnHRSpoc()
    }
    if(type == 'inttype'){
      this.filterNameFormGroup.controls['inttype'].setValue('');
      this.getFilterOnIntType()
    }
    if(type == 'intname'){
      this.filterNameFormGroup.controls['intname'].setValue('');
      this.getFilterOnIntName()
    }
    if(type == 'zone'){
      this.filterNameFormGroup.controls['zone'].setValue('');
      this.getFilterOnZone()
    }
  }

  resetFormGroup(name){
    this.filterNameFormGroup.controls[name].setValue('');
    return "";
  }

  updateData(){
    this.filtersEvent.emit(this.filters)
    this.getValuesForComboChart();
    this.getValuesForStackedBarChart();
  }

  scrollUp(){
    let element = document.getElementById('targetGraph');
    element.scrollIntoView({block: 'nearest'});
  }

  viewScoreChart(){
    this.toggle = !this.toggle;
   if(this.toggle){
     this.chartButton = 'View Distribution'
      if(this.graphType == 'pie'){
        this.graphType = 'combo'
      }
   }
   else{
    this.chartButton = 'View Score'
   }
   if(this.type == 'hr'){
    delete this.stackedBar2d;
    delete this.stackedBar2dScore;
    this.viewTenureGraphBy(this.tenureChartType);
   }
  }

  getScoreChart(){
    this.scoreParam['charttype'] = "scorechart";
    if(this.type == 'hr'){
      this.scoreParam['keys'] = [
        {
          "id": "HapinessStatus",
          "value": "engaged",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "71ba51",
          "anchorbordercolor": "71ba51",
          "anchorbgcolor": "71ba51"
      },
      {
          "id": "HapinessStatus",
          "value": "not engaged",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "ffaf40",
          "anchorbordercolor": "ffaf40",
          "anchorbgcolor": "ffaf40"
      },
      {
          "id": "HapinessStatus",
          "value": "actively disengaged",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "ff4d4d",
          "anchorbordercolor": "ff4d4d",
          "anchorbgcolor": "ff4d4d"
      },
        {
          "id": "Engagement_Score",
          "value": "Engagement_Score",
          "name": "Engagement_Score",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "0061FF",
          "anchorbordercolor": "0061FF",
          "anchorbgcolor": "0061FF"
        }
      ]
    }
    else if(this.type == 'happiness'){
      this.scoreParam['keys']=[  
        {
          "id": "Mood",
          "value": "5",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "71ba51",
          "anchorbordercolor": "71ba51",
          "anchorbgcolor": "71ba51"
      },
      {
          "id": "Mood",
          "value": "4",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "59CB59",
          "anchorbordercolor": "59CB59",
          "anchorbgcolor": "59CB59"
      },
      {
          "id": "Mood",
          "value": "3",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "F9FF00",
          "anchorbordercolor": "F9FF00",
          "anchorbgcolor": "F9FF00"
      },
      {
          "id": "Mood",
          "value": "2",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "ffaf40",
          "anchorbordercolor": "ffaf40",
          "anchorbgcolor": "ffaf40"
      },
      {
          "id": "Mood",
          "value": "1",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "ff4d4d",
          "anchorbordercolor": "ff4d4d",
          "anchorbgcolor": "ff4d4d"
      },      
        {
          "id": "MoodScore",
          "value": "1",
          "name": "Mood Score",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "0061FF",
          "anchorbordercolor": "0061FF",
          "anchorbgcolor": "0061FF"
      }
      ]
    }
    else{
      this.scoreParam['keys']=[
        {
          "id": "EnpsStatus",
          "value": "Detractor",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "ff4d4d",
          "anchorbordercolor": "ff4d4d",
          "anchorbgcolor": "ff4d4d"
          },
          {
          "id": "EnpsStatus",
          "value": "Passive",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "ffaf40",
          "anchorbordercolor": "ffaf40",
          "anchorbgcolor": "ffaf40"
          },
          {
          "id": "EnpsStatus",
          "value": "Promoter",
          "name": "",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "0",
          "color": "71ba51",
          "anchorbordercolor": "71ba51",
          "anchorbgcolor": "71ba51"
          },
          {
          "id": "EnpsScore",
          "value": "Promoter",
          "name": "eNPS Score",
          "parentYAxis": "S",
          "renderAs": "line",
          "showValues": "1",
          "color": "0061FF",
          "anchorbordercolor": "0061FF",
          "anchorbgcolor": "0061FF"
          }
      ]
    }

    this.dashboardService.getScoreChart(this.scoreParam).subscribe(
      res =>{
        let maxTotal;
        if(this.type == 'enps'){
          maxTotal = 100;
          this.comboChartScore = new ComboChart(ENPSComboChartScoreData.caption, ENPSComboChartScoreData.subCaption, ENPSComboChartScoreData.xAxisname, ENPSComboChartScoreData.pYAxisName, ENPSComboChartScoreData.sYAxisName, ENPSComboChartData.numberPrefix, ENPSComboChartScoreData.sNumberSuffix, ENPSComboChartScoreData.colorPalete,ENPSComboChartScoreData.sYAxisMaxValue,ENPSComboChartScoreData.decimals);
          this.mslineScore = new MsLine(ENPSMSLINECHARTScoreData.caption,ENPSMSLINECHARTScoreData.subCaption,ENPSMSLINECHARTScoreData.yAxisMaxValue);
          this.stackedColumn2dScore = new StackedColumn2d(ENPSStackedColumn2dChartScoreData.caption,ENPSStackedColumn2dChartScoreData.subCaption,ENPSStackedColumn2dChartScoreData.yAxisMaxValue,ENPSStackedColumn2dChartScoreData.yAxisName,ENPSStackedColumn2dChartScoreData.numberSuffix,ENPSStackedColumn2dChartScoreData.colorPalete,"1",ENPSStackedColumn2dChartScoreData.decimals);
        }
        else if(this.type == 'happiness'){
          maxTotal = 5;
          this.comboChartScore = new ComboChart(HappinessComboChartScoreData.caption, HappinessComboChartScoreData.subCaption, HappinessComboChartScoreData.xAxisname, HappinessComboChartScoreData.pYAxisName, HappinessComboChartScoreData.sYAxisName, HappinessComboChartScoreData.numberPrefix, HappinessComboChartScoreData.sNumberSuffix, HappinessComboChartScoreData.colorPalete,HappinessComboChartScoreData.sYAxisMaxValue,HappinessComboChartScoreData.decimals);
          this.mslineScore = new MsLine(HappinessMSLINECHARTScoreData.caption,HappinessMSLINECHARTScoreData.subCaption,HappinessMSLINECHARTScoreData.yAxisMaxValue);
          this.stackedColumn2dScore = new StackedColumn2d(HappinessStackedColumn2dChartScoreData.caption,HappinessStackedColumn2dChartScoreData.subCaption,HappinessStackedColumn2dChartScoreData.yAxisMaxValue,HappinessStackedColumn2dChartScoreData.yAxisName,HappinessStackedColumn2dChartScoreData.numberSuffix,HappinessStackedColumn2dChartScoreData.colorPalete,"1",HappinessStackedColumn2dChartScoreData.decimals);
        }
        else{
          maxTotal = 5;
          this.comboChartScore = new ComboChart(HRComboChartScoreData.caption, HRComboChartScoreData.subCaption, HRComboChartScoreData.xAxisname, HRComboChartScoreData.pYAxisName, HRComboChartScoreData.sYAxisName, HRComboChartScoreData.numberPrefix, HRComboChartScoreData.sNumberSuffix, HRComboChartScoreData.colorPalete,HRComboChartScoreData.sYAxisMaxValue,HRComboChartScoreData.decimals);
          this.mslineScore = new MsLine(EngagmentMSLINECHARTScoreData.caption,EngagmentMSLINECHARTScoreData.subCaption,EngagmentMSLINECHARTScoreData.yAxisMaxValue);
          this.stackedColumn2dScore = new StackedColumn2d(EngagmentStackedColumn2dChartScoreData.caption,EngagmentStackedColumn2dChartScoreData.subCaption,EngagmentStackedColumn2dChartScoreData.yAxisMaxValue,EngagmentStackedColumn2dChartScoreData.yAxisName,EngagmentStackedColumn2dChartScoreData.numberSuffix,EngagmentStackedColumn2dChartScoreData.colorPalete,"1",EngagmentStackedColumn2dChartScoreData.decimals);
        }
        
        this.comboChartScore.dataset.push(new Dataset("Total"));
        res['keys'].forEach(
          key => {
            this.comboChartScore.dataset.push(new Dataset(key.name, key.parentYAxis, key.renderAs, "1"));
            this.mslineScore.dataset.push(new MSLineDataSet(key.name, key.color, key.anchorbordercolor, key.anchorbgcolor));
            this.stackedColumn2dScore.dataset.push(new Dataset(key.name));
        })
        let k =1;
        let subCaption = "";
        res['labels'].forEach(
          label => {
            this.comboChartScore.categories.push(new Category(label.value));
            this.mslineScore.categories.push(new Category(label.value));
            this.stackedColumn2dScore.categories.push(new Category(label.value));
            let total = 0;
            for (let i = 0; i < label.keys.length; i++) {
              if(label.keys[i].id == 'Engagement_Score' || label.keys[i].id == 'MoodScore' || label.keys[i].id == 'EnpsScore'){
                continue;
              }
              else{
                total += label.keys[i].count;
              }
            }

            for (let i = 0; i < label.keys.length; i++) {
              if(label.keys[i].id == 'Engagement_Score' || label.keys[i].id == 'MoodScore' || label.keys[i].id == 'EnpsScore'){
                this.comboChartScore.dataset[1].data.push(new Data(label.keys[i].count, this.getToolTextForComboChartScore(label.keys[i].count, maxTotal, this.type)));
                this.mslineScore.dataset[i].data.push(new Data(label.keys[i].count, this.getToolTextForMSLineChart(label.keys[i].count, maxTotal, '')));
                this.stackedColumn2dScore.dataset[i].data.push(new Data(label.keys[i].count, this.getToolTextForComboChart(label.keys[i].count, maxTotal, '')));
              }
            }

            this.comboChartScore.dataset[0].data.push(new Data(total, "$seriesName, $label, $value"));

            if (k === 1) {
              subCaption = subCaption + label.value;
              if(res['labels'].length === 1){
                this.comboChartScore.subCaption = subCaption;
                this.mslineScore.subCaption = subCaption;
                this.stackedColumn2dScore.subCaption = subCaption;
              } else {
                subCaption = subCaption + " to ";
              }
            } else if (k === res['labels'].length) {
              subCaption += label.value;
              this.comboChartScore.subCaption = subCaption;
              this.mslineScore.subCaption = subCaption;
              this.stackedColumn2dScore.subCaption = subCaption;
            }
            k++;
          }) 
      }
    )
  }

  getToolTextForComboChartScore(count,total,type){
    let cstText = "";
    switch(type){
      case 'enps':
      if(total === 0){
        cstText = "Total " + count + " of " + total; 
      } else {
        cstText = "Total " + count + " of " + total; 
      }
      break;
      case 'happiness':
      if(total === 0){
        cstText = "Total " + count + " of " + total; 
      } else {
        cstText = "Total " + count + " of " + total; 
      }
      break;
      case 'hr':
      if(total === 0){
        cstText = "Total " + count + " of " + total; 
      } else {
        cstText = "Total " + count + " of " + total; 
      }
      break;
    }

    return cstText;
  }

  viewTenureGraphBy(type){
    if(type == 'tenure'){
      this.tenureChartType = 'tenure'
      this.getValuesForStackedBarChart();
    }
    else{
      this.tenureChartType = 'factor'
      this.isLoadingResultsStackedBar = true;
      let param = {};
      param['labelType'] = this.filter.type;
      if(this.toggle){
        param['charttype'] = 'factorscore'
      }
      else{
        param['charttype'] = 'factor'
      }
      
      let labels = [];
      param['chartParams'] = { fields: [] };
      this.subscriptions.push(
        this.dashboardService.getFactors().subscribe(
          res => {
            if (res) {
              JSON.parse(JSON.stringify(res)).forEach(
                item => {
                  let label = {};
                  label['value'] = item['FactorName'];
                  label['fields'] = [
                    {
                      id: "ConvCompleted",
                      value: "yes"
                    },
                    {
                      id: "Factor",
                      value: item['FactorName']
                    }
                  ]
                  labels.push(label);
                  // this.setFilterValueForStackedChart(label);
                }
              )
              let filterFields = this.getFilterParam();
              filterFields.forEach(
                filter => {
                  param['chartParams']['fields'].push(filter);
                }
              )
              param['labels'] = labels;
              param['StartMonth'] = this.scoreParam['StartMonth'];
              param['StartYear'] = this.scoreParam['StartYear'];
              param['EndMonth'] = this.scoreParam['EndMonth'];
              param['EndYear'] = this.scoreParam['EndYear'];
              param['DateFilterBy']= this.filter.dateFilterBy;

              if(this.toggle){
                param['keys']=[
                  {
                    id: "HapinessStatus",
                    value: "1,2,3,4,5",
                    name: "Engagement Score",
                    parentYAxis: "S",
                    renderAs: "line",
                    showValues: "0",
                    color: '71ba51',
                    anchorbordercolor: "71ba51", 
                    anchorbgcolor: "71ba51"
                },
                ]
              }
              else{
                param['keys'] = FilterConstants.getHrFactorKeys();
              }
              let details = JSON.parse(atob(sessionStorage.getItem('details')));
              param["empCode"] = details.empcode;
              param["empType"] = this.empType;
              this.dashboardService.getChartFactorValues(param).subscribe(
                res => {
                  if(this.toggle){
                    this.updateStackedBarScoreChart(res,'factor');
                  }
                  else{
                    this.updateStackedBarChart(res,'factor');
                  }
                  this.isLoadingResultsStackedBar = false;
                },
                error => {
                  this.isLoadingResultsStackedBar = false;
                }
              )
            }
          }
        )
      )
    }
  }

  getTenureScoreChart(){
    this.isLoadingResultsStackedBar = true;
    this.tenureScoreParam['charttype'] = "stagescore"
    if(this.type == 'enps'){
      this.tenureScoreParam['keys'] = [
        {
          id: "EnpsScore",
          value: "Score",
          name: "eNPS Score",
          parentYAxis: "S",
          renderAs: "line",
          showValues: "0",
          color: '32adda',
          anchorbordercolor: "32adda", 
          anchorbgcolor: "32adda"
      }
      ]
    }
    else if(this.type == 'happiness'){
      this.tenureScoreParam['keys'] = [
        {
          id: "Mood",
          value: "5",
          name: "Happiness Score",
          parentYAxis: "S",
          renderAs: "line",
          showValues: "0",
          color: '32adda',
          anchorbordercolor: "32adda", 
          anchorbgcolor: "32adda"
      },
      ]
    }
    else if(this.type == 'hr'){
      this.tenureScoreParam['keys'] = [
        {
          id: "Engagement_Score",
          value: "engaged",
          name: "Engagement Score",
          parentYAxis: "S",
          renderAs: "line",
          showValues: "0",
          color: '32adda',
          anchorbordercolor: "32adda", 
          anchorbgcolor: "32adda"
      }
      ]
    }


    this.dashboardService.getScoreChart(this.tenureScoreParam).subscribe(
      res => {
        this.updateStackedBarScoreChart(res);
        this.isLoadingResultsStackedBar = false;
      },
      error => {
        this.isLoadingResultsStackedBar = false;
      }
    )
  }

  updateStackedBarScoreChart(res,type?){
    if (this.stackedBar2dScore) {
      delete this.stackedBar2dScore;
    }

    switch (this.type) {
      case 'enps':
        this.tenureScoreCaption = ENPSStackedBarChartScoreData.caption
        this.stackedBar2dScore = new StackedBar2d(ENPSStackedBarChartScoreData.caption, ENPSStackedBarChartScoreData.subCaption, ENPSStackedBarChartScoreData.xAxisname, ENPSStackedBarChartScoreData.yAxisName, ENPSStackedBarChartScoreData.numberPrefix, ENPSStackedBarChartScoreData.colorPalete, ENPSStackedBarChartScoreData.yAxisMaxValue, ENPSStackedBarChartScoreData.showSum)
        break;
      case 'happiness':
        this.tenureScoreCaption = HappinessStackedBarCharScoretData.caption
        this.stackedBar2dScore = new StackedBar2d(HappinessStackedBarCharScoretData.caption, HappinessStackedBarCharScoretData.subCaption, HappinessStackedBarCharScoretData.xAxisname, HappinessStackedBarCharScoretData.yAxisName, HappinessStackedBarCharScoretData.numberPrefix, HappinessStackedBarCharScoretData.colorPalete,HappinessStackedBarCharScoretData.yAxisMaxValue, HappinessStackedBarCharScoretData.showSum)
        break;
      case 'hr':
        this.tenureScoreCaption = EngagmentStackedBarChartScoreData.caption
        this.stackedBar2dScore = new StackedBar2d(EngagmentStackedBarChartScoreData.caption, EngagmentStackedBarChartScoreData.subCaption, EngagmentStackedBarChartScoreData.xAxisname, EngagmentStackedBarChartScoreData.yAxisName, EngagmentStackedBarChartScoreData.numberPrefix, EngagmentStackedBarChartScoreData.colorPalete,EngagmentStackedBarChartScoreData.yAxisMaxValue,EngagmentStackedBarChartScoreData.showSum)
        break;
      // case 'flight':
      //   this.stackedBar2dScore = new StackedBar2d(FlightChartStackedBarChartData.caption, FlightChartStackedBarChartData.subCaption, FlightChartStackedBarChartData.xAxisname, FlightChartStackedBarChartData.yAxisName, FlightChartStackedBarChartData.numberPrefix, FlightChartStackedBarChartData.colorPalete)
      //   break;

    }

    if(type){
      this.tenureChartType = 'factor'
      this.tenureScoreCaption = EngagmentStackedBarChartFactorScoreData.caption
      this.stackedBar2dScore = new StackedBar2d(EngagmentStackedBarChartFactorScoreData.caption, EngagmentStackedBarChartFactorScoreData.subCaption, EngagmentStackedBarChartFactorScoreData.xAxisname, EngagmentStackedBarChartFactorScoreData.yAxisName, EngagmentStackedBarChartFactorScoreData.numberPrefix, EngagmentStackedBarChartFactorScoreData.colorPalete,EngagmentStackedBarChartFactorScoreData.yAxisMaxValue,EngagmentStackedBarChartFactorScoreData.showSum)
    }
    else{
      this.tenureChartType = 'tenure'
    }

    res.keys.forEach(
      key => {
        if (this.type === 'flight') {
          if (key.id === 'FlightRiskStatus') {
            this.stackedBar2dScore.dataset.push(new Dataset(key.name));
          }
        } else {
          this.stackedBar2dScore.dataset.push(new Dataset(key.name));
        }
      }
    )
    res.labels.forEach(
      label => {
        this.stackedBar2dScore.categories.push(new Category(label.value));
        let total = 0;
        for (let i = 0; i < label.keys.length; i++) {
          if(this.type !== 'flight'){
            total += label.keys[i].count;
          }
          else{
            if (label.keys[i].id === 'ConvCompleted'){
              total = label.keys[i].count;
            }
          }
        }
        for (let i = 0; i < label.keys.length; i++) {

          if (this.type !== 'flight') {
            if (total === 0) {
              this.stackedBar2dScore.dataset[i].data.push(new Data(0, "$seriesName, $label, $dataValue{br}Total " + 0 + " of " + total));
            } else {
              let value;
              let totalValue;
              if(this.type == 'enps'){
                totalValue = 100;
                value = ((label.keys[i].count / totalValue)*100).toFixed(2)
              }
              else{
                totalValue = 5;
                value = ((label.keys[i].count / totalValue)*100).toFixed(2)
              }
              this.stackedBar2dScore.dataset[i].data.push(new Data(label.keys[i].count,"$seriesName, $label,"+value+"%{br}Total " + label.keys[i].count + " of " + totalValue));
            }
          } else {
            if (label.keys[i].id === 'FlightRiskStatus') {
              if (total === 0) {
                this.stackedBar2dScore.dataset[i].data.push(new Data(0, "$seriesName, $label, $dataValue{br}Total " + 0 + " of " + total));
              } else {
                let value = ((label.keys[i].count / total) * 100).toFixed(2)
                this.stackedBar2dScore.dataset[i].data.push(new Data((label.keys[i].count / total) * 100,"$seriesName, $label,"+value+"%{br}Total " + label.keys[i].count + " of " + total));
              }
            }
          }
        }
      }
    )
   // this.stackedBar2dScore.subCaption = this.getSubCaption(res);
   this.tenureSubCaption = this.getSubCaption(res);
  }

  getSubCaption(res){
    let subCaption = "";
    if(this.filter.type == "1"){
      subCaption = this.getMonthNameForId(res.StartMonth)+" "+res.StartYear+" to "+this.getMonthNameForId(res.EndMonth)+" "+res.EndYear;
    }
    else if(this.filter.type == "2"){
      subCaption = this.getQuarterNameForId(this.filter.quarterStart)+" "+res.StartYear+" to "+this.getQuarterNameForId(this.filter.quarterEnd)+" "+res.EndYear;
    }
    else{
      subCaption = res.StartYear+" to "+res.EndYear;
    }
    return subCaption;
  }

  getSubCaption1(){
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