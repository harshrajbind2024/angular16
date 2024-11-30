import { Component, OnInit, OnChanges } from '@angular/core';
import { widgettrends } from '@lib/umwelt-lib';
import { DashboardService } from '@lib/umwelt-lib';

@Component({
  selector: 'app-flight-trend',
  templateUrl: './flight-trend.component.html',
  styleUrls: ['./flight-trend.component.scss']
})
export class FlightTrendComponent implements OnInit,OnChanges {

    constructor(private _trend: DashboardService) { }

    public trend = new widgettrends("","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","");
    public width = 300;
    public height = 225;
    public type = 'funnel';
    public dataFormat = 'json';
    public dataSource;
    public graphs: any = [];

    ngOnInit() {
        this.dataSource = {
            "chart": {
                "theme": "fint",
                "borderAlpha": "20",
                "bgColor": "#ffffff",
                "decimals": "1",
                "labelDistance": "15",
                "streamlinedData": "0",
                //Use same slant angle
                "useSameSlantAngle": "1",
                "plotHighlightEffect": "fadeout|color=#ffffff, alpha=30",
                "legendItemFontBold": "0",
                "legendItemFont": "open sans",
                "legendItemFontSize": "10",
                "legendItemFontColor": "#333",
                "legendPosition": "right",
                "palettecolors": "F9FF00, ffaf40, ff4d4d, 71ba51"
            },
            "data": [{
                "label": "Conversation Initiated",
                "value": 0
            }, {
                "label": "Conversation Closed",
                "value": 0
            }, {
                "label": "Flight Risk",
                "value": 0
            }, {
                "label": "Action Closed",
                "value": 0
            }]
        }

        setTimeout(() => {
            this.buildguage()
                .then((data: any) => {
                    //... continue with anything depending on "data" after the Promise has resolved
                    // "Total "+ this.trend.convclosed +" responses and "+this.trend.Total_feedback+" comments",
                    this.graphs.push({
                        color: "#71ba51",
                        upperlabel: "Response Rate",
                        label: "Response Rate",
                        //label: this.trend.ResponseRate_Num + " of " + this.trend.ResponseRate_Deno + " Unique Employees",
                        lowerLabel: "<b>" + this.trend.convclosed + "</b> of <b>"+ this.trend.convinit+"</b> responses</br><b>" + this.trend.totfeedback + "</b> comments",
                        radius: 30,
                        //value: this.trend.ResponseRate_Current
                        value: this.trend.convinit === "0" ? "0" : Number.parseInt(this.trend.response_rate)+0.001,
                        id: 'hrchart1'
                        // value: Number.parseInt(this.trend.convclosed) / Number.parseInt(this.trend.convinit)
                    });
                    this.graphs.push({
                        color: "#ff4d4d",
                        upperlabel: "Flight Risk",
                        label: "High Risk",
                        lowerLabel: "<b>" + this.trend.actionsreq + "</b> of <b>" + this.trend.action_deno + "</b> at risk",
                        radius: 30,
                        value: this.trend.convclosed === "0" ? "0" : Number.parseInt(this.trend.highRisk_rate)+0.001,
                        colorModerate:"#FFAF40",
                        labelModerate: "Moderate Risk",
                        valueModerate: this.trend.convclosed === "0" ? "0" : Number.parseInt(this.trend.modRisk_rate)+0.001,
                        id: 'hrchart2'
                    });
                    this.graphs.push({
                        color: "#71ba51",
                        upperlabel: "Actions Closed",
                        label: "Actions Closed",
                        lowerLabel: "<b>" + this.trend.actionsclosed + "</b> of <b>" + this.trend.actionsreq + "</b> risks acted on <br> Total <b>"+this.trend.totaction+"</b> responses acted on",
                        radius: 30,
                        value: this.trend.actionsreq === "0" ? "0" : Number.parseInt(this.trend.actionClosed_rate)+0.001,
                        id: 'hrchart3'
                    });

                    this.dataSource = {
                        "chart": {
                            "theme": "fint",
                            "borderAlpha": "20",
                            "bgColor": "#ffffff",
                            "decimals": "1",
                            "labelDistance": "15",
                            //Use same slant angle
                            "useSameSlantAngle": "1",
                            "streamlinedData": "0",
                            "plotHighlightEffect": "fadeout|color=#ffffff, alpha=60",
                            "legendItemFontBold": "0",
                            "legendItemFont": "open sans",
                            "legendItemFontSize": "10",
                            "legendItemFontColor": "#333",
                            "legendPosition": "right",
                            "palettecolors": "F9FF00, ffaf40, ff4d4d, 71ba51"
                        },
                        "data": [{
                            "label": "Conversation Initiated",
                            "value": 0
                        }, {
                            "label": "Conversation Closed",
                            "value": 0
                        }, {
                            "label": "Flight Risk",
                            "value": 0
                        }, {
                            "label": "Action Closed",
                            "value": 0
                        }]
                    }


                })
        }, 4000);

    }

    ngOnChanges(){
      }

    buildguage() {
        return new Promise(resolve => {
            this._trend.get().subscribe(data => {
                this.trend = data;
                resolve(data);
            })
        });
    }
}