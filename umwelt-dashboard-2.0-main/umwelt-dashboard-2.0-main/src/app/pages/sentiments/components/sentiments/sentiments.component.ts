import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SentimentsService } from '@lib/umwelt-lib';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { EmployeeDetailComponent } from '../../modals/employee-detail/employee-detail.component';
import { saveAs } from 'file-saver';
import { LegacyPageEvent } from '@angular/material/legacy-paginator';
import { AuthService } from '@lib/umwelt-lib';
// import { SubscriberModalComponent } from '../../../shared/subscriber-modal/subscriber-modal.component';
import { ActivatedRoute } from '@angular/router'
import { RecordActionComponent } from '../../../../common-views/modals/record-action/record-action.component';
import { FilterConstants } from '@lib/umwelt-lib';
import { WordCloudComponent } from '../../modals/word-cloud/word-cloud.component';
import { NguCarouselConfig } from '@ngu/carousel';

class Comment {
  public anonymous: any;
  public band: any;
  public comment: any;
  public completedOn: any;
  public department: any;
  public designation: any;
  public function: any;
  public hrspoc: any;
  public location: any;
  public manager: any;
  public company: any;
  public intname: any;
  public name: any;
  public question: any;
  public role: any;
  public tag = "";
  public score: any;
  public factor: any;
  public driver: any;
  public empcode: any;
  public pk: any;
  constructor(
    anonymous: any, band: any, comment: any, completedOn: any, department: any,
    designation: any, functions: any, hrspoc: any, location: any, manager: any,
    company: any, intname: any, name: any, question: any, role: any, score: any, factor: any,
    subfactor: any, empcode:any, pk: any
  ) {
    this.anonymous = anonymous;
    this.band = band;
    this.comment = comment;
    this.completedOn = completedOn;
    this.department = department;
    this.designation = designation;
    this.function = functions;
    this.hrspoc = hrspoc;
    this.location = location;
    this.manager = manager;
    this.company = company;
    this.intname = intname;
    this.name = name;
    this.question = question;
    this.role = role;
    this.score = score;
    this.factor = factor;
    this.driver = subfactor;
    this.empcode = empcode;
    this.pk = pk;
  }
}

@Component({
  selector: 'app-sentiments',
  templateUrl: './sentiments.component.html',
  styleUrls: ['./sentiments.component.scss']
})
export class SentimentsComponent implements OnInit {

  comments = [];
  scoreCategory = [];
  factors = [];
  subFactors = [];
  commentsList = [];
  managers = [];
  hrSpocs = [];
  companies = [];
  intnames = [];
  commentForm: FormGroup;
  showForm: boolean = false;
  showComments: boolean = true;
  totalNoOfComments = 0;
  gettingResults = false;
  list:any;
  isPositive = false; isNegative = false; isNeutral = false;
  totalNoOfPosComments = 0; totalNoOfNegComments = 0; totalNoOfNeuComments = 0;
  public pageSize = 20;
  public length = 0;
  public pageSizeOptions = [20, 40, 60, 80];
  public pageIndex = 1;
  public pageEvent: LegacyPageEvent;
  public intentScore;
  public isCommentReport = false;
  public reportErrorMsg;
  public carouselTile;
  public intentWords = [];
  public posWords = [];// = ['Pos1','Pos2','Pos3','Pos4','Pos5','Pos6','Pos7','Pos8','Pos9','Pos10','Pos11','Pos12'];
  public negWords = [];// = ['Neg1','Neg2','Neg3','Neg4','Neg5','Neg6','Neg7','Neg8','Neg9','Neg10','Neg11','Neg12'];
  public neuWords = [];// = ['Neu1','Neu2','Neu3','Neu4','Neu5','Neu6','Neu7','Neu8','Neu9','Neu10','Neu11','Neu12'];
  public selectIndex = [];
  public maxLength;
  public selectedWord;
  public selectedIntent;
  public tempIntent = [];
  public searchTextManager='';
  public searchTextHrspoc='';
  public searchTextCompany='';
  public searchTextIntervention='';
  public selectedFilters=[];
  public getCommentCountRes;
  cap1:any = ''
  cap2:any = ''
  quarters = FilterConstants.getQuarters();
  months = FilterConstants.getMonths();
  posPercent = ''; negPercent = ''; neuPercent = '';
  posDiff = ''; negDiff= ''; neuDiff= '';

  public carouselConfig: NguCarouselConfig = {
    grid: {xs: 2, sm: 4, md: 6, lg: 9, all: 0},
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

  constructor(private commentService: SentimentsService, 
    private ref: ChangeDetectorRef,
    public dialog: MatLegacyDialog,
    private auth: AuthService,
    public route: ActivatedRoute
    ) {
    this.auth.setCurrentPage('sentiments');
    this.cap1 = this.getTitle('filter');
    this.cap2 = this.getTitle('filter2');
    this.commentForm = new FormGroup(
      {
        comments: new FormControl(''),
        scoreCategory: new FormControl(''),
        factors: new FormControl(''),
        subFactors: new FormControl(''),
        managers: new FormControl(''),
        companies: new FormControl(''),
        intnames: new FormControl(''),
        hrSpocs: new FormControl(''),
        from: new FormControl(this.getMonthBackDate()),
        to: new FormControl(new Date())
      }
    );
    this.commentService.getCommentType().subscribe(
      res => {
        this.createForm(res);
      }
    )

    let isEmpExp = this.auth.getEmpExp()
    // if(!isEmpExp){
    //   this.dialog.open(SubscriberModalComponent,{
    //     disableClose: true,
    //     data:{
    //       'moduleName':'Employee Experience'
    //     }
    //   });
    // }

    this.route.queryParams.subscribe((params:any) => {
      if(params){
        const {from,to} = params
        this.commentForm = new FormGroup(
          {
            comments: new FormControl(''),
            scoreCategory: new FormControl(''),
            factors: new FormControl(''),
            subFactors: new FormControl(''),
            managers: new FormControl(''),
            companies: new FormControl(''),
            intnames: new FormControl(''),
            hrSpocs: new FormControl(''),
            from: new FormControl(from?from:this.getMonthBackDate()),
            to: new FormControl(to?to:new Date())
          }
        );
      }
    });

    this.auth.getSelectedFilter().subscribe(filter => {
      this.selectedFilters = filter;
      if (this.auth.currentPage === 'sentiments' && this.auth.isFilterSet){
        this.sendSelectedFilters()
      }
    });
    this.auth.getDateFilter().subscribe(filter => {
      if (this.auth.currentPage === 'sentiments' && this.auth.isDateFilterSet){
        this.cap1 = this.getTitle('filter');
        this.cap2 = this.getTitle('filter2');
        this.sendSelectedFilters()
      }
    });
  }

  getMonthBackDate() {
    let today = new Date();
    today.setDate(today.getDate() - 30);
    return today;
  }

  createForm(res) {
    this.comments = JSON.parse(JSON.stringify(res.comment));
    this.scoreCategory = JSON.parse(JSON.stringify(res.category));
    this.showForm = true;
    this.getTotalComments();
    this.viewComments();
  }

  ngOnInit() {
    this.list = JSON.parse(localStorage.getItem('List'));
    this.commentForm.controls['factors'].valueChanges.subscribe(
      val => {
        this.subFactors = [];
        if (val && val !== 'all') {
          let selectedComment = this.comments.filter(x => x.id === this.commentForm.controls['comments'].value);
          let selectedFactor = selectedComment[0].factor.filter(x => x.id === val);
          selectedFactor[0].subfactor.forEach(
            item => {
              this.subFactors.push({
                id: item.id,
                name: item.name
              })
            }
          )
        } else {
          this.commentForm.controls['subFactors'].setValue('all');
        }
      }
    )
    this.commentForm.controls['comments'].valueChanges.subscribe(
      val => {
        this.factors = [];
        this.subFactors = [];
        this.commentForm.controls['factors'].setValue('');
        this.commentForm.controls['subFactors'].setValue('');
        if (val && val !== 'all') {
          let selectedComment = this.comments.filter(x => x.id === val);
          selectedComment[0].factor.forEach(
            item => {
              this.factors.push({
                id: item.id,
                name: item.name
              })
            }
          )
        }
      }
    )

    // this.carouselTile = {
    //   grid: {xs: 2, sm: 4, md: 6, lg: 9, all: 0},
    //   slide: 2,
    //   speed: 400,
    //   animation: 'lazy',
    //   point: {
    //     visible: false
    //   },
    //   load: 2,
    //   touch: true,
    //   easing: 'ease'
    // }
  }

  changeInput(value,type){
    if(value.data == null){
      if(type == 'manager'){this.searchTextManager =  this.searchTextManager.slice(0, this.searchTextManager.length - 1)}
      else if(type == 'hr'){this.searchTextHrspoc = this.searchTextHrspoc.slice(0, this.searchTextHrspoc.length - 1)}
      else if(type == 'company'){this.searchTextCompany = this.searchTextCompany.slice(0, this.searchTextCompany.length - 1)}
      else if(type == 'intname'){this.searchTextIntervention = this.searchTextIntervention.slice(0, this.searchTextIntervention.length - 1)}
    }
    else{
      if(type == 'manager'){this.searchTextManager = this.searchTextManager+value.data}
      else if(type == 'hr'){this.searchTextHrspoc = this.searchTextHrspoc+value.data}
      else if(type == 'company'){this.searchTextCompany = this.searchTextCompany+value.data}
      else if(type == 'intname'){this.searchTextIntervention = this.searchTextIntervention+value.data}
    }
  }

  selectWord(index,word,score?){
    if(this.isPositive){
      this.initiateSelectIndex(this.posWords.length);
    }
    else if(this.isNeutral){
      this.initiateSelectIndex(this.neuWords.length);
    }
    else if(this.isNegative){
      this.initiateSelectIndex(this.negWords.length);
    }
    else{
      this.initiateSelectIndex(this.intentWords.length);
    }
    this.selectIndex[index] = 1;
    this.selectedWord = word;
    if(score){
      this.viewComments(score,word,1);
    }
    else{
      if(this.isPositive){
        this.viewComments('1',word)
      }
      else if(this.isNeutral){
        this.viewComments('2',word)
      }
      else{
        this.viewComments('3',word)}
    }
  }

  removeSelectedWord(){
    this.selectedWord = "";
    if(this.isPositive){
      this.viewComments('1')
    }
    else if(this.isNeutral){
      this.viewComments('2')
    }
    else if(this.isNegative){
      this.viewComments('3')
    }
    else{
      this.viewComments()
    }
  }

  removeSelectedIntent(){
    this.selectedIntent = "";
    if(this.selectedWord){
      this.initiateSelectIndex(this.maxLength);
      if(this.isPositive){
        for(let i=0; i<this.tempIntent.length; i++){
          if(this.tempIntent[i].Entities == this.selectedWord && this.tempIntent[i].Score == '1'){
            this.selectIndex[i] = 1;
          }
        }
        this.viewComments(1,this.selectedWord,1);
      }
      if(this.isNeutral){
        for(let i=0; i<this.tempIntent.length; i++){
          if(this.tempIntent[i].Entities == this.selectedWord && this.tempIntent[i].Score == '2'){
            this.selectIndex[i] = 1;
          }
        }
        this.viewComments(2,this.selectedWord,1);
      }
      if(this.isNegative){
        for(let i=0; i<this.tempIntent.length; i++){
          if(this.tempIntent[i].Entities == this.selectedWord && this.tempIntent[i].Score == '3'){
            this.selectIndex[i] = 1;
          }
        }
        this.viewComments(3,this.selectedWord,1);
      }
    }
    else{
      this.viewComments(undefined,undefined,1);
    }
  }

  getTodayDate() {
    return new Date();
  }

  getFromMaxDate() {
    if (this.commentForm) {
      if (this.commentForm.controls['to'].value) {
        return this.commentForm.controls['to'].value;
      }
    }

    return this.getTodayDate();
  }

  getTotalComments(){
    let empCode = JSON.parse(atob(sessionStorage.getItem('details'))).empcode;
    let empType = this.auth.getEmpType();
    let from = new Date(this.commentForm.value.from)
    let to = new Date(this.commentForm.value.to)
    
    this.clear();
    this.showComments = true;
    let obj = {
      comments: this.commentForm.value.comments === "all" ? "" : (this.commentForm.value.comments).toString(),
      factor: this.commentForm.value.factors === "all" ? "" : (this.commentForm.value.factors).toString(),
      subFactor: this.commentForm.value.subFactors === "all" ? "" : (this.commentForm.value.subFactors).toString(),
      flag: 0,
      scoreCategory: '',
      empcode: empCode,
      emptype: empType,
      sentimentParams: this.selectedFilters,
      range_filter_1: this.auth.filter,
      range_filter_2: this.auth.filter2
    }

    this.commentService.getCommentCount(obj).subscribe(
      res => {
        let number = JSON.parse(JSON.stringify(res));
        let error = "Data Not Found.";
         this.totalNoOfPosComments = number==error? 0 :number.Positive;
         this.totalNoOfNeuComments = number==error? 0 :number.Neutral;
         this.totalNoOfNegComments = number==error? 0 :number.Negative;
         this.totalNoOfComments = this.totalNoOfPosComments+this.totalNoOfNegComments+this.totalNoOfNeuComments;
         this.posPercent = number==error? '' :number.Positive_percentage;
         this.negPercent = number==error? '' :number.Negative_percentage;
         this.neuPercent = number==error? '' :number.Neutral_percentage;
         this.posDiff = number==error? '' :number.pos_diff;
         this.negDiff = number==error? '' :number.neg_diff;
         this.neuDiff = number==error? '' :number.neu_diff;
      },
      error =>{
        console.log(error);
      }
    )
    this.viewComments();
    this.commentService.getIntentWords(obj).subscribe(
      res =>{
        let array = []
        array.push(res);
        let temp = [];
        this.posWords = [];
        this.neuWords = [];
        this.negWords = [];
        array.forEach(obj =>{
          obj.forEach(item =>{
            if(item != 'No Data Found'){
              temp.push(item)
            }
            if(item.Score == '1'){
              this.posWords.push(item)
            }
            else if(item.Score == '2'){
              this.neuWords.push(item)
            }
            else if(item.Score == '3'){
              this.negWords.push(item)
            }
          })
        })
        this.intentWords = temp;
        this.tempIntent = temp;
        this.maxLength = this.posWords.length > this.negWords.length ? (this.posWords.length>this.neuWords.length ? this.posWords.length : this.neuWords.length) : (this.negWords.length > this.neuWords.length ? this.negWords.length : this.neuWords.length);
        this.initiateSelectIndex(this.intentWords.length);
      }
    )
  }

  initiateSelectIndex(length){
    for(let i=0; i<length ;i++){
      this.selectIndex[i] = 0
    }
  }

  clear(){
    this.gettingResults = false;
    this.isCommentReport = false;
    this.isPositive = false;
    this.isNeutral = false;
    this.isNegative = false;
    this.commentsList = [];
    this.length = 0;
    this.selectedWord = "";
    this.selectedIntent = "";
  }

  resetPage(){
    this.pageIndex = 1;
    this.pageSize = 20;
  }

  changePage(pageEvent){
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex + 1;
    if(this.selectedWord && !this.selectedIntent){
      this.viewComments(this.intentScore,this.selectedWord,1)
    }
    else if(this.selectedIntent && !this.selectedWord){
      this.viewComments(this.intentScore,undefined,0)
    }
    else{
      this.viewComments(this.intentScore,this.selectedWord,0);
    }
  }

  viewComments(score?,word?,cardchange?) {
    let empCode = JSON.parse(atob(sessionStorage.getItem('details'))).empcode;
    let empType = this.auth.getEmpType();
    if(!word){
      this.selectIndex = [];
      if(score == "1"){
        this.initiateSelectIndex(this.posWords.length);
      }
      else if(score == "2"){
        this.initiateSelectIndex(this.neuWords.length);
      }
      else if(score == "3"){
        this.initiateSelectIndex(this.negWords.length);
      }
      else{
        if(this.tempIntent){
          this.initiateSelectIndex(this.tempIntent.length);
        }
      }
      this.selectedWord = ""
    }
    if(!cardchange){
      if(score=="1"){
        this.isPositive = true; this.isNegative = false; this.isNeutral = false;
        this.intentWords = this.posWords;
        this.selectedIntent = 'positive';
      }
      else if(score=="2"){
        this.isPositive = false; this.isNegative = false; this.isNeutral = true;
        this.intentWords = this.neuWords;
        this.selectedIntent = 'neutral';
      }
      else if(score == "3") { this.isPositive = false; this.isNegative = true; this.isNeutral = false;
        this.intentWords = this.negWords;
        this.selectedIntent = 'negative';
      }
    }
    else{
      this.isPositive = false; this.isNegative = false; this.isNeutral = false;
      this.intentWords = this.tempIntent;
    }

    if(this.intentScore !=score){
      this.resetPage();
    }
    this.intentScore = score;
    this.showComments = true;
    this.gettingResults = true;
    this.commentsList = [];
    let obj = {
      comments: this.commentForm.value.comments === "all" ? "" : (this.commentForm.value.comments).toString(),
      factor: this.commentForm.value.factors === "all" ? "" : (this.commentForm.value.factors).toString(),
      scoreCategory:score ? score: '',
      subFactor: this.commentForm.value.subFactors === "all" ? "" : (this.commentForm.value.subFactors).toString(),
      flag: 0,
      page: this.pageIndex,
      limit: this.pageSize,
      sentimentword: word ? word : '',
      empcode:empCode,
      emptype: empType,
      sentimentParams: this.selectedFilters,
      range_filter_1: this.auth.filter,
      range_filter_2: this.auth.filter2
    }

    this.commentService.getCommentList(obj).subscribe(
      res => {
        let result = JSON.parse(JSON.stringify(res));
        if(result[0].total !== 0 && result[0] !== "No Data Found"){
          this.totalNoOfComments = parseInt((result[0].total).toString());
          this.length = this.totalNoOfComments;
          this.commentsList = [];
          for(let i=1;i<result.length;i++){
            this.commentsList.push(
              new Comment(
                result[i]['anonymous'],
                result[i]['band'],
                result[i]['comment'],
                result[i]['completedOn'],
                result[i]['department'],
                result[i]['designation'],
                result[i]['function'],
                result[i]['hrspoc'],
                result[i]['location'],
                result[i]['manager'],
                result[i]['company'],
                result[i]['intname'],
                result[i]['name'],
                result[i]['question'],
                result[i]['role'],
                (result[i]['score']).toLowerCase(),
                result[i]['factor'],
                result[i]['subfactor'],
                result[i]['EmpCode'],
                result[i]['pk'],
              )
            )
          }
        } else {
          this.totalNoOfComments = 0;
          this.length = 0;
        }
        this.gettingResults = false;
        this.ref.detectChanges();
      }
    )
  }

  toggleComments() {
    if (this.commentForm.disabled) {
      this.commentForm.enable();
    } else {
      this.commentForm.disable();
    }
    this.showComments = !this.showComments
  }

  showEmployeeDetails(empID){
    let pk = {
      pk : empID,
      timezone : this.auth.timezone
    }
    const dialogRef = this.dialog.open(EmployeeDetailComponent,{
      width: '800px',
      data: pk, 
      panelClass: 'dialog-padding-0'
    })
  }

  showAcknowledgeDialog(empID){
    let employee = {
      Pk : empID
    }

    let actionPopUpDialogRef = this.dialog.open(RecordActionComponent,{
      height: '80%',
      width: '80%',
      panelClass: 'dialog-padding-0',
      data: {
        employee: employee,
        comment: '1'
      }
    })

    actionPopUpDialogRef.afterClosed().subscribe(
      result => {
        if(result){
          this.list.refreshData(result.status,result.pk);
        }
      }
    )
  }

  firstLetterUpper(theString) {
    let newString = theString.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g,function(c){
      return c.toUpperCase()
    });
    return newString;
  }

  export(){
    this.isCommentReport = true;
    this.reportErrorMsg = "Please Wait!! We are fetching report for you";
    let empCode = JSON.parse(atob(sessionStorage.getItem('details'))).empcode;
    let empType = this.auth.getEmpType();
    let obj = [
      {flag:"0"},
      { function:"",
        department:"",
        role:"",
        location:"",
        band:"",
        searchempcode:"",
        comments: this.commentForm.value.comments === "all" ? "" : (this.commentForm.value.comments).toString(),
        factor: this.commentForm.value.factors === "all" ? "" : (this.commentForm.value.factors).toString(),
        scoreCategory: this.commentForm.value.scoreCategory === "all" ? "" : (this.commentForm.value.scoreCategory).toString(),
        subFactor: this.commentForm.value.subFactors === "all" ? "" : (this.commentForm.value.subFactors).toString(),
        page: this.pageIndex,
        limit: this.pageSize,
        EmpType:empType,
        EmpCode:empCode,
        timezone: this.auth.timezone,
        reportParams: this.selectedFilters,
        filter: this.auth.filter,
    }]

    this.commentService.exportCommentList(obj).subscribe(
      res => {
        let date = new Date();
        let fileName;
        let dateStr = date.getDate() + "_" + (date.getMonth() + 1) + "_" + ((date.getFullYear() + "").substr(2, 2));
        fileName = "Comment_Report_" + " "+dateStr+".xls";
        this.saveFile(res.body,fileName);
        this.isCommentReport = false;
      },
      error =>{
        this.reportErrorMsg = "Some Error has been occured!!"
        console.log(error);
      }
    )
  }

  saveFile = (blobContent: Blob, fileName: string) => {
    const blob = new Blob([blobContent], { type: 'application/vnd.ms-excel' });
    saveAs(blob, fileName);
  };

  sendSelectedFilters(){
    this.getTotalComments()
    this.viewComments()
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

  createWordCloud(){

    const wordcloudDialogRef = this.dialog.open(WordCloudComponent,{
      width: '80%',
      minHeight: '80%',
      data: this.intentWords,
      panelClass: 'word-cloud'
    })
  }
}