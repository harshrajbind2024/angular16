import { Component, OnInit, Inject,Output,EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatLegacyDialogRef, MAT_LEGACY_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { FilterConstants } from '@lib/umwelt-lib';
import { AuthService } from '@lib/umwelt-lib';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements OnInit {

  months = FilterConstants.getMonths();
  quarters = FilterConstants.getQuarters();
  periods = FilterConstants.getPeriods();
  years = [];
  type;
  formattedpickFrom;
  formattedpickTo;
  types = [
    {
      id : 1,
      name : 'Custom'
    }
  ]
  fromActionPage:boolean=false;

  rangeFormGroup: FormGroup;
  dateFormGroup: FormGroup;
  @Output() dateChange = new EventEmitter<any>();
  constructor(public dialogRef: MatLegacyDialogRef<DateFilterComponent>, public auth:AuthService,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: any,
    public snackBar: MatLegacySnackBar) {
    if (data.page){
      if (data.page === 'action-page'){
        this.fromActionPage = true
      }
    }
    if (this.fromActionPage){
      this.periods = FilterConstants.getPeriodsActionPage();
    }
    this.type = data.type;
    let datePipe = new DatePipe('en-US');
    if (data.value.pickfrom && data.value.pickto){
      let pickFrom = new Date(data.value.pickfrom);
      let pickTo = new Date(data.value.pickto);
      this.formattedpickFrom = datePipe.transform(pickFrom, 'yyyy-MM-ddTHH:mm:ss', 'IST');
      this.formattedpickTo = datePipe.transform(pickTo, 'yyyy-MM-ddTHH:mm:ss', 'IST');
    }
    else{
      this.formattedpickFrom = data.value.pickfrom
      this.formattedpickTo = data.value.pickto
    }

    if(this.type == 'presense-snapshot' || this.type == 'presense-dailytrend'){
      this.dateFormGroup = new FormGroup({
        type: new FormControl(1),
        fromDate: new FormControl(data.value.fromdate),
        toDate : new FormControl(data.value.todate)
      })
    } 
    else{
      this.initYear();
      this.rangeFormGroup = new FormGroup({
        type: new FormControl(data.value.type, [Validators.required]),
        monthStart: new FormControl(data.value.monthStart),
        monthEnd: new FormControl(data.value.monthEnd),
        yearStart: new FormControl(data.value.yearStart),
        yearEnd: new FormControl(data.value.yearEnd),
        quarterStart: new FormControl(data.value.quarterStart),
        quarterEnd: new FormControl(data.value.quarterEnd),
        dateFilterBy: new FormControl(data.value.dateFilterBy),
        pickfrom: new FormControl(this.formattedpickFrom),
        pickto: new FormControl(this.formattedpickTo),
        timezone: new FormControl(this.auth.timezone)
      });
    }
  }

  ngOnInit() {
  }

  changeType(type){
    this.rangeFormGroup.patchValue({yearStart:this.data.value.yearStart})
  }

  initYear() {
    let currentYear = (new Date()).getFullYear();
    for (let i = 2018; i <= currentYear; i++) {
      this.years.push({
        id: i.toString(),
        name: i.toString()
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  onDateChange(value){
    let date = value._validSelected;
    let fromValue = new Date(date)
    let toValue = new Date(fromValue.setDate(fromValue.getDate()+6))
    this.dateFormGroup.controls['toDate'].setValue(toValue)
  }

  apply() {
    if(this.type == 'presense-snapshot'){
      this.applyForPresense()
    }
    else if(this.type == 'presense-dailytrend'){
      this.applyForPresenseTrend()
    }
    else if(this.type == 'employee-insights'){
      if (this.fromActionPage){
        let from = !this.rangeFormGroup.controls['pickfrom'].value ? "" : new Date(this.rangeFormGroup.controls['pickfrom'].value).toLocaleString('en-US');
        let to = !this.rangeFormGroup.controls['pickto'].value ? "" : new Date(this.rangeFormGroup.controls['pickto'].value).toLocaleString('en-US');
        this.rangeFormGroup.controls['pickfrom'].setValue(from)
        this.rangeFormGroup.controls['pickto'].setValue(to)
      }
      this.dialogRef.close(this.rangeFormGroup.value);
    }
    else{
      let value = this.rangeFormGroup.value;
      if (value.type === "1") {
        if (value.yearEnd - value.yearStart === 1) {
          let monthDiff = this.getMonthDifference(Number.parseInt(value.monthStart), Number.parseInt(value.monthEnd), 1);
          if (monthDiff <= 6) {
            this.dialogRef.close(this.rangeFormGroup.value);
          } else {
            if(this.type == 'chart'){
              this.openSnackBar('Max 6 months range can be selected!!');
            }
            else{
              this.dialogRef.close(this.rangeFormGroup.value);
            }
          }
        } else if (value.yearEnd === value.yearStart) {
          if (Number.parseInt(value.monthStart) > Number.parseInt(value.monthEnd)) {
            this.openSnackBar('Please select valid range!!');
          } else {
            let monthDiff = this.getMonthDifference(Number.parseInt(value.monthStart), Number.parseInt(value.monthEnd) , 0);
            if (monthDiff <= 6) {
              this.dialogRef.close(this.rangeFormGroup.value);
            } else {
              if(this.type == 'chart'){
                this.openSnackBar('Max 6 months range can be selected!!');
              }
              else{
                this.dialogRef.close(this.rangeFormGroup.value);
              }
            }
          }
        } else {
          if(this.type == 'chart'){
            this.openSnackBar('Please select valid range!!');
          }
          else{
            this.dialogRef.close(this.rangeFormGroup.value)
          }
        }
      } else if (value.type === "2") {
        if (value.yearEnd - value.yearStart === 1) {
          let quarterDiff = this.getQuarterDifference(Number.parseInt(value.quarterStart), Number.parseInt(value.quarterEnd), value.yearEnd - value.yearStart);
          if (quarterDiff <= 6) {
            this.dialogRef.close(this.rangeFormGroup.value);
          } else {
            if(this.type == 'chart'){
              this.openSnackBar('Max 4 quarters range can be selected!!');
            }
            else{
              this.dialogRef.close(this.rangeFormGroup.value);
            }
          }
        } else if (value.yearEnd === value.yearStart) {
          if (Number.parseInt(value.quarterStart) > Number.parseInt(value.quarterEnd)) {
            this.openSnackBar('Please select valid range!!');
          } else {
            let quarterDiff = this.getQuarterDifference(Number.parseInt(value.quarterStart), Number.parseInt(value.quarterEnd) , value.yearEnd - value.yearStart);
            if (quarterDiff <= 4) {
              this.dialogRef.close(this.rangeFormGroup.value);
            } else {
              if(this.type == 'chart'){
                this.openSnackBar('Max 4 quarters range can be selected!!');
              }
              else{
                this.dialogRef.close(this.rangeFormGroup.value);
              }
            }
          }
        } else {
          if(this.type == 'chart'){
            this.openSnackBar('Please select valid range!!');
          }
          else{
            this.dialogRef.close(this.rangeFormGroup.value)
          }
        }
      } else {
        if(value.yearEnd - value.yearStart > 6){
          this.openSnackBar('Please select valid range!!');
        } else {
          this.dialogRef.close(this.rangeFormGroup.value);
        }
      }
    }
  }

  applyForPresense(){
    let value = this.dateFormGroup.value;
    if((Date.parse(value.toDate) <= Date.parse(value.fromDate))){
      this.openSnackBar('Please select valid range!!');
    }
    else{
      this.dialogRef.close(this.dateFormGroup.value);
    }
  }

  applyForPresenseTrend(){
    let value = this.dateFormGroup.value;
    let fromValue = value.fromDate;
    let toValue = value.toDate;
    let diff = Math.ceil(( Math.abs(toValue - fromValue)) / (1000 * 60 * 60 * 24));
    if((Date.parse(value.toDate) <= Date.parse(value.fromDate))){
      this.openSnackBar('Please select valid range!!');
    }
    else if(diff>6){
      this.openSnackBar('Max 7 days range can be selected!!');
    }
    else{
      this.dialogRef.close(this.dateFormGroup.value);
    }
  }

  getMonthDifference(start, end, yearGap) {
    return  12*yearGap + end - start + 1;
  }

  getQuarterDifference(start, end, yearGap) {
    return  4*yearGap + end - start + 1;
  }

  openSnackBar(message) {
    this.snackBar.open(message, '', {
      duration: 3000
    });
  }

  fromDateChange(value) {
    if (this.rangeFormGroup.controls['pickto'].value) {
      if (this.rangeFormGroup.controls['pickto'].value < this.rangeFormGroup.controls['pickfrom'].value) {
        this.rangeFormGroup.controls['pickto'].setValue(value);
      }
    } else {
      this.rangeFormGroup.controls['pickto'].setValue(value);
    }
  }
  toDateChange(value) {
    if (this.rangeFormGroup.controls['pickfrom'].value) {
      if (this.rangeFormGroup.controls['pickto'].value < this.rangeFormGroup.controls['pickfrom'].value) {
        this.rangeFormGroup.controls['pickfrom'].setValue(value);
      }
    } else {
      this.rangeFormGroup.controls['pickfrom'].setValue(value);
    }
  }
  maxDateForFrom() {
    let to = this.rangeFormGroup.controls['pickto'].value;
    if (to === undefined || to === null || to === "") {
      return new Date();
    } else {
      return to;
    }
  }
  minDateForTo() {
    let from = this.rangeFormGroup.controls['pickfrom'].value;
    if (from === undefined || from === null || from === "") {
      return;
    } else {
      return from;
    }
  }
  todayDate() {
    return new Date();
  }
}