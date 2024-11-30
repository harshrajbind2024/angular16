export class Pie2d {
    caption: string;
    subCaption: string;
    numberSuffix: string;
    colorPalete: string;
    data: DataPie[] = [];
    constructor(caption,
        numberSuffix,
        colorPalete) {
        this.caption = caption;
        this.numberSuffix = numberSuffix;
        this.colorPalete = colorPalete;
    }
}

export class DataPie{
    label: string;
    value: string;
    toolText: string;
    constructor(label: string, value: string, toolText: string){
        this.label = label;
        this.value = value;
        this.toolText = toolText;
    }
}