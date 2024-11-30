import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './components/reports/reports.component';
import { RouterModule, Routes } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyNativeDateModule } from '@angular/material/legacy-core';
import {MatLegacyInputModule} from '@angular/material/legacy-input';
import { MAT_LEGACY_DATE_LOCALE } from '@angular/material/legacy-core';;
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
// import { DashReportsSelectModule } from '@lib/umwelt-lib';
// import { DashReportsInputDatepickerModule } from '@lib/umwelt-lib';
// import { DashInputSearchModule } from '@lib/umwelt-lib';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';


const dashroutes: Routes = [
  {
    path: '',
    component: ReportsComponent
  }
]

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    RouterModule.forChild(dashroutes),
    CommonModule,
    MatProgressSpinnerModule,
    MatLegacyCardModule,
    MatLegacyTableModule,
    MatIconModule,
    MatSortModule,
    MatLegacyButtonModule,
    MatLegacyChipsModule,
    ReactiveFormsModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyDialogModule,
    MatLegacyNativeDateModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    // DashReportsSelectModule,
    // DashReportsInputDatepickerModule,
    // DashInputSearchModule,
    MatDatepickerModule
  ],
  exports: [
    ReportsComponent
  ],
  providers: [
    { provide: MAT_LEGACY_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class ReportsModule { }