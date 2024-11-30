import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MsLine } from './msline';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input() msline: MsLine;
  @Output() dataPlotClickEvent = new EventEmitter<any>();
  // public width = 100%;
  // public height = "100%";
  public type = 'msline';
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
    if(this.msline){
      this.dataSource = {
        "chart": {
            "caption": this.msline.caption,
            "subCaption": this.msline.subCaption,
            "linethickness": "1",
            "showvalues": "0",
            "formatnumberscale": "0",
            "anchorradius": "2",
            "divlinecolor": "666666",
            "divlinealpha": "30",
            "divlineisdashed": "1",
            "bgcolor": "FFFFFF",
            "showalternatehgridcolor": "0",
            "labelpadding": "10",
            "canvasborderthickness": "1",
            "legendiconscale": "1.5",
            "legendshadow": "0",
            "legendborderalpha": "0",
            "legendposition": "down",
            "canvasborderalpha": "50",
            "numvdivlines": "5",
            "vdivlinealpha": "20",
            "showborder": "0",
            "exportEnabled": "1",
            "anchorRadius": "4",
            "anchorBorderThickness": "2",
            "toolTipBgColor": "#000000",
            "toolTipColor": "#ffffff",
            "tooltipbgalpha": "80",
            "showtooltipshadow": "1",
            "showValues":"1",
            "valueFontBold":"1",
            "valueFontSize": "14",
            "yAxisMaxValue":this.msline.yAxisMaxValue,
            "subcaptionFontSize": "10",
            "subcaptionFontBold": "0",
            drawcrossline: "0",
        },
        "categories": [{"category": this.msline.categories}],
        "dataset": this.msline.dataset
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