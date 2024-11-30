import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboChartComponent } from './combo-chart.component';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular-fusioncharts';
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme, Widgets);

@NgModule({
  declarations: [
    ComboChartComponent
  ],
  imports: [
    CommonModule,
    FusionChartsModule
  ],
  exports: [
    ComboChartComponent
  ]
})
export class ComboChartModule { }
