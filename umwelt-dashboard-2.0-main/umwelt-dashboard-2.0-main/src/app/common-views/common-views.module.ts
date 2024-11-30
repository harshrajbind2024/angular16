import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatLegacyTableModule} from '@angular/material/legacy-table';
import {MatLegacyButtonModule} from '@angular/material/legacy-button';
import {MatLegacyPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyMenuModule} from '@angular/material/legacy-menu';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AssignToComponent } from './modals/assign-to/assign-to.component';
import { DateFilterComponent } from './modals/date-filter/date-filter.component';
import { RecordActionComponent } from './modals/record-action/record-action.component';
import { MultiChartComponent } from './components/multi-chart/multi-chart.component';
import { ListViewComponent } from './components/list-view/list-view.component';

import { Stackedbar2dModule } from '../charts/stackedbar2d/stackedbar2d.module';
import { MultiSeriesColumnChart2dModule } from '../charts/multi-series-column-chart2d/multi-series-column-chart2d.module';
import { StackedColumn2dModule } from '../charts/stacked-column2d/stacked-column2d.module';
import { LineChartModule } from '../charts/line-chart/line-chart.module';
import { ComboChartModule } from '../charts/combo-chart/combo-chart.module';
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatSortModule } from '@angular/material/sort';
import { Pie2dModule } from '../charts/pie2d/pie2d.module';
import { CustomPipeModule } from '@lib/umwelt-lib';
@NgModule({
  declarations: [
    ListViewComponent,
    AssignToComponent,
    DateFilterComponent,
    RecordActionComponent,
    MultiChartComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    MatLegacyTableModule,
    MatLegacyChipsModule,
    MatLegacyCardModule,
    MatLegacyButtonModule,
    MatLegacyPaginatorModule,
    MatLegacyMenuModule,
    MatLegacyFormFieldModule,
    MatLegacySelectModule,
    MatLegacyInputModule,
    MatLegacyTabsModule,
    MatLegacyRadioModule,
    MatLegacyOptionModule,
    MatLegacyCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSortModule,
    MatToolbarModule,
    MatGridListModule,
    Stackedbar2dModule,
    MultiSeriesColumnChart2dModule,
    StackedColumn2dModule,
    LineChartModule,
    ComboChartModule,
    Pie2dModule,
    CustomPipeModule
  ],
  exports: [
    ListViewComponent,
    AssignToComponent,
    DateFilterComponent,
    RecordActionComponent,
    MultiChartComponent
  ],
})
export class CommonViewsModule { }