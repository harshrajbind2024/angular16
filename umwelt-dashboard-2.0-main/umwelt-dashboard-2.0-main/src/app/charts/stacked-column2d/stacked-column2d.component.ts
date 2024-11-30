import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { StackedColumn2d } from './stackedColumn2d';
@Component({
  selector: 'app-stacked-column2d',
  templateUrl: './stacked-column2d.component.html',
  styleUrls: ['./stacked-column2d.component.scss']
})
export class StackedColumn2dComponent implements OnInit, OnChanges {

  @Input() stackedColumn2d: StackedColumn2d;
  @Output() dataPlotClickEvent = new EventEmitter<any>();
  public type = 'stackedcolumn2d';
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
    if(this.stackedColumn2d){
      this.dataSource = {
        "chart": {
          "exportEnabled": "1",
            "caption": this.stackedColumn2d.caption,
            "subCaption": this.stackedColumn2d.subCaption,
            "showvalues": "0",
            "decimals": this.stackedColumn2d.decimals,
            "yAxisName": this.stackedColumn2d.yAxisName,
            "yAxisMaxValue": this.stackedColumn2d.yAxisMaxValue,
            "numberSuffix": this.stackedColumn2d.numberSuffix,
            "plotgradientcolor": "",
            "formatnumberscale": "0",
            "showplotborder": "0",
            "palettecolors": this.stackedColumn2d.colorPalete,
            "canvaspadding": "0",
            "bgcolor": "FFFFFF",
            "showalternatehgridcolor": "0",
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
            "showSum":this.stackedColumn2d.showSum,
            "valueFontBold":"1",
            "valueFontSize": "12", 
            "subcaptionFontSize": "10",
            "subcaptionFontBold": "0",
            "valuePosition":"ABOVE",
            "valuePadding":"5",
            drawcrossline: "0",
        },
        "categories": [{"category": this.stackedColumn2d.categories}],
        "dataset": this.stackedColumn2d.dataset
      };
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