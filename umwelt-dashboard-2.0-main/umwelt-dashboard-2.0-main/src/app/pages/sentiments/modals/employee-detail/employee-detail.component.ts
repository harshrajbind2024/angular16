import {Component, Inject, OnInit} from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef} from '@angular/material/legacy-dialog';
import { SentimentsService } from '@lib/umwelt-lib';
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {

  public list = JSON.parse(localStorage.getItem('List'));
  public gettingResult = false;
  constructor( @Inject(MAT_LEGACY_DIALOG_DATA) public data: any, private commentService: SentimentsService,
  public dialogRef: MatLegacyDialogRef<EmployeeDetailComponent>,) {
    this.gettingResult = true;

    this.commentService.getCuratedComment(this.data).subscribe(
      res =>{
        this.data = res[0];
        this.gettingResult = false;
      },
      error =>{
        console.log(error);
        this.gettingResult = false;
      }
    )
  }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }

}