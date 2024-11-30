import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HrTableComponent } from './components/hr-table/hr-table.component';
import { EnpsTableComponent } from './components/enps-table/enps-table.component';
import { FlightTableComponent } from './components/flight-table/flight-table.component';
import { HappinessTableComponent } from './components/happiness-table/happiness-table.component';
import { EnpsTrendComponent } from './trend-charts/enps-trend/enps-trend.component';
import { FlightTrendComponent } from './trend-charts/flight-trend/flight-trend.component';
import { HappinessTrendComponent } from './trend-charts/happiness-trend/happiness-trend.component';
import { HrTrendComponent } from './trend-charts/hr-trend/hr-trend.component';
import { CommonViewsModule } from '../common-views/common-views.module';
import { Donut2dModule } from '../charts/donut2d/donut2d.module';
import { SpeedoMeterModule } from '../charts/speedo-meter/speedo-meter.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular-fusioncharts';
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme, Widgets);
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    HrTableComponent,
    EnpsTableComponent,
    FlightTableComponent,
    HappinessTableComponent,
    EnpsTrendComponent,
    FlightTrendComponent,
    HappinessTrendComponent,
    HrTrendComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, FormsModule,
    FusionChartsModule,
    Donut2dModule,
    SpeedoMeterModule,
    CommonViewsModule,
    FlexLayoutModule,
    MatIconModule
  ],
  exports: [
    HrTableComponent,
    EnpsTableComponent,
    FlightTableComponent,
    HappinessTableComponent,
    EnpsTrendComponent,
    FlightTrendComponent,
    HappinessTrendComponent,
    HrTrendComponent
  ]
})
export class DashboardWidgetsModule { }