import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedoMeterComponent } from './speedo-meter.component';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular-fusioncharts';
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme, Widgets);

@NgModule({
  declarations: [
    SpeedoMeterComponent
  ],
  imports: [
    CommonModule,
    FusionChartsModule
  ],
  exports: [
    SpeedoMeterComponent
  ]
})
export class SpeedoMeterModule { }
