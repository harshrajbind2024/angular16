import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EngagementScoresComponent } from './components/engagement-scores/engagement-scores.component';
import { EngagementHeatmapComponent } from './components/engagement-heatmap/engagement-heatmap.component';
import { EngagementInsightsComponent } from './components/engagement-insights/engagement-insights.component';
import { AddHighlightsComponent } from './modals/add-highlights/add-highlights.component';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule } from '@angular/material/legacy-input';

const routes: Routes = [
  {
    path: '',
    component: EngagementInsightsComponent
  }
]

@NgModule({
  declarations: [
    EngagementScoresComponent,
    EngagementHeatmapComponent,
    EngagementInsightsComponent,
    AddHighlightsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, FormsModule,
    MatLegacyTooltipModule,
    MatLegacyTableModule,
    MatLegacyCardModule,
    MatLegacyButtonModule,
    MatLegacyPaginatorModule,
    MatLegacySelectModule,
    MatLegacyMenuModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatIconModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  exports: [
    EngagementScoresComponent,
    EngagementHeatmapComponent,
    EngagementInsightsComponent,
    AddHighlightsComponent
  ]
})
export class EngagementInsightsModule { }