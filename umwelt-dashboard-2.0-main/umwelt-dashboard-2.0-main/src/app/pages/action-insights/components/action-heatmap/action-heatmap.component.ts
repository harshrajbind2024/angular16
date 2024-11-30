import { Component, OnInit, SimpleChanges, Input, OnChanges, HostListener } from '@angular/core';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { AuthService } from '@lib/umwelt-lib';
import { ActivatedRoute } from '@angular/router'
import { ActionInsightsService } from '@lib/umwelt-lib';
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-action-heatmap',
  templateUrl: './action-heatmap.component.html',
  styleUrls: ['./action-heatmap.component.scss']
})
export class ActionHeatmapComponent implements OnInit, OnChanges {
  @Input() actioninsightsCardData : any;
  @Input() cap1 : any = '';
  @Input() cap2 : any = '';
  @Input() dateFilter: any;
  @Input() dateFilter2: any;
  @Input() selectedFilters = [];
  @Input() actionType: any;
  @Input() empType;
  public actionpendingShow:boolean = false;
  public actiontakenShow:boolean = false;
  public peopleretainedShow:boolean = false;
  public viewPercent:boolean = false;
  public viewNumber:boolean = true;  //button will be shown
  public btnText : string = 'View Numbers';
  public viewDiffFlag:boolean = true; //button will be shown
  public hideDiffFlag:boolean = false;
  public diffBtnText = 'View Difference';
  public export = 'percentage';
  public download:boolean=false;

  constructor(public dialog:MatLegacyDialog,
    public actionInsightsService:ActionInsightsService,
    public route: ActivatedRoute
    )
    {}
    // @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    //   let elem = document.getElementById('tableFactors');
    //   elem.scrollLeft += (event.deltaX*30);
    //   event.preventDefault();
    // }

    async ngOnInit() {
      let details = JSON.parse(atob(sessionStorage.getItem('details')));
      await this.actionInsightsService.getParentActionHeatlist({empType:this.empType,empCode:details.empcode,data_type:''})
    }

    async ngOnChanges(changes: SimpleChanges) {
      if(changes['actioninsightsCardData'] && changes['actioninsightsCardData'].currentValue && Object.keys(changes['actioninsightsCardData'].currentValue).length > 0){
        this.viewDiffFlag = true
        this.hideDiffFlag = false
        this.viewNumber = true
        this.viewPercent = false
        this.actiontakenShow = false
        this.actionpendingShow = false
        this.peopleretainedShow = false
        this.btnText = 'View Number'
        this.diffBtnText = 'View Difference'
      }
    }

    async update(param){
      let payload = {}
      if (param == 'action-pending'){
        if (this.actionpendingShow){
          this.actionpendingShow = false
        }
        else{
          this.actionpendingShow = true
          this.actiontakenShow = false
          this.peopleretainedShow = false
        }
      }
      if (param == 'action-taken'){
        if(this.actiontakenShow){
          this.actiontakenShow = false
        }
        else{
          this.actiontakenShow = true
          this.actionpendingShow = false
          this.peopleretainedShow = false
        }
      }
      if (param == 'people-retained'){
        if (this.peopleretainedShow){
          this.peopleretainedShow = false
        }
        else{
          this.peopleretainedShow = true
          this.actionpendingShow = false
          this.actiontakenShow = false
        }
      }
      if (this.hideDiffFlag){
        if (this.actionpendingShow){
          payload = {
            tat_type:'PendingTat',
            data_type:'difference'
          }
          this.viewTurnAroundTime(payload)
        }
        else if(this.actiontakenShow){
          payload = {
            tat_type:'ActionTat',
            data_type:'difference'
          }
          this.viewTurnAroundTime(payload)
        }
        else if (this.peopleretainedShow){
          payload = {
            data_type:'difference'
          }
          this.viewPeopleRetained(payload)
        }
        else{
          payload = {
            tat_type:'',
            data_type:'difference'
          }
          this.closeViewTurnAroundTime(payload)
        }
      }
      else{
        if (this.actionpendingShow){
          payload = {
            tat_type:'PendingTat',
            data_type:''
          }
          this.viewTurnAroundTime(payload)
        }
        else if(this.actiontakenShow){
          payload = {
            tat_type:'ActionTat',
            data_type:''
          }
          this.viewTurnAroundTime(payload)
        }
        else if (this.peopleretainedShow){
          payload = {
            data_type:''
          }
          this.viewPeopleRetained(payload)
        }
        else{
          payload = {
            tat_type:'',
            data_type:''
          }
          this.closeViewTurnAroundTime(payload)
        }
      }
    }

    viewNum(){
      if (this.viewNumber){
        this.viewNumber = false
        this.viewPercent = true
        this.btnText = 'View Percentage'
      }
      else if (this.viewPercent){
        this.viewNumber = true
        this.viewPercent = false
        this.btnText = 'View Number'
      }
    }

    viewDiff(){
      let payload = {}
      this.actionpendingShow = false
      this.actiontakenShow = false
      this.peopleretainedShow = false
      if (this.viewDiffFlag){
        this.viewDiffFlag = false
        this.hideDiffFlag = true
        this.diffBtnText = 'Hide Difference'
        payload = {
          tat_type:'',
          data_type:'difference'
        }
        this.closeViewTurnAroundTime(payload)
      }
      else if (this.hideDiffFlag){
        this.viewDiffFlag = true
        this.hideDiffFlag = false
        this.diffBtnText = 'View Difference'
        payload = {
          tat_type:'',
          data_type:''
        }
        this.closeViewTurnAroundTime(payload)
      }
    }

    changeFlag(){
      setTimeout(()=>{ this.download = false }, 3000)
    }

    downloadAsImage(){
      this.download = true
      var node = document.getElementById('table-body');
      domtoimage.toJpeg(node, {quality: 0.95, bgcolor:'white'})
      .then(function (dataUrl) {
        domtoimage.toJpeg(node, {quality: 0.95, bgcolor:'white'})
        .then(function (dataUrl1){
        var link = document.createElement('a');
        link.download = 'action-heatmap.jpeg';
        link.href = dataUrl1;
        link.click();
        });
      });
      this.changeFlag()
    }

    downloadAsPDF(){
      this.download = true
      var node = document.getElementById('table-body');
      domtoimage.toJpeg(node, { quality: 1.0, bgcolor:'white'})
      .then(function (dataUrl) {
        domtoimage.toJpeg(node, {quality: 0.95, bgcolor:'white'})
        .then(function (dataUrl1){
          const contentDataURL = dataUrl1
          let pdf = new jsPDF('l', 'mm', 'a4');
          var position = 0;
          const imgProps= pdf.getImageProperties(dataUrl1);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(contentDataURL,'JPEG',0,position,pdfWidth, pdfHeight)
          pdf.save('action-heatmap.pdf');
        });
      });
      this.changeFlag()
    }

    saveFile = (blobContent: Blob, fileName: string) => {
      const blob = new Blob([blobContent], { type: 'application/vnd.ms-excel' });
      saveAs(blob, fileName);
    };

    downloadAsExcel(){
      if (!this.hideDiffFlag){
        if (this.viewNumber){
          this.export = 'percentage'
        }
        else{
          this.export = 'number'
        }
      }
      else{
        if (this.viewNumber){
          this.export = 'difference_percentage'
        }
        else{
          this.export = 'difference_number'
        }
      }
      let details = JSON.parse(atob(sessionStorage.getItem('details')));
        let param =
        {
          empType:this.actionInsightsService.empType,
          empCode:details.empcode,
          range_filter_1:this.dateFilter,
          range_filter_2:this.dateFilter2,
          type:this.actionType,
          selected_filters:this.selectedFilters,
          export:this.export
        }
        this.actionInsightsService.getActionHeatListExport(param).subscribe(res => {
          this.saveFile(res.body, 'action-heatmap.xlsx');})
    }

    async viewTurnAroundTime(payload){
      let details = JSON.parse(atob(sessionStorage.getItem('details')));
      await this.actionInsightsService.getChildActionHeatlist({empType:this.empType,empCode:details.empcode,range_filter_1:this.actionInsightsService.filter,range_filter_2:this.actionInsightsService.filter2,actionParams:this.selectedFilters,tat_type:payload.tat_type,data_type:payload.data_type});
    }

    async closeViewTurnAroundTime(payload){
      let details = JSON.parse(atob(sessionStorage.getItem('details')));
      await this.actionInsightsService.getParentActionHeatlist({empType:this.empType,empCode:details.empcode,range_filter_1:this.actionInsightsService.filter,range_filter_2:this.actionInsightsService.filter2,actionParams:this.selectedFilters,tat_type:payload.tat_type,data_type:payload.data_type});
    }

    async viewPeopleRetained(payload){
      let details = JSON.parse(atob(sessionStorage.getItem('details')));
      await this.actionInsightsService.getPeopleRetainedActionHeatlist({empType:this.empType,empCode:details.empcode,range_filter_1:this.actionInsightsService.filter,range_filter_2:this.actionInsightsService.filter2,actionParams:this.selectedFilters,data_type:payload.data_type});
    }
  }