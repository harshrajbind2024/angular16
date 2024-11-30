import { Component, OnInit, Inject, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '@lib/umwelt-lib';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef, MatLegacyDialog } from '@angular/material/legacy-dialog';
import { AuthService } from '@lib/umwelt-lib';
import { AssignToComponent } from '../assign-to/assign-to.component';

@Component({
  selector: 'app-record-action',
  templateUrl: './record-action.component.html',
  styleUrls: ['./record-action.component.scss']
})
export class RecordActionComponent implements OnInit, OnDestroy {

  public empName: string = "";
  public empID: string = "";
  public intID: string = "";
  public func: string = "";
  public location: string = "";
  public stage: string = "";
  public department: string = "";
  public company: string = "";
  public band: string = "";
  public role: string = "";
  public manager: string = "";
  public contact: string = "";
  public hrspoc:string = "";
  public completedOn:string = "";
  public assignedTo:any;
  public assignedToName:string = "";
  public designation: string = "";
  public hrcode;
  public hrname;
  public hrassignedflag = false;
  public glfname;
  public actions: any = [];
  public selectedPK: string = "";
  displayedColumns: string[] = ['Areas of Concern', 'Feedback', 'Action', 'Description of Action', 'Action By', 'Date of Action'];
  public subscriptions: Subscription[] = [];
  public actionLibraryData: any[] = [];
  public currentUserName: string = "";
  public currentUserId: string = "";
  public form: FormGroup;
  public showForm: boolean = false;
  public noDataPresent: boolean = false;
  public action_data;
  chat = [];
  isLoadingResults = true;
  public isClosedButton = false;
  public list:any;
  selectedIndex = 0;
  isLoading: boolean = false;
  constructor(
    public dialogRef: MatLegacyDialogRef<RecordActionComponent>,
    private ngZone: NgZone,
    private dialog: MatLegacyDialog,
    private dashboardService: DashboardService,
    private auth: AuthService,
    // protected localStorage: LocalStorage,
    private formBuilder: FormBuilder,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: any
  ) {
    this.initData();

    this.ngZone.runOutsideAngular(() => {
      this.dashboardService.getChatCuratedForPk(data.employee.Pk).subscribe(
        res => {
          this.chat = JSON.parse(JSON.stringify(res[0].Value));
          this.isLoadingResults = false;
        }
      )
    })

    this.ngZone.runOutsideAngular(() => {
      this.subscriptions.push(this.dashboardService.getLoggedInUserInfo().subscribe(
        res => this.ngZone.run(() => {
          this.currentUserId = res['empcode'];
          this.currentUserName = res['firstname'] + " " + res['lastname'];
        })
      ))
    });
  }

  ngOnInit() {
    this.list = JSON.parse(localStorage.getItem('List'));
    this.form = this.formBuilder.group({
      status: [''],
      items: this.formBuilder.array([])
    })

    this.getActionPopData();
    this.getActionLibraryData();
  }

  updateFormData() {
    for (let i = 0; i < this.actionLibraryData.length; i++) {
      if(i == 0){
        this.form.controls['status'].setValue(this.actionLibraryData[0].status);
        this.isClosedButton = this.actionLibraryData[0].status == 'yes' ? true: false;
      } else {
        (<FormArray>this.form.controls['items']).push(
          this.formBuilder.group({
            action: this.actionLibraryData[i].action,
            description: this.actionLibraryData[i].description
          })
        )
      }
    }
    this.showForm = true;
    this.statusChanged(this.actionLibraryData[0].status);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      item => {
        item.unsubscribe();
      }
    )
  }

  initData() {
    if(this.data.comment == '1'){
      let pk = {
        pk : this.data.employee.Pk,
        timezone : this.auth.timezone
      }

      this.dashboardService.getCuratedComment(pk).subscribe(
        res => {
          this.data = res[0]
          this.empID = this.data.EmpID;
          this.intID = this.data.IntID;
          this.empName = this.data.GLFname + " " + this.data.GLMName + " " + this.data.GLLName;
          this.func = this.data.FuncName;
          this.location = this.data.LocName;
          this.stage = this.data.TenureName;
          this.department = this.data.DeptName;
          this.company = this.data.CompanyName;
          // this.band = this.data.employee.
          this.role = this.data.Role;
          this.manager = this.data.MgrName;
          this.contact = this.data.Mobile;
          this.selectedPK = this.data.Pk;
          this.hrspoc = this.data.HRSpocName;
          this.completedOn = this.data.EndTime;
          this.assignedTo = this.data.AssignedToCode;
          this.assignedToName = this.data.AssignedToName;
          this.glfname = this.data.GLFname
          this.designation = this.data.Designation
        })
    }
    else{
      this.empID = this.data.employee.EmpID;
      this.intID = this.data.employee.IntID;
      this.empName = this.data.employee.GLFname + " " + this.data.employee.GLMName + " " + this.data.employee.GLLName;
      this.func = this.data.employee.FuncName;
      this.location = this.data.employee.LocName;
      this.stage = this.data.employee.TenureName;
      this.department = this.data.employee.DeptName;
      this.company = this.data.employee.CompanyName;
      // this.band = this.data.employee.
      this.role = this.data.employee.Role;
      this.manager = this.data.employee.MgrName;
      this.contact = this.data.employee.Mobile;
      this.selectedPK = this.data.employee.Pk;
      this.hrspoc = this.data.employee.HRSpocName;
      this.completedOn = this.data.employee.EndTime;
      this.assignedTo = this.data.employee.AssignedToCode;
      this.assignedToName = this.data.employee.AssignedToName;
      this.glfname = this.data.employee.GLFname;
      this.designation = this.data.employee.Designation
      this.selectedIndex = this.data.tab
    }
  }

  closeDialog() {
    if (confirm("All the changes made would be lost.. Are you sure to leave?")){
      this.dialogRef.close(false);
    }
  }

// get action pop up data  
  getActionPopData(){
    this.ngZone.runOutsideAngular(() => {
      this.subscriptions.push(this.dashboardService.getActionsForPopUp().subscribe(
        res => this.ngZone.run(() => {
          this.actions = JSON.parse(JSON.stringify(res));
        })
      ))
    });
  }

// get action library data
  getActionLibraryData(){
    if (this.data.comment == '1'){
      this.selectedPK = this.data.employee.Pk
    }
    else{
      this.selectedPK = this.selectedPK
    }
    this.ngZone.runOutsideAngular(() => {
      this.subscriptions.push(this.dashboardService.getActionLibraryData(this.selectedPK).subscribe(
        res => this.ngZone.run(() => {
          this.actionLibraryData = JSON.parse(JSON.stringify(res));
          if(this.actionLibraryData.length > 1){
            this.updateFormData();
          } else {
            this.noDataPresent = true;
          }
          let counter = 0;
          let action_array = this.actionLibraryData.slice(1)
          let length_of_array = action_array.length
          for (const obj of action_array) {
            if (obj.action !== '') counter++;
          }
          if (counter === length_of_array){
            this.isClosedButton = true;
          }else{
            this.isClosedButton = false;
          }
        }),
        error => {
          if (error['error']['error'] == 'User not exist'){
            this.noDataPresent = true;
          }
        }
      ))
    });
  }  

  getActionBy(index){
    if(this.actionLibraryData[index].actionby !== ""){
      return this.actionLibraryData[index].actionby.name + "("+this.actionLibraryData[index].actionby.id+")"
    } else {
      return "";
    }
  }

  openAssignTo(){
      let constDialog = this.dialog.open(AssignToComponent, {
        height: '40%',
        width: '28%',
        panelClass: 'dialog-padding-0',
        disableClose: true,
        data: {
          'Pk': this.selectedPK,
          'actionpopup': true,
          'AssignedToCode': this.assignedTo,
          'AssignedToName': this.assignedToName,
          'GLFname': this.glfname
        }
      });

      constDialog.afterClosed().subscribe(result =>{
          this.hrcode = result['AssignedToCode']
          this.hrname = result['AssignedToName']
          this.hrassignedflag = true
          this.assignedTo = this.hrcode
          this.assignedToName = this.hrname
        });
      }

  actionChanged(action, index){
    if(this.actionLibraryData[index].action !== action){
      this.actionLibraryData[index].actionby = {
        id: this.currentUserId,
        name: this.currentUserName
      }
    }

    let value = this.form.getRawValue();
    let count = 0;
    for(let i=0;i < value.items.length;i++){
        if(value.items[i].action != ''){
          count++;
        }
    }
    if(value.items.length == count){
      this.isClosedButton = true;
    }
    else{
      this.isClosedButton = false;
    }
  }

  statusChanged(status){
    if(status === "yes"){
      this.form.disable();
      this.form.controls['status'].enable();
    } else {
      this.form.enable();
    }
  }

  save(){
    this.isLoading = true;
    let value = this.form.getRawValue();
    let empType = this.auth.getEmpType();
    let data = [];
    data.push({
      status: value.status,
      empID: this.empID,
      intID: this.intID,
      pk: this.selectedPK,
      loggedInUserEmpId: sessionStorage.getItem('user'),
      logged_in_usertype: empType.toString()
    })

    for(let i=0;i < value.items.length;i++){
      if(this.actionLibraryData[i+1].feedback.length>1){
        for(let j=0; j<this.actionLibraryData[i+1].feedback.length; j++){
          data.push({
            action: value.items[i].action,
            description: value.items[i].description,
            actionby: this.actionLibraryData[i+1].actionby.id == undefined ? '' : this.actionLibraryData[i+1].actionby.id,
            badfactor: this.actionLibraryData[i+1].badfactor.id
          })
        }
      }
      else{
        data.push({
          action: value.items[i].action,
          description: value.items[i].description,
          actionby: this.actionLibraryData[i+1].actionby.id == undefined ? '' : this.actionLibraryData[i+1].actionby.id,
          badfactor: this.actionLibraryData[i+1].badfactor.id
        })
      }
    }
    if (this.hrassignedflag){
      let assign_hrspoc = {
        "curated_pk": this.selectedPK,
        "hrspoc_name":this.hrname,
        "hrspoc_id":this.hrcode
      }
      this.dashboardService.getCuratedForAssignedTo(assign_hrspoc).subscribe()
    }

    this.ngZone.runOutsideAngular(() => {
      this.subscriptions.push(
        this.dashboardService.saveActionPopData(data).subscribe(
          res => this.ngZone.run(() => {
            if(res['status']){
              this.dashboardService.getDataFromCurated(this.selectedPK).subscribe(result => {
                this.isLoading = false;
                if (data[0].status == 'yes' || 'no'){
                  let empData = {
                    'status': data[0].status,
                    'pk' : this.selectedPK,
                    'AssignedToCode':this.hrcode,
                    'AssignedToName':this.hrname,
                    'AssignedBy':result['AssignedBy'],
                    'AssignedByName':result['AssignedByName'],
                    'AssignedDate':result['AssignedDate']
                  }
                  this.dialogRef.close(empData);
                }
                else{
                  let empData = {
                    'status': 'AssignedTo Updated',
                    'pk' : this.selectedPK,
                    'AssignedToCode':this.hrcode,
                    'AssignedToName':this.hrname,
                    'AssignedBy':result['AssignedBy'],
                    'AssignedByName':result['AssignedByName'],
                    'AssignedDate':result['AssignedDate']
                  }
                  this.dialogRef.close(empData);
                }
              })
            }
          }),
          error => {
            //Error handling required
          }, () => {

          }
        )
      )
    })
  }
}