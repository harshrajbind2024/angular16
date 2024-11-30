import { Category, Data } from "../combo-chart/combo-chart";

export class MsLine {
    caption: string;
    subCaption: string;
    yAxisMaxValue: string;
    categories: Category[] = [];
    dataset: MSLineDataSet[] = [];
    constructor(caption,subCaption,yAxisMaxValue?) {
        this.caption = caption;
        this.subCaption = subCaption;
        this.yAxisMaxValue = yAxisMaxValue;
    }
}

export class MSLineDataSet {
    seriesName: string;
    color: string;
    anchorbordercolor: string;
    anchorbgcolor: string;
    data: Data[] = [];
    constructor(seriesName, color, anchorbordercolor, anchorbgcolor) {
        this.seriesName = seriesName;
        this.color = color;
        this.anchorbordercolor = anchorbordercolor;
        this.anchorbgcolor = anchorbgcolor;
    }
}