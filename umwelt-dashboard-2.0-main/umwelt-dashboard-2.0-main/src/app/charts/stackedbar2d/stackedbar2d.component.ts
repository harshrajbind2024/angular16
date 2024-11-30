import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { StackedBar2d } from './stackedbar2d';

@Component({
  selector: 'app-stackedbar2d',
  templateUrl: './stackedbar2d.component.html',
  styleUrls: ['./stackedbar2d.component.scss']
})
export class Stackedbar2dComponent implements OnInit, OnChanges {

  @Input() stackedBar2d: StackedBar2d;
  @Output() dataPlotClickEvent = new EventEmitter<any>();
  public type = 'stackedbar2d';
  public dataFormat = 'json';
  public dataSource: any;
  public showGraph = false;
  public events = {
    dataplotClick: (eventObj, dataObj) => {
      this.dataPlotClicked(dataObj);
    }
  }

  constructor() { }

  ngOnInit(){

  }

  ngOnChanges() {
    if(this.stackedBar2d){
      this.dataSource = {
        "chart": {
          "caption": '',
          "subCaption": '',
          "xAxisname": this.stackedBar2d.xAxisname,
          "yAxisName": this.stackedBar2d.yAxisName,
          "palettecolors": this.stackedBar2d.colorPalete,
          "exportEnabled": "1",
          "showvalues": "0",
          "xAxisMaxValue": "100",
          "yAxisMaxValue": this.stackedBar2d.yAxisMaxValue,
          "numberSuffix": this.stackedBar2d.numberPrefix,
          "plotgradientcolor": "",
          "formatnumberscale": "0",
          "showplotborder": "0",
          "canvaspadding": "0",
          "bgcolor": "FFFFFF",
          "showAlternateVGridColor": "0",
          "divlinecolor": "CCCCCC",
          "showcanvasborder": "0",
          "legendborderalpha": "0",
          "legendshadow": "0",
          "interactivelegend": "0",
          "canvasborderalpha": "0",
          "showborder": "0",
          "toolTipBgColor": "#000000",
          "toolTipColor": "#ffffff",
          "tooltipbgalpha": "80",
          "showtooltipshadow": "1",
          "showSum":this.stackedBar2d.showSum,
          "valueFontBold":"1",
          "valueFontSize": "14", 
          "subcaptionFontSize": "10",
          "subcaptionFontBold": "0",
          "showlegend":"0",
          drawcrossline: "0",
        },
        "categories": [
          {
            "category": this.stackedBar2d.categories
          }
        ],
        "dataset": this.stackedBar2d.dataset
      }
      this.showGraph = true;
    }
  }
  dataPlotClicked(obj) {
    let param = {};
    param['label'] = obj.categoryLabel;
    param['key'] = obj.datasetName;
    this.dataPlotClickEvent.emit(param);
  }

}