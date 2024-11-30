import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { widgettrends } from '@lib/umwelt-lib';
import { DashboardService } from '@lib/umwelt-lib';

@Component({
  selector: 'app-happiness-trend',
  templateUrl: './happiness-trend.component.html',
  styleUrls: ['./happiness-trend.component.scss']
})
export class HappinessTrendComponent implements OnInit, OnChanges {

  constructor(private _trend: DashboardService) { }

  public trend = new  widgettrends("","","", "", "", "","","","","","","","","","","","","","","","","","","","","","","","","","","");

    ngOnInit() {
        this._trend.get().subscribe( data => {
          this.trend = data;
        });
    }

    ngOnChanges(){
    }

}
