export class ComboChart {
    caption: string;
    subCaption: string;
    xAxisname: string;
    pYAxisName: string;
    sYAxisName: string;
    numberPrefix: string;
    sNumberSuffix: string;
    colorPalete: string;
    sYAxisMaxValue:string;
    decimals:string;
    categories: Category[] = [];
    dataset: Dataset[] = [];
    constructor(caption,
        subCaption,
        xAxisname,
        pYAxisName,
        sYAxisName,
        numberPrefix,
        sNumberSuffix,
        colorPalete,
        sYAxisMaxValue?,
        decimals?) {
        this.caption = caption;
        this.subCaption = subCaption;
        this.xAxisname = xAxisname;
        this.pYAxisName = pYAxisName;
        this.sYAxisName = sYAxisName;
        this.numberPrefix = numberPrefix;
        this.sNumberSuffix = sNumberSuffix;
        this.colorPalete = colorPalete;
        this.sYAxisMaxValue = sYAxisMaxValue;
        this.decimals = decimals
    }
}

export class Category {
    label: string;
    constructor(label) {
        this.label = label
    }
}

export class Dataset {
    seriesName: string;
    parentYAxis: string;
    renderAs: string;
    showValues: string;
    data: Data[] = [];
    constructor(seriesName, parentYAxis?, renderAs?, showValues?) {
        this.seriesName = seriesName;
        this.parentYAxis = parentYAxis;
        this.renderAs = renderAs;
        this.showValues = showValues;
    }
}

export class Data {
    value: string;
    toolText = "Value $value{br}Data Value $dataValue{br}label $label{br}displayValue $displayValue {br}seriesName $seriesName{br}"
    constructor(value, tooltext) {
        this.value = value;
        this.toolText = tooltext;
    }
}