import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-speedo-meter',
  templateUrl: './speedo-meter.component.html',
  styleUrls: ['./speedo-meter.component.scss']
})
export class SpeedoMeterComponent implements OnInit {

  @Input('upperLimit') upperLimit = "100";
  @Input('lowerLimit') lowerLimit = "-100";
  @Input('range') range = [
    {
      minValue: "-100",
      maxValue: "100",
      code: "#ff4d4d"
    }
  ];
  @Input('value') value = "0";
  @Input('message') message = "";
  @Input('showGraph') showGraph = false;
  public id = 'speedo-chart';
  public width = 300;
  public height = 180;
  public type = 'angulargauge';
  public dataFormat = 'json';
  public dataSource: any;
  public graphCreated: boolean = false;
  constructor() { }

  ngOnInit() {
    this.dataSource = {
      "chart": {
        "lowerlimit": this.lowerLimit,
        "upperlimit": this.upperLimit,
        "showvalue": "1",
        "theme": "fusion",
        "showtooltip": "1",
        "showBorder": "0",
        "bgColor": "#FFFFFF",
        "pivotBorderColor": "#FFF",
        "pivotBorderAlpha": "100",
        "pivotFillColor": "#000",
        "pivotFillAlpha": "100",
        "gaugeFillMix": "{dark}",
        "gaugeFillRatio": "100",
        "majorTMNumber": "9",
        "minorTMNumber": "1",
        "valueBelowPivot": "1",
        "valueFontSize": "14",
        "autoAlignTickValues": "1",
        "manageValueOverLapping": "1",
        "tickValueDistance": "5"
      },
      "colorrange": {
        "color": this.range
      },
      "dials": {
        "dial": [
          {
            "value": this.value,
            "bgColor": "#000",
            "borderThickness": "0",
            "borderAlpha": "100",
            "tooltext": this.message,
          }
        ]
      }
    }    
    this.graphCreated = true;
  }
  
}