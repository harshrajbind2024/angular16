import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MsColumn2d } from './msColumn2d';

@Component({
  selector: 'app-multi-series-column-chart2d',
  templateUrl: './multi-series-column-chart2d.component.html',
  styleUrls: ['./multi-series-column-chart2d.component.scss']
})
export class MultiSeriesColumnChart2dComponent implements OnInit {

  @Input() msColumn2d: MsColumn2d;
  @Output() dataPlotClickEvent = new EventEmitter<any>();

  public type = 'mscolumn2d';
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
    if(this.msColumn2d){
      this.dataSource = {
        "chart": {
          "caption": this.msColumn2d.caption,
          "subCaption": this.msColumn2d.subCaption,
          "showvalues": "1",
          "decimals":"0",
          "valueFontBold":"1",
          "valueFontSize": "12",
          "valuePosition":"ABOVE",
          "numberSuffix": this.msColumn2d.numberPrefix,
          "plotgradientcolor": "",
          "formatnumberscale": "0",
          "showplotborder": "0",
          "palettecolors": this.msColumn2d.colorPalete,
          "canvaspadding": "0",
          "bgcolor": "FFFFFF",
          "showalternatehgridcolor": "0",
          "divlinecolor": "CCCCCC",
          "showcanvasborder": "0",
          "legendborderalpha": "0",
          "legendshadow": "0",
          "interactivelegend": "0",
          "showpercentvalues": "1",
          "canvasborderalpha": "0",
          "showborder": "0",
          "anchorRadius": "4",
          "anchorBorderThickness": "2",
          "exportEnabled": "1",
          "toolTipBgColor": "#000000",
          "toolTipColor": "#ffffff",
          "tooltipbgalpha": "80",
          "showtooltipshadow": "1",
          "yAxisMaxValue": "100",
          "subcaptionFontSize": "10",
          "subcaptionFontBold": "0",
          drawcrossline: "0",
      },
      "categories": [{"category": this.msColumn2d.categories}],
      "dataset": this.msColumn2d.dataset
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