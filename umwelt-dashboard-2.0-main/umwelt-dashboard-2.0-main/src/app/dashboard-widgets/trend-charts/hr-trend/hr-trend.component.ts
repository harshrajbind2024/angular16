import { Component, OnInit, OnChanges } from '@angular/core';
import { widgettrends } from '@lib/umwelt-lib';
import { DashboardService } from '@lib/umwelt-lib';

@Component({
  selector: 'app-hr-trend',
  templateUrl: './hr-trend.component.html',
  styleUrls: ['./hr-trend.component.scss']
})
export class HrTrendComponent implements OnInit,OnChanges {

    constructor(private _trend: DashboardService) { }

    public trend = new  widgettrends("","","", "", "", "","","","","","","","","","","","","","","","","","","","","","","","","","","");
    public id = 'chart1';
    public width = 450;
    public height = 218;
    public type = 'pyramid';
    public dataFormat = 'json';
    public dataSource;
    //public trend = new HrTrend("0", "0", "0", "0", "", "", "","","","");
    public chartvisible="happiness";
    public current      =   39;
    public max          =   100;
    public color        =   "#6C7A89";
    public background   =   "#77dd77";
    public radius       =    100;
    public stroke       =    "20" ;
    public semicircle   =    true;
    public rounded      =    false;
    public clockwise    =    false;
    public responsive   =    true;
    public duration     =    "800";
    public animation    =    'easeInOutQuart';
     public colorScheme = {
      domain: ['#00ff00', '#ffff00', '#ff0000', '#a9a9a9']
    };
    public showLabels = false;
    public view:any[] = [170,170];
    public showLegend = false;
    public explodeSlices = false;
    public doughnut = true;
    public gradient = false;
    public datasets = [  {
    "name": "Engaged",
    "value": 30
    },
    {
    "name": "Not Engaged",
    "value": 30
    },
    {
    "name": "Actively Disengaged",
    "value": 20
    } 
    ];

    ngOnInit() {
      this.dataSource = {
            "chart": {
                "theme": "fint",
                "borderAlpha": "20",
                "is2D": "0",
                "bgColor": "#ffffff",
                "showValues": "0",
                "numberPrefix": "$",
                "numberSuffix": "M",
                "plotTooltext": "$label is $value%",
                "showPercentValues": "1",
                "chartLeftMargin": "40",
                "showlegend": "0",
                "showlabels": "1",
                "plotHighlightEffect": "fadeout|color=#ffffff, alpha=60",
                "legendItemFontBold": "0",
                "legendItemFont": "open sans",
                "legendItemFontSize": "10",
                "legendItemFontColor": "#333",
                 "palettecolors":"71ba51,ffaf40,ff4d4d,F9FF00",
                 "enableSmartLabels": "0",
                 "labelDistance": "5"

            },
            "data": [{
                  "label": "Engaged",
                  "value": this.trend.engaged
              }, {
                  "label": "Not Engaged",
                  "value": this.trend.not_engaged
              }, {
                  "label": "Actively Disengaged",
                  "value": this.trend.actively_disengaged
              }
            ]
        }

         setTimeout( ()=>{this.buildguage()
                 .then((data:any)=>{
                  //... continue with anything depending on "data" after the Promise has resolved
         
                  this.dataSource = {
                    "chart": {
                        "theme": "fint",
                        "borderAlpha": "20",
                        "is2D": "0",
                        "bgColor": "#ffffff",
                        "showValues": "1",
                        "numberPrefix": "$",
                        "numberSuffix": "M",
                        "showPercentValues": "1",
                        "showlegend": "0",
                        "showlabels": "1",
                        "legendPosition": "RIGHT",
                        "plotHighlightEffect": "fadeout|color=#ffffff, alpha=60",
                        "legendItemFontBold": "0",
                        "legendItemFont": "open sans",
                        "legendItemFontSize": "10",
                        "legendItemFontColor": "#333",
                         "palettecolors":"71ba51,ffaf40,ff4d4d,F9FF00",
                         "enableSmartLabels": "1",
                         "labelDistance": "8",
                         "captionPadding" : "0",
"chartLeftMargin" : "20",
"chartRightMargin" : "0",
"chartTopMargin" : "5",
"chartBottomMargin" : "0",
                    },
                    "data": [{
                        "toolText": this.updateFactorStatement("Engaged",this.trend.engagedFactor1, this.trend.engagedFactor2),
                        "label": "Engaged",
                        "value": this.trend.engaged
                    }, {
                        "toolText":  this.updateFactorStatement("Not Engaged",this.trend.notEngagedFactor1, this.trend.notEngagedFactor2),
                        "label": "Not Engaged",
                        "value": this.trend.not_engaged
                    }, {
                        "toolText":  this.updateFactorStatement("Actively Disengaged",this.trend.activelyDisEngagedFactor1, this.trend.activelyDisEngagedFactor2),
                        "label": "Actively Disengaged",
                        "value": this.trend.actively_disengaged
                    }
                  ]
                }
                         

        })},4000);

    }

    ngOnChanges(){
    }
    updateFactorStatement(label,factor1, factor2){
        let statement = ""
        if(factor1 === "NA" && factor2 === "NA"){
            return "Not enough data available"
        } else if(label === "Engaged"){
            statement = "Top";
        } else if(label === "Not Engaged"){
            statement = "Bottom";
        } else if(label === "Actively Disengaged"){
            statement = "Bottom";
        }

        if(factor1 === "NA"){
            return statement + " factor is " + factor2; 
        } else if(factor2 === "NA") {
            return statement + " factor is " + factor1; 
        } else {
            return statement + " two factors are " + factor1 + " and " + factor2;
        }

    }

    buildguage(){
       return new Promise(resolve=>{
         this._trend.get().subscribe( data => {
          this.trend = data;
          resolve(data);
         })
       });
    }
}