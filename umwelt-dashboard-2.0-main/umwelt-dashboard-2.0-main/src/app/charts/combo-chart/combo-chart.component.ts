import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ComboChart } from './combo-chart';

@Component({
  selector: 'app-combo-chart',
  templateUrl: './combo-chart.component.html',
  styleUrls: ['./combo-chart.component.scss']
})
export class ComboChartComponent implements OnInit {
  @Input() comboChart: ComboChart;
  @Output() dataPlotClickEvent = new EventEmitter<any>();
  public type = 'mscombidy2d';
  public dataFormat = 'json';
  public dataSource: any;
  public showGraph = false;
  public events = {
    dataplotClick: (eventObj, dataObj) => {
      this.dataPlotClicked(dataObj);
    }
  }
  constructor() {

  }

  ngOnChanges() {
    if (this.comboChart) {
      this.dataSource = {
        "chart": {
          "caption": this.comboChart.caption,
          "subCaption": this.comboChart.subCaption,
          "xAxisname": this.comboChart.xAxisname,
          "pYAxisName": this.comboChart.pYAxisName,
          "sYAxisName": this.comboChart.sYAxisName,
          "numberPrefix": this.comboChart.numberPrefix,
          "sNumberSuffix": this.comboChart.sNumberSuffix,
          "palettecolors": this.comboChart.colorPalete,
          "decimals": this.comboChart.decimals,
          "baseFontColor": "#333333",
          "baseFont": "Helvetica Neue,Arial",
          "captionFontSize": "14",
          "subcaptionFontSize": "10",
          "subcaptionFontBold": "0",
          "showBorder": "0",
          "bgColor": "#ffffff",
          "showShadow": "0",
          "canvasBgColor": "#ffffff",
          "canvasBorderAlpha": "0",
          "divlineAlpha": "100",
          "divlineColor": "#999999",
          "divlineThickness": "1",
          "divLineDashed": "1",
          "divLineDashLen": "1",
          "usePlotGradientColor": "0",
          "showplotborder": "0",
          "showXAxisLine": "1",
          "xAxisLineThickness": "1",
          "xAxisLineColor": "#999999",
          "showAlternateHGridColor": "0",
          "showAlternateVGridColor": "0",
          "legendBgAlpha": "0",
          "legendBorderAlpha": "0",
          "legendShadow": "0",
          "legendItemFontSize": "10",
          "legendItemFontColor": "#666666",
          "showHoverEffect": "1",
          "plotHoverEffect ": "1",
          "toolTipBgColor": "#000000",
          "toolTipColor": "#ffffff",
          "tooltipbgalpha": "80",
          "showtooltipshadow": "1",
          drawcrossline: "0",
          "exportEnabled": "1",
          "valueFontBold":"1",
          "valueFontSize": "12",
          "valuePosition":"ABOVE",
          "valuePadding":"5",
          "sYAxisMaxValue":this.comboChart.sYAxisMaxValue
        },
        "categories": [
          {
            "category": this.comboChart.categories
          }
        ],
        "dataset": this.comboChart.dataset
      }
      this.showGraph = true;
    }

  }

  ngOnInit() {
  }

  dataPlotClicked(obj) {
    let param = {};
    param['label'] = obj.categoryLabel;
    param['key'] = obj.datasetName;
    this.dataPlotClickEvent.emit(param);
  }

}