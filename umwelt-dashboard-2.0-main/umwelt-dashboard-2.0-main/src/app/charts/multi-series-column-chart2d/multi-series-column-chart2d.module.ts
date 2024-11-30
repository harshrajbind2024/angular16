import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSeriesColumnChart2dComponent } from './multi-series-column-chart2d.component';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular-fusioncharts';
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme, Widgets);

@NgModule({
  declarations: [MultiSeriesColumnChart2dComponent],
  imports: [
    CommonModule,
    FusionChartsModule
  ],
  exports : [MultiSeriesColumnChart2dComponent]
})
export class MultiSeriesColumnChart2dModule { }