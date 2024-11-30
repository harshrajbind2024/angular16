import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatLegacyButtonModule} from '@angular/material/legacy-button';
import {MatLegacyPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyTableModule} from '@angular/material/legacy-table';
import {MatLegacyMenuModule} from '@angular/material/legacy-menu';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';

import { SentimentsComponent } from './components/sentiments/sentiments.component';
import { EmployeeDetailComponent } from './modals/employee-detail/employee-detail.component';
import { WordCloudComponent } from './modals/word-cloud/word-cloud.component';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { CommonViewsModule } from '../../common-views/common-views.module';
import { NguCarouselModule } from '@ngu/carousel';

const routes: Routes = [
  {
    path: '',
    component: SentimentsComponent
  }
]
@NgModule({
  declarations: [
    SentimentsComponent,
    EmployeeDetailComponent,
    WordCloudComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatStepperModule,
    MatLegacyButtonModule,
    MatLegacyPaginatorModule,
    MatLegacyTableModule,
    MatLegacyChipsModule,
    MatLegacyFormFieldModule,
    MatLegacyMenuModule,
    MatLegacySelectModule,
    MatLegacyCardModule,
    MatLegacyTooltipModule,
    MatLegacyInputModule,
    MatLegacyDialogModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    NguCarouselModule,
    CommonViewsModule
  ],
  exports: [
    SentimentsComponent,
    EmployeeDetailComponent,
    WordCloudComponent
  ]
})
export class SentimentsModule { }