import { Category, Dataset } from "../combo-chart/combo-chart";
export class StackedColumn2d {
    caption: string;
    subCaption: string;
    yAxisMaxValue: string;
    yAxisName: string;
    numberSuffix: string;
    colorPalete: string;
    showSum: string;
    decimals: string;
    categories: Category[] = [];
    dataset: Dataset[] = [];
    constructor(caption,
        subCaption,
        yAxisMaxValue,
        yAxisName,
        numberSuffix,
        colorPalete,
        showSum,
        decimals?) {
        this.caption = caption;
        this.subCaption = subCaption;
        this.yAxisMaxValue = yAxisMaxValue;
        this.yAxisName = yAxisName;
        this.numberSuffix = numberSuffix;
        this.colorPalete = colorPalete;
        this.showSum = showSum;
        this.decimals = decimals
    }
}