import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedColumn2dComponent } from './stacked-column2d.component';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular-fusioncharts';
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme, Widgets);

@NgModule({
  declarations: [
    StackedColumn2dComponent
  ],
  imports: [
    CommonModule,
    FusionChartsModule
  ],
  exports: [
    StackedColumn2dComponent
  ]
})
export class StackedColumn2dModule { }
