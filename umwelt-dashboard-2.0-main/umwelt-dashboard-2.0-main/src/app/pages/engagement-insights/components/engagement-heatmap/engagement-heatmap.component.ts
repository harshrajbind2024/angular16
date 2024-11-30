import { Component, OnInit,Input, ChangeDetectorRef, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MatLegacyTableDataSource} from '@angular/material/legacy-table';
import { MatLegacyOption } from '@angular/material/legacy-core';
import { MatSort } from '@angular/material/sort';
import { MatLegacyDialog, MatLegacyDialogRef} from '@angular/material/legacy-dialog';
import { EngagementInsightsService } from '@lib/umwelt-lib';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '@lib/umwelt-lib';
import { ActivatedRoute } from '@angular/router'
import { AddHighlightsComponent } from '../../modals/add-highlights/add-highlights.component';
import { jsPDF } from "jspdf";
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { FilterlistService } from '@lib/umwelt-lib';
// import PerfectScrollbar from 'perfect-scrollbar';
import { IntelHeatmapService } from '@lib/umwelt-lib';

class InsightsIntervention {
  public intname: any;
  constructor(
    intname: any
  ) {
    this.intname = intname;
  }
}
interface colorscaleOpts {}

interface ColorScale {
  name: string;
  colorscaleOpts: colorscaleOpts[];
}

@Component({
  selector: 'app-engagement-heatmap',
  templateUrl: './engagement-heatmap.component.html',
  styleUrls: ['./engagement-heatmap.component.scss']
})
export class EngagementHeatmapComponent implements OnInit {
  public columns_length: any;
  filterForm: FormGroup;
  public SelectedIntervention = ''
  public SelectedInterventionID = ''
  intervention_list = [];
  intnames = [];
  searchTextIntName='';
  showForm: boolean = false;
  showIntervention: boolean = true;
  @Input() cap1 : any = '';
  @Input() cap2 : any = '';
  highlightIntName = false;
  searchedinterventions: string[] = this.intervention_list;
  list = JSON.parse(localStorage.getItem('List'));
  showTableSelected: string = 'factors';
  public viewValue:boolean = true;
  public viewPercentage:boolean = false;  //button will be shown
  public engagementBtnText: string = 'Ratings';
  public downloadMedia: boolean = false;
  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;
  @ViewChild('search',{static:true}) searchTextBox: ElementRef;
  @ViewChild('allInterventionSelected',{static: false}) private allInterventionSelected: MatLegacyOption;
  @ViewChild(MatSort,{static: true}) sort: MatSort;
  engagementOptForm: FormGroup;
  colorscaleList: ColorScale[] = [
    {
      name: 'Color Scale',
      colorscaleOpts: JSON.parse(localStorage.getItem('colorscale'))
    }
  ];
  selectedScale : any = 1;
  colorScale = JSON.parse(localStorage.getItem('colorscale'));
  public downloadFlag;
  public showDownloadingMsg: boolean = false;
  showMagicBox: boolean = false;
  heatmapMagicFlag = JSON.parse(localStorage.getItem('heatmapMagicStatus'));
  constructor(public dialog:MatLegacyDialog,
    public insights:EngagementInsightsService,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private filterlistService: FilterlistService,
    private formBuilder: FormBuilder,
    private ren: Renderer2,
    public intelHeatmapService: IntelHeatmapService
    )
    {

    this.filterForm = new FormGroup(
      {
        intname: new FormControl(''),
      }
    );
    let details = JSON.parse(atob(sessionStorage.getItem('details')));
    let empType = this.auth.getEmpType();
      this.filterlistService.fetchFilterlistData(details.empcode,empType).then((res: any) => {
        let data = JSON.parse(JSON.stringify(res));
        this.intnames = data.intervention;
        this.filterForm.controls['intnames'].setValue(this.intnames);
        this.showForm = true;
      });
    this.route.queryParams.subscribe((params:any) => {
      if(params){
        this.filterForm = new FormGroup(
          {
            intnames: new FormControl(''),
          }
        );
      }
    });
  }
  // @HostListener('mousewheel', ['$event']) onMousewheel(event) {
  //   let elemFactor = document.getElementById('tableFactors');
  //   // elem.scrollLeft -= (event.wheelDelta*30);
  //   elemFactor.scrollLeft += (event.deltaX*30);

  //   let elemDriver = document.getElementById('driverFactors');
  //   // elem.scrollLeft -= (event.wheelDelta*30);
  //   elemDriver.scrollLeft += (event.deltaX*30);

  //   let elemQuestion = document.getElementById('driverQuestions');
  //   // elem.scrollLeft -= (event.wheelDelta*30);
  //   elemQuestion.scrollLeft += (event.deltaX*30);

  //   event.preventDefault();
  // }


  changeInput(value,type){
    if(value.data == null){
      if(type == 'intname'){this.searchTextIntName =  this.searchTextIntName.slice(0, this.searchTextIntName.length - 1)}
    }
    else{
      if(type == 'intname'){this.searchTextIntName = this.searchTextIntName+value.data}
    }
  }


  toggleAllSelection(type) {
    if(type == 'intname'){
      if (this.allInterventionSelected.selected) {
        this.filterForm.controls['intnames'].patchValue([...this.intnames.map(item => item),0])
      } else {
        this.filterForm.controls['intnames'].patchValue([]);
      }
    }
  }

  
  getFilterOnIntName(){
    let data = this.filterForm;
    var res = data.value.intnames.map(s=>s.IntID);
    var res_names = data.value.intnames.map(s=>s.IntName);
    this.insights.SelectedInterventionID = res
    this.insights.SelectedIntervention = res_names
    this.insights.getHeatList()
  }


  async onChange(comment) {
    await this.insights.getHeatList()
    this.SelectedIntervention = comment.IntName
    this.SelectedInterventionID = comment.IntID
 }


  export(){
    let obj = [
      {
        intnames: this.filterForm.value.intnames === "all" ? "" : (this.filterForm.value.intnames).toString(),
    }]}

  async ngOnInit() {
    this.engagementOptForm = this.formBuilder.group({
      highlightVal: [this.selectedScale, [Validators.required]],
      topBottomVal: [this.insights.topBottomRuleSelected, [Validators.required]],
      ouVal: [this.insights.selectedFilter, [Validators.required]],
      heatmapVal: [this.showTableSelected, [Validators.required]],
    });

    await this.insights.getHeatList()
    this.columns_length = this.insights['displayedColumns'].length
    this.SelectedIntervention = "All"
    this.intervention_list = this.intnames

    // if (this.insights.typeHeatlist == 'factors'){
    //   document.addEventListener("DOMContentLoaded", function () {
    //     // Get the table and the container div
    //     const table = document.getElementById("table1");
    //     const container = document.getElementById("tableFactors");
      
    //     // Initialize Perfect Scrollbar
    //     const ps = new PerfectScrollbar(container);
      
    //     // Function to set the container height based on table's scrollHeight
    //     function adjustScrollbarHeight() {
    //       container.style.height = table.scrollHeight + "px";
    //       ps.update(); // Update Perfect Scrollbar
    //     }
      
    //     // Adjust scrollbar height initially and whenever table content changes
    //     adjustScrollbarHeight();
    //   });
    // }
    // else if (this,this.insights.typeHeatlist == 'drivers'){
    //   document.addEventListener("DOMContentLoaded", function () {
    //     // Get the table and the container div
    //     const table = document.getElementById("table2");
    //     const container = document.getElementById("driverFactors");
      
    //     // Initialize Perfect Scrollbar
    //     const ps = new PerfectScrollbar(container);
      
    //     // Function to set the container height based on table's scrollHeight
    //     function adjustScrollbarHeight() {
    //       container.style.height = table.scrollHeight + "px";
    //       ps.update(); // Update Perfect Scrollbar
    //     }
      
    //     // Adjust scrollbar height initially and whenever table content changes
    //     adjustScrollbarHeight();
    //   });
    // }
    // else {
    //   document.addEventListener("DOMContentLoaded", function () {
    //     // Get the table and the container div
    //     const table = document.getElementById("table3");
    //     const container = document.getElementById("driverQuestions");
      
    //     // Initialize Perfect Scrollbar
    //     const ps = new PerfectScrollbar(container);
      
    //     // Function to set the container height based on table's scrollHeight
    //     function adjustScrollbarHeight() {
    //       container.style.height = table.scrollHeight + "px";
    //       ps.update(); // Update Perfect Scrollbar
    //     }
      
    //     // Adjust scrollbar height initially and whenever table content changes
    //     adjustScrollbarHeight();
    //   });
    // }

  }
  async submit(e?){
    if (e){
      this.insights.selectedFilter = e
      this.insights.respondentFilter['flag'] = '0'
    }
    await this.insights.getHeatList(this.insights.typeHeatlist, this.insights.selectedFactor, this.insights.selectedDriver)
    this.resetSorting()
  }

  factorSelected:any = ''
  subfactorSelected:any = ''


  search(query: string){
    let result = this.select(query)
    this.intervention_list = result;
  }

  select(query: string):string[]{
    let result: string[] = [];
    if (query == ''){
      return result = this.intnames
    }
    else{
    for(let a of this.intervention_list){
      if(a.IntName.indexOf(query) > -1){
        result.push(a)
      }
    }
    return result
  }
}

  addHighlightValues(type:any){
    let hightlightModal = this.dialog.open(AddHighlightsComponent, {
      panelClass: 'dialog-padding-0',
      data: {
        type,
        [type]:this.insights.rules[type],
        valueType: this.viewValue ? "percentage" : "value",
        respondentFlag: false
      }
    });
    hightlightModal.afterClosed().subscribe(
      res => {
        if (res) {
          if(['greater','lesser','between'].includes(type)){
            this.insights.hightlightCellRuleSelected = type;
            // ['greater','lesser','between'].forEach((d:any)=>{
            //   if(d!=type){
            //     this.insights.rules[d] = [{}]
            //   }
            // })
            this.engagementOptForm.get('highlightVal').setValue(this.insights.hightlightCellRuleSelected)
          }
          if(['top','bottom'].includes(type)){
            this.insights.topBottomRuleSelected = type;
            // ['top','bottom'].forEach((d:any)=>{
            //   if(d!=type){
            //     this.insights.rules[d] = [{}]
            //   }
            // })
            this.engagementOptForm.get('topBottomVal').setValue(this.insights.topBottomRuleSelected)
            }
          this.insights.rules[type] = res;
          // this.engagementOptForm.get('highlightVal').setValue(this.insights.hightlightCellRuleSelected)
          // this.engagementOptForm.get('topBottomVal').setValue(this.insights.topBottomRuleSelected)
          this.submit()
        }
        // this.engagementOptForm.get('highlightVal').setValue(this.insights.hightlightCellRuleSelected)
        // this.engagementOptForm.get('topBottomVal').setValue(this.insights.topBottomRuleSelected)
      }
    )
  }

  openRespondentMenu(type){
    this.insights.respondentFilter['type'] = type
    let hightlightModal = this.dialog.open(AddHighlightsComponent, {
      panelClass: 'dialog-padding-0',
      data: {
        type,
        [type]:this.insights.respondentFilter[type],
        respondentFlag: true
      }
    });
    hightlightModal.afterClosed().subscribe(
      res => {
        if (res) {
          this.insights.respondentFilter[type] = res;
          this.insights.respondentFilter['flag'] = '1'
          this.submit()
        }
      }
    )
  }

  changeHighlightVal(e){
    if (e == 'greater' || e == 'lesser' || e == 'between'){
      if(this.insights.hightlightCellRuleSelected !== 'colorscale'){
        this.engagementOptForm.get('highlightVal').setValue(this.insights.hightlightCellRuleSelected)
      }else{
        this.engagementOptForm.get('highlightVal').setValue(this.selectedScale)
      }
    }
    else{
      this.selectedScale = e
      this.insights.hightlightCellRuleSelected = 'colorscale';
      // ['greater','lesser','between'].forEach((d:any)=>{
      //   if(d!='greater'){
      //     this.insights.rules[d] = [{}]
      //   }else{
      //     this.insights.rules[d] = [
      //       {value:4,pervalue:80,bg:'#9292ff',font:'white',label:'Positive'},
      //       {value:3,pervalue:60,bg:'#ffdbdb',font:'white',label:'Neutral'},
      //       {value:0,pervalue:0,bg:'#ff4949',font:'white',label:'Negative'}
      //     ]
      //   }
      // })

      this.engagementOptForm.get('highlightVal').setValue(this.selectedScale)
      for (const scale of this.colorScale) {
        if (scale.ColorScaleID == e) {
          this.insights.selectedColorscale = scale.ColorScale
          this.submit()
        }
      }
    }
  }

  changeTopBottomVal(e){
    if (e == 'top' || e == 'bottom'){
      this.engagementOptForm.get('topBottomVal').setValue(this.insights.topBottomRuleSelected)
    }
  }

  changeRespondentFilterFlag(){
    this.insights.respondentFilter['flag'] = '0'
    this.submit()
  }

  getTooltipData(item,data:any){
    let string;
    if (item == 'Total Respondents'){
      string = ''
    }
    else if (this.insights.hightlightCellRuleSelected == 'colorscale'){
      if (Number(data.total) > 0){
        string = `
        No. of Responses: ${data.total || 0}`
        this.insights.rules['greater'].forEach(element => {
          if(data[`${element.label} %`]){
            string += `
            ${element.label}: ${data[`${element.label} %`] !== '-' ? data[`${element.label} %`] + '%' : '0%'} , ${data[`${element.label}`] !== '-' ? data[`${element.label}`] : '0'} of ${data.total}`
          }
        });
      }else{
        string = `
        No. of Responses: ${data.total || 0}`
        this.insights.rules['greater'].forEach(element => {
          if(data[`${element.label} %`]){
            string += `
            ${element.label}: ${data[`${element.label} %`]} , ${data[`${element.label}`]} of ${data.total}`
          }
        });
      }
    }else{
      if (Number(data.total) > 0){
        string = `
        No. of Responses: ${data.total || 0}`
        this.insights.rules[this.insights.hightlightCellRuleSelected].forEach(element => {
          if(data[`${element.label} %`]){
            string += `
            ${element.label}: ${data[`${element.label} %`] !== '-' ? data[`${element.label} %`] + '%' : '0%'} , ${data[`${element.label}`] !== '-' ? data[`${element.label}`] : '0'} of ${data.total}`
          }
        });
      }else{
        string = `
        No. of Responses: ${data.total || 0}`
        this.insights.rules[this.insights.hightlightCellRuleSelected].forEach(element => {
          if(data[`${element.label} %`]){
            string += `
            ${element.label}: ${data[`${element.label} %`]} , ${data[`${element.label}`]} of ${data.total}`
          }
        });
      }
    }
    // else if (this.insights.hightlightCellRuleSelected == 'colorscale'){
    //     string = `
    //     No. of Responses: ${data.total || 0}`
    //     this.insights.rules['greater'].forEach(element => {
    //       if(data[`${element.label} %`]){
    //         string += `
    //         ${element.label}: ${data[`${element.label} %`]}, ${data[`${element.label}`]} of ${data.total}`
    //       }
    //     });
    // }else{
    //     string = `
    //     No. of Responses: ${data.total || 0}`
    //     this.insights.rules[this.insights.hightlightCellRuleSelected].forEach(element => {
    //       if(data[`${element.label} %`]){
    //         string += `
    //         ${element.label}: ${data[`${element.label} %`]}, ${data[`${element.label}`]} of ${data.total}`
    //       }
    //     });
    // }

      // string = `
      // No. of Responses: ${data.total || 0}
      // Positive: ${data['Good %'] !== '-' ? data['Good %'] + ' %' : '0 %'} , ${data.Good !== '-' ? data.Good : '0'} of ${data.total}
      // Negative: ${data['Bad %'] !== '-' ? data['Bad %'] + ' %' : '0 %'} , ${data.Bad !== '-' ? data.Bad : '0'} of ${data.total}
      // Neutral: ${data['Average %'] !== '-' ? data['Average %'] + ' %' : '0 %'} , ${data.Average !== '-' ? data.Average : '0'} of ${data.total}`
    // let string = `
    // No. of Responses: ${data.total || 0}`
    // this.insights.rules[this.insights.hightlightCellRuleSelected].forEach(element => {
    //   if(data[`${element.label} %`]){
    //     string += `
    //     ${element.label}: ${data[`${element.label} %`]}, ${data[`${element.label}`]} of ${data.total}`
    //   }
    // });
    return string
  }

  getCleanedPercentage(elem): number {
    return parseFloat(elem.replace('%', ''));
  }

  downloadImage(){
    let element;
    if (this.insights.typeHeatlist=='drivers'){
      element = 'table2'
    }else if (this.insights.typeHeatlist=='questions'){
      element = 'table3'
    }else{
      element = 'table1'
    }
    var node = document.getElementById(element);
    domtoimage.toPng(node)
    .then((dataUrl) => {
      var link = document.createElement('a');
      link.href = dataUrl;
     link.download = 'heatmap.png';
    this.showDownloadingMsg = false;
    link.click();
    });
  this.changeFlag()
 }

 downloadPDF(){
  let element;
  if (this.insights.typeHeatlist=='drivers'){
    element = 'table2'
  }else if (this.insights.typeHeatlist=='questions'){
    element = 'table3'
  }else{
    element = 'table1'
  }

  var node = document.getElementById(element);
    domtoimage.toPng(node)
    .then((dataUrl) => {
      const contentDataURL = dataUrl
      let pdf = new jsPDF('p', 'mm', 'a4');
      var position = 0;
      const imgProps= pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(contentDataURL,'PNG',0,position,pdfWidth, pdfHeight);
      this.showDownloadingMsg = false;
      pdf.save('heatmap.pdf');})
  }

  openMagicBox(){
    this.showMagicBox = !this.showMagicBox
  }

  closeMagicBox() {
    this.showMagicBox = false;
  }

  formatFilter(filter,filter2){
    if(filter.type == '1'){
      filter.monthEnd = filter.monthStart
      filter.yearEnd = filter.yearStart
      filter2.monthEnd = filter2.monthStart
      filter2.yearEnd = filter2.yearStart
    } else if(filter.type == '2'){
        filter.monthStart = String((3 * filter.quarterStart)- 2)
        filter.monthEnd = String(3 * filter.quarterStart)
        filter.yearEnd = filter.yearStart
        filter2.monthStart = String((3 * filter2.quarterStart)- 2)
        filter2.monthEnd = String(3 * filter2.quarterStart)
        filter2.yearEnd = filter2.yearStart

    } else if(filter.type == '3'){
      filter.monthStart = '1'
      filter.monthEnd = '12'
      filter.yearEnd = filter.yearStart

      filter2.monthStart = '1'
      filter2.monthEnd = '12'
      filter2.yearEnd = filter2.yearStart
    }
    delete filter.quarterEnd
    // delete filter.quarterStart
    delete filter2.quarterEnd
    // delete filter2quarterStart
    delete filter2.yearStartQuart
    delete filter.yearStartQuart
    return [filter,filter2]
  }

  saveFile = (blobContent: Blob, fileName: string) => {
    const blob = new Blob([blobContent], { type: 'application/vnd.ms-excel' });
    saveAs(blob, fileName);
  };

  downloadExcel(){
    let details = JSON.parse(atob(sessionStorage.getItem('details')));
    let filterCopy = JSON.parse(JSON.stringify(this.auth.filter))
    let filterCopy2 = JSON.parse(JSON.stringify(this.auth.filter2))
    let [formattedFilter,formattedFilter2] = this.formatFilter(filterCopy,filterCopy2)
    let param =
    {
      empType:this.insights.empType || 0,
      empCode:details.empcode,
      intervention: this.insights.SelectedInterventionID,
      filter_by: this.insights.selectedFilter,
      topBottomRuleSelected: this.insights.topBottomRuleSelected,
      hightlightCellRuleSelected: this.insights.hightlightCellRuleSelected,
      rules: this.insights.rules,
      range_filter_1:formattedFilter,
      range_filter_2:formattedFilter2,
      factorname:this.factorSelected,
      subfactorname:this.subfactorSelected,
      responseType: 'excel',
      type: this.insights.typeHeatlist,
      engagementParams: this.auth.ouFilters,
      reportType: this.viewValue ? 'percentage' : 'score',
      colorscale: this.insights.selectedColorscale,
      respondentFilter : this.insights.respondentFilter
    }
    this.insights.getHeatlistExcelExport(param).subscribe(res => {
      this.saveFile(res.body, 'heatmap.xls');})
  }

  async backToFactors(){
    this.factorSelected = ''
    this.subfactorSelected = ''
    this.insights.typeHeatlist = 'factors'
    this.showTableSelected = 'factors'
    await this.insights.getHeatList(this.insights.typeHeatlist, '', '')
    this.resetSorting()
  }

  async backToSubfactor(){
    this.subfactorSelected=''
    this.insights.typeHeatlist = 'drivers'
    this.showTableSelected = 'drivers'
    await this.insights.getHeatList(this.insights.typeHeatlist, this.insights.selectedFactor, '')
    this.resetSorting()
  }

  async showTablesFor(selected){
    this.subfactorSelected = ''
    this.factorSelected = ''
    this.showTableSelected = selected
    this.insights.typeHeatlist = selected
    await this.insights.getHeatList(this.insights.typeHeatlist)
    this.resetSorting()
  }

  setTableValue(){
    if (this.viewPercentage){
      this.viewPercentage = false
      this.viewValue = true
      this.engagementBtnText = 'Ratings'
    }
    else if (this.viewValue){
      this.viewPercentage = true
      this.viewValue = false
      this.engagementBtnText = 'Engaged %'
    }
  }

  setCellColor(elem){
    if (this.viewPercentage) {
      if (elem['total'] == 0 || elem['total'] == '-'){
        return '#b5b1b1'
      }
      else{
        return elem['bg-color']
      }
    }
    else if (this.viewValue){
      if (elem['total'] == 0 || elem['total'] == '-'){
        return '#b5b1b1'
      }
      else{
        return elem['bg-color-per']
      }
    }
  }

  changeFlag(){
    setTimeout(()=>{ this.downloadMedia = false }, 1000)
  }

  downloadMediaOpt(flag){
    this.showDownloadingMsg = true
    this.downloadFlag = flag
    this.downloadMedia = true
    if (flag == 'image'){
      setTimeout(()=>{ this.downloadImage() }, 1)
    }
    else {
      setTimeout(()=>{ this.downloadPDF() }, 1)
    }
  }


  //on hover show mat-menu code

  menuEnter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80)
  }

  buttonEnter(trigger) {
    setTimeout(() => {
      if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        trigger.openMenu();
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        trigger.openMenu();
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
      }
    })
  }

  buttonLeave(trigger, button) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100)
  }

  sortData(
    matsort: MatSort,
    data,table) {
    const activeColumn = matsort.active;
    const order = matsort.direction;

    if (!activeColumn || order === '') {
      if (table == 'factor'){
        data = [...this.insights.heatlist]
        this.insights.table1DataSource = new MatLegacyTableDataSource(data);
      }
      else if (table == 'driver'){
        data = [...this.insights.driverheatlist]
        this.insights.table2DataSource = new MatLegacyTableDataSource(data);
      }
      else{
        data = [...this.insights.driverQuestionsheatlist]
        this.insights.table3DataSource = new MatLegacyTableDataSource(data);
      }
      return;
    }

    if (this.viewValue){
      data.sort((a, b) => {
        const aValue = a[activeColumn].percentage_value;
        const bValue = b[activeColumn].percentage_value;
    
        // Convert the values to numbers for proper comparison
        const numA = parseFloat(aValue);
        const numB = parseFloat(bValue);
    
        if (order === 'asc') {
          return numA - numB;
        } else {
          return numB - numA;
        }
      });

      if (table == 'factor'){
        this.insights.table1DataSource = new MatLegacyTableDataSource(data);
      }
      else if (table == 'driver'){
        this.insights.table2DataSource = new MatLegacyTableDataSource(data);
      }
      else{
        this.insights.table3DataSource = new MatLegacyTableDataSource(data);
      }
    }
    else{
      data.sort((a, b) => {
        const aValue = a[activeColumn].value;
        const bValue = b[activeColumn].value;
    
        // Convert the values to numbers for proper comparison
        const numA = parseFloat(aValue);
        const numB = parseFloat(bValue);
    
        if (order === 'asc') {
          return numA - numB;
        } else {
          return numB - numA;
        }
      });

      if (table == 'factor'){
        this.insights.table1DataSource = new MatLegacyTableDataSource(data);
      }
      else if (table == 'driver'){
        this.insights.table2DataSource = new MatLegacyTableDataSource(data);
      }
      else{
        this.insights.table3DataSource = new MatLegacyTableDataSource(data);
      }
    }
  }

  resetSorting() {
    this.sort.active = '';
    this.sort.direction = 'asc'; 
    this.sort.sortChange.emit({ active: this.sort.active, direction: this.sort.direction });
  }
}