import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { DashboardService } from '@lib/umwelt-lib';

@Component({
  selector: 'app-assign-to',
  templateUrl: './assign-to.component.html',
  styleUrls: ['./assign-to.component.scss']
})
  export class AssignToComponent implements OnInit {
    AssignHRSPOCForm: FormGroup;
    public searchTextHrspoc='';
    public hrspoc: any;
    list:any;
    public curated_pk;
    public assigned_code;
    public assigned_name;
    public hrspocname;
    public empname;
    public inAction = false;
    public hrspocs = [];
    public searchAssign='';
    assignToArray = [];

    constructor( @Inject(MAT_LEGACY_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, public snackBar: MatLegacySnackBar,
    private dialogRef: MatLegacyDialogRef<AssignToComponent>, public dashboardService: DashboardService) {
        this.AssignHRSPOCForm = this.formBuilder.group({
            "hrspoc": ['', [Validators.required]]
        })
        if (data){
            this.curated_pk = data.Pk
            this.empname = data.GLFname
        }
        if (data.AssignedToCode && data.AssignedToName){
            this.assigned_code = data.AssignedToCode
            this.assigned_name = data.AssignedToName
        }
        if (data.actionpopup) {
          this.inAction = true;
        }
    }

    async ngOnInit() {
      let res = await this.dashboardService.getAssignToList();
      this.assignToArray = JSON.parse(JSON.stringify(res));
      this.hrspoc = this.assignToArray['assign_to'];
      this.hrspocs = this.assignToArray['assign_to'];

        for (const obj of this.hrspoc) {
            obj['hrspoc_display'] = obj['HRSpoc'] + ' ' + '(' + obj['HRSpocID'] + ')'
        }

        for (const obj of this.hrspocs) {
          obj['hrspoc_display'] = obj['HRSpoc'] + ' ' + '(' + obj['HRSpocID'] + ')'
        }
        if (this.assigned_code && this.assigned_name){
          if(!this.inAction){
            this.AssignHRSPOCForm.controls['hrspoc'].setValue(this.assigned_code);
          }
          else{
              this.data['assignedto'] = this.assigned_code
            }
        }
    }

    changeInput(value,type){
        if(value.data == null){
          if(type == 'hr'){this.searchTextHrspoc = this.searchTextHrspoc.slice(0, this.searchTextHrspoc.length - 1)}
        }
        else{
          if(type == 'hr'){this.searchTextHrspoc = this.searchTextHrspoc+value.data}
        }
      }
    
    cancel(){
        this.dialogRef.close();
    }

    submit(){
        if (this.AssignHRSPOCForm.invalid) {
            this.validateAllFormFields(this.AssignHRSPOCForm);
        }
        else {
          let code = this.AssignHRSPOCForm.value.hrspoc
          var hrspocObj =  this.hrspoc.filter(function(hr) {
            return hr.HRSpocID == code;
          });
          this.hrspocname =  hrspocObj[0]['HRSpoc']

            let assign_hrspoc = {
            "curated_pk": this.curated_pk,
            "hrspoc_name":this.hrspocname,
            "hrspoc_id":this.AssignHRSPOCForm.value.hrspoc
        }
          this.dashboardService.getCuratedForAssignedTo(assign_hrspoc).subscribe(
            res =>{
              this.snackBar.open('HRSPOC Assigned Successfully!', 'OK', { duration: 3000 });
              this.dialogRef.close(true);
            },
            err =>{
              this.snackBar.open('Some Error has been occured!', 'OK', { duration: 3000 });
            }
          )
        }
    }

    addToAction(){
      let hrcode = this.data.assignedto
      var hrspocsObj =  this.hrspocs.filter(function(hr) {
        return hr.HRSpocID == hrcode;
      });
      let hrname =  hrspocsObj[0]['HRSpoc']
      this.dialogRef.close({'AssignedToCode':hrcode,'AssignedToName':hrname});
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
          const control = formGroup.get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
          }
        });
      }
}