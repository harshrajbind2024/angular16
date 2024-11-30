import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pie2d } from './pie-2d';

@Component({
  selector: 'app-pie2d',
  templateUrl: './pie2d.component.html',
  styleUrls: ['./pie2d.component.scss']
})
export class Pie2dComponent implements OnInit {

  @Input() pie2d: Pie2d;
  @Output() dataPlotClickEvent = new EventEmitter<any>();
  // public width = 100%;
  // public height = "100%";
  public type = 'pie2d';
  public dataFormat = 'json';
  public dataSource: any;
  public showGraph = false;
  public id = 'hr-pie';
  public events = {
    dataplotClick: (eventObj, dataObj) => {
      this.dataPlotClicked(dataObj);
    }
  }

  constructor() { }

  ngOnInit(){

  }

  ngOnChanges() {
    if(this.pie2d){
      this.dataSource = {
        "chart": {
            "caption": this.pie2d.caption,
            "subCaption": this.pie2d.subCaption,
            "showPercentInTooltip": "0",
            "numberSuffix": this.pie2d.numberSuffix,
            "decimals": "1",
            "useDataPlotColorForLabels": "1",
            "palettecolors": this.pie2d.colorPalete,
            "theme": "fint",
            "showLegend": "1",
            "legendposition": "down",
            "exportEnabled": "1",
            drawcrossline: "0",
        },
        "data": this.pie2d.data
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