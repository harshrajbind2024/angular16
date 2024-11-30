import { Category, Dataset } from "../combo-chart/combo-chart";
export class StackedBar2d {
    caption: string;
    subCaption: string;
    xAxisname: string;
    yAxisName: string;
    numberPrefix: string;
    colorPalete: string;
    yAxisMaxValue: string;
    showSum: string;
    categories: Category[] = [];
    dataset: Dataset[] = [];
    constructor(caption,
        subCaption,
        xAxisname,
        yAxisName,
        numberPrefix,
        colorPalete,
        yAxisMaxValue?,
        showSum?) {
        this.caption = caption;
        this.subCaption = subCaption;
        this.xAxisname = xAxisname;
        this.yAxisName = yAxisName;
        this.numberPrefix = numberPrefix;
        this.colorPalete = colorPalete;
        this.yAxisMaxValue = yAxisMaxValue;
        this.showSum = showSum;
    }
}