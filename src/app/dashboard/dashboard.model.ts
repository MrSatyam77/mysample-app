export interface IDashboardWidgetOption {
    returnSummary: IWidgetOption
    efileSummary: IWidgetOption
    newsSummary: IWidgetOption
    quickReturnSummary: IWidgetOption
    // bankApplicationSummary: IWidgetOption
    // toDoSummary: IWidgetOption
    rejectedReturns: IWidgetOption
    appointmentList: IWidgetOption
    yourFirm: IWidgetOption
    myTaxPortal: IWidgetOption
    financialProducts: IWidgetOption
    // toolBox: IWidgetOption
    hiddenWidgets: IWidgetOption
}

export interface IWidgetOption {
    title: string;
    key: string;
    x: number;
    y: number;
    height: number;
    width: number;
    maxHeight?: number;
    minHeight?: number;
    maxWidth?: number;
    minWidth?: number;
    backgroundColor?: string;
    foregroundColor?: string;
    visible: boolean;
    noResize?: boolean;
    noMove?: boolean;
    columns?: string;
    columnNumber?: string;
    count?: number;
}

export interface IReturnSummaryCoulmnsSize {
    one: Array<IColumnsFields>;
    two: Array<IColumnsFields>;
    three: Array<IColumnsFields>;
    four: Array<IColumnsFields>;
}

export interface IColumnsFields {
    fieldName: string;
    displayText: string;
    color?: string;
    className?: string;
    displayOrder?: number;
    link?: string;
    filter?: string;
    graphXAxisLabel?: string;
}

export interface IRefreshOption {
    rejectedReturnComponent: boolean;
    returnSummaryComponent: boolean;
    financialProductsComponent: boolean;
    appointmentListComponent: boolean;
    eFileSummaryComponent: boolean;
    newsSummaryComponent: boolean;
}


export interface IColorPallete {
    backgroundColor: string;
}

export interface IWidgetSize {
    ratio?: string;
    size?: ISize;
    columnNumber?: string;
    count?: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IRowColorPallete {
    row1: Array<IColorPallete>;
    row2: Array<IColorPallete>;
    row3: Array<IColorPallete>;
    row4: Array<IColorPallete>;
    row5: Array<IColorPallete>;
    row6: Array<IColorPallete>;
}

export interface IWidgetColumnConfiguration {
    returnSummary: IWidgetSize
    efileSummary: IWidgetSize
    newsSummary: IWidgetSize
    quickReturnSummary: IWidgetSize
    // bankApplicationSummary: IWidgetSize
    // toDoSummary: IWidgetSize
    rejectedReturns: IWidgetSize
    appointmentList: IWidgetSize
    yourFirm: IWidgetSize
    myTaxPortal: IWidgetSize
    financialProducts: IWidgetSize
    // toolBox: IWidgetSize
    hiddenWidgets: IWidgetSize
}

export interface ICalenderListByDate {
    appointment: Array<any>;
    tomorrowsAppointment: number;
}

export interface IEFileSummaryCoulmnsSize {
    one: Array<IColumnsFields>;
    two: Array<IColumnsFields>;
}


export interface IIntroStepInfo {
    returnSummary: Array<string>;
    quickReturnSummary: Array<string>;
    financialProducts: Array<string>;
    toolBox: Array<string>;
    rejectedReturns: Array<string>;
}