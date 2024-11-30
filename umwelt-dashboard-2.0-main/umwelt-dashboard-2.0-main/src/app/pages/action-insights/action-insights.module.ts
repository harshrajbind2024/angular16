import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import {MatLegacyTableModule} from '@angular/material/legacy-table';
import {MatLegacyButtonModule} from '@angular/material/legacy-button';
import {MatLegacyPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ActionScoresComponent } from './components/action-scores/action-scores.component';
import { ActionInsightsComponent } from './components/action-insights/action-insights.component';
import { ActionHeatmapComponent } from './components/action-heatmap/action-heatmap.component';
import { CommonViewsModule } from '../../common-views/common-views.module';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';

const routes: Routes = [
  {
    path: '',
    component: ActionInsightsComponent
  }
]

@NgModule({
  declarations: [
    ActionScoresComponent,
    ActionInsightsComponent,
    ActionHeatmapComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MatLegacyTableModule,
    MatLegacyCardModule,
    MatLegacyButtonModule,
    MatLegacyPaginatorModule,
    MatLegacyMenuModule,
    MatLegacyDialogModule,
    MatLegacyProgressSpinnerModule,
    MatIconModule,
    CommonViewsModule
  ],
  exports: [
    ActionInsightsComponent,
    ActionHeatmapComponent,
    ActionScoresComponent
  ]
})
export class ActionInsightsModule { }