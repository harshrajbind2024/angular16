import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatLegacyButtonModule} from '@angular/material/legacy-button';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NguCarouselModule } from '@ngu/carousel';
import { DashboardWidgetsModule } from '../../dashboard-widgets/dashboard-widgets.module';

export const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
]
@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    RouterModule.forChild(appRoutes),
    CommonModule,
    ReactiveFormsModule, 
    FormsModule,
    MatIconModule,
    MatLegacyCardModule,
    MatLegacyButtonModule,
    MatLegacyDialogModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyInputModule,
    MatLegacySelectModule,
    RouterModule,
    FlexLayoutModule,
    NguCarouselModule,
    DashboardWidgetsModule,
    NguCarouselModule 
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }