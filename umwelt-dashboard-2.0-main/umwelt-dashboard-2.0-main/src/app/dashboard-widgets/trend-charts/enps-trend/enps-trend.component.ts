import { Component, OnInit, OnChanges } from '@angular/core';
import { widgettrends } from '@lib/umwelt-lib';
import { DashboardService } from '@lib/umwelt-lib';

@Component({
  selector: 'app-enps-trend',
  templateUrl: './enps-trend.component.html',
  styleUrls: ['./enps-trend.component.scss']
})
export class EnpsTrendComponent implements OnInit,OnChanges {
    
    constructor(private _trend: DashboardService) { }

    public trend = new  widgettrends("", "","", "", "","","","","","","","","","","","","","","","","","","","","","","","","","","","");
    public current_quarter_arrow;
    public current_month_arrow;
    public chartvisible="enps";
    public current 		= 	39;
    public max 			= 	100;
    public color 		= 	"#6C7A89";
    public background 	= 	"#77dd77";
    public radius       =    100;
    public stroke       =    "20" ;
    public semicircle   =    true;
    public rounded      =    false;
    public clockwise    =    false;
    public responsive   =    true;
    public duration     =    "800";
    public animation    =    'easeInOutQuart';



    public width = 280;
    public height = 150;
    public type = 'angulargauge';
    public dataFormat = 'json';
    public dataSource;
    public speedoMeterValue = "0";
    public speedoMeterMessage = "Current Enps score is $value";
    public speedoMeterRange = [{
        "minValue": "-100",
        "maxValue": "-11",
        "code": "#ff4d4d"
    }, {
        "minValue": "-10",
        "maxValue": "19",
        "code": "#FFAF40"
    }, {
        "minValue": "20",
        "maxValue": "49",
        "code": "#59CB59"
    }, {
        "minValue": "50",
        "maxValue": "100",
        "code": "#71ba51"
    }]
    public showGraph: boolean = false;

    ngOnChanges(){
    }

    ngOnInit() {
         setTimeout(() =>this.buildguage()
            .then((data:any)=>{
   //... continue with anything depending on "data" after the Promise has resolved
            this.showGraph = true;
            this.speedoMeterValue = this.trend.current_month;            
            this.dataSource = {
                    "chart": {
                    // "caption": "Customer Satisfaction Score",
                    // "subcaption": "Last week",
                    "lowerLimit": "-100",
                    "upperLimit": "100",
                    "theme": "fint",
                    "showValue": "1",
                    "majorTMNumber": "11",
                    "minorTMNumber": "4",
                    "showHoverEffect": "1",
                    "majorTMHeight": "8",
                    "gaugeInnerRadius": "0",
                },
                "colorRange": {
                    "color": [{
                        "minValue": "-100",
                        "maxValue": "-11",
                        "code": "#ff4d4d"
                    }, {
                        "minValue": "-10",
                        "maxValue": "19",
                        "code": "#FFAF40"
                    }, {
                        "minValue": "20",
                        "maxValue": "49",
                        "code": "#59CB59"
                    }, {
                        "minValue": "50",
                        "maxValue": "100",
                        "code": "#71ba51"
                    }]
                },
                "dials": {
                    "dial": [{
                        "value": this.trend.current_month,
                        "tooltext": "Current Enps score is $value",
                        "radius": "70"
                    }]
                }
            }
             
        }),4000);

    }

    buildguage(){
        
        return new Promise(resolve=>{
        this._trend.get().subscribe( data => {
          this.trend = data;
            if(parseInt(this.trend.current_quarter) > parseInt(this.trend.previous_quarter)) {
                this.current_quarter_arrow = "arrow_upward";
            } else if (parseInt(this.trend.current_quarter) === parseInt(this.trend.previous_quarter)){
                this.current_quarter_arrow = ""
            }else{
                this.current_quarter_arrow = "arrow_downward";
            }

            if(parseInt(this.trend.current_month) > parseInt(this.trend.previous_month)) {
                this.current_month_arrow = "arrow_upward";
            }else if (parseInt(this.trend.current_month) === parseInt(this.trend.previous_month)){
                this.current_month_arrow = ""
            }
             else {
                this.current_month_arrow = "arrow_downward";
            }    
            
             resolve(data);
             
        })
      });
    }
}