import { Category, Dataset } from "../combo-chart/combo-chart";
export class MsColumn2d {
    caption: string;
    subCaption: string;
    numberPrefix: string;
    colorPalete: string;
    categories: Category[] = [];
    dataset: Dataset[] = [];
    constructor(caption,
        subCaption,
        numberPrefix,
        colorPalete) {
        this.caption = caption;
        this.subCaption = subCaption;
        this.numberPrefix = numberPrefix;
        this.colorPalete = colorPalete;
    }
}