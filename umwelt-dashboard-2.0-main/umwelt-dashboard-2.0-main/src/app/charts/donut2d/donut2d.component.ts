import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-donut2d',
  templateUrl: './donut2d.component.html',
  styleUrls: ['./donut2d.component.scss']
})
export class Donut2dComponent implements OnInit {

  @Input('color') public color = "#32adda";  
  @Input('label') public label = "";
  @Input('value') public value = "0";
  @Input('showGraph') public showGraph = false;
  @Input('radius') public radius = 40;
  @Input('colorModerate') public colorModerate = "#32adda";
  @Input('labelModerate') public labelModerate = "";
  @Input('valueModerate') public valueModerate = "0";
  @Input('id') public id;
  public dataCreated: boolean = false;
  public width = 120;
  public height = 500;
  public type = 'doughnut2d';
  public dataFormat = 'json';
  public dataSource: any;
  constructor() { }

  ngOnInit() {
    if(this.value === undefined || this.value === null || this.value === '' || this.value === 'NaN'){
      this.value = "0";
    }
    if(this.valueModerate === undefined || this.valueModerate === null || this.valueModerate === '' || this.valueModerate === 'NaN'){
      this.valueModerate = "0";
    }
    // this.height = this.radius*2 + 5;
    this.height = this.radius*2 + 20;
    this.dataSource = {
      "chart": {
        "defaultCenterlabel": (Number.parseInt(this.value)).toString() + "%",
        "decimals": "0",
        "theme": "fusion",
        "showBorder": "0",
        "bgColor": "#FFFFFF",
        "doughnutRadius": (this.radius - 8).toString(),
        "pieRadius": this.radius.toString(),
        "enableSmartLabels": "0",
        "startingAngle": "90",
        "showPlotBorder": "0",
        "showShadow": "0",
        "use3DLighting": "0",
        // "plottooltext": this.label,
        "centerLabelFontSize": this.radius >= 40 ? "14" : (this.radius >30 ? "10" : (this.radius >=20 ? "8" : "6")),
        "enableSlicing": "0",
        "toolTipBgColor": "#000",
        "toolTipColor": "#FFFFFF"
      },
      "data": [
        {
          "value": (100 - Number.parseInt(this.value+this.valueModerate)).toString(),
          "showLabel": "0",
          "showValue": "0",
          "color": +this.valueModerate > 0?"#71ba51":"#EFEDEE",
        },
        {
          "label": this.label,
          "value": (Number.parseInt(this.value)).toString(),
          "color": this.color,
          "showValue": "0",
          "showLabel": "0"
        },
        {
          "label": this.labelModerate,
          "value": (Number.parseInt(this.valueModerate)).toString(),
          "color": this.colorModerate,
          "showValue": "0",
          "showLabel": "0"
        }
  
      ]
    }
    this.dataCreated = true;
  }
  
}